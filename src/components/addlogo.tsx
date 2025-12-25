import { FaTimes } from 'react-icons/fa';

const AddLogoPopup = ({
	onBack,
	onNext,
	onUpload,
	onClose,
	selectedSizes // Add selectedSizes prop to show what's being customized
}) => {
	const handleClose = (e) => {
		e.stopPropagation();
		onClose?.();
	};

	return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col'>
        {/* Header */}
        <div className='sticky top-0 bg-white p-6 pb-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center'>
          <div>
            <h2 className='text-xl font-bold text-gray-800'>Add Your Logo</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Choose a method of adding your logo
            </p>
            {/* Display selected sizes if available */}
            {selectedSizes && selectedSizes.length > 0 && (
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
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors'
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto flex-1'>
          <div className='grid grid-cols-1 gap-6'>
            {/* Text Logo Option */}
            <div 
              className='flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors'
              onClick={onNext}
            >
              <div className='bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0'>
                <span className='text-xl font-bold'>T</span>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800 mb-1'>Text Logo</h3>
                <p className='text-sm text-gray-500'>
                  Add a basic font to your garments. For example, a company, club, or employee name.
                </p>
              </div>
            </div>

            {/* Upload Logo Option */}
            <div 
              className='flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors'
              onClick={onUpload}
            >
              <div className='bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 12v3m16-3v3M4 15h16m-7-3V3m-2 9V3m0 9h-2.5m2.5 0h2.5m5.5-3h-1.5a2.5 2.5 0 010-5h1.5'
                  />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800 mb-1'>Upload Your Logo</h3>
                <p className='text-sm text-gray-500'>Your setup will be completely free!</p>
              </div>
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
          <div className="text-sm text-gray-500 flex items-center">
            Logo will apply to all selected items
          </div>
        </div>
      </div>
    </div>
  );
};



export default AddLogoPopup;
