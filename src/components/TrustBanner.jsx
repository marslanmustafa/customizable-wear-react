import React from 'react';
import money from '../assets/icons/money.png';
import print from '../assets/icons/print.png';
import rocket from '../assets/icons/rocket.png';
import star from '../assets/icons/star.png';

const TrustBanner = () => {
  return (
    <div className="bg-black py-2 sm:py-2 text-white w-full">
      {/* Mobile View (stacked) */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-3 px-4 mx-auto max-w-md">
          <div className="flex items-center gap-2 text-xs">
            <img src={money} alt="Price Match" className="h-4 w-4"/>
            <span>PRICE MATCH</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <img src={rocket} alt="Trusted" className="h-4 w-4"/>
            <span>MANY CUSTOMERS</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <img src={print} alt="Embroidery" className="h-4 w-4"/>
            <span>IN-HOUSE PRINT</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <img src={star} alt="Reviews" className="h-4 w-4"/>
            <span>POSITIVE REVIEWS</span>
          </div>
        </div>
      </div>

      {/* Desktop View (full width) */}
      <div className="hidden md:block w-full">
        <div className="flex justify-center items-center gap-6 lg:gap-10 px-4 text-sm md:text-base mx-auto">
          <div className="flex items-center gap-2">
            <img src={money} alt="Price Match" className="h-5 w-5"/>
            <span>PRICE MATCH PROMISE - WE'LL BEAT ANY PRICE</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={rocket} alt="Trusted" className="h-5 w-5"/>
            <span>TRUSTED BY OUR CUSTOMERS</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={print} alt="Embroidery" className="h-5 w-5"/>
            <span>IN-HOUSE EMBROIDERY & PRINT</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={star} alt="Reviews" className="h-5 w-5"/>
            <span>POSITIVE REVIEWS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBanner;