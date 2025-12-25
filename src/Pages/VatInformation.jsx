import React from 'react';
import { FaMoneyBillWave, FaInfoCircle, FaShoppingCart, FaEnvelope, FaPhone } from 'react-icons/fa';
import vatImage from '../assets/images/vat-information.jpg';

const VatInformation = () => {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Image */}
      <div 
        className="relative mt-4 py-32 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(rgba(9, 22, 56, 0.9), rgba(5, 11, 29, 0.9)), url(${vatImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">VAT Information</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Transparent pricing with no hidden charges
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden my-2">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-start mb-8">
            <div className="bg-green-100 p-3 rounded-full mr-4 mt-1">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No VAT Charged on Your Purchases!</h2>
              <p className="text-lg text-gray-600">
                We want to let you know that we are not currently registered for VAT (Value Added Tax). 
                This means that we do not charge VAT on any of your purchases, and the prices you see 
                are the exact prices you pay.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Current Status Section */}
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
                <FaInfoCircle className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Current VAT Status</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-start mb-4">
                    <div className="bg-green-50 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-semibold">No VAT Registration:</span> We are not currently registered for VAT.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-50 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-semibold">No VAT Charged:</span> You won't see any VAT added to your purchases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Changes Section */}
            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-full mr-4 mt-1">
                <FaInfoCircle className="text-yellow-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Future Changes</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    We'll be sure to update our website if our VAT registration status changes in the future. 
                    Any changes will be clearly communicated to our customers with advance notice.
                  </p>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-700">
                      <span className="font-semibold">Note:</span> If we become VAT registered in the future, we will update all product prices accordingly and display VAT information clearly at checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            

            {/* Contact Section */}
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4 mt-1">
                <FaEnvelope className="text-red-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Questions?</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    If you have any questions about our VAT status or pricing, please don't hesitate to contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <a 
                      href="mailto:support@yourstore.com" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-3 rounded-lg"
                    >
                      <FaEnvelope className="mr-2" />
                      info@yourstore.com
                    </a>
                    <a 
                      href="tel:+441234567890" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-3 rounded-lg"
                    >
                      <FaPhone className="mr-2" />
                      +44 1234 567890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VatInformation;