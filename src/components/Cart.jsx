import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCart, increaseQuantity, decreaseQuantity, removeItem } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import img from '../assets/images/empty-cart.png';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { RiDeleteBin4Line } from 'react-icons/ri';
import { BiCheckShield } from 'react-icons/bi';
import { useToast } from '@/components/ui/use-toast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Cart = () => {
  const cart = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [shippingCost, setShippingCost] = useState(4.95); // Default shipping cost
  const totalAmount = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${apiUrl}/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        dispatch(setCart(data.cart || []));
      } catch (error) {
        toast({
          title: 'Login Required',
          description: 'Please login to add items to your cart.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    let cost = 0;
    switch (selectedShipping) {
      case 'standard':
        cost = totalAmount >= 100 ? 0 : 4.95;
        break;
      case 'expedited':
        cost = 6.95;
        break;
      case 'international':
        cost = 9.95;
        break;
      default:
        cost = 4.95;
    }
    setShippingCost(cost);

    fetchCartData();
  }, [dispatch, navigate, toast, selectedShipping, totalAmount]);

  const handleIncrease = async (item) => {
    try {
      const response = await fetch(`${apiUrl}/cart/increase/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const updatedCartItem = await response.json();
      dispatch(increaseQuantity(updatedCartItem?.updatedCart?._id || item._id));
    } catch (error) {
      dispatch(decreaseQuantity(item._id));
    }
  };

  const handleDecrease = async (item) => {
    try {
      const response = await fetch(`${apiUrl}/cart/decrease/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      dispatch(decreaseQuantity(item._id));
    } catch (error) {
      dispatch(increaseQuantity(item._id));
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      dispatch(removeItem(data?.deletedProduct?._id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const renderColorSizeOptions = (sizesByColor) => {
    return Object.entries(sizesByColor).map(([color, sizes]) => (
      <div key={color} className="mb-2">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
          <span className="text-sm font-medium">{color}</span>
        </div>
        <div className="ml-5 mt-1">
          {sizes.map((sizeItem, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>Size: {sizeItem.size}</span>
              <span className="font-semibold">Qty: {sizeItem.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading cart...</p>;
  }

  if (!Array.isArray(cart)) {
    return <p className="text-center text-gray-500">Error loading cart.</p>;
  }

  // Logo Charges
  let logoEmbroideryTotal = 0;
  let newLogoSetupTotal = 0;

  cart.forEach(item => {
    if (item.logo) {
      if (item.usePreviousLogo) {
        // Previous logo - only embroidery charge (use 5.5 as per popup)
        logoEmbroideryTotal += 5.5 * (item.quantity || 1);
      } else {
        // New logo - both setup and embroidery charges
        newLogoSetupTotal += 20 * (item.quantity || 1);
        logoEmbroideryTotal += 5.5 * (item.quantity || 1);
      }
    }
  });

  const handleCheckout = () => {
    navigate('/checkout', { 
    state: { 
      shippingType: selectedShipping,
      shippingCost: shippingCost 
    } 
  });
  };

  return (
    <div className="mx-auto my-8 container min-h-96 px-6 md:px-2 lg:px-8 pt-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-2 flex flex-col">
          {cart.length === 0 ? (
            <div className="text-center">
              <img src={img} alt="emptycart" className="w-96 mx-auto" />
              <p className="text-gray-500 mt-4">Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item, index) => {
              const itemTotal = (item.price || 0) * (item.quantity || 1);
              const hasLogo = item.logo && item.logo !== '';
              // --- FIX: Determine logoTypeLabel for bundle logo section
              let logoTypeLabel = '';
              if (item.usePreviousLogo) {
                logoTypeLabel = 'Previous Logo';
              } else if (hasLogo) {
                logoTypeLabel = 'New Logo';
              }

              return (
                <div key={item._id || index}>
                  <div className="cart-item flex items-center m-2 bg-white shadow-md rounded-md p-4">
                    <div className="m-3 w-20 rounded-md">
                      <img
                        src={item.frontImage || item.thumbnail || 'default-image.jpg'}
                        alt={item.title}
                        className="object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = 'default-image.jpg';
                        }}
                      />
                    </div>
                    <div className="my-2 flex justify-between items-center w-full h-full">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg font-bold">{item.title}</h2>
                          <div className="text-right">
                            <p className="text-lg font-bold">£ {itemTotal.toFixed(2)}</p>
                            {hasLogo && (
                              <p className="text-xs text-gray-500">
                                Includes {item.usePreviousLogo ? 'Previous Logo' : 'New Logo'} (£{item.usePreviousLogo ? 5.5 : 20})
                              </p>
                            )}
                          </div>
                        </div>
                        {item.isBundle ? (
                          <div className="mt-3">
                            {item.textLine && (
                              <div className="mb-3 p-3 bg-gray-50 rounded-md border border-blue-100">
                                <p className="font-medium text-sm">
                                  Custom Text: <span className="font-normal">{item.textLine}</span>
                                </p>
                                <p className="font-medium text-sm">
                                  Font: <span className="font-normal">{item.font}</span>
                                </p>
                              </div>
                            )}
                            {item.notes && (
                              <div className="mb-3 p-3 bg-gray-50 rounded-md border border-blue-100">
                                <p className="font-medium text-sm">
                                  Notes: <span className="font-normal">{item.notes}</span>
                                </p>
                              </div>
                            )}
                            <div className="space-y-3">
                              {item.bundleProducts?.map((product, idx) => (
                                <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                  <div className="flex items-start">
                                    {product.frontImage && (
                                      <img
                                        src={product.frontImage}
                                        alt={product.title || product.name}
                                        className="w-16 h-16 object-cover rounded-md mr-3"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm mb-2">{product.title || product.name}</h4>
                                      {product.sizesByColor && (
                                        <div className="mb-2">
                                          <h5 className="text-xs font-semibold text-gray-500 mb-1">Selected Options:</h5>
                                          {renderColorSizeOptions(product.sizesByColor)}
                                        </div>
                                      )}
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <span className="font-semibold text-gray-500">Method:</span>
                                          <span className="ml-1 capitalize">{product.method}</span>
                                        </div>
                                        <div>
                                          <span className="font-semibold text-gray-500">Position:</span>
                                          <span className="ml-1">{product.position}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Always show logo for bundle if present */}
                            {item.logo && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <div className="flex items-center">
                                  <img
                                    src={item.logo}
                                    alt="Bundle Logo"
                                    className="w-12 h-12 object-cover border border-gray-300 rounded-md mr-3"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">
                                      {/* FIX: Show correct logo type label */}
                                      Custom Logo {logoTypeLabel ? `(${logoTypeLabel})` : ""}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.usePreviousLogo
                                        ? 'Reusing your previous logo'
                                        : 'Included with this bundle'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-600 text-sm">Size: {item.size || 'Not selected'}</p>
                            <p className="text-gray-600 text-sm flex items-center">
                              Color:
                              <span
                                className="w-5 h-5 ml-2 inline-block border border-gray-400 rounded-full"
                                style={{ backgroundColor: item.color || '#ccc' }}
                              />
                            </p>
                            {item.method !== 'Not selected' && (
                              <>
                                <p className="text-gray-600 text-sm">Method: {item.method}</p>
                                <p className="text-gray-600 text-sm">
                                  Position: {Array.isArray(item.position) ? item.position.join(', ') : item.position || 'Not selected'}
                                </p>
                                {item.textLine && <p className="text-gray-600 text-sm">Text Line: {item.textLine}</p>}
                                {item.notes && <p className="text-gray-600 text-sm">Notes: {item.notes}</p>}
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-x-2 mx-2">
                        <div className="border-gray-300 border-[1px] flex items-center rounded-full">
                          <button
                            onClick={() => handleDecrease(item)}
                            className={`${item.quantity <= 1
                              ? 'border-gray-300 text-gray-400 bg-gray-200'
                              : 'border-gray-300 text-gray-600'
                              } px-3 py-2 rounded-full border-[1px]`}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="inline-block text-gray-600" />
                          </button>
                          <p className="text-gray-600 text-sm px-4">{item.quantity}</p>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="px-3 py-2 rounded-full border-[1px] border-gray-300"
                          >
                            <FaPlus className="inline-block text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-xl text-red-500 underline hover:text-red-700"
                        >
                          <RiDeleteBin4Line className="inline-block" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Uploaded Logo section for non-bundle */}
                  {!item.isBundle && item.logo && (
                    <div className="mt-3 mb-4 mx-4 bg-[#F4F4F4] rounded-md px-3 flex items-center gap-x-2">
                      <img
                        src={item.logo}
                        alt="Uploaded Logo"
                        className="w-16 h-16 object-cover border border-gray-300 rounded-md"
                      />
                      <div>
                        <p className="text-sm text-gray-600">
                          {item.usePreviousLogo ? "Previous Logo" : "New Logo"} - £{item.usePreviousLogo ? 5.5 : 20} customization
                        </p>
                        {item.usePreviousLogo && (
                          <p className="text-xs text-gray-500">Reusing your previous logo</p>
                        )}
                      </div>
                    </div>
                  )}
                  <hr className="mt-3 mb-4 mx-2" />
                </div>
              );
            })
          )}
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <div className="lg:w-auto xl:w-auto p-4 bg-white h-auto px-10 shadow-lg shadow-gray-300 rounded-md">
            <h2 className="text-xl md:text-md font-bold text-nowrap text-black mb-4 mx-7">Order Summary</h2>
            <div className="flex justify-between">
              <p className="text-gray-800 text-sm">Subtotal: </p>
              <p className="text-gray-800 text-md font-bold">£ {totalAmount.toFixed(2)}</p>
            </div>
            {/* Logo Charges Section */}
            {(logoEmbroideryTotal > 0 || newLogoSetupTotal > 0) && (
              <>
                {logoEmbroideryTotal > 0 && (
                  <div className="flex justify-between mb-1">
                    <p className="text-gray-800 text-sm">Logo Embroidery/Printing:</p>
                    <p className="text-gray-800 text-md font-bold">£ {logoEmbroideryTotal.toFixed(2)}</p>
                  </div>
                )}
                {newLogoSetupTotal > 0 && (
                  <div className="flex justify-between mb-1">
                    <p className="text-gray-800 text-sm">New Logo Setup Charges:</p>
                    <p className="text-gray-800 text-md font-bold">£ {newLogoSetupTotal.toFixed(2)}</p>
                  </div>
                )}
              </>
            )}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Shipping Options</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={selectedShipping === 'standard'}
                    onChange={() => setSelectedShipping('standard')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="font-medium">Standard Shipping (UK)</span>
                    <p className="text-xs text-gray-500">2-3 business days • {totalAmount >= 100 ? 'Free' : '£4.95'}</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="expedited"
                    checked={selectedShipping === 'expedited'}
                    onChange={() => setSelectedShipping('expedited')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="font-medium">Expedited Shipping</span>
                    <p className="text-xs text-gray-500">1-2 business days • £6.95</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="international"
                    checked={selectedShipping === 'international'}
                    onChange={() => setSelectedShipping('international')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="font-medium">International Shipping</span>
                    <p className="text-xs text-gray-500">5-10 business days • £9.95</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex justify-between mb-3">
              <p className="text-gray-800 text-sm">Shipping: </p>
              <p className="text-gray-800 text-md font-bold">
                {shippingCost === 0 ? 'Free' : `£ ${shippingCost.toFixed(2)}`}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-b border-gray-200">
              <span className="text-black">VAT:</span>
              <span className="font-bold text-red-600">No VAT Charged</span>
            </div>
            <hr className="border-gray-700" />
            <div className="flex justify-between mt-3">
              <p className="text-gray-800 font-bold text-lg mt-2">Total: </p>
              <p className="mt-2 font-bold">£{(totalAmount + logoEmbroideryTotal + newLogoSetupTotal + shippingCost).toFixed(2)}</p>
            </div>
            <button
              className="mt-4 w-full bg-[#091638] text-white py-2 rounded-full flex items-center justify-center gap-2"
              onClick={handleCheckout}
            >
              <BiCheckShield className="inline-block" /> Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;