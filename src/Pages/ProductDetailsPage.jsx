import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaArrowLeft, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useToast } from '@/components/ui/use-toast';
import { addItem } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import Popup from "../components/shirtpopup";
import { getApiBaseUrl } from '../utils/config';

// Import brand logos
import kustomkit from '../assets/images/kustomkit.png';
import fruitOfTheLoom from '../assets/images/fruit_of_the_loom.png';
import gildan from '../assets/images/gildan.png';
import printerEssentials from '../assets/images/printer_essentials.png';
import result from '../assets/images/result.png';
import jobmanWorkwear from '../assets/images/jobman_workwear.png';
import jamesHarvest from '../assets/images/james_harvest.png';
import hiv from '../assets/images/hiv.jpg';
import beechfield from '../assets/images/beechfield.png';
import ucc from '../assets/images/ucc.png';

const BRANDS = [
  { name: "Kustom Kit", logo: kustomkit },
  { name: "Fruit of the Loom", logo: fruitOfTheLoom },
  { name: "Gildan", logo: gildan },
  { name: "Printer Essentials", logo: printerEssentials },
  { name: "Result", logo: result },
  { name: "Jobman Workwear", logo: jobmanWorkwear },
  { name: "James Harvest", logo: jamesHarvest },
  { name: "HI-VIS & PPE", logo: hiv },
  { name: "Beechfield", logo: beechfield },
  { name: "UCC (Ultimate Clothing Collection)", logo: ucc },
];

