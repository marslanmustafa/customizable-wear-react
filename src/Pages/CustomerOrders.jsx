import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiTruck, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { getApiBaseUrl } from '../utils/config';

const CustomerOrders = () => {
	const { customerId } = useParams();
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	// const apiUrl = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch(`${getApiBaseUrl()}/orders/order-user/${customerId}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				});

				const data = await response.json();
				if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');

				setOrders(data.orders);
				if (data.orders.length > 0) {
					setCustomerInfo({
						name: `${data.orders[0].shippingAddress?.firstName} ${data.orders[0].shippingAddress?.lastName}`,
						address: data.orders[0].shippingAddress,
						email: data.orders[0].shippingAddress?.email,
						phone: data.orders[0].shippingAddress?.phone,
					});
				}
			} catch (err) {
				setError(err.message);
				navigate('/login');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [customerId, navigate]);

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Customer Order History</h1>

			{customerInfo && (
				<div className='bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200'>
					<h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
						<FiTruck className='text-blue-500' />
						Shipping Information
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<h3 className='font-medium text-gray-700 mb-2 flex items-center gap-2'>
								<FiMapPin className='text-gray-500' />
								Delivery Address
							</h3>
							<div className='text-gray-600 pl-7'>
								<p className='font-medium'>{customerInfo.name}</p>
								<p>{customerInfo?.address?.address}</p>
								<p>
									{customerInfo?.address?.city}, {customerInfo?.address?.state} {customerInfo.address?.zipCode}
								</p>
								<p>{customerInfo?.address?.country}</p>
							</div>
						</div>
						<div>
							<h3 className='font-medium text-gray-700 mb-2 flex items-center gap-2'>
								<FiPhone className='text-gray-500' />
								Contact Information
							</h3>
							<div className='text-gray-600 pl-7 space-y-2'>
								{customerInfo.phone && (
									<p className='flex items-center gap-2'>
										<span>Phone:</span>
										<span className='font-medium'>{customerInfo.phone}</span>
									</p>
								)}
								{customerInfo.email && (
									<p className='flex items-center gap-2'>
										<span>Email:</span>
										<span className='font-medium'>{customerInfo.email}</span>
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{loading && <p className='text-center text-gray-500'>Loading orders...</p>}
			{error && <p className='text-center text-red-500'>{error}</p>}

			{!loading && !error && orders.length > 0 && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{orders.map((order) => (
						<div key={order._id} className='bg-white shadow-lg rounded-lg p-6 border border-gray-200'>
							<div className='flex justify-between items-center border-b pb-4'>
								<div>
									<h2 className='text-xl font-bold'>Order #{order._id.slice(-6).toUpperCase()}</h2>
									<p className='text-gray-500'>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
								</div>
								<span
									className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status?.payment === 'paid'
											? 'bg-green-100 text-green-700'
											: 'bg-yellow-100 text-yellow-700'
										}`}>
									{order.status?.payment || 'Processing'}
								</span>
							</div>

							<div className='mt-4'>
								<p className='text-gray-600'>
									<strong>Total Amount:</strong> ${Math.round(order.finalAmount)}
								</p>
								<p className='text-gray-600'>
									<strong>Payment:</strong> {order.paymentMode} ({order.paymentStatus})
								</p>
							</div>

							<div className='mt-6'>
								<h3 className='text-lg font-semibold text-gray-700 border-b pb-2'>Products Ordered</h3>
								<div className='grid grid-cols-1 gap-4 mt-4'>
									{order.products.map((product) => (
										<div key={product.productId || product._id} className='bg-gray-50 p-4 rounded-lg shadow-sm border'>
											<div className='flex items-center gap-4 mb-3'>
												{(product.thumbnail || product.frontImage) && (
													<img
														src={product.thumbnail || product.frontImage}
														alt={product.title}
														className='w-24 h-24 object-cover rounded-md'
													/>
												)}
												<div>
													<h4 className='text-md font-semibold'>{product.title}</h4>
													<p className='text-gray-500'>${product.price?.toFixed(2)}</p>
													<p className='text-gray-500'>Qty: {product.quantity || 1}</p>
												</div>
											</div>

											{product.isBundle && product.bundleProducts && (
												<div className='mt-3 pl-2 border-l-2 border-gray-200'>
													<h5 className='font-medium text-sm mb-2'>Bundle Includes:</h5>
													<div className='space-y-3'>
														{product.bundleProducts.map((bundleItem, idx) => (
															<div key={idx} className='flex items-start gap-3'>
																{(bundleItem.thumbnail || bundleItem.frontImage) && (
																	<img
																		src={bundleItem.thumbnail || bundleItem.frontImage}
																		alt={bundleItem.title}
																		className='w-16 h-16 object-cover rounded-md'
																	/>
																)}
																<div>
																	<p className='text-sm font-medium'>{bundleItem.title}</p>
																	<div className='text-xs text-gray-500 space-y-1 mt-1'>
																		{bundleItem.size && (
																			<p>
																				Size:{' '}
																				{Array.isArray(bundleItem.size) ? bundleItem.size.join(', ') : bundleItem.size}
																			</p>
																		)}
																		{bundleItem.color && (
																			<p className='flex items-center'>
																				Color:
																				<span
																					className='ml-1 w-4 h-4 rounded-full inline-block border border-gray-300'
																					style={{
																						backgroundColor: Array.isArray(bundleItem.color)
																							? bundleItem.color[0]
																							: bundleItem.color,
																					}}
																				/>
																			</p>
																		)}
																		{bundleItem.position && (
																			<p>
																				Position:{' '}
																				{Array.isArray(bundleItem.position)
																					? bundleItem.position.join(', ')
																					: bundleItem.position}
																			</p>
																		)}
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{!product.isBundle && (
												<div className='mt-2 text-sm text-gray-500 space-y-1'>
													{product.size && <p>Size: {product.size}</p>}
													{product.color && (
														<p className='flex items-center'>
															Color:
															<span
																className='ml-1 w-4 h-4 rounded-full inline-block border border-gray-300'
																style={{ backgroundColor: product.color }}
															/>
														</p>
													)}
													{product.position !== 'Not selected' && <p>Position: {product.position}</p>}
													{product.quantity && <p>Quantity: {product.quantity}</p>}
													{product.price && <p>Price: ${product.price.toFixed(2)}</p>}
													{product.method !== 'Not selected' && <p>Method: {product.method}</p>}
													{product.textLine && <p>TextLine: {product.textLine}</p>}
													{product.notes && <p>Notes: {product.notes}</p>}
												</div>
											)}

											{product.logo && (
												<div className='mt-3 flex items-center gap-2'>
													<p className='text-sm font-medium'>Custom Logo:</p>
													<img
														src={product.logo}
														alt='Custom logo'
														className='w-10 h-10 object-cover rounded-md border border-gray-300'
													/>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{!loading && !error && orders.length === 0 && (
				<p className='text-center text-gray-500'>No orders found for this customer.</p>
			)}
		</div>
	);
};

export default CustomerOrders;
