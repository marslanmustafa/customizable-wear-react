import React from 'react';
import { FaTruck, FaClock, FaGlobe, FaBoxOpen, FaEnvelope, FaPhone, FaPoundSign, FaShippingFast } from 'react-icons/fa';
import shippingImage from '../assets/images/shipping-policy.jpg';

const ShippingPolicy = () => {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Hero Section with Image */}
      <div 
        className="relative rounded-xl overflow-hidden mb-8 h-64"
        style={{
          background: `linear-gradient(rgba(9, 22, 56, 0.9), rgba(5, 11, 29, 0.9)), url(${shippingImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Shipping Policy</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Fast, reliable delivery for your custom orders
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="space-y-8">
            {/* Order Processing Time */}
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
                <FaClock className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Order Processing Time</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-3">
                    All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays.
                  </p>
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-yellow-700">
                      During high volume periods, shipments may be delayed by a few days. We'll contact you if there are significant delays.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Rates & Delivery Estimates */}
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4 mt-1">
                <FaTruck className="text-green-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Shipping Rates & Delivery Estimates</h3>
                <div className="bg-gray-50 p-5 rounded-lg overflow-x-auto">
                  <p className="text-gray-600 mb-4">Shipping charges for your order will be calculated and displayed at checkout.</p>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaShippingFast className="mr-2" />
                            Shipping Method
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaClock className="mr-2" />
                            Estimated Delivery
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaPoundSign className="mr-2" />
                            Cost
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          Standard Shipping (UK)
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          2-3 business days
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          £4.95 <span className="text-green-600">(Free over £100)</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          Expedited Shipping
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          1-2 business days
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          £6.95
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          International Shipping
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          5-10 business days
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          £10.95
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-gray-500 text-sm mt-2 italic">*Delivery delays can occasionally occur*</p>
                </div>
              </div>
            </div>

            {/* Shipment Confirmation */}
            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-full mr-4 mt-1">
                <FaEnvelope className="text-purple-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Shipment Confirmation & Order Tracking</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600">
                    You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4 mt-1">
                <FaGlobe className="text-red-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">International Shipping</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600">
                    We offer international shipping to most countries. A flat rate of £10.95 will be applied at checkout for all international orders.
                  </p>
                </div>
              </div>
            </div>

            {/* Customs Section */}
            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-full mr-4 mt-1">
                <FaBoxOpen className="text-yellow-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Customs, Duties, and Taxes</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600">
                    Customisable Wear is not responsible for any customs and taxes applied to your international order. All fees imposed during or after shipping are the responsibility of the customer (including tariffs, taxes, etc.).
                  </p>
                </div>
              </div>
            </div>

            {/* Damages Section */}
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4 mt-1">
                <FaBoxOpen className="text-indigo-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Damages</h3>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-gray-600 mb-3">
                    Customisable Wear is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier or our support team directly to file a claim.
                  </p>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-red-600 text-sm">
                      Please save all packaging materials and damaged goods before filing a claim.
                    </p>
                  </div>
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
                    If you have any questions about this Shipping Policy, please contact our support team:
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

export default ShippingPolicy;