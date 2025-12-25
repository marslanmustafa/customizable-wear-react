import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiBaseUrl } from '../utils/config';

// const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Bundles = () => {
	const [bundles, setBundles] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBundles = async () => {
			try {
				const response = await fetch(`${getApiBaseUrl()}/bundle`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Failed to fetch bundles');
				}

				const data = await response.json();
				setBundles(data.bundles || []);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchBundles();
	}, []);

	if (loading) {
		return (
			<div className='bg-white'>
				<div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
					<div className='flex justify-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
					</div>
				</div>
			</div>
		);
	}

	if (!bundles || bundles.length === 0) {
		return null;
	}

	return (
		<div className='bg-white'>
			<div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
				<h2 className='text-2xl font-bold tracking-tight text-gray-900'>
					Uniform Deals that Add Up: SAVE UP TO 60% ON OUR MIX & MATCH BUNDLES
				</h2>

				<div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
					{bundles.map((bundle) => (
						<div key={bundle._id} className='group relative border-[1px] rounded-md'>
							<Link to={`/bundle/${bundle._id}`}>
								<div className='aspect-square w-full bg-gray-200 overflow-hidden'>
									<img
										src={bundle.thumbnail}
										alt={bundle.title}
										className='w-full h-full object-cover object-center'
										onError={(e) => {
											e.target.src = 'https://via.placeholder.com/300';
										}}
									/>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Bundles;
