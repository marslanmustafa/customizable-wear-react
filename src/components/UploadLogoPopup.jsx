import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const UploadLogoPopup = ({
  onBack,
  onClose,
  selectedProduct,
  selectedSizes, // Changed from selectedSize to selectedSizes (array)
  selectedPosition,
  selectedMethod,
  selectedColor,
  resetSelectedSizes, // Changed from resetSelectedSize
  resetSelectedColor,
  onSuccess,
}) => {
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [previousLogos, setPreviousLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartLogos, setCartLogos] = useState([]);
  const [showPreviousLogos, setShowPreviousLogos] = useState(false);
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth.user || {});
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreviousLogos = async () => {
      try {
        setUserId(id);

        if (!id) {
          toast({
            description: 'User ID is missing! Please login.',
            className: 'bg-red-500 text-white border-0',
          });
          return;
        }

        // Fetch logos from orders
        const ordersResponse = await fetch(`${apiUrl}/orders/order-user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const ordersData = await ordersResponse.json();
        let orderLogos = [];

        if (ordersResponse.ok && ordersData.orders) {
          ordersData.orders.forEach(order => {
            order.products.forEach(product => {
              if (product.logo && product.logo !== '') {
                orderLogos.push(product.logo);
              }
            });
          });
        }

        // Fetch logos from cart
        const cartResponse = await fetch(`${apiUrl}/cart/get-cart-product-logs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const cartData = await cartResponse.json();
        let uniqueCartLogos = [];

        if (cartResponse.ok && cartData.logos && cartData.logos.length > 0) {
          uniqueCartLogos = [...new Set(cartData.logos)];
        }

        // Combine and deduplicate all logos
        const allLogos = [...new Set([...orderLogos, ...uniqueCartLogos])];
        
        setPreviousLogos(allLogos);
        setCartLogos(uniqueCartLogos);

      } catch (error) {
        toast({
          description: 'Error fetching previous logos. Please try again.',
          className: 'bg-red-500 text-white border-0',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousLogos();
  }, [id, toast]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedLogo(null);
      setShowPreviousLogos(false);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewURL(null);
  };

  const handleSelectLogo = (logo) => {
    setSelectedLogo(logo);
    setSelectedFile(null);
    setPreviewURL(null);
    setShowPreviousLogos(false);
  };

  const calculatePrice = () => {
    const basePrice = selectedProduct?.price || 200;
    let logoPrice = 0;
    let priceDetails = [];
    
    if (selectedFile) {
      logoPrice = 20 + 5.5;
      priceDetails = [
        { label: 'Base Product Price', amount: basePrice },
        { label: 'Logo Template', amount: 20 },
        { label: 'Logo Embroidery/Print', amount: 5.5 }
      ];
    } else if (selectedLogo) {
      logoPrice = 5.5;
      priceDetails = [
        { label: 'Base Product Price', amount: basePrice },
        { label: 'Logo Embroidery/Print', amount: 5.5 }
      ];
    } else {
      return {
        total: basePrice,
        details: [{ label: 'Base Product Price', amount: basePrice }]
      };
    }
    
    return {
      total: basePrice + logoPrice,
      details: priceDetails
    };
  };

  const { total, details } = calculatePrice();

  const togglePreviousLogos = () => {
    setShowPreviousLogos(!showPreviousLogos);
    if (!showPreviousLogos) {
      setSelectedFile(null);
      setPreviewURL(null);
    }
  };

const handleFinish = async () => {
  if (!selectedFile && !selectedLogo) {
    toast({
      description: 'Please upload a logo or select a previous logo before finishing.',
      className: 'bg-red-500 text-white border-0',
    });
    return;
  }

  if (!selectedSizes?.length) {
    toast({
      description: 'Please select at least one size before finishing.',
      className: 'bg-red-500 text-white border-0',
    });
    return;
  }

  try {
    setLoading(true);

    let logoUrl = selectedLogo; 
    let isFirstItem = true;

    for (const sizeSelection of selectedSizes) {
      const formData = new FormData();
      formData.append('productId', selectedProduct._id);
      formData.append('title', `${selectedProduct?.title || 'Custom T-Shirt'} (${sizeSelection.size})`);
      formData.append('size', sizeSelection.size);
      formData.append('color', selectedColor);
      formData.append('quantity', sizeSelection.quantity || 1);

      // Calculate price based on logo type
      const logoPrice = isFirstItem && selectedFile ? 25.5 : 5.5;
      const itemPrice = (selectedProduct?.price || 200) + logoPrice;
      formData.append('price', itemPrice);

      if (selectedFile && isFirstItem) {
        formData.append('logo', selectedFile);
        formData.append('usePreviousLogo', 'false');
      } else if (selectedFile && !isFirstItem) {
        formData.append('logo', logoUrl);
        formData.append('usePreviousLogo', 'true');
      } else if (selectedLogo) {
        formData.append('logo', selectedLogo);
        formData.append('usePreviousLogo', 'true');
      }

      formData.append('method', selectedMethod);
      formData.append('position', selectedPosition);

      // Send request and parse response only ONCE
      const response = await fetch(`${apiUrl}/cart/`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to add size ${sizeSelection.size} to cart`);
      }

      if (selectedFile && isFirstItem) {
        logoUrl = data.logoUrl || (data.cartItem && data.cartItem.logo) || logoUrl;
      }

      dispatch(
        addItem({
          _id: `${selectedProduct._id}-${sizeSelection.size}`,
          productId: selectedProduct._id,
          title: `${selectedProduct?.title || 'Custom T-Shirt'} (${sizeSelection.size})`,
          size: sizeSelection.size,
          color: selectedColor,
          quantity: sizeSelection.quantity || 1,
          price: itemPrice,
          usePreviousLogo: !isFirstItem || !!selectedLogo,
          logo: logoUrl,
        })
      );

      isFirstItem = false;
    }

    toast({
      title: 'Success!',
      description: `${selectedSizes.length} items successfully added to cart!`,
      variant: 'success',
      className: 'bg-green-500 text-white border-0',
    });
    onSuccess(true);
    onClose();
    resetSelectedColor();
    resetSelectedSizes();
  } catch (error) {
    toast({
      description: error.message || 'An error occurred while adding to the cart.',
      className: 'bg-red-500 text-white border-0',
    });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Upload Your Logo</h2>
            <p className="text-sm text-gray-500 mt-1">{selectedProduct?.title}</p>
            
            {/* Display selected sizes */}
            {selectedSizes?.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Applying to:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSizes.map((size, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {size.size} (Qty: {size.quantity})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close popup"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="bg-black text-white py-2 px-6 rounded-md hover:bg-orange-600 flex items-center justify-center mx-auto mb-3">
                Upload New Logo
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".jpg,.png,.eps,.ai,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Logo Preview */}
            {(previewURL || selectedLogo) && (
              <div className="text-center">
                <img 
                  src={previewURL || selectedLogo} 
                  alt={selectedFile ? "Uploaded Logo" : "Selected Logo"} 
                  className="w-32 h-auto mx-auto border rounded-md"
                />
                <div className="mt-2">
                  {selectedFile ? (
                    <p className="text-red-500 text-sm">
                      Logo Template: £20 + Embroidery/Print: £5.5
                    </p>
                  ) : (
                    <p className="text-green-600 text-sm">
                      Logo Embroidery/Print: £5.5
                    </p>
                  )}
                  <button 
                    onClick={selectedFile ? handleRemoveFile : () => setSelectedLogo(null)}
                    className="text-xs text-gray-400 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price: £{total.toFixed(2)}</span>
              </div>
              <div className="mt-2 space-y-1">
                {details.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.label}:</span>
                    <span>£{item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Logos Section */}
            {previousLogos.length > 0 && (
              <>
                <button
                  onClick={togglePreviousLogos}
                  className={`w-full py-2 px-4 rounded-md ${
                    showPreviousLogos ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'
                  } hover:bg-orange-600 hover:text-white transition-colors`}
                  disabled={!!selectedFile}
                >
                  {showPreviousLogos ? 'Hide Previous Logos' : 'Use Previous Logo'}
                </button>

                {showPreviousLogos && (
                  <div className="mt-4">
                    <h3 className="font-medium text-center mb-2">Select from your previous logos:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previousLogos.map((logo, index) => (
                        <div 
                          key={index} 
                          className={`cursor-pointer border-2 ${
                            selectedLogo === logo ? 'border-orange-500' : 'border-gray-200'
                          } hover:border-orange-300 transition-colors`}
                          onClick={() => handleSelectLogo(logo)}
                        >
                          <img 
                            src={logo} 
                            alt={`Previous Logo ${index + 1}`} 
                            className="w-full h-24 object-contain p-1"
                          />
                          <p className="text-xs text-center mt-1 text-green-600">
                            Logo Embroidery/Print: £5.5
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 rounded-b-xl flex justify-between">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={handleFinish}
            disabled={loading}
            className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
            aria-busy={loading}
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding {selectedSizes?.length || 0} items...
              </span>
            ) : `Add ${selectedSizes?.length || 0} Items`}
          </button>
        </div>
      </div>
    </div>
  );
};

UploadLogoPopup.propTypes = {
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedProduct: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    frontImage: PropTypes.string,
  }),
  selectedSizes: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  selectedPosition: PropTypes.string,
  selectedMethod: PropTypes.string,
  selectedColor: PropTypes.string,
  resetSelectedSizes: PropTypes.func.isRequired,
  resetSelectedColor: PropTypes.func.isRequired,
};

export default UploadLogoPopup;