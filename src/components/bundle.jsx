import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from './ConfirmationModal';
import { ClipLoader } from 'react-spinners';
import { Button } from '@/components/ui/button';
import { getApiBaseUrl } from '../utils/config';

const Bundle = () => {
	const [bundles, setBundles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [noBundlesAvailable, setNoBundlesAvailable] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedBundle, setSelectedBundle] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [products, setProducts] = useState([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [currentBundleType, setCurrentBundleType] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	// Form state
	const [formData, setFormData] = useState({
		title: '',
		price: '',
		thumbnail: null,
		sizeChartImage: null,
		selectedProducts: [],
	});

	// const apiUrl = import.meta.env.VITE_API_BASE_URL;
	const { toast } = useToast();

	// Bundle type configurations
	const bundleTypes = {
		solo1: {
			title: "Solo Starter Bundle 1",
			description: "Select 2 products for this bundle",
			requiredProducts: 2,
			buttonText: "Create Solo Starter 1",
			color: "blue"
		},
		solo2: {
			title: "Solo Starter Bundle 2",
			description: "Select 2 products for this bundle",
			requiredProducts: 2,
			buttonText: "Create Solo Starter 2",
			color: "blue"
		},
		everyday: {
			title: "Everyday Bundle",
			description: "Select 3 products for this bundle",
			requiredProducts: 3,
			buttonText: "Create Everyday Bundle",
			color: "green"
		}
	};

	// Custom Modal Component
	const Modal = ({ isOpen, onClose, children, title }) => {
		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">{title}</h2>
							<button
								onClick={onClose}
								className="text-gray-500 hover:text-gray-700"
							>
								&times;
							</button>
						</div>
						{children}
					</div>
				</div>
			</div>
		);
	};

	// Fetch all bundles and products
	const fetchData = async () => {
		try {
			setLoading(true);

			// Fetch bundles
			const bundlesResponse = await fetch(`${getApiBaseUrl()}/bundle/`, {
				credentials: 'include',
			});

			if (!bundlesResponse.ok) {
				if (bundlesResponse.status === 404) {
					setNoBundlesAvailable(true);
					setBundles([]);
				} else {
					throw new Error(`Server responded with status ${bundlesResponse.status}`);
				}
			} else {
				const bundlesData = await bundlesResponse.json();
				const formattedBundles = bundlesData.bundles || bundlesData;
				setBundles(formattedBundles.map(b => ({ ...b, imageLoaded: false })));
				setNoBundlesAvailable(formattedBundles.length === 0);
			}

			// Fetch products
			const productsResponse = await fetch(`${getApiBaseUrl()}/products`, {
				credentials: 'include',
			});

			if (productsResponse.ok) {
				const productsData = await productsResponse.json();
				if (productsData.success) {
					setProducts(productsData.products);
				}
			}
		} catch (err) {
			setError(err.message);
			setNoBundlesAvailable(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const openCreateModal = (bundleType) => {
		setCurrentBundleType(bundleType);
		setFormData({
			title: bundleTypes[bundleType].title,
			price: '',
			thumbnail: null,
			sizeChartImage: null,
			selectedProducts: [],
		});
		setIsCreateModalOpen(true);
	};

	const handleProductSelect = (productId) => {
		const product = products.find(p => p._id === productId);
		const maxProducts = bundleTypes[currentBundleType].requiredProducts;

		setFormData(prev => {
			// Toggle selection
			if (prev.selectedProducts.some(p => p._id === productId)) {
				return {
					...prev,
					selectedProducts: prev.selectedProducts.filter(p => p._id !== productId)
				};
			}

			// Enforce max selection
			if (prev.selectedProducts.length >= maxProducts) {
				toast({
					title: "Maximum reached",
					description: `You can select maximum ${maxProducts} products for this bundle`,
					variant: "default"
				});
				return prev;
			}

			return {
				...prev,
				selectedProducts: [...prev.selectedProducts, product]
			};
		});
	};

	const handleFileUpload = (e, field) => {
		const file = e.target.files[0];
		if (file) {
			setFormData(prev => ({
				...prev,
				[field]: file
			}));
		}
	};

	const createBundle = async () => {
		setIsCreating(true); // Start loading
		const { title, price, thumbnail, selectedProducts, sizeChartImage } = formData;
		const priceValue = parseFloat(price);

		// Validate inputs
		if (!priceValue || isNaN(priceValue)) {
			toast({ title: "Error", description: "Please enter a valid price", variant: "destructive" });
			setIsCreating(false);
			return;
		}
		if (!thumbnail) {
			toast({ title: "Error", description: "Please upload a thumbnail image", variant: "destructive" });
			setIsCreating(false);
			return;
		}

		const requiredProducts = bundleTypes[currentBundleType].requiredProducts;
		if (selectedProducts.length !== requiredProducts) {
			toast({
				title: "Error",
				description: `Please select exactly ${requiredProducts} products for this bundle`,
				variant: "destructive"
			});
			setIsCreating(false);
			return;
		}

		try {
			const formDataToSend = new FormData();

			// Basic bundle info
			formDataToSend.append('title', title);
			formDataToSend.append('price', priceValue.toString());
			formDataToSend.append('type', currentBundleType);
			formDataToSend.append('thumbnail', thumbnail);

			// Prepare product images first
			const productsWithFiles = await Promise.all(
				selectedProducts.map(async (product, index) => {
					let productImageFile = product.imageFile;
					if (!productImageFile && product.image) {
						productImageFile = await urlToFile(product.image, `product_${index}.jpg`);
					}

					// Handle colors with proper fallbacks
					const colors = (product.colors && product.colors.length > 0
						? product.colors.map((color, i) => ({
							color: typeof color === 'string' ? color : color.color || `color-${i}`,
							image: product.colorImages?.[i] || product.image,
							size: product.size // Include product sizes for each color
						}))
						: [{
							color: 'default',
							image: product.image,
							size: product.size
						}]
					);

					const colorsWithFiles = await Promise.all(
						colors.map(async (color, colorIndex) => {
							let colorImageFile = color.imageFile;
							if (!colorImageFile && color.image) {
								try {
									colorImageFile = await urlToFile(color.image, `color_${index}_${colorIndex}.jpg`);
								} catch (err) {
									console.warn(`⚠️ Failed to download color image for ${index}_${colorIndex}: ${color.image}`);
								}
							}
							return {
								...color,
								imageFile: colorImageFile
							};
						})
					);

					return {
						...product,
						imageFile: productImageFile,
						colors: colorsWithFiles
					};
				})
			);

			// Build BundleData structure with proper sizes
			const BundleData = productsWithFiles.map((product) => {
				// Use product.size if available, otherwise default to ['One Size']
				const productSizes = product.size && product.size.length > 0
					? product.size
					: ['One Size'];

				return {
					productId: product._id,
					image: product.image,
					sizes: productSizes, // Use actual product sizes
					colors: product.colors.map(color => ({
						color: color.color,
						image: color.image,
						sizes: color.size || productSizes // Fallback to product sizes
					}))
				};
			});

			formDataToSend.append('BundleData', JSON.stringify(BundleData));
			formDataToSend.append('categories', JSON.stringify([currentBundleType]));

			// Add all images to formData
			productsWithFiles.forEach((product, index) => {
				if (product.imageFile) {
					formDataToSend.append(`productImage_${index}`, product.imageFile);
				}

				product.colors.forEach((color, colorIndex) => {
					if (color.imageFile) {
						formDataToSend.append(`colorImage_${index}_${colorIndex}`, color.imageFile);
					} else {
						console.warn(`❌ Missing colorImage_${index}_${colorIndex}`, color);
					}
				});
			});

			if (sizeChartImage) {
				formDataToSend.append('sizeChartImage', sizeChartImage);
			}

			const response = await fetch(`${getApiBaseUrl()}/bundle`, {
				method: 'POST',
				credentials: 'include',
				body: formDataToSend
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to create bundle');
			}

			const result = await response.json();

			if (result.success) {
				toast({
					title: "Success",
					description: `${title} created successfully`,
					variant: "default"
				});
				setIsCreateModalOpen(false);
				fetchData();
			}
		} catch (error) {
			toast({
				title: "Error",
				description: error.message || "Failed to create bundle",
				variant: "destructive"
			});
		} finally {
			setIsCreating(false); // End loading
		}
	};

	// Helper function to convert URL to File
	const urlToFile = async (url, filename) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			return new File([blob], filename, { type: blob.type });
		} catch (error) {
			console.error('Error converting URL to File:', error);
			throw new Error(`Failed to load image from ${url}`);
		}
	};

	const handlePriceChange = useCallback((e) => {
		const value = e.target.value;
		if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
			setFormData(prev => ({
				...prev,
				price: value
			}));
		}
	}, []);

	const handleDeleteBundle = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch(`${getApiBaseUrl()}/bundle/${selectedBundle._id}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (!response.ok) throw new Error('Failed to delete bundle');

			setBundles(bundles.filter((bundle) => bundle._id !== selectedBundle._id));
			toast({
				description: 'Bundle deleted successfully!',
				variant: 'success'
			});
		} catch (error) {
			toast({
				description: 'Failed to delete bundle',
				variant: 'destructive'
			});
		} finally {
			setIsDeleting(false);
			setIsDeleteModalOpen(false);
		}
	};

	const handleImageLoad = (bundleId) => {
		setBundles((prevBundles) =>
			prevBundles.map((bundle) => (bundle._id === bundleId ? { ...bundle, imageLoaded: true } : bundle)),
		);
	};

	const retryFetch = () => {
		setLoading(true);
		setError(null);
		fetchData();
	};

	if (loading) {
		return (
			<div className='p-6 flex flex-col items-center justify-center min-h-[200px]'>
				<ClipLoader color='#4F46E5' size={50} />
				<p className='mt-4 text-gray-600'>Loading bundles...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='p-6 text-center'>
				<div className='text-red-500 mb-4'>Error: {error}</div>
				<button
					onClick={retryFetch}
					className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className='p-4 md:p-6'>
			<div className="flex justify-between items-center mb-6">
				<h1 className='text-2xl font-bold text-gray-800'>Bundle Management</h1>
			</div>

			{/* Bundle Creation Buttons */}
			<div className='flex flex-wrap gap-4 mb-8'>
				{Object.entries(bundleTypes).map(([type, config]) => (
					<Button
						key={type}
						variant="outline"
						className={`border-${config.color}-500 text-${config.color}-600 hover:bg-${config.color}-50`}
						onClick={() => openCreateModal(type)}
					>
						{config.buttonText}
					</Button>
				))}
			</div>

			{/* Create Bundle Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				title={formData.title}
			>
				<div className="space-y-4">
					<p className="text-sm text-gray-500">{bundleTypes[currentBundleType]?.description}</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Form inputs */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Bundle Price*</label>
								<input
									type="number"
									value={formData.price}
									onChange={handlePriceChange}
									className="w-full p-2 border rounded"
									placeholder="Enter price"
									step="0.01"
									min="0"
									inputMode="decimal"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Bundle Thumbnail*</label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFileUpload(e, 'thumbnail')}
									className="w-full p-2 border rounded"
									required
								/>
								{formData.thumbnail && (
									<div className="mt-2">
										<p className="text-xs text-gray-500">Selected: {formData.thumbnail.name}</p>
									</div>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Size Chart Image (Optional)</label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFileUpload(e, 'sizeChartImage')}
									className="w-full p-2 border rounded"
								/>
								{formData.sizeChartImage && (
									<div className="mt-2">
										<p className="text-xs text-gray-500">Selected: {formData.sizeChartImage.name}</p>
									</div>
								)}
							</div>

							<div className="pt-4">
								<h3 className="font-medium mb-2">
									Selected Products ({formData.selectedProducts.length}/{bundleTypes[currentBundleType]?.requiredProducts})
								</h3>
								{formData.selectedProducts.length > 0 ? (
									<div className="space-y-2">
										{formData.selectedProducts.map(product => (
											<div key={product._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
												<span className="text-sm">{product.title}</span>
												<button
													onClick={() => handleProductSelect(product._id)}
													className="text-red-500 hover:text-red-700 text-sm"
												>
													Remove
												</button>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-500">No products selected yet</p>
								)}
							</div>
						</div>

						{/* Product selection */}
						<div>
							<h3 className="font-medium mb-3">Available Products</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
								{products.map(product => (
									<div
										key={product._id}
										className={`border rounded-lg p-3 cursor-pointer transition-all ${formData.selectedProducts.some(p => p._id === product._id)
											? 'ring-2 ring-blue-500 bg-blue-50'
											: 'hover:bg-gray-50'
											}`}
										onClick={() => handleProductSelect(product._id)}
									>
										<img
											src={product.frontImage || product.image}
											alt={product.title}
											className="w-full h-32 object-contain mb-2"
										/>
										<h3 className="font-medium text-sm">{product.title}</h3>
										<p className="text-xs text-gray-600">£{product.price}</p>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							variant="outline"
							onClick={() => setIsCreateModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={createBundle}
							disabled={
								formData.selectedProducts.length !== bundleTypes[currentBundleType]?.requiredProducts ||
								!formData.price ||
								!formData.thumbnail ||
								isCreating
							}
							className={`bg-${bundleTypes[currentBundleType]?.color}-600 hover:bg-${bundleTypes[currentBundleType]?.color}-700`}
						>
							{isCreating ? (
								<>
									<ClipLoader color="#ffffff" size={16} className="mr-2" />
									Creating...
								</>
							) : (
								"Create Bundle"
							)}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Existing Bundles Display */}
			<div className='mt-8'>
				<h2 className='text-2xl font-bold mb-6 text-gray-800'>Your Bundles</h2>

				{noBundlesAvailable ? (
					<div className='text-center py-12 bg-gray-50 rounded-lg'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-12 w-12 mx-auto text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
							/>
						</svg>
						<p className='text-gray-600 mb-4 mt-2'>No bundles available</p>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{bundles.map((bundle) => (
							<div
								key={bundle._id}
								className='border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col h-full'>
								<div className='relative flex-grow'>
									<div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden'>
										{bundle.thumbnail && (
											<>
												<img
													src={bundle.thumbnail.startsWith('http') ? bundle.thumbnail : `${getApiBaseUrl()}/${bundle.thumbnail}`}
													alt={bundle.title}
													className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${!bundle.imageLoaded ? 'opacity-0' : 'opacity-100'
														}`}
													onError={(e) => {
														e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
														handleImageLoad(bundle._id);
													}}
													onLoad={() => handleImageLoad(bundle._id)}
												/>
												{!bundle.imageLoaded && (
													<div className='absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center'>
														<ClipLoader color='#4F46E5' size={24} />
													</div>
												)}
											</>
										)}
									</div>

									<div className='mt-4'>
										<h3 className='font-semibold text-lg text-gray-800 line-clamp-1'>{bundle.title}</h3>
										<p className='text-gray-600 font-bold mt-1'>£{bundle.price}</p>
										<p className='text-sm text-gray-500 mt-2 line-clamp-2'>{bundle.description}</p>

										<div className='mt-3'>
											<div className='flex flex-wrap gap-1'>
												{bundle.categories?.map((category, index) => (
													<span
														key={index}
														className='text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full'>
														{category}
													</span>
												))}
											</div>
										</div>

										<div className='mt-2'>
											<span className='text-xs font-semibold text-gray-600'>Sizes: {bundle.size?.join(', ')}</span>
										</div>
									</div>
								</div>
								<div className='mt-4 pt-4 border-t border-gray-100'>
									<button
										className='w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors'
										onClick={() => {
											setSelectedBundle(bundle);
											setIsDeleteModalOpen(true);
										}}>
										Delete Bundle
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteBundle}
				isLoading={isDeleting}
				title='Delete Bundle'
				message='Are you sure you want to delete this bundle?'
			/>
		</div>
	);
};

export default Bundle;