function isPant(product) {
  if (!product || !product.productType) return false;
  // If string: check for "pant" (case-insensitive)
  if (typeof product.productType === "string") {
    return product.productType.toLowerCase().includes("pant");
  }
  // If array: check for any entry containing "pant"
  if (Array.isArray(product.productType)) {
    return product.productType.some(pt => pt.toLowerCase().includes("pant"));
  }
  return false;
}

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sizeSelections, setSizeSelections] = useState([]); // Array of {size, quantity}
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  // const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [addedToCart, setAddedToCart] = useState(false); // Add this new state
  const [showCartActions, setShowCartActions] = useState(false); // Add this state

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/products/${id}`, {
        credentials: "include",
        method: "GET",
      });
      const data = await response.json();

      if (!data || !data.product) {
        toast({
          description: 'Failed to load product details',
          className: 'bg-red-500 text-white border-0',
        });
        return;
      }

      setProduct(data.product);
      setSelectedImage(data.product.frontImage || "https://via.placeholder.com/400");

      if (data.product.colors && data.product.colors.length > 0) {
        setSelectedColor(data.product.colors[0]);
      }
    } catch (error) {
      toast({
        description: 'Failed to load product details',
        className: 'bg-red-500 text-white border-0',
      });
    }
  };

  const handleAddSize = (size) => {
    // Check if size is already selected
    if (sizeSelections.some(item => item.size === size)) {
      return;
    }

    setSizeSelections([...sizeSelections, { size, quantity: 1 }]);
  };

  const handleRemoveSize = (sizeToRemove) => {
    setSizeSelections(sizeSelections.filter(item => item.size !== sizeToRemove));
  };

  const handleSizeQuantityChange = (size, newQuantity) => {
    setSizeSelections(sizeSelections.map(item =>
      item.size === size ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Validate selections
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        description: "Please select a color",
        className: 'bg-yellow-500 text-white border-0',
      });
      return;
    }

    if (sizeSelections.length === 0) {
      toast({
        description: "Please select at least one size",
        className: 'bg-yellow-500 text-white border-0',
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      // Add each size selection as a separate cart item
      for (const selection of sizeSelections) {
        dispatch(
          addItem({
            _id: `${product._id}-${selection.size}`,
            productId: product._id,
            image: selectedImage,
            title: `${product.title} (${selection.size})`,
            size: selection.size,
            color: selectedColor,
            quantity: selection.quantity,
            price: product.price,
          }),
        );

        const response = await fetch(`${getApiBaseUrl()}/cart/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: product._id,
            image: selectedImage,
            title: `${product.title} (${selection.size})`,
            size: selection.size,
            color: selectedColor,
            quantity: selection.quantity,
            price: product.price,
          }),
        });

        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to add to cart");
        }
      }

      toast({
        description: 'Products added to cart successfully!',
        className: 'bg-green-500 text-white border-0',
      });

      setAddedToCart(true); // Set addedToCart to true after successful addition

    } catch (error) {
      // ... (keep your existing error handling)
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleContinueShopping = () => {
    setAddedToCart(false);
    setShowCartActions(false)
    // Reset selections if needed
    setSizeSelections([]);
    setSelectedColor(product.colors?.[0] || "");
    setSelectedImage(product.frontImage || "https://via.placeholder.com/400");
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleAddLogoClick = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiBaseUrl()}/cart/addlogo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        if (!selectedColor || sizeSelections.length === 0) {
          let missingFields = [];
          if (!selectedColor) missingFields.push('color');
          if (sizeSelections.length === 0) missingFields.push('size');
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `Please select ${missingFields.join(' and ')}.`,
          });
          return;
        }

        setPopupVisible(true);
      } else {
        navigate('/login', { state: { from: window.location.pathname, openPopup: true } });
      }
    } catch (error) {
      navigate('/login', { state: { from: window.location.pathname, openPopup: true } });
    } finally {
      setLoading(false);
    }
  };

  // Reset handlers for popup
  const resetSelectedColor = () => setSelectedColor("");
  const resetSelectedSize = () => setSelectedSize("");

  const getBrandLogo = () => {
    if (!product || !product.brand) return null;
    if (isPant(product)) return null;
    const brand = BRANDS.find(b =>
      b.name.toLowerCase() === product.brand.toLowerCase()
    );
    return brand ? brand.logo : null;
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <FaArrowLeft className="mr-2" />
              Back to Products
            </button>
          </li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Brand logo if available and not pant */}
            {getBrandLogo() && (
              <div className="mb-4">
                <img
                  src={getBrandLogo()}
                  alt={`${product.brand} logo`}
                  className="h-14 object-contain"
                />
              </div>
            )}

            {/* Main Image */}
            <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-8">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-96 object-contain transition duration-300 ease-in-out hover:scale-105"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-3">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-md overflow-hidden border-2 transition-all duration-200 ${selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="py-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-2xl font-semibold text-gray-900">£{product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.discountPercentage && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Color Options */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColor(color);
                        if (product.colorImages?.[index]) {
                          setSelectedImage(product.colorImages[index]);
                        }
                      }}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    >

                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options - Only shown after color is selected */}
            {selectedColor && product.size?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Available Sizes</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.size.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddSize(size)}
                      disabled={sizeSelections.some(item => item.size === size)}
                      className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${sizeSelections.some(item => item.size === size) ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Selected Sizes with Quantities */}
                {sizeSelections.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Selected Sizes</h4>
                    {sizeSelections.map((selection, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="font-medium">{selection.size}</span>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <button
                              onClick={() => handleSizeQuantityChange(selection.size, selection.quantity - 1)}
                              className="p-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                              aria-label="Decrease quantity"
                            >
                              <FaMinus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="px-3 py-1 border-t border-b border-gray-300 bg-white text-center w-8">
                              {selection.quantity}
                            </span>
                            <button
                              onClick={() => handleSizeQuantityChange(selection.size, selection.quantity + 1)}
                              className="p-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                              aria-label="Increase quantity"
                            >
                              <FaPlus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveSize(selection.size)}
                            className="text-gray-500 hover:text-red-500"
                            aria-label="Remove size"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Replace the Add to Cart button section with this conditional rendering */}
            {addedToCart || showCartActions ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 px-8 py-3 bg-white text-gray-900 font-medium rounded-md border border-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleGoToCart}
                  className="flex-1 px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Go to Cart
                </button>
              </div>
            ) : (
              <>
                {/* Keep the existing ADD LOGO button */}
                {!isPant(product) && (
                  <button
                    onClick={handleAddLogoClick}
                    className="w-full mb-2 flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-white hover:text-black border border-black transition-colors"
                    disabled={loading || sizeSelections.length === 0 || !selectedColor}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>ADD LOGO</>
                    )}
                  </button>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || sizeSelections.length === 0 || !selectedColor}
                  className="w-full flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="mr-2" />
                      Add to Cart ({sizeSelections.reduce((total, item) => total + item.quantity, 0)} items)
                    </>
                  )}
                </button>
              </>
            )}


          </div>
        </div>
      </div>

      {/* Popup for ADD LOGO (reusing logic from TShirtSelector) */}
      {popupVisible && (
        <Popup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          selectedProduct={product}
          selectedSizes={sizeSelections} // Pass all size selections instead of single size
          selectedColor={selectedColor}
          selectedShirt={selectedImage}
          resetSelectedSizes={() => setSizeSelections([])} // New reset function
          resetSelectedColor={resetSelectedColor}
          onAddCart={(success) => {
            if (success) setShowCartActions(true);
          }}
        />
      )}

      {/* Size Chart Section */}
      {product.sizeChartImage && (
        <div id="size-chart" className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Size Guide</h2>
            <div className="overflow-x-auto">
              <img
                src={product.sizeChartImage}
                alt="Size Guide"
                className="w-full max-w-3xl mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;