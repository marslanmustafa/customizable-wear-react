import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { clearCart } from '../store/cartSlice';
import { useDispatch } from 'react-redux';

const Success = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const [orderDetails, setOrderDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');
  	const apiUrl = import.meta.env.VITE_API_BASE_URL;


	useEffect(() => {
		const verifyPayment = async () => {
			try {
				if (sessionId) {
					// Verify payment with your backend using fetch
					const response = await fetch(`${apiUrl}/payments/verify-payment?session_id=${sessionId}`, {
						credentials: 'include', // Include cookies if using session auth
					});

					if (!response.ok) {
						throw new Error('Payment verification failed');
					}

					const data = await response.json();
					setOrderDetails(data.order);

					// Only clear cart after successful verification
					dispatch(clearCart());
				} else {
					// Handle case where no session_id exists (e.g., Cash on Delivery)
					dispatch(clearCart());
				}
			} catch (err) {
				setError('Payment verification failed. Please contact support.');
				
			} finally {
				setLoading(false);
			}
		};

		verifyPayment();
	}, [sessionId, dispatch]);

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate('/');
		}, 10000); // Extended timeout for verification

		return () => clearTimeout(timer);
	}, [navigate]);

	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen bg-gray-100'>
				<div className='bg-white p-8 rounded-lg shadow-lg text-center'>
					<h2 className='text-2xl font-bold text-gray-800'>Verifying your payment...</h2>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto my-4'></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-screen bg-gray-100'>
				<div className='bg-white p-8 rounded-lg shadow-lg text-center'>
					<h2 className='text-2xl font-bold text-red-500'>Verification Error</h2>
					<p className='text-gray-600 mt-2'>{error}</p>
					<button
						onClick={() => navigate('/contact')}
						className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition'>
						Contact Support
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-lg shadow-lg text-center max-w-md'>
				<FaCheckCircle className='text-green-500 text-6xl mx-auto mb-4' />
				<h2 className='text-2xl font-bold text-gray-800'>Order Placed Successfully!</h2>

				{orderDetails && (
					<div className='mt-4 text-left bg-gray-50 p-4 rounded'>
						{/* <p>
							<strong>Order ID:</strong> {orderDetails._id}
						</p>
						<p>
							<strong>Amount:</strong> ${orderDetails.finalAmount?.toFixed(2)}
						</p>
						<p>
							<strong>Payment Method:</strong> {orderDetails.paymentMode}
						</p> */}
					</div>
				)}

				<p className='text-gray-600 mt-4'>Thank you for your purchase. Your order has been confirmed.</p>
				<p className='text-gray-600'>We will notify you once your order is shipped.</p>

				<div className='mt-6 space-y-2'>
					<button
						onClick={() => navigate('/products')}
						className='w-full bg-[#0f2252] text-white px-4 py-2 rounded-md  transition'>
						Continue Shopping
					</button>
				</div>

				<p className='text-sm text-gray-500 mt-4'>You will be automatically redirected in 10 seconds...</p>
			</div>
		</div>
	);
};

export default Success;
