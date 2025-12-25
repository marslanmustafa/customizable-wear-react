import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import LargeBack from "../assets/shirtlogos/center-back_z8_large.png";
import LargeFront from "../assets/shirtlogos/center-chest_0n_large.png";
import LeftBreast from "../assets/shirtlogos/left-chest_34_large.png";
import LeftSleeve from '../assets/shirtlogos/sleeve-left_1f_large.png';
import NapeOfNeck from '../assets/shirtlogos/nape-of-neck_dq_large.png';
import RightBreast from '../assets/shirtlogos/right-chest_no_large.png';
import RightSleeve from '../assets/shirtlogos/sleeve-right_ju_large.png';

const PositionPopup = ({ 
  onClose, 
  onBack, 
  onNext, 
  initialSelectedPositions = {},
  products = []
}) => {
  const positionImages = {
    'Large Back': LargeBack,
    'Large Front': LargeFront,
    'Left Breast': LeftBreast,
    'Left Sleeve': LeftSleeve,
    'Nape of Neck': NapeOfNeck,
    'Right Breast': RightBreast,
    'Right Sleeve': RightSleeve
  };

  // Create garment types with product IDs
  const garmentTypes = products.map(product => ({
    id: product._id, // Use product ID as the key
    name: product.name,
    positions: [
      'Left Breast',
      'Right Breast',
      'Right Sleeve', 
      'Nape of Neck',
      'Large Front',
      'Large Back',
      'Left Sleeve'
    ],
    colors: product.colors,
    sizes: product.allSizes,
    formattedColors: product.formattedColors || []
  }));

  const [selectedPositions, setSelectedPositions] = useState(() => {
    // Initialize with product IDs as keys
    const initialized = {};
    products.forEach(product => {
      initialized[product._id] = initialSelectedPositions[product._id] || [];
    });
    return initialized;
  });

  const togglePosition = (productId, position) => {
    setSelectedPositions(prev => ({
      ...prev,
      [productId]: prev[productId]?.includes(position)
        ? prev[productId].filter(p => p !== position)
        : [...(prev[productId] || []), position]
    }));
  };

  const isNextEnabled = Object.values(selectedPositions).some(
    positions => positions && positions.length > 0
  );

  const allSelectedPositions = garmentTypes
    .flatMap(garment => selectedPositions[garment.id] || [])
    .filter(Boolean)
    .join(', ') || 'None';

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50'>
      <div className='bg-white p-6 md:p-8 rounded-lg w-[90%] max-w-2xl mx-auto relative max-h-[80vh] overflow-y-auto'>
        <button onClick={onClose} className='absolute top-4 right-4 text-red-600 hover:text-red-700 p-2'>
          <FaTimes size={20} />
        </button>

        <div className='font-semibold text-lg md:text-xl text-center mb-4'>Choose Position(s)</div>
        
        

        <div className='text-sm text-center text-gray-700 mb-6'>
          Selected: {allSelectedPositions}
        </div>

        {garmentTypes.map((garment) => (
          <div key={garment.id} className='mb-8'>
            <h2 className='font-semibold text-lg md:text-xl mb-4'>{garment.name}</h2>
            
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {garment.positions.map((position) => {
                const isSelected = (selectedPositions[garment.id] || []).includes(position);
                return (
                  <div
                    key={`${garment.id}-${position}`}
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 transition-all ${
                      isSelected ? 'border-green-500 bg-green-50' : 'border-orange-500 hover:border-orange-600'
                    }`}
                    onClick={() => togglePosition(garment.id, position)}
                  >
                    <img 
                      src={positionImages[position]} 
                      alt={position} 
                      className='rounded-md object-cover w-24 h-24 mb-2' 
                      loading="lazy"
                    />
                    <div className='text-sm font-medium text-center'>{position}</div>
                    {isSelected && (
                      <div className='text-xs text-green-600 mt-1'>Selected</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className='flex justify-between items-center mt-6'>
          <button 
            className='bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg w-32 text-center transition-colors'
            onClick={onBack}
          >
            BACK
          </button>
          <button 
            className={`py-2 px-4 rounded-lg w-32 text-center transition-colors ${
              isNextEnabled 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isNextEnabled}
            onClick={() => onNext(selectedPositions)}
          >
            NEXT STEP
          </button>
        </div>
      </div>
    </div>
  );
};

PositionPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  initialSelectedPositions: PropTypes.object,
  products: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    colors: PropTypes.array,
    allSizes: PropTypes.array,
    sizesByColor: PropTypes.object,
    formattedColors: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string
    }))
  })).isRequired
};

export default PositionPopup;