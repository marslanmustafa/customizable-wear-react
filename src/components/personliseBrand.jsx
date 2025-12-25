import React from 'react';
import { FaTshirt, FaMagic, FaShippingFast, FaEnvelope } from 'react-icons/fa';

const PersonaliseGarments = () => {
  return (
    <div className="overflow-hidden">

      {/* Left Column - Text Content */}
      <div className="px-8 pt-10 md:px-10 ">
        <div className="flex items-center mb-4">
          <div className="bg-[#0f2252]/10 p-2 rounded-full mr-3">
            <FaTshirt className="text-[#0f2252] text-xl" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Personalise <span className="text-[#0f2252]">Your Own</span> Garments!
          </h2>
        </div>

        <p className="text-black text-lg">
          Want to add a unique touch to your clothing? You can send us your own garments,
          and we'll help you personalise them!
        </p>
        <p className="text-black font-bold mb-6 text-lg">
          Just get in touch, and we'll guide you through the process,
        </p>

      </div>
    </div>
  );
};

export default PersonaliseGarments;