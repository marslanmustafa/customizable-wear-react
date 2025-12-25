import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner'; // Import React Loader Simple
import { useToast } from '@/components/ui/use-toast';

const PromoCodes = () => {
	const [promoCodes, setPromoCodes] = useState([]);
	const [code, setCode] = useState('');
	const [discount, setDiscount] = useState('');
	const [emailBody, setEmailBody] = useState('');
	const [ loading, setLoading ] = useState(false);
			  const { toast } = useToast();
	

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/promocodes`; 

	useEffect(() => {
		fetchPromoCodes();
	}, []);

	const fetchPromoCodes = async () => {

		try {
			const response = await fetch(`${apiUrl}/all`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials:"include"
			});
			if (!response.ok) throw new Error('Failed to fetch promo codes');
			const data = await response.json();
			setPromoCodes(data.promos);
		} catch (error) {
			
		}
	};

	const handleAddPromoCode = async (e) => {
		e.preventDefault();
		

		const newCode = { code, discount: parseFloat(discount), status: 'active' };
		try {
			const response = await fetch(`${apiUrl}/create`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials:"include",
				body: JSON.stringify(newCode),
			});
			if (!response.ok) throw new Error('Failed to add promo code');

			fetchPromoCodes();
			setCode('');
			setDiscount('');
		} catch (error) {
			
		}
	};

	const handleDeletePromoCode = async (id) => {
	;

		try {
			const response = await fetch(`${apiUrl}/delete/${id}`, {
				method: 'DELETE',
			credentials:"include"
			});
			if (!response.ok) throw new Error('Failed to delete promo code');

			fetchPromoCodes();
		} catch (error) {
			
		}
	};

	const handleToggleStatus = async (id, currentStatus) => {
	

		const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
		try {
			const response = await fetch(`${apiUrl}/toggle/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				credentials:"include",
				body: JSON.stringify({ status: newStatus }),
			});
			if (!response.ok) throw new Error('Failed to update status');

			setPromoCodes((prev) => prev.map((promo) => (promo._id === id ? { ...promo, status: newStatus } : promo)));
		} catch (error) {
			
		}
	};

	const generateRandomCode = () => {
		const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
		setCode(randomCode);
	};

	const handleSendEmail = async () => {
		
		if (!emailBody.trim()) {
			toast('Please enter the email body.');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${apiUrl}/send-email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					
				 },
				body: JSON.stringify({ emailBody }),
				credentials:"include"
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to send email');
			}

			toast('Email sent successfully!');
			setEmailBody('');
		} catch (error) {
			
			toast(error.message || 'Failed to send email.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='p-6 max-w-3xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4 text-center'>Manage Promo Codes</h2>

			<form onSubmit={handleAddPromoCode} className='flex gap-2 mb-6'>
				<input
					onChange={(e) => setCode(e.target.value)}
					type='text'
					value={code}
					placeholder='Promo Code'
					className='border p-2 flex-grow rounded-md bg-gray-100'
				/>
				<input
					type='number'
					value={discount}
					onChange={(e) => setDiscount(e.target.value)}
					placeholder='Discount %'
					className='border p-2 w-24 rounded-md'
					required
				/>
				<button type='button' onClick={generateRandomCode} className='bg-blue-500 text-white px-3 py-1 rounded-md'>
					Generate
				</button>
				<button type='submit' className='bg-green-500 text-white px-3 py-1 rounded-md'>
					Add
				</button>
			</form>

			<div className='mb-6'>
				<textarea
					value={emailBody}
					onChange={(e) => setEmailBody(e.target.value)}
					placeholder='Enter email body for the offer...'
					className='w-full p-2 border rounded-md bg-gray-100'
					rows={4}
				/>
				<button
					onClick={handleSendEmail}
					disabled={loading}
					className='mt-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed'>
					{loading ? 'Sending...' : 'Send Email to All Customers'}
				</button>
			</div>

			<div className='grid gap-4'>
				{promoCodes.map((promo) => (
					<div key={promo._id} className='p-4 border rounded-md shadow-md flex justify-between items-center'>
						<div>
							<span className='font-semibold'>{promo.code}</span>
						</div>

						<div className='flex items-center gap-2'>
							<div
								className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
									promo.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
								}`}
								onClick={() => handleToggleStatus(promo._id, promo.status)}>
								<div
									className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
										promo.status === 'active' ? 'translate-x-7' : 'translate-x-0'
									}`}></div>
							</div>

							<button
								onClick={() => handleDeletePromoCode(promo._id)}
								className='bg-red-500 text-white px-2 py-1 rounded-md'>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{loading && (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center'>
          <p className='text-lg font-semibold mb-4'>Sending emails...</p>
          <ThreeDots height='50' width='50' color='#6B46C1' />
        </div>
      </div>
    )}
		</div>
	);
};

export default PromoCodes;
