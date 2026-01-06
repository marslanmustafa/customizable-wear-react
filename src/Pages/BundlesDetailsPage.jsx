import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PoloSelector from '../components/poloBundle';
import { getApiBaseUrl } from '../utils/config';

const BundleSelectionPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [bundleData, setBundleData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const apiUrl = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		const fetchBundleData = async () => {
			try {
				setLoading(true);
				setError(null);

				setError(null);

				const response = await fetch(`${getApiBaseUrl()}/bundle/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.message || `Failed to fetch bundle (HTTP ${response.status})`);
				}

				const data = await response.json();

				if (!data.bundle) {
					throw new Error('Bundle data not found in response');
				}

				setBundleData(data.bundle);
			} catch (error) {
				setError(error.message);
				if (error.message.includes('not found')) {
					navigate('/404', { replace: true });
				}
			} finally {
				setLoading(false);
			}
		};

		fetchBundleData();
	}, [id, navigate]);

	const LoadingSpinner = () => (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
			<p className="mt-4 text-lg text-gray-700">Loading your bundle options...</p>
		</div>
	);

	const ErrorMessage = ({ message }) => (
		<div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
			<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-red-800">Error loading bundle</h3>
						<div className="mt-2 text-sm text-red-700">
							<p>{message}</p>
						</div>
					</div>
				</div>
			</div>
			<button
				onClick={() => window.location.reload()}
				className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
				Try Again
			</button>
		</div>
	);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
				<ErrorMessage message={error} />
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold text-gray-900">{bundleData.title}</h1>
					<p className="mt-2 text-lg text-gray-600">{bundleData.description}</p>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Bundle Preview */}
					<div className="lg:w-1/2">
						<div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
							<div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
								{bundleData.thumbnail ? (
									<img
										src={bundleData.thumbnail}
										alt={bundleData.title}
										className="w-full h-full object-contain max-h-[70vh]"
										onError={(e) => {
											e.target.src = '/placeholder-image.jpg';
											e.target.onerror = null;
										}}
									/>
								) : (
									<div className="bg-gray-100 w-full h-96 flex items-center justify-center rounded-lg">
										<span className="text-gray-500">No thumbnail available</span>
									</div>
								)}
							</div>

							<div className="mt-6">
								<h2 className="text-xl font-semibold text-gray-900">Bundle Includes:</h2>
								<ul className="mt-2 space-y-2">
									{bundleData.products.map((product, index) => (
										<li key={index} className="flex items-center">
											<span className="w-5 h-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">
												{index + 1}
											</span>
											<span>Product {index + 1}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Product Customization */}
					<div className="lg:w-1/2">
						<div className="bg-white p-6 rounded-xl shadow-md">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-900">Customize Your Bundle</h2>
								<span className="text-xl font-semibold text-blue-600">${bundleData.price}</span>
							</div>

							<PoloSelector
								thumbnail={bundleData.thumbnail}
								bundleType={bundleData.categories[0]}
								products={bundleData.products}
								sizes={bundleData.size}
							/>

							{/* Size Chart */}
							{bundleData.sizeChartImage && (
								<div className="mt-8">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Size Guide</h3>
									<div className="overflow-hidden rounded-lg">
										<img
											src={bundleData.sizeChartImage}
											alt="Size Chart"
											className="w-full"
											onError={(e) => {
												e.target.style.display = 'none';
											}}
										/>
									</div>
									<div className="mt-4">
										<h4 className="text-sm font-medium text-gray-700 mb-2">Available Sizes:</h4>
										<div className="flex flex-wrap gap-2">
											{bundleData.size.map((size) => (
												<span
													key={size}
													className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800"
												>
													{size}
												</span>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>




			{/* Fixed Add to Cart Button */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 shadow-lg">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<div>
						<p className="text-sm text-gray-500">Total</p>
						<p className="text-xl font-bold text-gray-900">£{bundleData.price}</p>
					</div>
					<button
						className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default BundleSelectionPage;
