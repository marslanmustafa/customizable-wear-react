import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { ClipLoader } from 'react-spinners';
import { useToast } from '@/components/ui/use-toast';

const Products = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [isAdding, setIsAdding] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const apiUrl = import.meta.env.VITE_API_BASE_URL;
	const { toast } = useToast();

	const fetchProducts = async () => {
		setIsFetching(true);
		try {
			const response = await fetch(`${apiUrl}/products`, {
				credentials: 'include',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) throw new Error('Failed to fetch products');
			const data = await response.json();

			if (data.success && Array.isArray(data.products)) {
				setProducts(data.products);
			} else {
				toast({
					description: 'Unexpected response format from API',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				description: 'Failed to fetch products',
				variant: 'destructive',
			});
		} finally {
			setIsFetching(false);
		}
	};

	// Unified product update handler
	const handleProductUpdate = (updatedProduct) => {
		if (updatedProduct._id) {
			// Update existing product
			setProducts((prevProducts) =>
				prevProducts.map((product) => (product._id === updatedProduct._id ? updatedProduct : product)),
			);
		} else {
			// Add new product
			setProducts((prevProducts) => [...prevProducts, updatedProduct]);
		}
	};

	const handleDeleteProduct = async (productId) => {
		setIsDeleting(true);
		try {
			const response = await fetch(`${apiUrl}/products/delete/${productId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			if (!response.ok) throw new Error('Failed to delete product');
			setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
			toast({
				description: 'Product deleted successfully!',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				description: 'Failed to delete product',
				variant: 'destructive',
			});
		} finally {
			setIsDeleting(false);
			setIsDeleteModalOpen(false);
		}
	};

	const filteredProducts = products.filter((product) => {
		const matchesName = product.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesPrice = product.price.toString().includes(searchTerm);
		return matchesName || matchesPrice;
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div className='p-4'>
			{/* Title and Add Product Button */}
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-semibold text-gray-800'>Products</h1>
				<button
					onClick={() => {
						setSelectedProduct(null);
						setIsModalOpen(true);
					}}
					className='bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center justify-center min-w-32'
					disabled={isAdding}>
					{isAdding ? <ClipLoader color='#ffffff' size={20} /> : 'Add Product'}
				</button>
			</div>

			{/* Search Bar */}
			<div className='mb-4'>
				<input
					type='text'
					placeholder='Search by product name or price'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
				/>
			</div>

			{/* Loading state */}
			{isFetching && (
				<div className='flex justify-center my-8'>
					<ClipLoader color='#f97316' size={40} />
				</div>
			)}

			{/* Product Count */}
			{!isFetching && (
				<div className='mb-4 text-gray-600'>
					<p className='text-lg'>Total Products: {filteredProducts.length}</p>
				</div>
			)}

			{/* Product Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{filteredProducts.map((product) => (
					<div key={product._id} className='bg-white shadow rounded-lg p-4'>
						<img
							src={product.frontImage || product.backImage || product.sideImage}
							alt={product.title}
							className='w-32 h-32 object-cover rounded-lg mb-4 mx-auto'
						/>
						<h2 className='text-lg font-semibold'>{product.title}</h2>
						<p>${product.price}</p>
						<div className='flex space-x-2 mt-4'>
							<button
								onClick={() => {
									setSelectedProduct(product);
									setIsModalOpen(true);
								}}
								className='bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600'
								disabled={isAdding}>
								Update
							</button>
							<button
								onClick={() => {
									setSelectedProduct(product);
									setIsDeleteModalOpen(true);
								}}
								className='bg-black text-white px-4 py-2 rounded hover:bg-red-700'
								disabled={isDeleting}>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Modals */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedProduct(null);
				}}
				initialData={selectedProduct}
				onProductAdded={handleProductUpdate} // Changed to use unified handler
			/>

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={() => handleDeleteProduct(selectedProduct?._id)}
				isLoading={isDeleting}
			/>
		</div>
	);
};

export default Products;
