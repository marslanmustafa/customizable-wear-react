'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { Audio } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { loginSuccess } from '../store/authSlice';
import { getApiBaseUrl } from '../utils/config';

// const apiUrl = import.meta.env.VITE_API_BASE_URL;
const AdminLoginPage = () => {
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const dispatch = useDispatch();
	const { toast } = useToast();
	const navigate = useNavigate();
	const location = useLocation();
	const [admin, setIsAdmin] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		const checkAdminStatus = async () => {
			try {

				const response = await fetch(`${getApiBaseUrl()}/auth/isAdmin`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});

				const data = await response.json();


				if (data.success) {
					setIsAdmin(true);
					navigate("/admin/dashboard")
				} else {

					navigate("/admin/login");
				}
			} catch (error) {

				navigate("/admin/login");
			} finally {
				setLoading(false);
			}
		};

		checkAdminStatus();
	}, [navigate]);
	const onSubmit = async (data) => {
		try {
			setLoading(true);
			const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				dispatch(
					loginSuccess({
						token: result.token,
						user: result.user,
						isAuthenticated: true,
					}),
				);

				toast({
					title: 'Logged In!',
					description: 'You are now logged in.',
					variant: 'success',
					className: 'bg-green-500 text-white border-0',
				});

				// Handle redirection logic
				handlePostLoginRedirect(result.user);
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: result.message || 'Invalid email or password.',
				});
			}
		} catch (error) {
			toast({
				title: 'Login Failed',
				description: '❌ An error occurred during login. Please try again.',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePostLoginRedirect = (user) => {
		const { from } = location.state || {};
		if (from) {
			navigate(from);
			return;
		}
		navigate('/admin/dashboard');
	};

	const handleClose = () => navigate('/');

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 px-4 md:px-0'>
			<div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative'>
				{loading && (
					<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-lg z-50'>
						<Audio height='100' width='100' color='white' ariaLabel='loading' />
					</div>
				)}

				<button onClick={handleClose} className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2'>
					<FaTimes size={20} />
				</button>

				<h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>Admin Login</h2>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='flex flex-col'>
						<label className='text-sm font-medium text-gray-600'>Admin Email</label>
						<input
							type='email'
							placeholder='Enter admin email'
							className='mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
							{...register('email', {
								required: 'Admin email is required',
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Invalid email address',
								},
							})}
						/>
						{errors.email && <span className='text-sm text-red-500 mt-1'>{errors.email.message}</span>}
					</div>

					<div className='flex flex-col relative'>
						<label className='text-sm font-medium text-gray-600'>Admin Password</label>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Enter admin password'
							className='mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 8,
									message: 'Password must be at least 8 characters',
								},
							})}
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-10 text-gray-500 hover:text-gray-700'
							aria-label={showPassword ? 'Hide password' : 'Show password'}>
							{showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
						</button>
						{errors.password && <span className='text-sm text-red-500 mt-1'>{errors.password.message}</span>}
					</div>

					<button
						type='submit'
						disabled={loading}
						className={`w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''
							}`}>
						{loading ? 'Logging in as Admin...' : 'Admin Login'}
					</button>
				</form>


			</div>
		</div>
	);
};

export default AdminLoginPage;
