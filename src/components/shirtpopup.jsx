import { useEffect, useState } from 'react';
import Embroidery from '../assets/images/Embroidery.jpeg';
import Print from '../assets/images/print.jpeg';
import SizePopup from './shirtpositionpopup';
import AddLogoPopup from './addlogo';
import AddTextLogoPopup from './AddTextLogoPopup';
import UploadLogoPopup from './UploadLogoPopup';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';

const Popup = ({ 
	onClose, 
	visible, 
	selectedProduct, 
	selectedSizes, 
	selectedColor, 
	resetSelectedColor, 
	resetSelectedSizes ,
	onAddCart
}) => {
	const [selectedMethod, setSelectedMethod] = useState('Embroidery');
	const [selectedPosition, setSelectedPosition] = useState('Large Front');
	const [showSizePopup, setShowSizePopup] = useState(false);
	const [isAddLogoPopupVisible, setIsAddLogoPopupVisible] = useState(false);
	const [isAddTextLogoPopupVisible, setIsAddTextLogoPopupVisible] = useState(false);
	const [isUploadLogoPopupVisible, setIsUploadLogoPopupVisible] = useState(false);
	const [textLogoDetails, setTextLogoDetails] = useState(null);
	const { toast } = useToast();

	useEffect(() => {
		if (visible) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [visible]);

	const handleFinishTextLogo = (details) => {
		setTextLogoDetails(details);
		setIsAddTextLogoPopupVisible(false);
		setIsAddLogoPopupVisible(false);

		// Show success message for all items
		toast({
			title: 'Success!',
			description: `Logo added to ${selectedSizes.length} items!`,
			variant: 'success',
			className: 'bg-green-500 text-white border-0',
		});

		onClose();
	};

	const handleClose = () => {
		setShowSizePopup(false);
		setIsAddLogoPopupVisible(false);
		setIsAddTextLogoPopupVisible(false);
		setIsUploadLogoPopupVisible(false);
		onClose();
	};

	if (!visible) return null;

	return (
		<>
			{!showSizePopup && !isAddLogoPopupVisible && !isAddTextLogoPopupVisible && !isUploadLogoPopupVisible && (
				<div className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 p-4 mt-10'>
					<div className='bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[70vh] flex flex-col'>
						{/* Header */}
						<div className='sticky top-0 bg-white p-6 pb-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center'>
							<div>
								<h2 className='text-xl font-bold text-gray-800'>{selectedProduct?.title || 'Select a T-Shirt'}</h2>
								<div className="flex flex-wrap gap-2 mt-2">
									{selectedSizes.map((size, index) => (
										<span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
											{size.size} (Qty: {size.quantity})
										</span>
									))}
								</div>
								<p className='text-sm text-gray-500 mt-1'>Select an application method</p>
							</div>
							<button
								onClick={handleClose}
								className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors'
							>
								<FaTimes size={20} />
							</button>
						</div>

						{/* Content */}
						<div className='p-6 overflow-y-auto flex-1'>
							<div className='flex justify-between space-x-4'>
								{/* Embroidery Option */}
								<div
									className={`relative w-full p-4 transition-all duration-200 ${selectedMethod === 'Embroidery'
										? 'bg-orange-50 border-2 border-orange-500'
										: 'bg-gray-50 border-2 border-gray-200 hover:border-orange-300'
										} rounded-lg cursor-pointer`}
									onClick={() => setSelectedMethod('Embroidery')}
								>
									<div className="flex flex-col items-center">
										<div className="w-full h-40 flex items-center justify-center mb-3 bg-white rounded-md overflow-hidden p-2">
											<img
												src={Embroidery}
												alt='Embroidery'
												className='object-contain w-full h-full'
											/>
										</div>
										<div className='text-lg font-semibold text-gray-800'>Embroidery</div>
										<div className='text-sm text-gray-500 text-center mt-1'>
											Embroidery involves stitching logos onto garments by needle and thread.
										</div>
										{selectedMethod === 'Embroidery' && (
											<div className='mt-2 text-sm font-medium text-orange-600'>
												<span className="inline-flex items-center">
													<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
													</svg>
													Recommended
												</span>
											</div>
										)}
									</div>
								</div>

								{/* Print Option */}
								<div
									className={`relative w-full p-4 transition-all duration-200 ${selectedMethod === 'Print'
										? 'bg-orange-50 border-2 border-orange-500'
										: 'bg-gray-50 border-2 border-gray-200 hover:border-orange-300'
										} rounded-lg cursor-pointer`}
									onClick={() => setSelectedMethod('Print')}
								>
									<div className="flex flex-col items-center">
										<div className="w-full h-40 flex items-center justify-center mb-3 bg-white rounded-md overflow-hidden p-2">
											<img
												src={Print}
												alt='Print'
												className='object-contain w-full h-full'
											/>
										</div>
										<div className='text-lg font-semibold text-gray-800'>Print</div>
										<div className='text-sm text-gray-500 text-center mt-1'>
											Printing involves pressing logos onto garments using heat.
										</div>
										{/* Optional badge - you can add similar to the embroidery if needed */}
										{selectedMethod === 'Print' && (
											<div className='mt-2 text-sm font-medium text-gray-600'>
												<span className="inline-flex items-center">
													<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
													</svg>
													Selected
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className='sticky bottom-0 bg-white p-4 border-t border-gray-200 rounded-b-xl flex justify-end '>
							<button
								onClick={() => setShowSizePopup(true)}
								className='bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200'
							>
								Next Step
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Update all child components to handle multiple sizes */}
			{showSizePopup && (
				<SizePopup
				onClose={handleClose}
				onBack={() => {
						setShowSizePopup(false);
					}}
					onNext={() => {
						setShowSizePopup(false);
						setIsAddLogoPopupVisible(true);
					}}
					visible={showSizePopup}
					selectedPosition={selectedPosition}
					setSelectedPosition={setSelectedPosition}
					selectedMethod={selectedMethod}
					
				
				/>
			)}

			{isAddLogoPopupVisible && (
				<AddLogoPopup
					selectedPosition={selectedPosition}
					onBack={() => {
						setIsAddLogoPopupVisible(false);
						setShowSizePopup(true);
					}}
					onNext={() => {
						setIsAddLogoPopupVisible(false);
						setIsAddTextLogoPopupVisible(true);
					}}
					onUpload={() => {
						setIsAddLogoPopupVisible(false);
						setIsUploadLogoPopupVisible(true);
					}}
					onClose={handleClose}
				/>
			)}

			{isAddTextLogoPopupVisible && (
				<AddTextLogoPopup
					selectedProduct={selectedProduct}
					selectedSizes={selectedSizes} // Pass array instead of single size
					selectedColor={selectedColor}
					selectedPosition={selectedPosition}
					selectedMethod={selectedMethod}
					onBack={() => {
						setIsAddTextLogoPopupVisible(false);
						setIsAddLogoPopupVisible(true);
					}}
					onFinish={handleFinishTextLogo}
					onClose={handleClose}
					resetSelectedColor={resetSelectedColor}
					resetSelectedSizes={resetSelectedSizes} // Updated prop name
				/>
			)}

			{isUploadLogoPopupVisible && (
				<UploadLogoPopup
					selectedProduct={selectedProduct}
					selectedSizes={selectedSizes} // Pass array instead of single size
					selectedColor={selectedColor}
					selectedPosition={selectedPosition}
					selectedMethod={selectedMethod}
					onBack={() => {
						setIsUploadLogoPopupVisible(false);
						setIsAddLogoPopupVisible(true);
					}}
					resetSelectedColor={resetSelectedColor}
					resetSelectedSizes={resetSelectedSizes} // Updated prop name
					onClose={handleClose}
					onSuccess={(success)=>{
						if(success){
							onAddCart(true);
						}
					}}
				/>
			)}
		</>
	);
};



export default Popup;