import React from 'react';
import { FaEnvelope, FaPhone, FaInfoCircle, FaShieldAlt, FaLink, FaTshirt, FaExchangeAlt } from 'react-icons/fa';
import hero from '../assets/images/disclaimer.jpg';

const Disclaimer = () => {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Image Background */}
      <div 
        className="relative mt-4 py-32 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(rgba(9, 22, 56, 0.7), rgba(5, 11, 29, 0.7)), url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#091638]/80 to-[#050b1d]/80"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your Guide to Custom Orders: Policies & Protections
          </p>
        </div>
      </div>

      {/* Disclaimer Content */}
      <div className="max-w-8xl w-full mx-auto my-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
          <div className="p-6 md:p-10">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaInfoCircle className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Accuracy of Information</h3>
                    <p className="text-gray-600">
                      We strive to ensure that the information provided on the website is accurate and up-to-date. However, we make no guarantees about the completeness, accuracy, reliability, or suitability of the information. The content may contain errors, and we reserve the right to correct them at any time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FaTshirt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Products and Services</h3>
                    <p className="text-gray-600">
                      All product descriptions, pricing, and availability are subject to change without notice. We make every effort to ensure that the products displayed on our website are accurate, but there may be slight variations in color, size, or design due to differences in computer screens or other factors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <FaShieldAlt className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Liability</h3>
                    <p className="text-gray-600">
                      Customisable Wear will not be liable for any damages arising from the use or inability to use this website or its content, including but not limited to direct, indirect, incidental, or consequential damages. This includes any damages related to loss of data or profit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaLink className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">External Links</h3>
                    <p className="text-gray-600">
                      This website may contain links to third-party websites. We do not control or endorse the content of these external sites and are not responsible for their accuracy, legality, or any consequences of using them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaExchangeAlt className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Customised Products</h3>
                    <p className="text-gray-600">
                      Please note that all customised products are final sale and are non-refundable unless there is a defect or error on our part. You are responsible for ensuring that all custom details (such as spelling, size, and design) are correct at the time of order.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <FaInfoCircle className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Changes to the Disclaimer</h3>
                    <p className="text-gray-600">
                      We reserve the right to update, modify, or replace this disclaimer at any time. Any changes will be posted on this page, and it is your responsibility to review this page periodically for updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h3>
                <p className="text-gray-600 mb-6">
                  If you have any questions or concerns about this disclaimer, please contact us:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaEnvelope className="text-blue-600" />
                    </div>
                    <a 
                      href="mailto:info@customisablewear.com" 
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors"
                    >
                      info@customisablewear.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <FaPhone className="text-green-600" />
                    </div>
                    <a 
                      href="tel:+447723233021" 
                      className="text-gray-700 hover:text-green-600 hover:underline transition-colors"
                    >
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

export default Disclaimer;