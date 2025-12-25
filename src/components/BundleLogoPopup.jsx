import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { addBundleToCart, prepareBundleData, getTokenFromCookies } from "../services/bundle";

// Import images
import Embroidery from "../assets/images/Embroidery.jpeg";
import Print from "../assets/images/print.jpeg";
import LargeBack from "../assets/shirtlogos/center-back_z8_large.png";
import LargeFront from "../assets/shirtlogos/center-chest_0n_large.png";
import LeftBreast from "../assets/shirtlogos/left-chest_34_large.png";
import LeftSleeve from "../assets/shirtlogos/sleeve-left_1f_large.png";
import NapeOfNeck from "../assets/shirtlogos/nape-of-neck_dq_large.png";
import RightBreast from "../assets/shirtlogos/right-chest_no_large.png";
import RightSleeve from "../assets/shirtlogos/sleeve-right_ju_large.png";

// Import components
import PositionPopup from "./bundlePositionSelector";
import AddLogoMethod from "./AddBundleLogoMethod";
import AddTextLogoPopup from "./BundleAddTextLogoPopup";
import BundleUploadLogoPopup from "./BundleUploadLogo";

const COLOR_MAP = {
	"#000000": "Black",
	"#FFFFFF": "White",
	"#FF0000": "Red",
	"#0000FF": "Blue",
	"#008000": "Green",
	"#FFFF00": "Yellow",
	"#FFA500": "Orange",
	"#800080": "Purple",
	"#A52A2A": "Brown",
	"#808080": "Gray",
};

const positionImages = {
	"Large Back": LargeBack,
	"Large Front": LargeFront,
	"Left Breast": LeftBreast,
	"Left Sleeve": LeftSleeve,
	"Nape of Neck": NapeOfNeck,
	"Right Breast": RightBreast,
	"Right Sleeve": RightSleeve,
};

