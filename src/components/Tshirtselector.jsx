import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import SizeSelection from './SizeSelection';
import Popup from './shirtpopup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const SizeChartDisplay = ({ chartImage }) => {
  if (!chartImage) return null;

  return (
    <div className='mt-8 p-4 bg-white rounded-lg shadow-sm'>
      <h3 className='text-lg font-bold mb-4'>Size Chart</h3>
      <img
        src={chartImage}
        alt='Product Size Chart'
        className='w-full max-w-2xl mx-auto'
        onError={(e) => {
          e.target.style.display = 'none';
          console.error('Size chart image failed to load');
        }}
      />
    </div>
  );
};

const TShirtSelector = () => {
  const [selectedShirt, setSelectedShirt] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [sizeSelections, setSizeSelections] = useState([]); // Changed from selectedSize to array
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sizeChartImage, setChartImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState([]);


  // Handle Shirt View Change
  const handleShirtChange = (shirt) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedShirt(shirt);
      setIsAnimating(false);
    }, 300);
  };

  // Reset functions
  const resetSelectedColor = () => setSelectedColor(null);
  const resetSelectedSizes = () => setSizeSelections([]);

  // Handle Product Selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedShirt(product.frontImage);
    setSizeSelections([]);
    setSelectedColor(null);
    setChartImage(product.sizeChartImage);
  };

  const handleSizeSelect = (sizeObj) => {
  setSelectedSizes([...selectedSizes, sizeObj]);
};

const handleRemoveSize = (sizeToRemove) => {
  setSelectedSizes(selectedSizes.filter(s => s.size !== sizeToRemove));
};

