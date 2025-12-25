import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { useToast } from '@/components/ui/use-toast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const BundleUploadLogoPopup = ({
  onBack,
  onClose,
  thumbnail,
  onFinish,
  resetSelections,
  selectedPositions = {},
  selectedMethods = {},
  products = [],
  previousLogo = null,
  bundleId,
  bundle,
  onNotesChange = () => {},
}) => {
  const [logoFile, setLogoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [usePreviousLogo, setUsePreviousLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [previousLogos, setPreviousLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [showPreviousLogos, setShowPreviousLogos] = useState(false);
  const { id } = useSelector((state) => (state.auth.user || {}));
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPreviousLogos = async () => {
      try {
        if (!id) {
          toast('User ID is missing! Please login.');
          return;
        }
        // Fetch logos from orders
        const ordersResponse = await fetch(`${apiUrl}/orders/order-user/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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
          headers: { 'Content-Type': 'application/json' },
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
      } catch (error) {
        toast('Error fetching previous logos. Please try again.');
      }
    };
    fetchPreviousLogos();
  }, [id, toast]);

  const validateProducts = () => {
    if (!products || products.length === 0) {
      throw new Error('No products in bundle');
    }
    const invalidProducts = products.filter((p) => !p._id);
    if (invalidProducts.length > 0) {
      throw new Error(`Products missing IDs: ${invalidProducts.map((p) => p.name).join(', ')}`);
    }
  };

 

  const getProductSizes = (product) => {
    if (Array.isArray(product)) return product;
    if (Array.isArray(product.sizes)) return product.sizes;
    if (Array.isArray(product.size)) return product.size;
    if (product.sizesByColor) {
      return Object.values(product.sizesByColor).flatMap((colorSizes) =>
        colorSizes.map((s) => s.size)
      );
    }
    return product.allSizes || [];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG or PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    setLogoFile(file);
    setSelectedLogo(null);
    setUsePreviousLogo(false);
    setShowPreviousLogos(false);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewURL(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectLogo = (logo) => {
    setSelectedLogo(logo);
    setLogoFile(null);
    setPreviewURL('');
    setUsePreviousLogo(true);
    setShowPreviousLogos(false);
    setError(null);
  };

  const handleRemoveFile = () => {
    setLogoFile(null);
    setPreviewURL('');
    setSelectedLogo(null);
    setUsePreviousLogo(false);
    setError(null);
  };

  const togglePreviousLogos = () => {
    setShowPreviousLogos(!showPreviousLogos);
    if (!showPreviousLogos) {
      setLogoFile(null);
      setPreviewURL('');
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onNotesChange(newNotes);
  };

  const hasValidLogo = () => {
    return (
      (logoFile && previewURL) ||
      (usePreviousLogo && (selectedLogo || previousLogo))
    );
  };

  const getPositionsText = () => {
    if (!selectedPositions || Object.keys(selectedPositions).length === 0) {
      return <p className="text-gray-500">No positions selected</p>;
    }
    return Object.entries(selectedPositions).map(([productId, positions]) => {
      const product = products.find((p) => p._id === productId) || {};
      return (
        <p key={productId} className="mb-1">
          <span className="font-medium">{product.name || 'Product'}:</span>{' '}
          {positions.join(', ')}
        </p>
      );
    });
  };

  const handleFinish = async () => {
    if (!hasValidLogo()) {
      setError('Please upload a logo or select a previous one');
      return;
    }
    if (!bundleId) {
      setError('Bundle ID is required');
      return;
    }
    try {
      validateProducts();
    } catch (validationError) {
      setError(validationError.message);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const isPrevLogo = !!selectedLogo;
      const bundleItem = {
        bundleId,
        title: bundle?.title || 'Custom Bundle',
        price: bundle?.price || 0,
        thumbnail,
        notes,
        method: selectedMethods,
        position: selectedPositions,
        products: products.map((p) => ({
          productId: p._id,
          name: p.name,
          color: p.color,
          size: p.size,
        })),
        quantity: 1,
        isBundle: true,
        usePreviousLogo: isPrevLogo,
        logo: isPrevLogo ? selectedLogo : previewURL, // always a string for cart
        bundleProducts: products.map((product) => {
          // Map detailed product info for use in Cart/Order Summary
          const productId = product._id?.toString();
          const sizes = getProductSizes(product);
          const sizesByColor = {};
          if (product.colorSizeSelections) {
            product.colorSizeSelections.forEach(({ color, size }) => {
              if (!sizesByColor[color]) sizesByColor[color] = [];
              const existingSize = sizesByColor[color].find((item) => item.size === size);
              if (existingSize) existingSize.quantity += 1;
              else sizesByColor[color].push({ size, quantity: 1 });
            });
          }
          return {
            id: productId,
            name: product.name || `Product ${productId}`,
            quantity: sizes.length,
            size: product.allSizes || ['Not selected'],
            colors: product.colors || 'Not selected',
            sizesByColor: product.sizesByColor || sizesByColor,
            position: selectedPositions[productId] || 'Not selected',
            method: selectedMethods[productId] || 'Not selected',
            frontImage: product.images?.[0] || product.frontImage || '',
          };
        }),
      };
      dispatch(addItem(bundleItem));

      // Prepare FormData for backend
      const formData = new FormData();
      formData.append('isBundle', 'true');
      formData.append('bundleId', bundleId);
      formData.append('usePreviousLogo', isPrevLogo);
      formData.append('bundleProducts', JSON.stringify(bundleItem.bundleProducts));
      formData.append('price', bundle?.price);
      formData.append('notes', notes);
      formData.append('method', 'Print');
      formData.append(
        'position',
        JSON.stringify(Object.values(selectedPositions).flat().filter(Boolean))
      );
      formData.append('thumbnail', thumbnail);

      if (isPrevLogo) {
        formData.append('logo', selectedLogo);
      } else if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${apiUrl}/cart/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Failed to add bundle (HTTP ${response.status})`);
      }
      onClose();
      resetSelections();
      onFinish({
        type: 'image',
        content: result.logoUrl || selectedLogo || previewURL,
        preview: selectedLogo || previewURL,
        notes,
      });
    } catch (error) {
      setError(
        `Error: Please Login before procceding`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFinishDisabled = () => {
    return !hasValidLogo() || isSubmitting || !bundleId;
  };

  // Render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-20 ">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-6 relative max-h-[85vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-red-600 hover:text-red-700 p-2"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Upload Your Logo</h2>
          <div className="mb-2">
            <p className="text-gray-600">Selected Positions:</p>
            <div className="text-center mt-2 space-y-1">{getPositionsText()}</div>
          </div>
          {bundleId && (
            <p className="text-sm text-gray-500 mb-4">Bundle ID: {bundleId}</p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        <div className="mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg  text-center">
            {previewURL ? (
              <div className="relative">
                <img
                  src={previewURL}
                  alt="Logo preview"
                  className="max-h-24 mx-auto mb-2"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTimes size={12} />
                </button>
                <p className="text-red-500 text-sm">
                  Logo Template: £20 + Embroidery/Print: £5.5
                </p>
              </div>
            ) : selectedLogo ? (
              <div className="relative">
                <img
                  src={selectedLogo}
                  alt="Selected logo"
                  className="max-h-40 mx-auto mb-2"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTimes size={12} />
                </button>
                <p className="text-green-600 text-sm">
                  Logo Embroidery/Print: £5.5
                </p>
              </div>
            ) : usePreviousLogo && previousLogo ? (
              <div className="relative">
                <img
                  src={previousLogo}
                  alt="Previous logo"
                  className="max-h-40 mx-auto mb-2"
                />
                <p className="text-sm text-green-600 mb-2">Using previous logo</p>
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">JPEG or PNG (max. 5MB)</p>
                </div>
              </label>
            )}
          </div>

          {(previousLogos.length > 0 || previousLogo) && (
            <>
              <button
                onClick={togglePreviousLogos}
                className={`w-full mt-2 py-2 px-4 rounded-md ${
                  showPreviousLogos
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-black'
                } hover:bg-orange-600 hover:text-white transition-colors`}
                disabled={!!logoFile}
              >
                {showPreviousLogos ? 'Hide Previous Logos' : 'Use Previous Logo'}
              </button>

              {showPreviousLogos && (
                <div className="mt-4">
                  <h3 className="font-medium text-center mb-2">
                    Select from your previous logos:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previousLogo &&
                      !previousLogos.includes(previousLogo) && (
                        <div
                          key="previous-logo"
                          className={`cursor-pointer border-2 ${
                            selectedLogo === previousLogo
                              ? 'border-orange-500'
                              : 'border-gray-200'
                          } hover:border-orange-300 transition-colors`}
                          onClick={() => handleSelectLogo(previousLogo)}
                        >
                          <img
                            src={previousLogo}
                            alt="Previous Logo"
                            className="w-full h-24 object-contain p-1"
                          />
                          <p className="text-xs text-center mt-1 text-green-600">
                            Logo Embroidery/Print: £5.5
                          </p>
                        </div>
                      )}
                    {previousLogos.map((logo, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border-2 ${
                          selectedLogo === logo
                            ? 'border-orange-500'
                            : 'border-gray-200'
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

        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any special instructions for your order..."
            value={notes}
            onChange={handleNotesChange}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={handleFinish}
            disabled={isFinishDisabled()}
            className={`px-4 py-2 rounded-md text-white ${
              isFinishDisabled()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
};

BundleUploadLogoPopup.propTypes = {
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  selectedPositions: PropTypes.object,
  selectedMethods: PropTypes.object,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      colors: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(
          PropTypes.shape({
            code: PropTypes.string,
            name: PropTypes.string,
          })
        ),
      ]),
      sizes: PropTypes.array,
      size: PropTypes.array,
      sizesByColor: PropTypes.object,
      allSizes: PropTypes.array,
      price: PropTypes.number,
      images: PropTypes.array,
    })
  ).isRequired,
  previousLogo: PropTypes.string,
  bundleId: PropTypes.string.isRequired,
  onNotesChange: PropTypes.func,
};

export default BundleUploadLogoPopup;