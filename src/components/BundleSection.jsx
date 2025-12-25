// components/ProductSection.jsx
import React from 'react';

const ProductSection = ({
  title,
  product,
  selectedPoloShirts,
  selectedColors,
  isDropdownOpen,
  isPoloShirtsOpen,
  quantities,
  totalSelectedSizes,
  handleSelectProduct,
  handleColorChange,
  handleQuantityChange,
  toggleDropdown,
  togglePoloShirtsSection,
  sectionNumber
}) => {
  if (!product) return null;

  const availableColors = product?.colors || [];
  const totalSizesSelected = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="mb-8">
      <p className='text-md text-gray-500 mt-2'>
        {selectedPoloShirts.length} product(s) selected ({totalSizesSelected} / 3 sizes chosen)
      </p>
      <button
        onClick={togglePoloShirtsSection}
        className='w-full text-left flex items-center justify-between p-2 bg-gray-100 rounded-lg'
      >
        <h3 className='text-lg font-medium text-gray-900'>
          {product?.title || `${title} (Product ${sectionNumber})`}
        </h3>
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${
            isPoloShirtsOpen ? 'transform rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M19 9l-7 7-7-7'
          ></path>
        </svg>
      </button>

      {isPoloShirtsOpen && product && (
        <div>
          <ProductGrid 
            product={product}
            selectedPoloShirts={selectedPoloShirts}
            handleSelectProduct={handleSelectProduct}
          />
          
          <ColorSelection 
            availableColors={availableColors}
            selectedColors={selectedColors}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
            handleColorChange={handleColorChange}
          />

          {selectedColors.map((color) => {
            const selectedColorData = availableColors.find(
              (c) => c.color === color
            );
            return (
              selectedColorData && (
                <SizeSelection
                  key={color}
                  color={color}
                  selectedColorData={selectedColorData}
                  product={product}
                  quantities={quantities}
                  totalSizesSelected={totalSizesSelected}
                  handleQuantityChange={handleQuantityChange}
                />
              )
            );
          })}

          {selectedColors.length === 0 && (
            <div className='flex items-center justify-center p-4 mt-10 bg-gray-100 rounded-lg'>
              <p className='text-orange-700 text-xl font-medium'>
                Please select a colour to select your sizes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductGrid = ({ product, selectedPoloShirts, handleSelectProduct }) => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'>
    <div
      onClick={() => selectedPoloShirts.length < 1 && handleSelectProduct(product, 'polo')}
      className={`border p-4 rounded-lg cursor-pointer ${
        selectedPoloShirts.includes(product)
          ? 'border-indigo-500'
          : 'border-gray-200'
      } ${selectedPoloShirts.length >= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <img
        src={product.image || product.thumbnail}
        alt={product.description || 'Polo shirt'}
        className='w-full h-48 object-cover'
      />
      <h5 className='text-sm font-medium text-gray-900 mt-2'>
        {product.title || 'Polo Shirt'}
      </h5>
      <p className='text-sm text-gray-500'>
        {product.price ? `£${product.price}` : 'Price not available'}
      </p>
      {selectedPoloShirts.includes(product) && (
        <div className="mt-2 text-green-600 text-sm">Selected</div>
      )}
    </div>
  </div>
);

const ColorSelection = ({
  availableColors,
  selectedColors,
  isDropdownOpen,
  toggleDropdown,
  handleColorChange
}) => (
  <div className='mt-6'>
    <h3 className='text-lg font-medium text-gray-900'>
      Choose Colour(s)
    </h3>
    <div className='mt-2 relative'>
      <button
        onClick={toggleDropdown}
        className='w-full p-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between'
      >
        {selectedColors.length > 0 ? (
          <div className='flex flex-wrap items-center gap-2'>
            {selectedColors.map((color) => {
              const colorData = availableColors.find(c => c.color === color);
              return (
                <div key={color} className='flex items-center'>
                  {colorData?.image && (
                    <img
                      src={colorData.image}
                      alt={color}
                      className='w-6 h-6 rounded-full mr-1 object-cover'
                    />
                  )}
                  <div
                    className='w-4 h-4 rounded-full mr-1 border border-gray-300'
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{color}</span>
                </div>
              );
            })}
          </div>
        ) : (
          'Select a color'
        )}
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${
            isDropdownOpen ? 'transform rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M19 9l-7 7-7-7'
          ></path>
        </svg>
      </button>

      {isDropdownOpen && (
        <div className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          {availableColors.map((colorObj, index) => (
            <div
              key={colorObj.color || index}
              onClick={() => handleColorChange(colorObj.color)}
              className='p-2 hover:bg-gray-100 cursor-pointer flex items-center'
            >
              {colorObj.image && (
                <img
                  src={colorObj.image}
                  alt={colorObj.color}
                  className='w-6 h-6 rounded-full mr-2 object-cover'
                />
              )}
              <div
                className='w-4 h-4 rounded-full mr-2 border border-gray-300'
                style={{ backgroundColor: colorObj.color }}
              ></div>
              {colorObj.color}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const SizeSelection = ({
  color,
  selectedColorData,
  product,
  quantities,
  totalSizesSelected,
  handleQuantityChange
}) => (
  <div key={color} className='mt-4'>
    <h4 className='text-md font-medium text-gray-900'>
      Available Sizes for {color}
    </h4>
    <div className='mt-6 flex flex-col lg:flex-row lg:space-x-8'>
      <div className='w-full lg:w-1/3'>
        <img
          src={selectedColorData.image}
          alt={color}
          className='w-full h-48 lg:h-64 object-cover rounded-lg'
        />
      </div>

      <div className='w-full lg:w-2/3 mt-6 lg:mt-0'>
        <h3 className='text-lg font-medium text-gray-900'>
          Product Features
        </h3>
        <p className='text-md text-gray-500'>
          {product.description || 'Premium custom bundle'}
        </p>
      </div>
    </div>
    <div className='flex flex-col gap-2 mt-2'>
      {selectedColorData.sizes?.map((size, index) => (
        <div key={size || index} className='flex items-center gap-2'>
          <div className='px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700'>
            {size}
          </div>
          <button
            onClick={() => handleQuantityChange(size, -1, color)}
            className='px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700 disabled:opacity-50'
            disabled={(quantities[`${color}-${size}`] || 0) <= 0}
          >
            -
          </button>
          <span>{quantities[`${color}-${size}`] || 0}</span>
          <button
            onClick={() => handleQuantityChange(size, 1, color)}
            className='px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700 disabled:opacity-50'
            disabled={totalSizesSelected >= 3}
          >
            +
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ProductSection;