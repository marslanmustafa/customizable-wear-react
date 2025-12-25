import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { useToast } from '@/components/ui/use-toast';


const apiUrl = import.meta.env.VITE_API_BASE_URL;

const AddTextLogoPopup = ({
	 onBack,
  onFinish,
  onClose,
  selectedSizes, // Changed from selectedSize to selectedSizes (array)
  selectedColor,
  selectedPosition,
  selectedMethod,
  selectedProduct,
  resetSelectedColor,
  resetSelectedSizes, // Changed from resetSelectedSize
  products = [],
}) => {
	const [textLine, setTextLine] = useState('');
	const [font, setFont] = useState('Standard');
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const { toast } = useToast();

	const fontStyles = {
		Standard: 'font-sans',
		Serif: 'font-serif',
		'Sans-serif': 'font-sans',
	};

	const handleFinish = async () => {
    // Validation
    if (!textLine.trim()) {
      toast({
        variant: 'destructive',
        description: 'Please enter text for the logo.',
        className: 'bg-red-500 text-white border-0',
      });
      return;
    }

    if (!selectedSizes?.length) {
      toast({
        variant: 'destructive',
        description: 'Please select at least one size before finishing.',
        className: 'bg-red-500 text-white border-0',
      });
      return;
    }

    if (!selectedColor) {
      toast({
        variant: 'destructive',
        description: 'Please select a color before finishing.',
        className: 'bg-red-500 text-white border-0',
      });
      return;
    }

    if (!selectedMethod?.trim()) {
      toast({
        variant: 'destructive',
        description: 'Please select a printing method before finishing.',
        className: 'bg-red-500 text-white border-0',
      });
      return;
    }

    if (!selectedPosition?.trim()) {
      toast({
        variant: 'destructive',
        description: 'Please select a logo position before finishing.',
        className: 'bg-red-500 text-white border-0',
      });
      return;
    }

    try {
      setLoading(true);

      // Process each size selection
      for (const sizeSelection of selectedSizes) {
        const cartItem = {
          _id: `${selectedProduct?._id}-${sizeSelection.size}`, // Unique ID for each size
          productId: selectedProduct?._id,
          title: `${selectedProduct?.title} (${sizeSelection.size})`,
          frontImage: selectedProduct?.frontImage || selectedProduct?.image,
          size: sizeSelection.size,
          color: selectedColor,
          quantity: sizeSelection.quantity || 1,
          method: selectedMethod,
          position: selectedPosition,
          textLine,
          font,
          notes,
        };

        // 1. Optimistically update Redux state
        dispatch(addItem(cartItem));

        // 2. Sync with server
        const response = await fetch(`${apiUrl}/cart/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(cartItem),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to add size ${sizeSelection.size} to cart`);
        }
      }

      toast({
        title: 'Success!',
        description: `${selectedSizes.length} items successfully added to cart!`,
        variant: 'success',
        className: 'bg-green-500 text-white border-0',
      });

      onFinish();
      resetSelectedColor();
      resetSelectedSizes();
    } catch (error) {
      toast({
        description: error.message || 'An error occurred while adding to the cart.',
        variant: 'destructive',
        className: 'bg-red-500 text-white border-0',
      });
    } finally {
      setLoading(false);
    }
  };

	return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col'>
        {/* Header */}
        <div className='sticky top-0 bg-white p-6 pb-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center'>
          <div>
            <h2 className='text-xl font-bold text-gray-800'>Add Your Text Logo</h2>
            <p className='text-sm text-gray-500 mt-1'>Customize your text design</p>
            
            {/* Display selected sizes */}
            {selectedSizes?.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Applying to:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSizes.map((size, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {size.size} (Qty: {size.quantity})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='Close popup'
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto flex-1'>
          {/* Product Info */}
          <div className='mb-6 bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Product Details</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-gray-500'>Product</p>
                <p className='font-medium'>{selectedProduct?.title}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Color</p>
                <div className='flex items-center'>
                  <span 
                    className='inline-block w-4 h-4 rounded-full mr-2 border border-gray-300'
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span>{selectedColor}</span>
                </div>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Method</p>
                <p className='font-medium'>{selectedMethod}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Position</p>
                <p className='font-medium'>{selectedPosition}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className='space-y-5'>
            <div>
              <label htmlFor='textLine' className='block text-sm font-medium text-gray-700 mb-2'>
                Text Line
              </label>
              <input
                id='textLine'
                type='text'
                value={textLine}
                onChange={(e) => setTextLine(e.target.value)}
                placeholder='Enter your text'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                aria-required='true'
              />
            </div>

            <div>
              <label htmlFor='fontSelect' className='block text-sm font-medium text-gray-700 mb-2'>
                Font Style
              </label>
              <select
                id='fontSelect'
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+")] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1rem]'
              >
                <option value='Standard'>Standard</option>
                <option value='Serif'>Serif</option>
                <option value='Sans-serif'>Sans-serif</option>
                <option value='Script'>Script</option>
              </select>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-700 mb-2'>Text Preview</h3>
              <div className='bg-gray-900 p-4 rounded-lg'>
                <span
                  className={`inline-block px-4 py-2 bg-orange-500 text-white font-bold rounded-md text-lg ${fontStyles[font]}`}
                  aria-live='polite'
                >
                  {textLine || 'Preview Text'}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor='notes' className='block text-sm font-medium text-gray-700 mb-2'>
                Additional Notes
              </label>
              <textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Special instructions or requests'
                rows={3}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 bg-white p-4 border-t border-gray-200 rounded-b-xl flex justify-between'>
          <button
            onClick={onBack}
            className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200'
          >
            Back
          </button>
          <button
            onClick={handleFinish}
            disabled={loading}
            className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
            aria-busy={loading}
          >
            {loading ? (
              <span className='inline-flex items-center'>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding {selectedSizes?.length || 0} items...
              </span>
            ) : `Add ${selectedSizes?.length || 0} Items to Cart`}
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
  selectedSizes: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  selectedColor: PropTypes.string,
  selectedPosition: PropTypes.string,
  selectedMethod: PropTypes.string,
  selectedProduct: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    frontImage: PropTypes.string,
    image: PropTypes.string,
  }),
  resetSelectedColor: PropTypes.func.isRequired,
  resetSelectedSizes: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      formattedColors: PropTypes.arrayOf(
        PropTypes.shape({
          code: PropTypes.string,
          name: PropTypes.string,
        }),
      ),
      allSizes: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

export default AddTextLogoPopup;
