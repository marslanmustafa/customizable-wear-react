import React from 'react';

import { motion } from 'framer-motion';
const PriceGuide = () => {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Header Section */}
      
        <div className="relative bg-gradient-to-r from-[#091638] to-[rgba(9,22,56,0.9)] text-white rounded-xl mb-8 h-64 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Embroidery & Printing Services</h1>
          <p className="text-xl md:text-2xl text-blue-200">Premium customisation at competitive prices</p>
        </motion.div>
      </div>

      {/* Intro Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-700">
            At Customizable Wear, we specialise in high-quality embroidery and vinyl printing
            services tailored for workwear, uniforms, promotional clothing, and more. Whether you're
            a tradesperson, a school, a business owner, or planning an event — we offer premium
            customisation at competitive prices.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Embroidery Service Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="p-8">
              <div className="text-4xl mb-6">🧵</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Embroidery Services</h2>
              <p className="text-gray-600 mb-6">
                Our embroidery service delivers a durable, professional, and high-end finish — perfect
                for logos, names, and branding on garments like polo shirts, hoodies, jackets, and hats.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">What's Included:</h3>
              <ul className="list-disc pl-6 mb-8 space-y-2 text-gray-600">
                <li>Digitising of your logo (one-time setup)</li>
                <li>Choice of thread colours to match your brand</li>
                <li>Stitching directly onto garments</li>
                <li>Fast turnaround and quality control</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Embroidery Pricing:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 mb-8">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Embroidery (up to 10,000 stitches)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">£5.50 per item</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Additional stitches</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">£1.50 per extra 1,000 stitches</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Digitising Fee</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">£20 one-time setup</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700 mb-2">
                  If your logo is particularly detailed or complex, additional charges may apply.
                  Please contact us before placing your order so we can review your design and
                  provide an accurate quote.
                </p>
                <p className="text-gray-700">Bulk or contract rates available on request.</p>
              </div>
            </div>
          </div>

          {/* Vinyl Printing Service Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-4xl mb-6">🖨</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Vinyl Printing Services</h2>
              <p className="text-gray-600 mb-6">
                Vinyl printing offers a clean, bold, and long-lasting finish — ideal for logos, names, and
                promotional graphics. It's a perfect choice for teamwear, hi-vis, and branded clothing.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">What's Included:</h3>
              <ul className="list-disc pl-6 mb-8 space-y-2 text-gray-600">
                <li>Design setup and mock-up</li>
                <li>High-quality heat-pressed vinyl</li>
                <li>Available in a wide range of colours and finishes</li>
                <li>Suitable for all types of garments</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Vinyl Printing Pricing:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 mb-8">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Print Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Any Vinyl Print</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">£5.50 per item</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700 mb-2">
                  If you are interested in Screen Printing or DFT (Direct to Film Transfer) for
                  larger orders or detailed full-colour prints, please contact us for a custom
                  quote.
                </p>
                <p className="text-gray-700">
                  We're happy to recommend the best method based on your artwork, quantity, and garment
                  type.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garments Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Garments Available</h2>
          <p className="text-gray-600 mb-8">
            We can supply a wide range of high-quality garments including:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {['T-Shirts', 'Polo Shirts', 'Hoodies', 'Hi-Vis Vests', 'Work Jackets', 'Caps & Beanies', 'Tote & Kit Bags'].map((item) => (
              <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
                {item}
              </div>
            ))}
          </div>
          <p className="text-gray-600 italic">You can also provide your own garments for customisation.</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Fresh and modern approach to custom workwear",
              "Passionate team committed to quality and detail",
              "No minimum order for printing or embroidery",
              "Fast UK-wide delivery",
              "Friendly service & mock-ups provided before production",
              "Bulk discounts and trade accounts available"
            ].map((benefit) => (
              <div key={benefit} className="flex items-start">
                <div className="text-blue-600 text-2xl mr-4">⭐</div>
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* CTA Section */}
<section className="py-16 px-4 bg-gray-900 text-white mb-16">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-6">Get a Quote or Place an Order</h2>
    <p className="text-gray-300 mb-8">Use our easy online quote form or contact us directly:</p>
    
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mb-10">
      <div className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 transition duration-300">
        <span className="text-2xl mr-3 text-blue-400">📞</span>
        <a href="tel:+447723233021" className="hover:text-blue-400 transition">+44 7723 233021</a>
      </div>
      
      <div className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 transition duration-300">
        <span className="text-2xl mr-3 text-blue-400">🌐</span>
        <a 
          href="https://www.customizablewear.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-blue-400 transition"
        >
          www.customizablewear.com
        </a>
      </div>
      
      <div className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 transition duration-300">
        <span className="text-2xl mr-3 text-blue-400">📧</span>
        <a href="mailto:info@customizablewear.com" className="hover:text-blue-400 transition">
          info@customizablewear.com
        </a>
      </div>
    </div>
    
    <a 
      href="/contact" 
      className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
    >
      Get a Quote Online
    </a>
  </div>
</section>
    </div>
  );
};

export default PriceGuide;