import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { SlOptionsVertical } from "react-icons/sl";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [viewedOrders, setViewedOrders] = useState(new Set());
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [openDropdownId, setOpenDropdownId] = useState(null);
	const apiUrl = import.meta.env.VITE_API_BASE_URL;
	const { toast } = useToast();

	useEffect(() => {
		fetchOrders();
		// eslint-disable-next-line
	}, []);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${apiUrl}/orders`, {
				method: 'GET',
				credentials: 'include',
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error('Unauthorized - Please log in again.');
				} else {
					throw new Error('Failed to fetch orders');
				}
			}

			const data = await response.json();

			if (data.success && Array.isArray(data.orders)) {
				setOrders(data.orders);
			} else {
				setOrders([]); // Ensure orders is an empty array if not found
				toast({
					description: 'Unexpected response format from API',
					variant: 'destructive',
					className: 'bg-red-500 text-white border-0',
				});
			}
		} catch (error) {
			setOrders([]); // Ensure orders is an empty array if error
			setError(error.message);
			toast({
				description: error.message,
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteOrder = async (orderId) => {
		setOpenDropdownId(null);

		try {
			const response = await fetch(`${apiUrl}/orders/${orderId}/deleteOrder`, {
				method: 'DELETE',
				credentials: 'include',
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.message || 'Failed to delete order');
			}

			toast({
				description: 'Order deleted successfully!',
				className: 'bg-green-500 text-white border-0',
			});
			// Only remove from state if API says it was successful
			setOrders(prev => prev.filter(order => order._id !== orderId));
		} catch (error) {
			toast({
				description: error.message,
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	const isNewOrder = (createdAt, orderId) => {
		const oneDayAgo = new Date();
		oneDayAgo.setDate(oneDayAgo.getDate() - 1);
		return new Date(createdAt) > oneDayAgo && !viewedOrders.has(orderId);
	};

	const handleOrderClick = (orderId) => {
		setViewedOrders((prev) => new Set([...prev, orderId]));
	};

	// Filter orders based on search term (searches orderNumber if available, else _id)
	const filteredOrders = orders.filter((order) =>
		(order.orderNumber || order._id)
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	// Sort orders (new orders first)
	const sortedOrders = [...filteredOrders].sort((a, b) => {
		const aNew = isNewOrder(a.createdAt, a._id);
		const bNew = isNewOrder(b.createdAt, b._id);
		return bNew - aNew;
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div className='text-red-600'>{error}</div>;
	}

	// Always show "No orders found" if there are no orders after loading and no error
	if (!loading && sortedOrders.length === 0) {
		return (
			<div className='p-4'>
				<h1 className='text-2xl font-semibold text-gray-800 mb-4'>Orders</h1>
				<div className='bg-white p-8 rounded-lg text-center'>
					<p className='text-gray-600 text-lg'>No orders found</p>
				</div>
			</div>
		);
	}

	return (
		<div className='p-4'>
			<h1 className='text-2xl font-semibold text-gray-800 mb-4'>Orders</h1>

			{orders.length > 0 && (
				<div className='mb-4'>
					<input
						type='text'
						placeholder='Search by Order Number'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
					/>
				</div>
			)}

			<div className='overflow-x-auto'>
				<table className='w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden'>
					<thead className='bg-orange-400 text-white'>
						<tr>
							<th className='px-4 py-2 text-left text-sm font-medium'>#</th>
							<th className='px-4 py-2 text-left text-sm font-medium'>Order Number</th>
							<th className='px-4 py-2 text-left text-sm font-medium'>Date</th>
							<th className='px-4 py-2 text-left text-sm font-medium'>Status</th>
							<th className='px-4 py-2 text-left text-sm font-medium'>Total Amount</th>
							<th className='px-4 py-2 text-left text-sm font-medium'>Details</th>
							<th className='px-4 py-2 text-left text-sm font-medium'>New</th>
							<th className='px-4 py-2 text-left text-sm font-medium'></th>
						</tr>
					</thead>
					<tbody>
						{sortedOrders.map((order, index) => (
							<tr
								key={order._id}
								className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${isNewOrder(order.createdAt, order._id) ? 'bg-yellow-100 font-bold' : 'hover:bg-gray-100'
									}`}>
								<td className='px-4 py-2 text-sm text-gray-700'>{index + 1}</td>
								<td className='px-4 py-2 text-sm text-gray-700'>
									<Link
										to={`/orders/${order.orderNumber || order._id}`}
										className='text-blue-500 hover:underline'
										onClick={() => handleOrderClick(order._id)}>
										{order.orderNumber || order._id}
									</Link>
								</td>
								<td className='px-4 py-2 text-sm text-gray-700'>{new Date(order.createdAt).toLocaleDateString()}</td>
								<td
									className={`px-4 py-2 text-sm font-medium ${order.status === 'Delivered'
											? 'text-green-600'
											: order.status === 'Shipped'
												? 'text-blue-600'
												: order.status === 'Cancelled'
													? 'text-red-600'
													: 'text-yellow-600'
										}`}>
									{order.paymentStatus}
								</td>
								<td className='px-4 py-2 text-sm text-gray-700'>£{Math.round(order.finalAmount)}</td>
								<td className='px-4 py-2 text-sm'>
									<Link
										to={`/orders/${order.orderNumber || order._id}`}
										className='text-blue-500 hover:underline'
										onClick={() => handleOrderClick(order._id)}>
										View Details
									</Link>
								</td>
								<td className='px-4 py-2 text-sm text-green-600 font-bold'>
									{isNewOrder(order.createdAt, order._id) ? 'New' : ''}
								</td>
								<td className='px-1 py-2 text-sm text-blue-600 font-bold '
									onClick={() => setOpenDropdownId(openDropdownId === order._id ? null : order._id)}
								>
									<button className=''><SlOptionsVertical /></button>

									{openDropdownId === order._id && (
										<div className="absolute right-12 duration-500 w-32 bg-white border rounded shadow-lg z-10">
											<button
												onClick={() => handleDeleteOrder(order._id)}
												className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-white"
											>
												Delete
											</button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Orders;