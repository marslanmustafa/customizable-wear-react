import React from 'react';
import { FaExchangeAlt, FaUndo, FaMoneyBillWave, FaExclamationTriangle, FaEnvelope, FaPhone } from 'react-icons/fa';
import returnImage from '../assets/images/return-policy.jpg';

const ReturnPolicy = () => {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Image */}
      <div 
        className="relative mt-4 py-32 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(rgba(9, 22, 56, 0.9), rgba(5, 11, 29, 0.9)), url(${returnImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Return & Refund Policy</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Our commitment to your satisfaction with every purchase
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden my-2">
        <div className="p-6 md:p-8 lg:p-10">
          <p className="text-lg text-gray-600 mb-8">
            At Customisable Wear, we want you to be completely satisfied with your purchase. If you are not happy with your order, we're here to help.
          </p>

          <div className="space-y-8">
            {/* Returns Section */}
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
                <FaUndo className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Returns</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    You may return most non-customised items within 14 days of delivery for an exchange or refund. To be eligible for a return, your item must be:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Unworn, unused, and in the same condition that you received it</li>
                    <li>In its original packaging</li>
                    <li>Accompanied by a receipt or proof of purchase</li>
                  </ul>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-yellow-700">
                      <span className="font-semibold">Note:</span> Customized or personalised items are not eligible for return, exchange, or refund, unless the item arrives damaged, defective, or the error is on our part.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchanges Section */}
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4 mt-1">
                <FaExchangeAlt className="text-green-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Exchanges</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Non-customised items are eligible for exchange within 14 days of delivery. If you would like to exchange for a different size or product, please contact us.
                  </p>
                  <p className="text-gray-600">
                    We will provide instructions on how to return the original item. Once received and inspected, we will dispatch the replacement item.
                  </p>
                </div>
              </div>
            </div>

            {/* How to Initiate Section */}
            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-full mr-4 mt-1">
                <FaUndo className="text-purple-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">How to Initiate a Return or Exchange</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    To start a return or exchange, please contact us with the following details:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                    <li>Order number</li>
                    <li>Reason for the return or exchange</li>
                    <li>Photo evidence if the item is damaged or incorrect</li>
                  </ul>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-red-600 text-sm">
                      Returns sent back without prior approval may not be accepted.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refunds Section */}
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4 mt-1">
                <FaMoneyBillWave className="text-indigo-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Refunds</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Once we receive and inspect your return, we will notify you of the approval or rejection of your refund:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>If approved, your refund will be processed to your original method of payment within 5-7 business days</li>
                    <li>Shipping costs are non-refundable, unless the return is due to our error</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exceptions Section */}
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4 mt-1">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Exceptions</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Customised items are non-refundable and non-returnable, unless faulty or incorrect due to our mistake</li>
                    <li>Sale items are final and cannot be returned unless they are defective</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Contact Us</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    If you have any questions about your order or this policy, please contact our support team:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <a 
                      href="mailto:support@customisablewear.com" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-3 rounded-lg"
                    >
                      <FaEnvelope className="mr-2" />
                      info@customisablewear.com
                    </a>
                    <a 
                      href="tel:+447723233021" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-3 rounded-lg"
                    >
                      <FaPhone className="mr-2" />
                      +44 7723 233021
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

export default ReturnPolicy;