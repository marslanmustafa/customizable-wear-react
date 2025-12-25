import React from 'react';
import LargeBack from "../assets/shirtlogos/center-back_z8_large.png";
import LargeFront from "../assets/shirtlogos/center-chest_0n_large.png";
import LeftBreast from "../assets/shirtlogos/left-chest_34_large.png";
import LeftSleeve from '../assets/shirtlogos/sleeve-left_1f_large.png';
import NapeOfNeck from '../assets/shirtlogos/nape-of-neck_dq_large.png';
import RightBreast from '../assets/shirtlogos/right-chest_no_large.png';
import RightSleeve from '../assets/shirtlogos/sleeve-right_ju_large.png';
import { FaTimes } from 'react-icons/fa';

const PositionPopup = ({ onClose, onBack, onNext, visible, selectedPosition, setSelectedPosition, selectedSizes }) => {
  if (!visible) return null;

  const positions = [
    { label: 'Large Back', image: LargeBack },
    { label: 'Large Front', image: LargeFront },
    { label: 'Left Breast', image: LeftBreast },
    { label: 'Left Sleeve', image: LeftSleeve },
    { label: 'Nape of Neck', image: NapeOfNeck },
    { label: 'Right Breast', image: RightBreast },
    { label: 'Right Sleeve', image: RightSleeve },
  ];

  return (
  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 mt-28'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col'>
        {/* Header */}
        <div className='sticky top-0 bg-white p-6 pb-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center'>
          <div>
            <h2 className='text-xl font-bold text-gray-800'>Choose Position</h2>
            <p className='text-sm text-gray-500 mt-1'>
              {selectedPosition ? `Selected: ${selectedPosition}` : 'Select a position for your design'}
            </p>
            {/* Display selected sizes */}
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
            onClick={onClose} 
            className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors'
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto flex-1'>
          <div className='mb-4 text-center text-sm text-blue-600 bg-blue-50 p-2 rounded-lg'>
            Note: The selected logo will be applied to all {selectedSizes?.length || 0} items.
            Additional logos can be added after the first one has been uploaded.
          </div>
          
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            {positions.map((position) => (
              <div
                key={position.label}
                onClick={() => setSelectedPosition(position.label)}
                className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                  selectedPosition === position.label 
                    ? 'bg-orange-50 border-2 border-orange-500' 
                    : 'border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className='w-full h-20 flex items-center justify-center mb-3 bg-gray-100 rounded-md overflow-hidden'>
                  <img 
                    src={position.image} 
                    alt={position.label} 
                    className='object-contain max-h-full max-w-full p-2' 
                  />
                </div>
                <div className='text-sm font-medium text-gray-800 text-center'>{position.label}</div>
              </div>
            ))}
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
            onClick={onNext}
            disabled={!selectedPosition}
            className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${
              selectedPosition 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionPopup;