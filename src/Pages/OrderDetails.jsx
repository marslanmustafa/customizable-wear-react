import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { getApiBaseUrl } from '../utils/config';

// const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function OrderDetails() {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { toast } = useToast();

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				// Note: Now fetches by orderNumber instead of _id
				const { data } = await axios.get(`${getApiBaseUrl()}/orders/orders/${orderId}`, {
					withCredentials: true,
				});
				setOrder(data.order);
			} catch (err) {
				setError(err.response?.data?.message || 'Order not found');
				toast({
					description: 'Failed to load order details',
					className: 'bg-red-500 text-white border-0',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [orderId, toast]);

	if (loading) return <div className='text-center py-8'>Loading order details...</div>;
	if (error) return <div className='text-center py-8 text-red-500'>{error}</div>;
	if (!order) return null;

	return (
		<div className='max-w-4xl mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>
				Order #{order.orderNumber || order._id}
			</h1>

			<div className='bg-white rounded-lg shadow-md p-6 mb-6'>
				<h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<h3 className='font-medium mb-2'>Shipping Information</h3>
						<p>
							{order?.shippingAddress?.firstName} {order.shippingAddress?.lastName}
						</p>
						<p>{order.shippingAddress?.address}</p>
						<p>{order.shippingAddress?.email}</p>
						<p>{order.shippingAddress?.phone}</p>
					</div>
					<div>
						<h3 className='font-medium mb-2'>Order Details</h3>
						<p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
						<p>
							Status: <span className='capitalize'>{order.status?.payment}</span>
						</p>
						<p>Payment Method: {order.paymentMode}</p>
					</div>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-md p-6'>
				<h2 className='text-xl font-semibold mb-4'>Order Items</h2>
				{order.products.map((product, index) => (
					<div key={index} className='flex border-b py-4 items-start'>
						{(product.frontImage || product.thumbnail) && (
							<img
								src={product.frontImage || product.thumbnail}
								alt={product.title}
								className='w-20 h-20 object-contain mr-4 border rounded'
							/>
						)}
						<div className='flex-1'>
							<h3 className='font-medium'>{product.title}</h3>
							<p>Quantity: {product.quantity}</p>
							<p>Price: £{product.price.toFixed(2)}</p>
							{product.size && <p>Size: {product.size}</p>}
							{product.color && <p>Color: {product.color}</p>}
						</div>
					</div>
				))}

				<div className='mt-6 pt-4 border-t'>
					<div className='flex justify-between mb-2'>
						<span>Subtotal:</span>
						<span>£ {order.totalAmount.toFixed(2)}</span>
					</div>
					{order.discount > 0 && (
						<div className='flex justify-between mb-2 text-green-600'>
							<span>Discount:</span>
							<span>-£{((order.totalAmount * order.discount) / 100).toFixed(2)}</span>
						</div>
					)}
					<div className='flex justify-between font-bold text-lg mt-2'>
						<span>Total:</span>
						<span>£{order.finalAmount.toFixed(2)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}