import React from 'react';
import { FaPlus, FaMinus, FaCheck, FaTimes } from 'react-icons/fa';

const BundleProductSection = ({
  title,
  product,
  selectedPoloShirts,
  selectedColors,
  isDropdownOpen,
  isPoloShirtsOpen,
  quantities,
  totalSelectedSizes,
  requiredQuantity,
  handleSelectProduct,
  handleColorChange,
  handleQuantityChange,
  toggleDropdown,
  togglePoloShirtsSection,
  sectionNumber,
  calculateTotalSizes,
  bundleType,
}) => {
  if (!product) return null;
  const availableColors = product?.colors || [];

  const getMaxColors = () => {
    if (bundleType?.toLowerCase() === 'everyday') {
      return sectionNumber === 1 ? 5 : 
             sectionNumber === 2 ? 3 : 
             2;
    } else {
      return sectionNumber === 1 ? 3 : 
             sectionNumber === 2 ? 2 : 
             1;
    }
  };

  const getMaxQuantity = () => {
    if (bundleType?.toLowerCase() === 'everyday') {
      return sectionNumber === 1 ? 5 : 
             sectionNumber === 2 ? 3 : 
             2;
    } else {
      return sectionNumber === 1 ? 3 : 
             sectionNumber === 2 ? 2 : 
             1;
    }
  };
  
  const maxColors = getMaxColors();
  const maxQuantity = getMaxQuantity(sectionNumber);
  const totalSizesSelected = calculateTotalSizes(quantities);

  // Check if a color has at least one quantity selected
  const colorHasQuantity = (color) => {
    return Object.keys(quantities).some(key => 
      key.startsWith(`${color}-`) && quantities[key] > 0
    );
  };

  // Check if all selected colors have quantities
  const allColorsHaveQuantities = () => {
    return selectedColors.every(color => colorHasQuantity(color));
  };

  // Get colors without quantities
  const getColorsWithoutQuantities = () => {
    return selectedColors.filter(color => !colorHasQuantity(color));
  };

  // Function to handle color deselection
  const handleDeselectColor = (color, e) => {
    e.stopPropagation();
    // Only allow deselect if no quantities are selected
    if (!colorHasQuantity(color)) {
      handleColorChange(color, sectionNumber);
    }
  };

  // Function to handle quantity change with validation
  const handleQuantityChangeWithValidation = (size, change, color) => {
    // Check if this would leave any color without quantities
    const currentColorHasQty = colorHasQuantity(color);
    const willHaveQty = (quantities[`${color}-${size}`] || 0) + change > 0;
    
    // If removing the last quantity from a color when other colors have no quantities
    if (currentColorHasQty && !willHaveQty && selectedColors.length > 1) {
      const otherColorsWithoutQuantities = selectedColors.filter(c => c !== color && !colorHasQuantity(c));
      if (otherColorsWithoutQuantities.length > 0) {
        // Show error or prevent action
        return;
      }
    }
    
    handleQuantityChange(size, change, color);
  };

  return (
    <div className='mb-8 relative z-50'>
      {/* Main accordion button */}
      <button
        onClick={togglePoloShirtsSection}
        className={`w-full text-left flex justify-between items-center p-4 bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm ${isPoloShirtsOpen ? 'rounded-b-none border-b-0 shadow-sm' : 'shadow-xs'
          }`}>
        <div className='flex items-center'>
          <div className='bg-blue-100 text-blue-600 w-20 h-26 rounded-full flex items-center justify-center mr-3'>
            <img src={product?.image} />
          </div>
          <h3 className='text-lg font-semibold text-gray-800'>
            {product?.title || `${title} (Product ${sectionNumber})`}
          </h3>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-8 h-10 rounded-full bg-[#091638] hover:bg-[#091638] text-white text-md font-bold'>
            {totalSizesSelected}
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isPoloShirtsOpen ? 'transform rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isPoloShirtsOpen && product && (
        <div className='bg-white border border-gray-200 border-t-0 rounded-b-lg p-4 shadow-sm'>
          {/* Product selection card */}
          <div className='mb-6'>
            <div
              className={`relative p-4 border rounded-lg transition-all duration-200 ${selectedPoloShirts.includes(product)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => handleSelectProduct(product)}>
              {selectedPoloShirts.includes(product) && (
                <div className='absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full'>
                  <FaCheck className='w-3 h-3' />
                </div>
              )}
              <img
                src={product.image || product.thumbnail}
                alt={product.description || 'Polo shirt'}
                className='w-full h-48 object-contain rounded-md mb-3'
              />
              <div className='flex justify-between items-start'>
                <div>
                  <h5 className='text-base font-semibold text-gray-900'>{product.title || 'Polo Shirt'}</h5>
                  <p className='text-sm text-gray-500'>{product.description?.substring(0, 50)}...</p>
                </div>
                <p className='text-base font-medium text-blue-600'>
                  {product.price ? `£${product.price}` : 'Price not available'}
                </p>
              </div>
            </div>
          </div>

          {/* Color selection */}
          <div className='mb-6'>
            <div className='flex items-center justify-between border-t border-gray-200 py-4 px-2'>
              <h2 className='text-xl font-bold text-gray-700'>
                Choose Colour<span className='font-bold text-gray-700'>(s)</span>
              </h2>
              <div className='text-right leading-tight'>
                <p className='font-bold underline text-black'>{product?.colors?.length} colours</p>
                <p className='font-bold underline text-black'>Available</p>
              </div>
            </div>

            <div className='relative'>
              <button
                onClick={toggleDropdown}
                className={`w-full p-3 border rounded-lg bg-white text-left flex items-center justify-between transition-colors ${isDropdownOpen ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                <div className='flex flex-wrap items-center gap-2'>
                  {selectedColors.length > 0 ? (
                    selectedColors.map((color) => {
                      const colorData = availableColors.find((c) => c.color === color);
                      const hasQty = colorHasQuantity(color);
                      return (
                        <div key={color} className={`flex items-center rounded-full px-3 py-1 relative group ${hasQty ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
                          {colorData?.image && (
                            <img src={colorData.image} alt={color} className='w-5 h-5 rounded-full mr-2 object-cover' />
                          )}
                          <span className='text-sm font-medium'>{color}</span>
                          {!hasQty && (
                            <button 
                              onClick={(e) => handleDeselectColor(color, e)}
                              className='ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500'
                            >
                              <FaTimes className='w-3 h-3' />
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <span className='text-gray-400'>Select a color</span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                  {availableColors.map((colorObj, index) => {
                    const isSelected = selectedColors.includes(colorObj.color);
                    const maxColorsReached = selectedColors.length >= maxColors;

                    return (
                      <div
                        key={colorObj.color || index}
                        onClick={() => {
                          if (!isSelected && !maxColorsReached) {
                            handleColorChange(colorObj.color, sectionNumber);
                          }
                        }}
                        className={`p-2 cursor-pointer flex items-center justify-between ${isSelected ? 
                            colorHasQuantity(colorObj.color) ? 'bg-orange-500 text-white' : 'bg-orange-300 text-white' :
                            maxColorsReached ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                              'hover:bg-gray-100'
                          }`}
                      >
                        <div className='flex items-center'>
                          <div className='w-4 h-4 rounded-full mr-3 border' style={{ backgroundColor: colorObj.color }} />
                          <span className='text-sm font-medium'>{colorObj.color}</span>
                        </div>
                        {isSelected && colorHasQuantity(colorObj.color) && (
                          <span className="text-xs bg-white text-orange-500 px-2 py-1 rounded">
                            Quantities selected
                          </span>
                        )}
                        {maxColorsReached && !isSelected && (
                          <span className="ml-2 text-xs">Max {maxColors} colors</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Validation message */}
            {selectedColors.length > 1 && !allColorsHaveQuantities() && (
              <div className="mt-2 text-sm text-red-500">
                Please add at least one quantity for each selected color before proceeding. 
                Missing quantities for: {getColorsWithoutQuantities().join(', ')}
              </div>
            )}
          </div>

          {/* Size selection for each color */}
          {selectedColors.map((color) => {
            const selectedColorData = availableColors.find(c => c.color === color);
            const totalSelectedForColor = Object.entries(quantities)
              .filter(([key]) => key.startsWith(`${color}-`))
              .reduce((sum, [_, qty]) => sum + qty, 0);

            const remainingQuantity = Math.max(0, maxQuantity - totalSizesSelected);
            const colorRemainingQuantity = Math.max(0, maxQuantity - totalSelectedForColor);

            return (
              <div key={color} className="mb-6">
                {/* Color header with image */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                      style={{ backgroundColor: color }}
                    />
                    <h4 className="text-md font-semibold text-gray-900">
                      {color} ({totalSelectedForColor} selected)
                    </h4>
                  </div>
                  {!colorHasQuantity(color) && selectedColors.length > 1 && (
                    <span className="text-sm text-red-500">
                      Please add at least one quantity
                    </span>
                  )}
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                {/* Color image and features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-xs">
                    <img
                      src={selectedColorData?.image}
                      alt={color}
                      className="w-full h-48 object-contain p-4"
                    />
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-2">
                      Available Sizes for {color}
                    </h3>
                    {remainingQuantity > 0 && (
                      <p className="text-sm text-blue-600 mb-2">
                        You can add {remainingQuantity} more item{remainingQuantity !== 1 ? 's' : ''} total
                      </p>
                    )}
                  </div>
                </div>

                {/* Size selection */}
                <div className="space-y-3">
                  {selectedColorData?.sizes?.map((sizeObj) => {
                    const size = sizeObj.size || sizeObj;
                    const stock = sizeObj.stock || 99;
                    const quantity = quantities[`${color}-${size}`] || 0;
                    const canAddMore = totalSizesSelected < maxQuantity &&
                      quantity < stock &&
                      colorRemainingQuantity > 0;

                    return (
                      <div
                        key={`${color}-${size}`}
                        className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-md shadow-sm"
                      >
                        <div className="flex items-center">
                          <span className="font-bold text-lg text-gray-800 mr-2">{size}</span>
                          {stock < 10 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Only {stock} left
                            </span>
                          )}
                        </div>

                        <div className="flex items-center bg-white rounded-lg shadow-inner px-1 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChangeWithValidation(size, -1, color);
                            }}
                            disabled={quantity <= 0}
                            className={`px-3 py-1 rounded-l-md transition-colors ${quantity <= 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            <FaMinus size={14} />
                          </button>

                          <span className="w-8 text-center font-medium text-gray-900">
                            {quantity}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(size, 1, color);
                            }}
                            disabled={!canAddMore}
                            className={`px-3 py-1 rounded-r-md transition-colors ${!canAddMore
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedColorData?.sizes?.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No sizes available for this color
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BundleProductSection;