const handleQuantityChange = (size, newQuantity) => {
  setSelectedSizes(
    selectedSizes.map(item => 
      item.size === size ? { ...item, quantity: newQuantity } : item
    )
  );
};

  // Handle Color Selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const colorIndex = selectedProduct.colors.indexOf(color);
    if (colorIndex !== -1 && selectedProduct.colorImages[colorIndex]) {
      setSelectedShirt(selectedProduct.colorImages[colorIndex]);
    } else {
      setSelectedShirt(selectedProduct.frontImage);
    }
  };

  // Handle Adding to Cart
  const handleAddToCart = async () => {
    if (!selectedProduct) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a product first.',
      });
      return;
    }

    if (sizeSelections.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one size.',
      });
      return;
    }

    if (!selectedColor) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a color.',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Process each size selection
      for (const sizeSelection of sizeSelections) {
        const productToAdd = {
          productId: selectedProduct._id,
          image: selectedShirt || selectedProduct.frontImage,
          title: `${selectedProduct.title} (${sizeSelection.size})`,
          size: sizeSelection.size,
          color: selectedColor,
          finalQuantity: sizeSelection.quantity || 1,
          price: selectedProduct.price,
        };

        const response = await fetch(`${apiUrl}/cart/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(productToAdd),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to add size ${sizeSelection.size} to cart`);
        }

        dispatch(addItem({
          ...productToAdd,
          _id: `${selectedProduct._id}-${sizeSelection.size}` // Unique ID for each size
        }));
      }

      toast({
        title: 'Added to Cart',
        description: `${sizeSelections.length} items have been added to the cart.`,
        className: 'bg-green-500 text-white border-0',
        variant: 'success',
      });

    } catch (error) {
      if (error.message.includes('Unauthorized') || error.message.includes('login')) {
        toast({
          title: 'Login Required',
          description: 'Please login to add items to your cart.',
          variant: 'destructive',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'An error occurred while adding to the cart.',
        });
      }
    } finally {
      setLoading(false);
      resetSelectedColor();
      resetSelectedSizes();
    }
  };

  const handleAddLogoClick = async () => {
  // Client-side validation first
  if (!selectedColor) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Please select a color.',
    });
    return;
  }

  if (selectedSizes.length === 0) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Please select at least one size.',
    });
    return;
  }

  try {
    setLoading(true);
    
    // Check if user is authenticated
    const response = await fetch(`${apiUrl}/auth/check`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      // User is authenticated - show popup
      setPopupVisible(true);
    } else {
      // User not authenticated - redirect to login
      navigate('/login', { 
        state: { 
          from: location.pathname, 
          openPopup: true,
          productData: {
            selectedProduct,
            selectedSizes,
            selectedColor,
            selectedShirt
          }
        } 
      });
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    navigate('/login', { 
      state: { 
        from: location.pathname, 
        openPopup: true,
        productData: {
          selectedProduct,
          selectedSizes,
          selectedColor,
          selectedShirt
        }
      } 
    });
  } finally {
    setLoading(false);
  }
};

  // Fetch Products on Component Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/`, {
          credentials: 'include',
          method: 'GET',
        });
        const data = await response.json();

        if (data.products && data.products.length > 0) {
          const allowedCategories = ['t-shirt', 'sweatshirt', 'polo'];
          const filteredProducts = data.products.filter(
            (product) =>
              product.productType && allowedCategories.some((category) => product.productType.includes(category)),
          );

          setProducts(filteredProducts);

          if (filteredProducts.length > 0) {
            setSelectedProduct(filteredProducts[0]);
            setSelectedShirt(filteredProducts[0].frontImage);
            setChartImage(filteredProducts[0].sizeChartImage);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const { openPopup } = location.state || { openPopup: false };
    if (openPopup) {
      setPopupVisible(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className='container mx-auto pt-3'>
      <div className='flex flex-col md:flex-row'>
        {/* Shirt Display Area */}
        <div className='w-full mt-0 md:mt-4 md:w-3/5 flex justify-center items-center p-2'>
          {selectedShirt && (
            <div className='p-0 md:p-5 w-full h-[450px] md:h-[620px] md:w-[600px] rounded-xl'>
              <img
                src={selectedShirt}
                alt='Selected T-Shirt'
                className={`rounded-md object-contain h-full w-full transform transition-transform duration-200 ${
                  isAnimating ? 'scale-75 opacity-50' : 'scale-100 opacity-100'
                }`}
              />
            </div>
          )}
        </div>

        {/* Product & Selection Controls */}
        <div className='w-full md:w-2/5 h-auto md:px-5 py-4'>
          {/* Select Product */}
          <div className='my-4 p-0 md:p-5 rounded-md'>
            <div className='ml-7 font-medium text-lg text-start md:text-left'>Shirts</div>
            <div className='overflow-x-auto ml-6 flex gap-x-1 mt-4 p-2'>
              {products.map((product, index) => (
                <div key={index} className='text-center'>
                  <img
                    src={product.frontImage}
                    alt={`Front View ${index + 1}`}
                    className={`w-24 h-24 object-cover rounded-md cursor-pointer border-[2px] border-gray-300 hover:border-[#091638] ${
                      selectedProduct === product ? 'border-[#091638]' : ''
                    }`}
                    onClick={() => handleProductSelect(product)}
                  />
                </div>
              ))}
            </div>

            {/* Select Color */}
            <div className='mt-3 ml-7 font-medium text-lg text-start md:text-left'>Select Color</div>
            <div className='ml-7 grid grid-cols-7 sm:grid-cols-5 w-[55%] sm:w-1/4 md:w-1/2 lg:w-2/6 md:gap-x-2 lg:gap-x-1 gap-y-1'>
              {selectedProduct?.colors?.map((color, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 md:w-5 md:h-5 rounded-full border border-gray-300 cursor-pointer ${
                    selectedColor === color
                      ? 'border-[#091638] outline outline-1 md:outline-2'
                      : 'hover:border-[#091638]'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>

            {/* Shirt Details */}
            <div className='mt-3 ml-7'>
              <h3 className='text-lg font-bold mb-2'>Shirt Details</h3>
              <p className='text-sm text-gray-700'>{selectedProduct?.description || 'No description available.'}</p>
              <p className='text-sm font-bold mt-2'>Price: £{selectedProduct?.price}</p>
            </div>

            {/* Size Selection - Updated to handle multiple sizes */}
            <SizeSelection
  selectedProduct={selectedProduct}
  onSizeSelect={handleSizeSelect}
  selectedSizes={selectedSizes}
  onRemoveSize={handleRemoveSize}
  onQuantityChange={handleQuantityChange}
/>

            {/* Display selected sizes */}
            {sizeSelections.length > 0 && (
              <div className="mt-4 ml-7">
                <h4 className="text-sm font-medium">Selected Sizes:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizeSelections.map((selection, index) => (
                    <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {selection.size} (Qty: {selection.quantity || 1})
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='flex flex-col md:flex-col lg:flex-row md:items-start lg:items-center gap-2 mt-4'>
              <button
                onClick={handleAddLogoClick}
                className='bg-black text-white mx-2 md:mx-0 md:w-36 py-3 px-2 md:px-4 md:py-2 md:text-md border-[1px] border-black font-semibold rounded-full hover:bg-white hover:text-black'
                disabled={!selectedColor || sizeSelections.length === 0}
              >
                ADD LOGO
              </button>
              <button
                onClick={handleAddToCart}
                className='bg-transparent text-black mx-2 md:mx-0 md:w-36 py-3 px-1 md:px-4 md:py-2 md:text-md border-[1px] border-black font-semibold rounded-full hover:bg-black hover:text-white'
                disabled={!selectedColor || sizeSelections.length === 0 || loading}
              >
                {loading ? 'Adding...' : `ADD TO CART `}
              </button>
            </div>
          </div>
        </div>

        {/* Popup */}
        {popupVisible && (
          <Popup
            visible={popupVisible}
            onClose={() => setPopupVisible(false)}
            selectedProduct={selectedProduct}
            selectedSizes={sizeSelections}
            selectedColor={selectedColor}
            selectedShirt={selectedShirt}
            resetSelectedSizes={resetSelectedSizes}
            resetSelectedColor={resetSelectedColor}
          />
        )}
      </div>
      <SizeChartDisplay chartImage={sizeChartImage} />
    </div>
  );
};

export default TShirtSelector;