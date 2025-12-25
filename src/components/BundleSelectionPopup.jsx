import Embroidery from '../assets/images/Embroidery.jpeg';
import Print from '../assets/images/print.jpeg'; 
import { FaTimes } from 'react-icons/fa';

const BundleSelectionPopup = ({ 
  onClose, 
  visible, 
  selectedProduct, 
  selectedSize, 
  selectedColor,
  resetSelectedColor,
  resetSelectedSize 
}) => {
  if (!visible) return null;

  return (
    <>
      <div className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-250'>
        <div className='bg-white p-8 rounded-lg w-96 md:w-[600px] z-60 relative'>
          <button onClick={onClose} className='absolute top-4 right-4 text-red-600 hover:text-red-700 p-2'>
            <FaTimes size={20} />
          </button>

          <div className='font-semibold text-xl mb-4 text-center'>{selectedProduct?.title || 'Select a T-Shirt'}</div>
          <div className='text-lg mb-4 text-center'>Select an application method</div>

          <div className='flex justify-between space-x-4'>
            <div className='flex flex-col items-center cursor-pointer w-full p-2 rounded-md'>
              <div className='border-2 border-transparent rounded-md'>
                <img
                  src={Embroidery}
                  alt='Embroidery'
                  className='object-cover mb-2 rounded-md'
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
              <div className='text-lg font-semibold text-center'>Embroidery</div>
              <div className='text-sm text-gray-500 text-center'>
                Embroidery involves stitching logos onto garments by needle and thread.
              </div>
              <div className='mt-2 text-sm text-yellow-500'>We Recommend</div>
            </div>

            <div className='flex flex-col items-center cursor-pointer w-full p-2 rounded-md'>
              <div className='border-2 border-transparent rounded-md'>
                <img
                  src={Print}
                  alt='Print'
                  className='object-cover mb-2 rounded-md'
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
              <div className='text-lg font-semibold text-center'>Print</div>
              <div className='text-sm text-gray-500 text-center'>
                Printing involves pressing logos onto garments using heat.
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <button className='bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600'>
              NEXT STEP
            </button>
          </div>
        </div>
      </div>

      {/* Size Popup Placeholder */}
    
    </>
  );
};

export default BundleSelectionPopup;