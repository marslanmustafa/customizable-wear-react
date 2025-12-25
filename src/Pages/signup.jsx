import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { Audio } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { getApiBaseUrl } from '../utils/config';


// const apiUrl = import.meta.env.VITE_API_BASE_URL; 


const SignUp = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		role: 'user',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(true);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { toast } = useToast();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch(`${getApiBaseUrl()}/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
				credentials: 'include',
			});

			setLoading(false);
			const data = await response.json();
			if (response.ok && data.user.role === 'user') {
				dispatch(
					loginSuccess({
						token: data.token,
						user: data.user,
						isAuthenticated: true
					}),
				);
				toast({
					title: 'Success!',
					description: 'Account created successfully!',
					variant: 'success',
					className: 'bg-green-500 text-white border-0',
				});


				navigate('/products');
			} else {
				navigate('/');
			}
		} catch (error) {
			setLoading(false);

			toast({
				description: error.message || 'An error occurred while signing up',
				className: 'bg-red-500 text-white border-0',
			});
		}
	};

	return (
		<div className='my-5  flex justify-center items-center relative px-4 md:px-0'>
			{/* Background overlay when loading */}
			{loading && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-lg z-50'>
					<Audio height='100' width='100' color='white' ariaLabel='loading' />
				</div>
			)}

			{/* Sign Up Form */}
			{showForm && (
				<div className='p-8 w-full max-w-md bg-white rounded-lg shadow-lg z-20 relative'>
					{/* Close button positioned at top-right corner */}
					<button
						onClick={() => setShowForm(false)}
						className='absolute top-4 right-4 text-gray-600 hover:text-gray-700 p-2'>
						<FaTimes size={20} />
					</button>

					<h2 className='text-2xl font-semibold text-center text-gray-700 mb-6'>Sign Up</h2>

					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Form Fields */}
						<div>
							<label htmlFor='firstName' className='block text-sm font-medium text-gray-600'>
								First Name
							</label>
							<input
								type='text'
								name='firstName'
								id='firstName'
								value={formData.firstName}
								onChange={handleChange}
								required
								className='mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
							/>
						</div>
						<div>
							<label htmlFor='lastName' className='block text-sm font-medium text-gray-600'>
								Last Name
							</label>
							<input
								type='text'
								name='lastName'
								id='lastName'
								value={formData.lastName}
								onChange={handleChange}
								required
								className='mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
							/>
						</div>
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-600'>
								Email Address
							</label>
							<input
								type='email'
								name='email'
								id='email'
								value={formData.email}
								onChange={handleChange}
								required
								className='mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
							/>
						</div>
						<div className='relative mt-2'>
							<label htmlFor='password' className='block text-sm font-medium text-gray-600'>
								Password
							</label>
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								id='password'
								value={formData.password}
								onChange={handleChange}
								required
								className='p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-10'
							/>
							<button
								type='button'
								onClick={() => setShowPassword((prev) => !prev)}
								className='absolute inset-y-[63%] right-3 flex items-center justify-center h-100 text-gray-500'>
								{showPassword ? <FaEyeSlash size={20} /> : <FaRegEye size={20} />}
							</button>
						</div>

						<div className='flex justify-center'>
							<button
								type='submit'
								className='w-full bg-black text-white p-3 rounded-md hover:bg-transparent border-[1px] border-black hover:text-black'>
								Sign Up
							</button>
						</div>
					</form>

					<div className='mt-4 text-center text-sm text-gray-600'>
						<p>
							Already have an account?{' '}
							<a href='/login' className='text-indigo-600 hover:text-indigo-700'>
								Login here
							</a>
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default SignUp;
