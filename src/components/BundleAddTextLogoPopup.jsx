import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const AddTextLogoPopup = ({
	onBack,
	onFinish,
	onClose,
	 resetSelections,
	products = [],
	selectedPositions = {},
	selectedMethods = {},
	thumbnail,
	bundleId,
	bundle,
	onNotesChange = () => {},
}) => {
	const [textLine, setTextLine] = useState('');
	const [font, setFont] = useState('Standard');
	const [notes, setNotes] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const dispatch = useDispatch()
	
	const fontStyles = {
		Standard: 'font-sans',
		Serif: 'font-serif',
		'Sans-serif': 'font-sans',
	};

	const getProductColors = (product) => {
		if (!product.colors) return [];
		return product.colors.map((color) => (typeof color === 'string' ? { code: color, name: color } : color));
	};

	const getProductSizes = (product) => {
		if (Array.isArray(product)) return product;
		if (Array.isArray(product.sizes)) return product.sizes;
		if (Array.isArray(product.size)) return product.size;
		if (product.sizesByColor) {
			return Object.values(product.sizesByColor).flatMap((colorSizes) => colorSizes.map((s) => s.size));
		}
		return product.allSizes || [];
	};

	const validateProducts = () => {
		if (!products || products.length === 0) {
			throw new Error('No products in bundle');
		}

		const invalidProducts = products.filter((p) => !p._id);
		if (invalidProducts.length > 0) {
			throw new Error(`Products missing IDs: ${invalidProducts.map((p) => p.name).join(', ')}`);
		}
	};

	const handleNotesChange = (e) => {
		const newNotes = e.target.value;
		setNotes(newNotes);
		onNotesChange(newNotes);
	};

	const handleFinish = async () => {
		if (!textLine.trim()) {
			toast({
				description: 'Please enter text for the logo.',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
			return;
		}

		if (!bundleId) {
			toast({
				description: 'Bundle ID is required.',
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
			return;
		}

		try {
			validateProducts();
		} catch (validationError) {
			toast({
				description: validationError.message,
				variant: 'destructive',
				className: 'bg-red-500 text-white border-0',
			});
			return;
		}

		setIsSubmitting(true);

				try {
					const formData = new FormData();

					const bundleProductsWithDetails = products.map((product) => {
						const productId = product._id?.toString();
						if (!productId) {
							throw new Error(`Product ${product.name} is missing an ID`);
						}
						const sizes = getProductSizes(product);
						 const sizesByColor = {};
							if (product.colorSizeSelections) {
								product.colorSizeSelections.forEach(({ color, size }) => {
									if (!sizesByColor[color]) {
										sizesByColor[color] = [];
									}

									const existingSize = sizesByColor[color].find((item) => item.size === size);
									if (existingSize) {
										existingSize.quantity += 1;
									} else {
										sizesByColor[color].push({ size, quantity: 1 });
									}
								});
							}
						return {
							id: productId,
							name: product.name || `Product ${productId}`,
							quantity: sizes.length,
							size: product.allSizes || ['Not selected'],
							colors: product.colors || 'Not selected',
							position: selectedPositions[productId] || 'Not selected',
							method: selectedMethods || 'Not selected',
							frontImage: product.images?.[ 0 ] || product.frontImage || '',
							sizesByColor: product.sizesByColor || [],
						};
					});

					formData.append('isBundle', 'true');
					formData.append('bundleId', bundleId);
					formData.append('bundleProducts', JSON.stringify(bundleProductsWithDetails));
					formData.append('price', bundle?.price);
					formData.append('notes', notes);
					formData.append('textLine', textLine);
					formData.append('font',font)
					formData.append('method', selectedMethods[0].toUpperCase()+selectedMethods.slice(1).toLowerCase() || 'Embroidery');
					formData.append('position', JSON.stringify(Object.values(selectedPositions).flat().filter(Boolean)));
					formData.append('thumbnail', thumbnail);
					// formData.append(
					// 	'textLogo',
					// 	JSON.stringify({
					// 		text: textLine,
					// 		font: font,
					// 	}),
					// );
					const bundleItem = {
						bundleId: bundleId,
						title: bundle?.title || 'Custom Bundle',
						price: bundle?.price || 0,
						thumbnail: thumbnail,
						textLine: textLine,
						font: font,
						notes: notes,
						method: selectedMethods,
						position: selectedPositions,
						products: products.map((p) => ({
							productId: p._id,
							name: p.name,
							color: p.color,
							size: p.size,
						})),
						quantity: 1, 
					};

					// Add to Redux store first (optimistic update)
					dispatch(addItem(bundleItem));
				

					const response = await fetch(`${apiUrl}/cart/`, {
						method: 'POST',
						body: formData,
						credentials: 'include',
						headers: {
							Accept: 'application/json',
						},
					});

					const result = await response.json();

					if (!response.ok) {
						throw new Error(result.message || `Failed to add bundle (HTTP ${response.status})`);
					}

					toast({
						description: 'Text logo has been added successfully',
						variant: 'success',
						className: 'bg-green-500 text-white border-0',
					});

					onClose();
					 resetSelections()
					onFinish({
						type: 'text',
						content: {
							text: textLine,
							font: font,
						},
						preview: textLine, // For preview purposes
						notes,
					});
				} catch (error) {
					toast({
						
						description: error.message || 'An error occurred while adding the text logo',
						variant: 'destructive',
						className: 'bg-red-500 text-white border-0',
					});
				} finally {
					setIsSubmitting(false);
				}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white overflow-x-auto h-full rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 relative'>
				<button onClick={onClose} className='absolute top-4 right-4 text-red-600 hover:text-red-700 p-2'>
					<FaTimes size={20} />
				</button>

				<div className='text-center'>
					<h2 className='text-2xl font-bold mb-2'>Add Your Text Logo</h2>
					<p className='text-gray-600 mb-4'>
						Create your text logo, we have no setup fees! We will always send a design proof for your approval before
						production.
					</p>

				</div>

				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>Text Line</label>
						<input
							type='text'
							value={textLine}
							onChange={(e) => setTextLine(e.target.value)}
							placeholder='Enter your text'
							className='w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>Font</label>
						<select
							value={font}
							onChange={(e) => setFont(e.target.value)}
							className='w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500'>
							<option>Standard</option>
							<option>Serif</option>
							<option>Sans-serif</option>
						</select>
					</div>

					<div>
						<h3 className='text-lg font-semibold mb-2'>Text Preview</h3>
						<div className='bg-black text-center py-3 rounded-md'>
							<span className={`px-4 py-2 bg-orange-500 text-white font-bold rounded-md ${fontStyles[font]}`}>
								{textLine || 'Preview Text'}
							</span>
						</div>
						<p className='text-sm text-gray-500 mt-1'>Please note: The black box is for preview purposes only.</p>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label>
						<textarea
							value={notes}
							onChange={handleNotesChange}
							placeholder='Leave a message'
							className='w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
						/>
					</div>
				</div>

				<div className='flex justify-between mt-6'>
					<button
						onClick={onBack}
						className='bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none'>
						Back
					</button>
					<button
						onClick={handleFinish}
						className={`mt-4 bg-orange-500 text-white ml-10 py-2 px-4 rounded-lg hover:bg-orange-600 ${
							isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						disabled={isSubmitting}>
						{isSubmitting ? 'Adding...' : 'Finish'}
					</button>
				</div>
			</div>
		</div>
	);
};

AddTextLogoPopup.propTypes = {
	onBack: PropTypes.func.isRequired,
	onFinish: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	products: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string,
			name: PropTypes.string,
			colors: PropTypes.array,
			allSizes: PropTypes.array,
			sizes: PropTypes.array,
			size: PropTypes.array,
			sizesByColor: PropTypes.object,
			images: PropTypes.array,
		}),
	),
	selectedPositions: PropTypes.object,
	selectedMethods: PropTypes.object,
	thumbnail: PropTypes.string,
	bundleId: PropTypes.string,
	bundle: PropTypes.object,
	onNotesChange: PropTypes.func,
};

export default AddTextLogoPopup;
