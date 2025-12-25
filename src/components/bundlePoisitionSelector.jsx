import React from 'react';
import LargeBack from "../assets/shirtlogos/center-back_z8_large.png";
import LargeFront from "../assets/shirtlogos/center-chest_0n_large.png";
import LeftBreast from "../assets/shirtlogos/left-chest_34_large.png";
import LeftSleeve from '../assets/shirtlogos/sleeve-left_1f_large.png';
import NapeOfNeck from '../assets/shirtlogos/nape-of-neck_dq_large.png';
import RightBreast from '../assets/shirtlogos/right-chest_no_large.png';
import RightSleeve from '../assets/shirtlogos/sleeve-right_ju_large.png';
import shirtPop from './shirtpopup';

import Popup from './shirtpopup';
import { FaTimes } from 'react-icons/fa'; // Import FaTimes for close icon

const PositionPopup = ({ onClose,onBack, onNext, visible, selectedPosition, setSelectedPosition }) => {

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
        <div className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50'>
            <div className='bg-white p-6 md:p-8 rounded-lg w-[90%] max-w-2xl mx-auto relative'>
                {/* Close Button */}
                <button onClick={onClose} className='absolute top-4 right-4 text-red-600 hover:text-red-700 p-2'>
                    <FaTimes size={20} />
                </button>

                <div className='font-semibold text-lg md:text-xl text-center mb-4'>Choose Position(s)</div>
                <div className='text-sm text-center text-gray-700 mb-6'>
                    {selectedPosition ? `Selected: ${selectedPosition}` : 'Select a position'}
                </div>
                <div className='text-sm text-blue-500 text-center mb-6'>
                    Note: Additional logos can be added after the first one has been uploaded.
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    {positions.map((position) => (
                        <div
                            key={position.label}
                            onClick={() => setSelectedPosition(position.label)}
                            className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                                selectedPosition === position.label ? 'border-orange-500' : 'border-gray-300'
                            }`}>
                            <img src={position.image} alt={position.label} className='rounded-md object-cover w-24 h-24 mb-2' />
                            <div className='text-sm font-medium text-center'>{position.label}</div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between items-center mt-6'>
                    <button
                        onClick={onBack}
                        className='bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg w-32 text-center'>
                        BACK
                    </button>
                    <button
                        onClick={onNext}
                        className='bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg w-32 text-center'
                        disabled={!selectedPosition} // Disable if no position selected
                    >
                        NEXT STEP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PositionPopup;
