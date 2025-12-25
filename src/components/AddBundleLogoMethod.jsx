// AddLogoMethod.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const AddLogoMethod = ({
  onClose,
  onBack,
  onSelect,
  selectedPositions = {},
  products = []
}) => {
  const positionsText = Object.values(selectedPositions).flat().join(', ') || 'None selected';

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 relative'>
        <button
          className='absolute top-4 right-4 text-red-600 hover:text-red-700 p-2'
          onClick={onClose}
          aria-label='Close'
        >
          <FaTimes size={20} />
        </button>

        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Add Your Logo</h2>
          <p className='text-gray-600 mb-2'>Selected Positions: {positionsText}</p>
          
        
          
          <p className='text-gray-600 mb-6'>Choose a method of adding your logo</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div
            onClick={() => onSelect('text')}
            className='text-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md cursor-pointer transition-all'
          >
            <div className='bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3'>
              <span className='text-4xl font-bold'>T</span>
            </div>
            <h3 className='font-semibold mb-2'>Text Logo</h3>
          </div>

          <div
            onClick={() => onSelect('upload')}
            className='text-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md cursor-pointer transition-all'
          >
            <div className='bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0-6l-3 3m3-3l3 3m3-10a4 4 0 00-8 0v4h8V9z' />
              </svg>
            </div>
            <h3 className='font-semibold mb-2'>Upload Logo</h3>
          </div>
        </div>

        <div className='flex justify-between mt-4'>
          <button onClick={onBack} className='bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400'>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

AddLogoMethod.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedPositions: PropTypes.object,
  products: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    colors: PropTypes.array,
    allSizes: PropTypes.array,
    sizesByColor: PropTypes.object,
    quantities: PropTypes.object,
    formattedColors: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string
    }))
  }))
};

export default AddLogoMethod;