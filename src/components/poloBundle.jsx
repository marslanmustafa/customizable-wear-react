import React, { useState } from 'react';
import { usePoloSelector } from '../hooks/usePoloSelector';
import BundleProductSection from './BundleProductSection';
import BundleLogoPopup from './BundleLogoPopup';
import PropTypes from 'prop-types';

const PoloSelector = ({ thumbnail, bundleType, products = [], sizes = [] }) => {
  const {
    bundle,
    selectedPoloShirts1 = [],
    selectedColors1 = [],
    isDropdownOpen1,
    isPoloShirtsOpen1,
    quantities1 = {},
    totalSelectedSizes1 = 0,
    handleSelectProduct1,
    handleColorChange1,
    handleQuantityChange1,
    toggleDropdown1,
    togglePoloShirtsSection1,
    selectedPoloShirts2 = [],
    selectedColors2 = [],
    isDropdownOpen2,
    isPoloShirtsOpen2,
    quantities2 = {},
    totalSelectedSizes2 = 0,
    handleSelectProduct2,
    handleColorChange2,
    handleQuantityChange2,
    toggleDropdown2,
    togglePoloShirtsSection2,
    selectedPoloShirts3 = [],
    selectedColors3 = [],
    isDropdownOpen3,
    isPoloShirtsOpen3,
    quantities3 = {},
    totalSelectedSizes3 = 0,
    handleSelectProduct3,
    handleColorChange3,
    handleQuantityChange3,
    toggleDropdown3,
    togglePoloShirtsSection3,
    resetSelections,
    getMaxQuantity,
    calculateTotalSizes
  } = usePoloSelector();

  const [showPopup, setShowPopup] = useState(false);

  // Determine product quantities based on bundle type
  const getProductQuantities = () => {
    if (!bundleType) return Array(products.length).fill(1);

    switch (bundleType) {
      case 'everyday':
        return [5, 3, 2]; // 5 of first product, 3 of second, 2 of third
      case 'solo1':
      case 'solo2':
        return [3, 2]; // 3 of first product, 2 of second
      default:
        return Array(products.length).fill(1); // Default to 1 each
    }
  };

  const requiredQuantities = getProductQuantities();
  const totalRequired = requiredQuantities.reduce((sum, qty) => sum + qty, 0);
  const totalSelected = (totalSelectedSizes1 || 0) + (totalSelectedSizes2 || 0) + (totalSelectedSizes3 || 0);

  const allProductsHaveRequiredSizes = () => {
    if (bundleType === 'everyday') {
      return totalSelectedSizes1 === 5 && 
             totalSelectedSizes2 === 3 && 
             totalSelectedSizes3 === 2;
    } else if (bundleType === 'solo1' || bundleType === 'solo2') {
      return totalSelectedSizes1 === 3 && 
             totalSelectedSizes2 === 2;
    }
    return true;
  };

  const handleAddLogoClick = () => {
    if (!bundle?._id) return;
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const getProductData = (selectedColors = [], quantities = {}, product = {}, selectedPoloShirts = []) => {
    const quantitiesEntries = quantities ? Object.entries(quantities) : [];

    const sizesArray = quantitiesEntries
      .filter(([_, qty]) => qty > 0)
      .flatMap(([sizeKey, qty]) => {
        const size = sizeKey?.split('-')[1] || '';
        return Array(qty).fill(size);
      });

    const uniqueSizes = quantitiesEntries
      .filter(([_, qty]) => qty > 0)
      .map(([sizeKey]) => sizeKey?.split('-')[1] || '');

    return {
      _id: product?._id || '',
      id: product?._id || '',
      colors: Array.isArray(selectedColors) ? selectedColors : [],
      sizesByColor: (Array.isArray(selectedColors) ? selectedColors : []).reduce((acc, color) => {
        acc[color] = quantitiesEntries
          .filter(([key, qty]) => key?.startsWith(`${color}-`) && qty > 0)
          .map(([size, qty]) => ({
            size: size?.split('-')[1] || '',
            quantity: qty,
          }));
        return acc;
      }, {}),
      allSizes: sizesArray,
      uniqueSizes: uniqueSizes,
      quantities: quantities || {},
      price: product?.price || 0,
      name: product?.name || 'Product',
      selectedPoloShirt: selectedPoloShirts[0] || {},
    };
  };

  const product1Data = getProductData(selectedColors1, quantities1, products[0], selectedPoloShirts1);
  const product2Data = getProductData(selectedColors2, quantities2, products[1], selectedPoloShirts2);
  const product3Data = bundleType === 'everyday' ?
    getProductData(selectedColors3, quantities3, products[2], selectedPoloShirts3) : null;

  if (!products || products.length === 0) {
    return <div className='text-center py-8'>Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative"> {/* Added padding-bottom for fixed button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bundle Summary Header */}
        <div className="bg-white py-4 shadow-sm rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">{bundle?.title || 'Custom Bundle'}</h2>
              <div className="flex -space-x-2">
                {products.map((product, index) => (
                  product?.image && (
                    <img
                      key={index}
                      src={product.image}
                      alt={`Product ${index + 1}`}
                      className="h-10 w-10 object-contain rounded-full border-2 border-white bg-gray-100"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Select {totalRequired} items total
                </p>
                <p className="text-xl font-bold text-gray-900">
                  <span className={totalSelected === totalRequired ? 'text-green-600' : 'text-blue-600'}>
                    {totalSelected}
                  </span>
                  <span className="text-gray-500"> / {totalRequired}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Selection Sections - Grid Layout */}
        <div className="grid grid-cols-1 gap-6">
          {products[0] && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <BundleProductSection
                title={`Product 1 (Select ${requiredQuantities[0]})`}
                product={products[0]}
                selectedPoloShirts={selectedPoloShirts1}
                selectedColors={selectedColors1}
                isDropdownOpen={isDropdownOpen1}
                isPoloShirtsOpen={isPoloShirtsOpen1}
                quantities={quantities1}
                totalSelectedSizes={totalSelectedSizes1}
                requiredQuantity={requiredQuantities[0]}
                handleSelectProduct={handleSelectProduct1}
                handleColorChange={handleColorChange1}
                handleQuantityChange={handleQuantityChange1}
                toggleDropdown={toggleDropdown1}
                togglePoloShirtsSection={togglePoloShirtsSection1}
                sectionNumber={1}
                sizes={sizes}
                maxColors={bundleType === 'everyday' ? 5 : 3}
                calculateTotalSizes={calculateTotalSizes}
                bundleType={bundleType}
              />
            </div>
          )}

          {products[1] && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <BundleProductSection
                title={`Product 2 (Select ${requiredQuantities[1]})`}
                product={products[1]}
                selectedPoloShirts={selectedPoloShirts2}
                selectedColors={selectedColors2}
                isDropdownOpen={isDropdownOpen2}
                isPoloShirtsOpen={isPoloShirtsOpen2}
                quantities={quantities2}
                totalSelectedSizes={totalSelectedSizes2}
                requiredQuantity={requiredQuantities[1]}
                handleSelectProduct={handleSelectProduct2}
                handleColorChange={handleColorChange2}
                handleQuantityChange={handleQuantityChange2}
                toggleDropdown={toggleDropdown2}
                togglePoloShirtsSection={togglePoloShirtsSection2}
                sectionNumber={2}
                sizes={sizes}
                maxColors={2}
                calculateTotalSizes={calculateTotalSizes}
                bundleType={bundleType}
              />
            </div>
          )}

          {bundleType === 'everyday' && products[2] && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <BundleProductSection
                title={`Product 3 (Select ${requiredQuantities[2]})`}
                product={products[2]}
                selectedPoloShirts={selectedPoloShirts3}
                selectedColors={selectedColors3}
                isDropdownOpen={isDropdownOpen3}
                isPoloShirtsOpen={isPoloShirtsOpen3}
                quantities={quantities3}
                totalSelectedSizes={totalSelectedSizes3}
                requiredQuantity={requiredQuantities[2]}
                handleSelectProduct={handleSelectProduct3}
                handleColorChange={handleColorChange3}
                handleQuantityChange={handleQuantityChange3}
                toggleDropdown={toggleDropdown3}
                togglePoloShirtsSection={togglePoloShirtsSection3}
                sectionNumber={3}
                sizes={sizes}
                maxColors={1}
                calculateTotalSizes={calculateTotalSizes}
                bundleType={bundleType}
              />
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom Add Logo button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 shadow-lg  z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Selected Items</p>
            <p className="text-xl font-bold text-gray-900">
              <span className={totalSelected === totalRequired ? 'text-green-600' : 'text-blue-600'}>
                {totalSelected}
              </span>
              <span className="text-gray-500"> / {totalRequired}</span>
            </p>
          </div>
          <button
            onClick={handleAddLogoClick}
            disabled={!allProductsHaveRequiredSizes() || !bundle?._id}
            className={`px-6 py-3 text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center ${
              allProductsHaveRequiredSizes() && bundle?._id 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            Add Logo
          </button>
        </div>
      </div>

      {/* Logo Popup */}
      {showPopup && (
        <BundleLogoPopup
          onClose={handleClosePopup}
          visible={showPopup}
          product1={product1Data}
          thumbnail={thumbnail}
          product2={product2Data}
          product3={bundleType === 'everyday' ? product3Data : null}
          selectedPoloShirts1={selectedPoloShirts1}
          selectedPoloShirts2={selectedPoloShirts2}
          selectedPoloShirts3={bundleType === 'everyday' ? selectedPoloShirts3 : null}
          bundleId={bundle?._id}
          bundle={bundle}
          resetSelections={resetSelections}
        />
      )}
    </div>
  );
};

PoloSelector.propTypes = {
  thumbnail: PropTypes.string,
  bundleType: PropTypes.string,
  products: PropTypes.array,
  sizes: PropTypes.array,
};

PoloSelector.defaultProps = {
  bundleType: '',
  products: [],
  sizes: [],
};

export default PoloSelector;