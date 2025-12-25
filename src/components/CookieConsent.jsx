import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const CookieConsent = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// Check if user has already made a choice
		const consentGiven = localStorage.getItem('cookieConsent');

		if (!consentGiven) {
			const timer = setTimeout(() => {
				setVisible(true);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, []);

	const handleAccept = () => {
		localStorage.setItem('cookieConsent', 'accepted');
		setVisible(false);
	};

	const handleReject = () => {
		localStorage.setItem('cookieConsent', 'rejected');
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className='fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-[#091638] text-white p-6 rounded-lg shadow-xl z-[9999] border border-gray-200'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div className='flex-1'>
					<div className='flex items-start'>
						<div className='mr-3 text-xl'>🍪</div>
						<div>
							<h3 className='font-bold text-lg mb-1'>We Value Your Privacy</h3>
							<p className='text-sm text-gray-300'>
								We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept All",
								you consent to our use of cookies.
							</p>
						</div>
					</div>
				</div>

				<div className='flex flex-col sm:flex-row gap-2'>
					<button
						onClick={handleReject}
						className='px-4 py-2 bg-transparent border border-white text-white rounded-md hover:bg-white hover:text-[#091638] transition-colors text-sm font-medium whitespace-nowrap'>
						Reject
					</button>
					<button
						onClick={handleAccept}
						className='px-4 py-2 bg-white text-[#091638] rounded-md hover:bg-gray-100 transition-colors text-sm font-medium whitespace-nowrap'>
						Accept All
					</button>
				</div>
			</div>

			<button onClick={handleReject} className='absolute top-3 right-3 text-gray-300 hover:text-white'>
				<FaTimes />
			</button>
		</div>
	);
};

export default CookieConsent;
