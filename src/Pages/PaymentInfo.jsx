import React from 'react';
import { FaCreditCard, FaPaypal, FaLock, FaPoundSign, FaQuestionCircle, FaEnvelope, FaPhone } from 'react-icons/fa';
import paymentImage from '../assets/images/payment-info.jpg';

const PaymentInfo = () => {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Image */}
      <div 
        className="relative mt-4 py-32 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(rgba(9, 22, 56, 0.7), rgba(5, 11, 29, 0.7)), url(${paymentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Payment Information</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Secure & Convenient Payment Options for Your Custom Orders
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-2">
        <div className="p-6 md:p-8 lg:p-10">
          <p className="text-lg text-gray-600 mb-8">
            At Customisable Wear, we offer secure and convenient payment options to ensure a smooth shopping experience.
          </p>

          <div className="mb-10">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
                <FaCreditCard className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Accepted Payment Methods</h3>
                <div className="bg-gray-50 p-5 rounded-lg mb-4">
                  <h4 className="font-semibold text-lg mb-2 flex items-center">
                    <FaCreditCard className="mr-2 text-blue-500" />
                    Credit & Debit Cards
                  </h4>
                  <p className="text-gray-600 mb-3">Processed securely via <span className="font-bold">Stripe</span></p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">Visa</span>
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">Mastercard</span>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">Maestro</span>
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">Other UK cards</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2 flex items-center">
                    <FaPaypal className="mr-2 text-blue-500" />
                    PayPal
                  </h4>
                  <p className="text-gray-600">
                    Pay easily and securely using your PayPal account. You can also check out with PayPal without creating an account, using your debit or credit card.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4 mt-1">
                <FaLock className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Payment Security</h3>
                <p className="text-gray-600 mb-4">
                  Your payment details are processed securely. We do not store or have access to your full credit card information. All transactions are encrypted and handled through trusted, PCI-compliant payment gateways:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center mb-2">
                      <FaLock className="mr-2 text-blue-500" />
                      Stripe
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Ensures secure card processing using industry-standard encryption and fraud prevention.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center mb-2">
                      <FaLock className="mr-2 text-blue-500" />
                      PayPal
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Protects your financial information and offers buyer protection on eligible purchases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4 mt-1">
                <FaPoundSign className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Currencies</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600">
                    All prices on our website are listed in <span className="font-bold text-purple-600">British Pounds (£ GBP)</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4 mt-1">
                <FaQuestionCircle className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Troubleshooting Payment Issues</h3>
                <div className="bg-gray-50 p-5 rounded-lg mb-4">
                  <p className="text-gray-600 mb-3">If you're experiencing issues during checkout:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Double-check that your card details are entered correctly</li>
                    <li>Ensure your billing address matches the one registered to your card</li>
                    <li>Try an alternative payment method</li>
                    <li>Contact your bank to ensure there are no holds or restrictions</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-3">If problems persist, feel free to reach out to us:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="mailto:support@customisablewear.com" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEnvelope className="mr-2" />
                      info@customisablewear.com
                    </a>
                    <a 
                      href="tel:+447723233021" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
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

export default PaymentInfo;