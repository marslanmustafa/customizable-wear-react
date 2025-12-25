import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

const SizeSelection = ({ 
  selectedProduct, 
  onSizeSelect, 
  selectedSizes,  // Changed from selectedSize to handle multiple sizes
  onRemoveSize,
  onQuantityChange 
}) => {
  const [sizes, setSizes] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();

  // Fetch the sizes data when the component is mounted
  useEffect(() => {
    if (selectedProduct) {
      const fetchProductSizes = async () => {
        try {
          const response = await fetch(`${apiUrl}/products/${selectedProduct._id}`);
          const data = await response.json();

          if (data.success && data.product) {
            setSizes(
              data.product.size.map((size) => ({
                size,
                stock: 100, // Modify as per your backend data
              })),
            );
          }
        } catch (error) {
          console.error('Error fetching sizes:', error);
        }
      };

      fetchProductSizes();
    }
  }, [selectedProduct]);

  // Handle size selection with quantity
  const handleSizeClick = (size) => {
    const sizeDetails = sizes.find((s) => s.size === size);
    if (!sizeDetails || sizeDetails.stock <= 0) return;

    // Check if size is already selected
    const isAlreadySelected = selectedSizes.some(s => s.size === size);
    
    if (isAlreadySelected) {
      onRemoveSize(size);
    } else {
      // Add size with default quantity 1
      onSizeSelect({ ...sizeDetails, quantity: 1 });
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 md:mb-5'>
      <div className='text-xl font-semibold mb-4'>Select Size</div>

      {/* Size Buttons Grid with Quantity Controls */}
      <div>
        {sizes.map((size) => {
          const isSelected = selectedSizes.some(s => s.size === size.size);
          const isAvailable = size.stock > 0;
          const selectedSizeObj = selectedSizes.find(s => s.size === size.size);

          return (
            <div key={size.size} className="flex items-center gap-2 my-4">
              <button
                className={`py-2 px-4 rounded-lg border-2 ${
                  isSelected
                    ? 'bg-transparent text-black border-black'
                    : isAvailable
                    ? 'hover:transparent hover:text-black hover:border-black border-gray-300'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200'
                }`}
                onClick={() => handleSizeClick(size.size)}
                disabled={!isAvailable}
              >
                {size.size}
              </button>

              {/* Quantity controls (only shown if size is selected) */}
              {isSelected && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuantityChange(size.size, Math.max(1, selectedSizeObj.quantity - 1));
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="mx-1">{selectedSizeObj.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuantityChange(size.size, selectedSizeObj.quantity + 1);
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelection;