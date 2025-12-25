import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	FaBox,
	FaShoppingCart,
	FaCheckCircle,
	FaMapMarkerAlt,
	FaInfoCircle,
	FaEye,
	FaDownload,
	FaEnvelope,
	FaTimes,
	FaTruck,
	FaCity,
	FaGlobeEurope,
	FaMailBulk,
	FaPhone,
} from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';
import { getApiBaseUrl } from '../utils/config';

const OrderDetails = () => {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [status, setStatus] = useState('Pending');
	const [isNotePopupOpen, setIsNotePopupOpen] = useState(false);
	const [noteMessage, setNoteMessage] = useState('');
	const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
	const [emailMessage, setEmailMessage] = useState('');
	const [orderMessage, setOrderMessage] = useState('');
	const [trackingId, setTrackingId] = useState('');
	const [shippingCarrier, setShippingCarrier] = useState('');
	const [isTrackingIdSaved, setIsTrackingIdSaved] = useState(false);
	const navigate = useNavigate();
	// const apiUrl = import.meta.env.VITE_API_BASE_URL;
	const { toast } = useToast();

	useEffect(() => {
		fetchOrderDetails();
		fetchOrderMessage();
		fetchEmailMessage();
		fetchTrackingId();
		// eslint-disable-next-line
	}, [orderId]);

	const fetchOrderDetails = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/orders/${orderId}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});

			if (!response.ok) {
				const errorData = await response.json();
				navigate('/login');
				throw new Error(errorData.message || 'Failed to fetch order details');
			}

			const data = await response.json();
			setOrder(data.order);
			setStatus(data.order.paymentStatus || 'Pending');
			setNoteMessage(data.order.internalNote || '');
			if (data.order.shippingCarrier) {
				setShippingCarrier(data.order.shippingCarrier);
			}
		} catch (error) {
			setError(error.message || 'Failed to fetch order details');
			toast({
				description: error.message || 'Failed to fetch order details',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchTrackingId = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/tracking`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();
			setTrackingId(data.trackingId || '');
			setIsTrackingIdSaved(!!data.trackingId);
		} catch (error) { }
	};

	const fetchOrderMessage = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/message`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();
			setOrderMessage(data.message || '');
		} catch (error) { }
	};

	const fetchEmailMessage = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/getEmailMessage`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			const data = await response.json();
			setEmailMessage(data.message || '');
		} catch (error) { }
	};

	const handleSaveTrackingId = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/tracking`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ trackingId }),
				credentials: 'include',
			});

			if (!response.ok) {
				const errorData = await response.json();
				navigate('/login');
				throw new Error(errorData.message || 'Failed to save tracking ID');
			}
			setIsTrackingIdSaved(true);
			toast({
				description: 'Tracking ID saved successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: error.message || 'Failed to save tracking ID',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const handleEmptyTrackingId = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/tracking`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to empty tracking ID');
			}
			setTrackingId('');
			setIsTrackingIdSaved(false);
			toast({
				description: 'Tracking ID emptied successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: error.message || 'Failed to empty tracking ID',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const handleStatusChange = async (newStatus) => {
		try {
			if (newStatus === 'Shipped') {
				if (!trackingId || !shippingCarrier) {
					toast({
						description: 'Please enter tracking ID and select shipping carrier before shipping',
						variant: 'destructive',
						className: 'bg-red-500 text-white border-0',
					});
					setStatus(order?.status || 'Pending');
					return;
				}
				if (!isTrackingIdSaved) {
					await handleSaveTrackingId();
				}
			}
			const response = await fetch(`${getApiBaseUrl()}/orders/update/${orderId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					status: newStatus,
					...(newStatus === 'Shipped' && { trackingId, shippingCarrier }),
				}),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to update order status');
			}
			setOrder((prev) => ({ ...prev, status: newStatus }));
			setStatus(newStatus);
			toast({
				description: 'Order status updated successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: error.message || 'Failed to update order status',
				className: 'bg-red-500 text-white border-0',
			});
			setStatus(order?.status || 'Pending');
		}
	};

	const handleSaveNote = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/message`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: noteMessage }),
				credentials: 'include',
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to save note');
			}
			setOrderMessage(noteMessage);
			setIsNotePopupOpen(false);
			toast({
				description: 'Note saved successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: error.message || 'Failed to save note',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const handleDeleteNote = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/message`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ message: '' }),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete note');
			}
			setOrderMessage('');
			toast({
				description: 'Note deleted successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: error.message || 'Failed to delete note',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const handleDeleteEmailNote = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/deleteEmail`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: '' }),
				credentials: 'include',
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete note');
			}
			setEmailMessage('');
			toast({
				description: 'Email note deleted successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: error.message || 'Failed to delete note',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const handleSendEmail = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/send-email`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: emailMessage }),
				credentials: 'include',
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to send email');
			}
			setIsEmailPopupOpen(false);
			toast({
				description: 'Email sent successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: error.message || 'Failed to send email',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const handleDownloadInvoice = async () => {
		try {
			const response = await fetch(`${getApiBaseUrl()}/orders/${orderId}/invoice`, {
				method: 'GET',
				credentials: 'include',
			});
			if (!response.ok) {
				throw new Error('Failed to fetch invoice');
			}
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `invoice_${orderId}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			toast({
				description: 'Invoice downloaded!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: 'Failed to download invoice. Please try again.',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const handleDownload = async (imageUrl) => {
		try {
			const response = await fetch(imageUrl, { mode: 'cors' });
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'custom-logo.png';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			toast({
				description: 'Failed to download image. Please try again.',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-gray-100'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-gray-100'>
				<p className='text-red-500 text-lg'>{error}</p>
			</div>
		);
	}

	const shipping = order?.shippingAddress || {};

	return (
		<div className='min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8'>
			<h1 className='text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center'>
				<FaBox className='mr-2' /> Order Details
			</h1>

			<div className='max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
				{/* Order Status */}
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-xl font-semibold mb-4 flex items-center'>
						<FaCheckCircle className='mr-2 text-gray-700' /> Order Status
					</h2>
					<div className='space-y-2'>
						<p className='text-gray-700'>
							<strong>Order ID:</strong> {order._id}
						</p>
						<div className='flex items-center gap-2'>
							<strong>Status:</strong>
							<select
								value={status}
								onChange={(e) => {
									setStatus(e.target.value);
									handleStatusChange(e.target.value);
								}}
								className={`px-2 py-1 rounded-full text-sm font-medium ${status === 'Delivered'
										? 'bg-green-100 text-green-700'
										: status === 'Pending'
											? 'bg-yellow-100 text-yellow-700'
											: status === 'Cancelled'
												? 'bg-red-100 text-red-700'
												: 'bg-gray-100 text-gray-700'
									}`}>
								<option value='Pending'>Pending</option>
								<option value='Confirmed'>Confirmed</option>
								<option value='Shipped'>Shipped</option>
								<option value='Delivered'>Delivered</option>
								<option value='Cancelled'>Cancelled</option>
							</select>
						</div>
						<div className='flex flex-wrap gap-2'>
							<button
								onClick={() => setIsNotePopupOpen(true)}
								className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2'>
								<FaInfoCircle /> Private Note
							</button>
							<button
								onClick={handleDownloadInvoice}
								className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2'>
								<FaDownload /> Download Invoice
							</button>
							<button
								onClick={() => setIsEmailPopupOpen(true)}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2'>
								<FaEnvelope /> Send Private Email
							</button>
						</div>
					</div>
				</div>

				{/* Shipping Information */}
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-xl font-semibold mb-4 flex items-center'>
						<FaTruck className='mr-2 text-gray-700' /> Shipping Information
					</h2>
					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>Tracking ID</label>
							<div className='flex items-center gap-2'>
								<input
									type='text'
									value={trackingId}
									onChange={(e) => setTrackingId(e.target.value)}
									className='w-full p-2 border border-gray-300 rounded-md'
									placeholder='Enter Tracking ID'
								/>
								<button
									onClick={handleSaveTrackingId}
									className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
									Save
								</button>
								<button
									onClick={handleEmptyTrackingId}
									className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'>
									Remove
								</button>
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>Shipping Carrier</label>
							<select
								value={shippingCarrier}
								onChange={(e) => setShippingCarrier(e.target.value)}
								className='w-full p-2 border border-gray-300 rounded-md'
								required>
								<option value=''>Select Carrier</option>
								<option value='FedEx'>FedEx</option>
								<option value='UPS'>UPS</option>
								<option value='USPS'>USPS</option>
								<option value='DHL'>DHL</option>
								<option value='Other'>Other</option>
							</select>
						</div>
					</div>
				</div>

				{/* Display Saved Note */}
				{orderMessage ? (
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold mb-4 flex items-center'>
							<FaInfoCircle className='mr-2 text-gray-700' /> Private Note
						</h2>
						<p className='text-gray-700'>{orderMessage}</p>
						<button
							onClick={handleDeleteNote}
							className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2'>
							Delete Note
						</button>
					</div>
				) : (
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold mb-4 flex items-center'>
							<FaInfoCircle className='mr-2 text-gray-700' /> Private Note
						</h2>
						<p className='text-gray-700'>Nothing saved</p>
					</div>
				)}

				{/* Display Email Note */}
				{emailMessage ? (
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold mb-4 flex items-center'>
							<FaInfoCircle className='mr-2 text-gray-700' /> Private Email sent to customer
						</h2>
						<p className='text-gray-700'>{emailMessage}</p>
						<button
							onClick={handleDeleteEmailNote}
							className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2'>
							Delete Note
						</button>
					</div>
				) : (
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold mb-4 flex items-center'>
							<FaInfoCircle className='mr-2 text-gray-700' /> Email sent to customer
						</h2>
						<p className='text-gray-700'>No email sent</p>
					</div>
				)}

				{/* Shipping Address */}
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-xl font-semibold mb-4 flex items-center'>
						<FaMapMarkerAlt className='mr-2 text-gray-700' /> Shipping Address
					</h2>
					<div className='space-y-2'>
						<p className='text-gray-700 font-semibold'>
							{shipping.firstName} {shipping.lastName}
						</p>
						<p className='text-gray-600'>{shipping.address}</p>
						<p className='text-gray-600 flex items-center'><FaCity className="mr-1 text-blue-500" /> <span>City: {shipping.city || 'N/A'}</span></p>
						<p className='text-gray-600 flex items-center'><FaMailBulk className="mr-1 text-purple-500" /> <span>Post Code: {shipping.postCode || shipping.postalCode || 'N/A'}</span></p>
						<p className='text-gray-600 flex items-center'><FaGlobeEurope className="mr-1 text-green-500" /> <span>Country: {shipping.country || 'N/A'}</span></p>
						<p className='text-gray-600'>Email: {shipping.email}</p>
						<p className='text-gray-600 flex items-center'><FaPhone className="mr-1" /> {shipping.phone}</p>
					</div>
				</div>

				{/* Products List */}
				<div className='p-6'>
					<h2 className='text-xl font-semibold mb-4 flex items-center'>
						<FaShoppingCart className='mr-2 text-gray-700' /> Products Ordered
					</h2>
					<div className='space-y-4'>
						{order?.products?.length === 0 ? (
							<div className='text-center py-8 bg-gray-50 rounded-lg'>
								<p className='text-gray-500'>No products found in this order.</p>
							</div>
						) : (
							order?.products?.map((item, index) => (
								<div
									key={item._id || index}
									className='border rounded-lg overflow-hidden hover:shadow-md transition-shadow'
									onMouseEnter={(e) => (e.currentTarget.style.cursor = 'default')}>
									{/* Product Card Header */}
									<div className='bg-gray-50 p-4 flex items-center justify-between border-b'>
										<div className='flex items-center min-w-0'>
											{item.frontImage && (
												<img
													src={item.frontImage}
													alt={item.title}
													className='w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0'
												/>
											)}
											<div className='min-w-0'>
												<h3 className='font-semibold truncate'>{item.title}</h3>
												<p className='text-gray-600'>
													${item.price?.toFixed(2)} × {item.quantity || 1}
												</p>
											</div>
										</div>
										<span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm whitespace-nowrap ml-2'>
											{item.isBundle ? 'Bundle' : 'Single'}
										</span>
									</div>
									{/* Product Details ... (rest unchanged) */}
									<div className='p-4'>
										{/* You can keep the rest of your product details rendering here as before */}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Note Popup */}
			{isNotePopupOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-96 relative'>
						<button
							onClick={() => setIsNotePopupOpen(false)}
							className='absolute top-2 right-2 text-gray-600 hover:text-gray-800'>
							<FaTimes />
						</button>
						<h2 className='text-xl font-semibold mb-4'>Add Private Note</h2>
						<textarea
							value={noteMessage}
							onChange={(e) => setNoteMessage(e.target.value)}
							className='w-full p-2 border border-gray-300 rounded-md mb-4'
							rows='4'
							placeholder='Type your note here...'
						/>
						<div className='flex justify-end gap-2'>
							<button
								onClick={() => setIsNotePopupOpen(false)}
								className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors'>
								Cancel
							</button>
							<button
								onClick={handleSaveNote}
								className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Email Popup */}
			{isEmailPopupOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-96 relative'>
						<button
							onClick={() => setIsEmailPopupOpen(false)}
							className='absolute top-2 right-2 text-gray-600 hover:text-gray-800'>
							<FaTimes />
						</button>
						<h2 className='text-xl font-semibold mb-4'>Send Email to Customer</h2>
						<textarea
							value={emailMessage}
							onChange={(e) => setEmailMessage(e.target.value)}
							className='w-full p-2 border border-gray-300 rounded-md mb-4'
							rows='4'
							placeholder='Type your message here...'
						/>
						<div className='flex justify-end gap-2'>
							<button
								onClick={() => setIsEmailPopupOpen(false)}
								className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors'>
								Cancel
							</button>
							<button
								onClick={handleSendEmail}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'>
								Send
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderDetails;