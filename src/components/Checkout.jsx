import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { applyPromoCode, clearPromoCode } from '../store/promoCodeSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '@/components/ui/use-toast';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
	const cart = useSelector((state) => state.cart.items) || [];
	const { code, discount: promoDiscount } = useSelector((state) => state.promoCode);
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { toast } = useToast();
	const location = useLocation();

	const apiUrl = import.meta.env.VITE_API_BASE_URL;
	const currencySymbol = '£';
	const isCartEmpty = cart.length === 0;

	const calculateLogoCharges = () => {
		let logoEmbroideryTotal = 0;
		let newLogoSetupTotal = 0;

		cart.forEach(item => {
			if (item.logo) {
				if (item.usePreviousLogo) {
					logoEmbroideryTotal += 5.5 * (item.quantity || 1);
				} else {
					newLogoSetupTotal += 20 * (item.quantity || 1);
					logoEmbroideryTotal += 5.5 * (item.quantity || 1);
				}
			}
		});

		return { logoEmbroideryTotal, newLogoSetupTotal };
	};

	const { logoEmbroideryTotal, newLogoSetupTotal } = calculateLogoCharges();
	const subtotalAmount = isCartEmpty
		? 0
		: cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

	const totalAmount = subtotalAmount + logoEmbroideryTotal + newLogoSetupTotal;
	const [shippingInfo, setShippingInfo] = useState({
		type: location.state?.shippingType || 'standard',
		cost: location.state?.shippingCost || (totalAmount >= 100 ? 0 : 4.95)
	});

	const discountAmount = user && code && !isCartEmpty ? (totalAmount * promoDiscount) / 100 : 0;
	const finalAmount = (totalAmount - discountAmount) + shippingInfo.cost;

	// UPDATED: Added address fields for Post Code, City, Country
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		companyName: '',
		address: '',
		postCode: '',
		city: '',
		country: '',
		email: user?.email || '',
		phone: '',
		additionalInfo: '',
	});

	const [loading, setLoading] = useState(false);
	const [stripePromise, setStripePromise] = useState(null);
	const [enteredPromoCode, setEnteredPromoCode] = useState('');
	const [activePromoCodes, setActivePromoCodes] = useState([]);

	useEffect(() => {
		if (isCartEmpty && code) {
			dispatch(clearPromoCode());
		}
	}, [isCartEmpty, code, dispatch]);

	useEffect(() => {
		dispatch(clearPromoCode());
		setEnteredPromoCode('');
		return () => {
			dispatch(clearPromoCode());
		};
	}, [dispatch]);

	useEffect(() => {
		const initializeStripe = async () => {
			const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
			setStripePromise(stripe);
		};
		initializeStripe();
	}, []);

	useEffect(() => {
		if (user && !isCartEmpty) {
			const fetchActivePromoCodes = async () => {
				try {
					const response = await fetch(`${apiUrl}/promocodes/active`, {
						credentials: 'include',
					});
					if (!response.ok) throw new Error('Failed to load promo codes');
					const data = await response.json();
					setActivePromoCodes(data.promos || []);
				} catch (error) {
					console.error('Error fetching promo codes:', error);
				}
			};
			fetchActivePromoCodes();
		}
	}, [apiUrl, user, isCartEmpty]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleApplyPromo = async () => {
		if (!user) {
			toast({
				title: 'Login Required',
				description: 'Please login to use promo codes.',
			});
			return;
		}

		dispatch(clearPromoCode());

		if (!enteredPromoCode.trim()) {
			toast({
				description: 'Please enter a promo code',
				variant: 'destructive',
			});
			return;
		}

		try {
			const response = await fetch(`${apiUrl}/promocodes/validate`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ code: enteredPromoCode }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Invalid promo code');
			}

			const { promoCode, discount } = await response.json();
			dispatch(applyPromoCode({ code: promoCode, discount }));

			Swal.fire({
				icon: 'success',
				title: 'Promo Applied!',
				html: `
					<p>You got ${discount}% off!</p>
					<p>New Total: ${currencySymbol}${((totalAmount - (totalAmount * discount) / 100) + shippingInfo.cost).toFixed(2)}</p>
				`,
			});
		} catch (error) {
			toast({
				description: error.message || 'Invalid promo code',
				variant: 'destructive',
			});
		}
	};

	const validateForm = () => {
		// UPDATED: Add postCode, city, country to required fields
		const requiredFields = ['firstName', 'address', 'postCode', 'city', 'country', 'email', 'phone'];
		const missingFields = requiredFields.filter((field) => !formData[field].trim());

		if (missingFields.length > 0) {
			toast({
				description: `Please fill in: ${missingFields.join(', ')}`,
				variant: 'destructive',
			});
			return false;
		}

		if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			toast({
				description: 'Please enter a valid email address',
				variant: 'destructive',
			});
			return false;
		}

		return true;
	};

	const handleStripePayment = async () => {
		if (!validateForm()) return false;
		setLoading(true);

		try {
			const sessionResponse = await fetch(`${apiUrl}/payments/create-checkout-session`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					cart: cart.map((item) => ({
						...item,
						productId: item._id || item.id,
					})),
					shippingAddress: {
						firstName: formData.firstName,
						lastName: formData.lastName,
						companyName: formData.companyName,
						address: formData.address,
						postCode: formData.postCode,
						city: formData.city,
						country: formData.country,
						email: formData.email,
						phone: formData.phone,
						additionalInfo: formData.additionalInfo,
					},
					promoCode: code,
					discount: promoDiscount,
					userId: user?._id || user?.id || '',
					totalAmount,
					finalAmount,
				}),
			});

			if (!sessionResponse.ok) {
				throw new Error('Failed to create checkout session');
			}

			const { sessionId } = await sessionResponse.json();
			const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
			await stripe.redirectToCheckout({ sessionId });
		} catch (error) {
			console.error('Stripe error:', error);
			toast({
				description: error.message || 'Payment processing failed',
				variant: 'destructive',
			});
			setLoading(false);
			return false;
		}
	};

	const StripePaymentForm = () => {
		const stripe = useStripe();
		const elements = useElements();

		const handleSubmit = async (event) => {
			event.preventDefault();
			if (!stripe || !elements) return;
			const isValid = await handleStripePayment();
			if (!isValid) return;
		};

		return (
			<form onSubmit={handleSubmit} className='mt-4 space-y-4'>
				<button
					type='submit'
					disabled={!stripe || loading}
					className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50'>
					{loading ? 'Processing...' : `Pay ${currencySymbol}${finalAmount.toFixed(2)}`}
				</button>
			</form>
		);
	};

	if (isCartEmpty) {
		return (
			<div className='container mx-auto px-4 py-8 text-center'>
				<h1 className='text-2xl font-bold mb-4'>Your cart is empty</h1>
				<button onClick={() => navigate('/')} className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'>
					Continue Shopping
				</button>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-6xl'>
			<h1 className='text-2xl font-bold mb-8'>Checkout</h1>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-xl font-semibold mb-4'>Shipping Information</h2>
					<form className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium mb-1'>First Name *</label>
								<input
									type='text'
									name='firstName'
									value={formData.firstName}
									onChange={handleChange}
									className='w-full p-2 border rounded'
									required
								/>
							</div>
							<div>
								<label className='block text-sm font-medium mb-1'>Last Name</label>
								<input
									type='text'
									name='lastName'
									value={formData.lastName}
									onChange={handleChange}
									className='w-full p-2 border rounded'
								/>
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>Company Name</label>
							<input
								type='text'
								name='companyName'
								value={formData.companyName}
								onChange={handleChange}
								className='w-full p-2 border rounded'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>Address *</label>
							<input
								type='text'
								name='address'
								value={formData.address}
								onChange={handleChange}
								className='w-full p-2 border rounded'
								required
							/>
						</div>

						<div className='grid grid-cols-3 gap-4'>
							<div>
								<label className='block text-sm font-medium mb-1'>Post Code *</label>
								<input
									type='text'
									name='postCode'
									value={formData.postCode}
									onChange={handleChange}
									className='w-full p-2 border rounded'
									required
								/>
							</div>
							<div>
								<label className='block text-sm font-medium mb-1'>City *</label>
								<input
									type='text'
									name='city'
									value={formData.city}
									onChange={handleChange}
									className='w-full p-2 border rounded'
									required
								/>
							</div>
							<div>
								<label className='block text-sm font-medium mb-1'>Country *</label>
								<input
									type='text'
									name='country'
									value={formData.country}
									onChange={handleChange}
									className='w-full p-2 border rounded'
									required
								/>
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>Email *</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								className='w-full p-2 border rounded'
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>Phone *</label>
							<input
								type='tel'
								name='phone'
								value={formData.phone}
								onChange={handleChange}
								className='w-full p-2 border rounded'
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>Additional Information</label>
							<textarea
								name='additionalInfo'
								value={formData.additionalInfo}
								onChange={handleChange}
								className='w-full p-2 border rounded'
								rows='3'
							/>
						</div>
					</form>
				</div>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
					<div className='mb-6 border-b pb-4'>
						<h3 className='font-medium mb-2'>Your Items</h3>
						<div className='space-y-4'>
							{cart.map((item) => (
								<div key={item._id || item.id} className='flex items-center gap-4'>
									<img
										src={item.frontImage || item.thumbnail}
										alt={item.title}
										className='w-16 h-16 object-cover rounded'
									/>
									<div className='flex-1'>
										<h4 className='font-medium'>{item.title}</h4>
										<div className='text-sm text-gray-600'>
											{item.quantity} × {currencySymbol}
											{item.price.toFixed(2)}
											{item.size && ` • Size: ${item.size}`}
											{item.color && ` • Color: ${item.color}`}
										</div>
									</div>
									<div className='font-medium'>
										{currencySymbol}
										{(item.price * item.quantity).toFixed(2)}
									</div>
								</div>
							))}
						</div>
					</div>
					{stripePromise && (
						<Elements stripe={stripePromise}>
							<StripePaymentForm />
						</Elements>
					)}

					<div className='border-t pt-4'>
						<div className='flex justify-between mb-2'>
							<span>Subtotal:</span>
							<span>
								{currencySymbol}
								{subtotalAmount.toFixed(2)}
							</span>
						</div>

						{logoEmbroideryTotal > 0 && (
							<div className='flex justify-between mb-1'>
								<span>Logo Embroidery/Printing:</span>
								<span>
									{currencySymbol}
									{logoEmbroideryTotal.toFixed(2)}
								</span>
							</div>
						)}
						{newLogoSetupTotal > 0 && (
							<div className='flex justify-between mb-1'>
								<span>New Logo Setup Charges:</span>
								<span>
									{currencySymbol}
									{newLogoSetupTotal.toFixed(2)}
								</span>
							</div>
						)}

						{user && code && (
							<div className='flex justify-between items-center bg-green-50 p-2 rounded mb-2'>
								<div className='text-green-700'>
									<span>Discount ({code} - {promoDiscount}%):</span>
								</div>
								<div className='text-green-700 font-medium'>
									-{currencySymbol}{discountAmount.toFixed(2)}
								</div>
							</div>
						)}

						<div className='flex justify-between mb-2'>
							<span>Shipping ({shippingInfo.type}):</span>
							<span>
								{shippingInfo.cost === 0 ? 'Free' : `${currencySymbol}${shippingInfo.cost.toFixed(2)}`}
							</span>
						</div>

						<div className='flex justify-between font-bold text-lg mt-4'>
							<span>Total:</span>
							<span>
								{currencySymbol}
								{finalAmount.toFixed(2)}
							</span>
						</div>
					</div>

					{user && !isCartEmpty && (
						<div className='mt-6'>
							<h3 className='font-medium mb-2'>Promo Code</h3>
							{code ? (
								<div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
									<div>
										<span className="font-medium text-green-700">Applied: {code}</span>
										<span className="ml-2 text-green-600">({promoDiscount}% off)</span>
									</div>
									<button
										onClick={() => {
											dispatch(clearPromoCode());
											setEnteredPromoCode('');
										}}
										className="text-red-500 hover:text-red-700 text-sm font-medium"
									>
										Remove
									</button>
								</div>
							) : (
								<>
									{activePromoCodes.length > 0 && (
										<div className='flex'>
											<input
												type='text'
												placeholder='Enter promo code'
												value={enteredPromoCode}
												onChange={(e) => setEnteredPromoCode(e.target.value)}
												className='flex-1 p-2 border rounded-l'
											/>
											<button
												onClick={handleApplyPromo}
												className='bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700'
											>
												Apply
											</button>
										</div>
									)}
								</>
							)}
						</div>
					)}
					{!user && (
						<div className='mt-4 text-sm text-gray-600'>
							<span>Want to use a promo code? </span>
							<button onClick={() => navigate('/login')} className='text-blue-600 hover:underline'>
								Login first
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Checkout;