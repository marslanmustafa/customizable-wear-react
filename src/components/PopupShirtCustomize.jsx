import React, { useEffect, useState } from 'react';

const PopupShirtCustomize = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [showVideo, setShowVideo] = useState(false);

	useEffect(() => {
		// Check if the popup has been shown before
		const hasSeenPopup = localStorage.getItem('hasSeenPopup');

		if (!hasSeenPopup) {
			setTimeout(() => {
				setIsOpen(true);
				localStorage.setItem('hasSeenPopup', 'true'); // Mark as seen
			}, 2000);
		}
	}, []);

	const handleClose = () => {
		setIsOpen(false);
		setShowVideo(false);
	};

	const handleWatchClick = () => {
		setShowVideo(true);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white p-6 mx-2 rounded-lg shadow-lg max-w-lg w-full'>
				{!showVideo ? (
					<>
						<h2 className='text-xl font-bold mb-4'>Welcome to Customizable Wear</h2>
						<p className='mb-4'>
							Your products, your way! At Customizable Wear, we turn ideas into reality. Whether you're making a
							statement, building your brand, or crafting something unforgettable, our powerful customization tools give
							you full control over your creations.
						</p>
						<div>
							<h2 className='text-md font-bold mb-2'>Customize Your Way:</h2>
							<ul className='list-disc ml-6 mb-2'>
								<li>Pick Your Product and Perfect Fit</li>
								<li>Play with Colors</li>
								<li>Design It, Place It, Make It Yours</li>
								<li>Choose the Right Size and Quantity</li>
							</ul>
							<h2 className='text-md font-bold mb-2'>Need help? Watch our guide and customise like a pro!</h2>
						</div>
						<div className='flex items-center justify-center gap-4 mt-2'>
							<button
								onClick={handleWatchClick}
								className='bg-black border border-black text-white px-4 py-2 rounded hover:bg-transparent hover:text-black'>
								Watch and Create
							</button>
							<button onClick={handleClose} className='bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400'>
								Close
							</button>
						</div>
					</>
				) : (
					<>
						<h2 className='text-lg font-bold mb-4'>Watch How to Customize</h2>
						<div className='aspect-w-16 aspect-h-9 mb-4'>
							<iframe
								className='w-full h-64'
								src='https://www.youtube.com/embed/xbxsk-Aszhg?si=OhgFCSDsQVfOPzF8'
								title='Customize Shirt Tutorial'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen></iframe>
						</div>
						<div className='text-center'>
							<button onClick={handleClose} className='bg-black text-white px-4 py-2 rounded'>
								Close
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PopupShirtCustomize;