const BundleLogoPopup = ({
	onClose,
	visible,
	bundle,
	product1,
	product2,
	product3,
	resetSelections,
	selectedPoloShirts1,
	selectedPoloShirts2,
	selectedPoloShirts3,
	thumbnail,
	previousLogo = null,
}) => {
	const { id: bundleId } = useParams();
	const [currentStep, setCurrentStep] = useState('method');
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedPositions, setSelectedPositions] = useState({});
	const [selectedMethods, setSelectedMethods] = useState({});
	const [logoData, setLogoData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [textLine, setTextLine] = useState('');
	const [font, setFont] = useState('');
	const [notes, setNotes] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		if (!bundleId) {
			setError('Missing bundle information. Please try again.');
		}
	}, [bundleId]);

	useEffect(() => {
		if (visible) {
			setCurrentStep('method');
			if (!logoData && !textLine) {
				setSelectedMethod(null);
				setSelectedPositions({});
				setSelectedMethods({});
			}
			setError(null);
		}
	}, [visible, logoData, textLine]);

	const getColorName = (colorCode) => COLOR_MAP[colorCode] || colorCode;

	const productsData = React.useMemo(() => {
		// Helper function to process each product
		const processProduct = (product, selectedPoloShirt, defaultName) => {
			if (!product) return null;

			// Get available colors (those with at least one size with quantity > 0)
			const availableColors = (product.colors || []).filter(color => {
				// Check if there's any size with quantity > 0 for this color
				const colorSizes = product.sizesByColor[color] || [];
				return colorSizes.some(size => size.quantity > 0);
			});

			// If no colors with quantities, return null (this product won't be included)
			if (availableColors.length === 0) return null;

			// Calculate total quantity for this product
			const totalQuantity = Object.values(product.sizesByColor)
				.flatMap(sizes => sizes)
				.reduce((sum, size) => sum + (size.quantity || 0), 0);

			return {
				...product,
				id: product._id || `product-${Math.random().toString(36).substr(2, 9)}`,
				_id: product._id || `product-${Math.random().toString(36).substr(2, 9)}`,
				name: selectedPoloShirt?.[0]?.name || defaultName,
				title: selectedPoloShirt?.[0]?.name || defaultName,
				type: 'Polo Shirt',
				colors: availableColors.map(color => getColorName(color)),
				formattedColors: availableColors.map(color => ({
					code: color,
					name: getColorName(color),
				})),
				color: selectedPoloShirt?.[0]?.color || availableColors[0] || 'Not selected',
				price: product.price || 0,
				quantity: 1,
				totalQuantity, // Add total quantity
				hasQuantities: totalQuantity > 0, // Add flag for quantities
				availableColors // Add available colors
			};
		};

		const processedProducts = [
			processProduct(product1, selectedPoloShirts1, 'Product 1'),
			processProduct(product2, selectedPoloShirts2, 'Product 2'),
			...(product3 ? [processProduct(product3, selectedPoloShirts3, 'Product 3')] : []),
		].filter(Boolean); // Filter out any null products (those with no colors with quantities)

		return processedProducts;
	}, [product1, product2, product3, selectedPoloShirts1, selectedPoloShirts2, selectedPoloShirts3]);

	const renderSelectedPositions = () => {
		const allPositions = Object.values(selectedPositions).flat();
		if (allPositions.length === 0) return 'None selected';

		return (
			<div className='flex flex-wrap justify-center gap-2'>
				{allPositions.map((position, index) => (
					<div key={index} className='flex flex-col items-center'>
						<img
							src={positionImages[position]}
							alt={position}
							className='w-16 h-16 object-contain border rounded-md'
							loading='lazy'
						/>
						<span className='text-xs mt-1'>{position}</span>
					</div>
				))}
			</div>
		);
	};

	const handleMethodSelect = (method) => {
		setSelectedMethod(method);
		const newMethods = {};
		productsData.forEach((product) => {
			newMethods[product._id] = method;
		});
		setSelectedMethods(newMethods);

		if (logoData || textLine) {
			handleFinalSubmission(method);
		}
	};

	const handleNextStep = () => {
		if (selectedMethod) {
			setCurrentStep('position');
		}
	};

	const handleFinalSubmission = async (method) => {
		 if (!bundleId) {
    setError('Missing bundle information. Please try again.');
    return;
  }

  if (!logoData && !textLine) {
    setError('Please complete your logo or text design first');
    return;
  }

  // Validate products before proceeding
  const validProducts = productsData.filter(product => 
    product.hasQuantities && product.availableColors.length > 0
  );

  if (validProducts.length === 0) {
    setError('No valid products with quantities selected. Please check your bundle.');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const token = getTokenFromCookies() || localStorage.getItem('token');

    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please login to add bundles to your cart.',
      });
      navigate('/login', { state: { from: 'bundle' } });
      return;
    }

    const bundleData = prepareBundleData({
      bundleId,
      method,
      positions: selectedPositions,
      methods: selectedMethods,
      logoData,
      productsData: validProducts, // Use only valid products
      textLine,
      font,
      notes,
    });

    const response = await addBundleToCart(bundleData, token);

    if (response.success) {
      onClose();
      resetSelections();
      alert('Bundle successfully added to cart!');
    } else {
      throw new Error(response.message || 'Failed to add bundle to cart');
    }
		} catch (err) {
			let errorMessage = err.message || 'Failed to add bundle to cart. Please try again.';

			if (err.message.includes('401')) {
				errorMessage = 'Session expired. Please login again.';
				document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				localStorage.removeItem('token');
				toast({
					title: 'Login Required',
					description: 'Please login to add bundles to your cart.',
				});
				navigate('/');
				navigate('/login');
			} else if (err.message.includes('Network Error')) {
				errorMessage = 'Network error. Please check your connection.';
			} else if (err.message.includes('400')) {
				errorMessage = 'Invalid data. Please check your bundle configuration.';
			}

			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handlePositionSelectionComplete = (positions) => {
		setSelectedPositions(positions);
		setCurrentStep('logoMethod');
	};

	const handleLogoMethodSelect = (type) => {
		if (type === 'text') {
			setCurrentStep('addTextLogo');
		} else {
			setCurrentStep('uploadLogo');
		}
	};

	const handleLogoComplete = (data) => {
		if (data.type === 'text') {
			setTextLine(data.text);
			setFont(data.font);
			setLogoData(null);
		} else {
			setLogoData(data);
			setTextLine('');
		}
		setCurrentStep('method');
	};

	if (!visible) return null;

	if (!bundleId) {
		return (
			<div className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50'>
				<div className='bg-white p-6 rounded-lg max-w-md'>
					<h2 className='text-xl font-bold text-red-500 mb-4'>Error</h2>
					<p className='mb-4'>Missing bundle information. Please go back and try again.</p>
					<button onClick={onClose} className='w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600'>
						Close
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{currentStep === 'method' && (
				<div className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50'>
					<div className='bg-white p-4 rounded-lg w-96 md:w-[500px] relative max-h-[90vh] overflow-y-auto'>
						<button
							onClick={onClose}
							className='absolute top-2 right-2 text-red-600 hover:text-red-700 p-1'
							aria-label='Close'>
							<FaTimes size={16} />
						</button>

						<div className='font-semibold text-md mb-2 text-center'>
							{logoData || textLine ? 'Confirm Your Design' : 'Customize Your Bundle'}
						</div>

						{error && <div className='mb-2 p-2 bg-red-100 text-red-700 text-sm rounded'>{error}</div>}

						{(logoData || textLine) && (
							<div className='mb-3 text-center'>
								{logoData ? (
									<img
										src={logoData.preview || logoData.content}
										alt='Uploaded Logo'
										className='w-24 h-auto mx-auto border rounded-md'
										loading='lazy'
									/>
								) : (
									<div className='w-24 h-24 mx-auto border rounded-md flex items-center justify-center bg-gray-100'>
										<p className='text-xs p-2'>{textLine}</p>
									</div>
								)}
								<div className='mt-1 text-xs'>
									<p className='font-medium'>Positions:</p>
									{renderSelectedPositions()}
								</div>
								{notes && (
									<div className='mt-1 text-xs'>
										<p className='font-medium'>Notes:</p>
										<p>{notes}</p>
									</div>
								)}
							</div>
						)}

						<div className='text-sm mb-2 text-center'>
							{logoData || textLine ? 'Select application method' : 'Select an application method'}
						</div>

						<div className='flex flex-col md:flex-row justify-between gap-2'>
							<div
								onClick={() => handleMethodSelect('embroidery')}
								className={`flex flex-col items-center cursor-pointer w-full p-2 rounded-md transition-all ${selectedMethod === 'embroidery'
									? 'border border-orange-500 bg-orange-50'
									: 'border border-gray-200 hover:border-orange-300'
									}`}>
								<div className='border border-orange-500 rounded-md mb-1'>
									<img
										src={Embroidery}
										alt='Embroidery'
										className='object-cover w-full h-24 rounded-md'
										loading='lazy'
									/>
								</div>
								<div className='text-sm font-semibold text-center'>Embroidery</div>
								{selectedMethod === 'embroidery' && (
									<div className='mt-0.5 text-2xs text-orange-500 font-medium'>✓ Selected</div>
								)}
							</div>

							<div
								onClick={() => handleMethodSelect('print')}
								className={`flex flex-col items-center cursor-pointer w-full p-2 rounded-md transition-all ${selectedMethod === 'print'
									? 'border border-orange-500 bg-orange-50'
									: 'border border-gray-200 hover:border-orange-300'
									}`}>
								<div className='border border-gray-200 rounded-md mb-1'>
									<img src={Print} alt='Print' className='object-cover w-full h-24 rounded-md' loading='lazy' />
								</div>
								<div className='text-sm font-semibold text-center'>Print</div>
								{selectedMethod === 'print' && (
									<div className='mt-0.5 text-2xs text-orange-500 font-medium'>✓ Selected</div>
								)}
							</div>
						</div>

						<div className='flex justify-between mt-4'>
							{!(logoData || textLine) ? (
								<button
									onClick={handleNextStep}
									className={`py-1 px-3 rounded text-xs ${selectedMethod
										? 'bg-orange-500 hover:bg-orange-600 text-white'
										: 'bg-gray-300 text-gray-500 cursor-not-allowed'
										}`}
									disabled={!selectedMethod}>
									NEXT STEP
								</button>
							) : (
								<button
									onClick={() => handleFinalSubmission(selectedMethod)}
									className='py-1 px-3 rounded text-xs bg-green-500 hover:bg-green-600 text-white'
									disabled={loading}>
									{loading ? 'PROCESSING...' : 'ADD TO CART'}
								</button>
							)}

							{(logoData || textLine) && (
								<button
									onClick={() => setCurrentStep('position')}
									className='py-1 px-3 rounded text-xs bg-gray-500 hover:bg-gray-600 text-white'
									disabled={loading}>
									EDIT DESIGN
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{currentStep === 'position' && (
				<PositionPopup
					onClose={onClose}
					onBack={() => setCurrentStep('method')}
					onNext={handlePositionSelectionComplete}
					initialSelectedPositions={selectedPositions}
					products={productsData}
				/>
			)}

			{currentStep === 'logoMethod' && (
				<AddLogoMethod
					onClose={onClose}
					onBack={() => setCurrentStep('position')}
					onSelect={handleLogoMethodSelect}
					selectedPositions={selectedPositions}
					products={productsData}
					thumbnail={thumbnail}
					bundle={bundle}
				/>
			)}

			{currentStep === 'addTextLogo' && (
				<AddTextLogoPopup
					onBack={() => setCurrentStep('logoMethod')}
					onClose={onClose}
					onFinish={handleLogoComplete}
					products={productsData}
					initialText={textLine}
					initialFont={font}
					onNotesChange={setNotes}
					previousLogo={previousLogo}
					bundleId={bundleId}
					selectedMethods={selectedMethod}
					resetSelections={resetSelections}
					selectedPositions={selectedPositions}
					bundle={bundle}
				/>
			)}

			{currentStep === 'uploadLogo' && (
				<BundleUploadLogoPopup
					onBack={() => setCurrentStep('logoMethod')}
					onClose={onClose}
					thumbnail={thumbnail}
					onFinish={handleLogoComplete}
					selectedPositions={selectedPositions}
					resetSelections={resetSelections}
					selectedMethods={selectedMethods}
					products={productsData}
					previousLogo={previousLogo}
					onNotesChange={setNotes}
					bundleId={bundleId}
					bundle={bundle}
				/>
			)}

			{loading && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500'></div>
				</div>
			)}
		</>
	);
};

BundleLogoPopup.propTypes = {
	onClose: PropTypes.func.isRequired,
	visible: PropTypes.bool.isRequired,
	product1: PropTypes.object.isRequired,
	product2: PropTypes.object.isRequired,
	product3: PropTypes.object,
	selectedPoloShirts1: PropTypes.array.isRequired,
	selectedPoloShirts2: PropTypes.array.isRequired,
	selectedPoloShirts3: PropTypes.array,
	previousLogo: PropTypes.string,
	resetSelections: PropTypes.func.isRequired,
	bundle: PropTypes.object,
	thumbnail: PropTypes.object,
};

export default BundleLogoPopup;