import { useState, useEffect } from 'react';
import { RxCross1, RxChevronLeft, RxChevronRight } from 'react-icons/rx';
import { useToast } from '@/components/ui/use-toast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const brands = [
  'Kustom Kit',
  'Fruit of the Loom',
  'Gildan',
  'Printer Essentials',
  'Result',
  'Jobman Workwear',
  'James Harvest',
  'HI-VIS & PPE',
  'Beechfield',
  'UCC (Ultimate Clothing Collection)',
];

const allProductTypes = [
  'polo', 'hi-vis', 't-shirt', 'sweatshirt', 'hoodie', 'bodywarmer', 'jacket',
  'trousers', 'shorts', 'workbag', 'backpack', 'headwear', 'cargo-paint', 'work-paint',
  'shirt-blouse', 'shirt', 'sweatShirt'
];

const colorSwatches = [
  // Basic colors
  '#000000', '#FFFFFF', '#C0C0C0', '#808080', '#FF0000', '#800000', 
  '#FFFF00', '#808000', '#00FF00', '#008000', '#00FFFF', '#008080', 
  '#0000FF', '#000080', '#FF00FF', '#800080',
  
  // Extended colors
  '#FFA07A', '#FA8072', '#E9967A', '#F08080', '#CD5C5C', '#DC143C',
  '#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#B8860B', '#DAA520',
  '#EEE8AA', '#F0E68C', '#BDB76B', '#9ACD32', '#7CFC00', '#7FFF00',
  '#ADFF2F', '#006400', '#90EE90', '#98FB98', '#8FBC8F', '#00FA9A',
  '#00FF7F', '#2E8B57', '#66CDAA', '#3CB371', '#20B2AA', '#008B8B',
  '#00BFFF', '#1E90FF', '#4169E1', '#0000CD', '#00008B', '#8A2BE2',
  '#9932CC', '#9400D3', '#8B008B', '#FF1493', '#FF69B4', '#DB7093',
  '#FFC0CB', '#FFB6C1', '#D8BFD8', '#DDA0DD', '#EE82EE', '#DA70D6'
];

const sizeOptions = [
  'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL',
  '6', '8', '10', '12', '14', '16', '18', '20',
  '13.5', '14', '14.5', '15', '15.5', '16', '16.5', '17', 
  '17.5', '18', '18.5', '19', 'C44', 'C46', 'C48', 'C50', 
  'C52', 'C54', 'C56', 'C58', 'C60', 'C62', 'O/S'
];

const Modal = ({ isOpen, onClose, initialData, onProductAdded }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('In Stock');
  const [productDescription, setProductDescription] = useState('');
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [frontImage, setFrontImage] = useState(null);
  const [frontImagePreview, setFrontImagePreview] = useState(null);
  const [sizeChartImage, setSizeChartImage] = useState(null);
  const [sizeChartImagePreview, setSizeChartImagePreview] = useState(null);
  const [colors, setColors] = useState([]);
  const [colorImages, setColorImages] = useState([]);
  const [colorImagePreviews, setColorImagePreviews] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizeImages, setSizeImages] = useState({});
  const [sizeImagePreviews, setSizeImagePreviews] = useState({});
  const [productType, setProductType] = useState(
    Object.fromEntries(allProductTypes.map(type => [type, false]))
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const { toast } = useToast();

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (frontImagePreview && typeof frontImagePreview !== 'string') URL.revokeObjectURL(frontImagePreview);
      if (sizeChartImagePreview && typeof sizeChartImagePreview !== 'string') URL.revokeObjectURL(sizeChartImagePreview);
      colorImagePreviews.forEach((url) => {
        if (url && typeof url !== 'string') URL.revokeObjectURL(url);
      });
      Object.values(sizeImagePreviews).forEach((url) => {
        if (typeof url !== 'string') URL.revokeObjectURL(url);
      });
    };
  }, [frontImagePreview, sizeChartImagePreview, colorImagePreviews, sizeImagePreviews]);

  // Initialize or reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setProductTitle(initialData.title || '');
      setProductPrice(initialData.price || '');
      setProductStock(initialData.stock || 'In Stock');
      setProductDescription(initialData.description || '');
      setSelectedBrand(initialData.brand ? [initialData.brand] : []);
      setFrontImage(initialData.frontImage || null);
      setFrontImagePreview(initialData.frontImage || null);
      setSizeChartImage(initialData.sizeChartImage || null);
      setSizeChartImagePreview(initialData.sizeChartImage || null);
      setColors(initialData.colors?.filter(Boolean) || []);
      setColorImages(initialData.colorImages || []);
      setColorImagePreviews(initialData.colorImages || []);
      setSizes(initialData.size || []);
      setSizeImages(initialData.sizeImages || {});
      setSizeImagePreviews(initialData.sizeImages || {});
      const initialTypes = Object.fromEntries(
        allProductTypes.map(type => [type, (initialData.productType || []).includes(type)])
      );
      setProductType(initialTypes);
    } else {
      setProductTitle('');
      setProductPrice('');
      setProductStock('In Stock');
      setProductDescription('');
      setSelectedBrand([]);
      setFrontImage(null);
      setFrontImagePreview(null);
      setSizeChartImage(null);
      setSizeChartImagePreview(null);
      setColors([]);
      setColorImages([]);
      setColorImagePreviews([]);
      setSizes([]);
      setSizeImages({});
      setSizeImagePreviews({});
      setProductType(Object.fromEntries(allProductTypes.map(type => [type, false])));
      setCurrentStep(1);
    }
  }, [initialData]);

  if (!isOpen) return null;

  // --- Color Logic ---
  const addColor = (color) => {
    setColors(prev => [...prev, color]);
    setColorImages(prev => [...prev, null]);
    setColorImagePreviews(prev => [...prev, null]);
    setShowCustomColorPicker(false);
  };

  const removeColor = (index) => {
    setColors(prev => prev.filter((_, i) => i !== index));
    setColorImages(prev => prev.filter((_, i) => i !== index));
    setColorImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleColorImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setColorImages(prev => prev.map((img, i) => (i === index ? file : img)));
    const previewUrl = URL.createObjectURL(file);
    setColorImagePreviews(prev => {
      if (prev[index] && typeof prev[index] !== 'string') URL.revokeObjectURL(prev[index]);
      return prev.map((url, i) => (i === index ? previewUrl : url));
    });
  };

  // --- Image Handling ---
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (type === 'front') {
      setFrontImage(file);
      setFrontImagePreview(previewUrl);
    } else if (type === 'chart') {
      setSizeChartImage(file);
      setSizeChartImagePreview(previewUrl);
    }
  };

  // --- Sizes ---
  const handleSizeChange = (size) => {
    if (!sizes.includes(size)) {
      setSizes([...sizes, size]);
    } else {
      toast({ description: 'This size has already been added', variant: 'destructive' });
    }
  };

  const removeSize = (size) => {
    setSizes(prev => prev.filter(s => s !== size));
    setSizeImages(prev => {
      const updated = { ...prev };
      delete updated[size];
      return updated;
    });
    setSizeImagePreviews(prev => {
      const updated = { ...prev };
      if (updated[size] && typeof updated[size] !== 'string') URL.revokeObjectURL(updated[size]);
      delete updated[size];
      return updated;
    });
  };

  const handleSizeImageChange = (e, size) => {
    const file = e.target.files[0];
    if (!file) return;
    setSizeImages(prev => ({ ...prev, [size]: file }));
    const previewUrl = URL.createObjectURL(file);
    setSizeImagePreviews(prev => {
      if (prev[size] && typeof prev[size] !== 'string') URL.revokeObjectURL(prev[size]);
      return { ...prev, [size]: previewUrl };
    });
  };

  // --- Brand and Product Type ---
  const handleBrandChange = (e) => {
    const { value } = e.target;
    if (!value) return;
    setSelectedBrand([value]);
  };

  const removeBrand = () => setSelectedBrand([]);

  const handleProductTypeChange = (e) => {
    const { name, checked } = e.target;
    setProductType(prev => ({ ...prev, [name]: checked }));
  };

  // --- Form Navigation ---
  const nextStep = () => {
    // Basic validation before proceeding
    if (currentStep === 1 && (!productTitle || !productPrice)) {
      toast({ description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    if (currentStep === 2 && !frontImage) {
      toast({ description: 'Please upload a front image', variant: 'destructive' });
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    // Validation
    if (sizes.length === 0) {
      toast({ description: 'Please select at least one size!', variant: 'destructive' });
      setIsAdding(false); return;
    }
    if (!frontImage) {
      toast({ description: 'Please upload front image!', variant: 'destructive' });
      setIsAdding(false); return;
    }
    if (!sizeChartImage) {
      toast({ description: 'Please select size chart image', variant: 'destructive' });
      setIsAdding(false); return;
    }
    if (!productDescription) {
      toast({ description: 'Please write description', variant: 'destructive' });
      setIsAdding(false); return;
    }
    if (selectedBrand.length === 0) {
      toast({ description: 'Please select a brand!', variant: 'destructive' });
      setIsAdding(false); return;
    }
    const selectedProductTypes = Object.keys(productType).filter((key) => productType[key]);
    if (selectedProductTypes.length === 0) {
      toast({ description: 'Please select at least one product type!', variant: 'destructive' });
      setIsAdding(false); return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append('title', productTitle);
    formData.append('price', productPrice);
    formData.append('brand', selectedBrand[0]);
    formData.append('stock', productStock);
    formData.append('description', productDescription);

    colors.forEach((color) => formData.append('colors', color));
    colorImages.forEach((img, idx) => {
      if (img instanceof File) formData.append('colorImages', img);
      else if (typeof img === 'string' && img) formData.append('colorImages', img);
    });

    if (typeof frontImage === 'string') formData.append('frontImageUrl', frontImage);
    else formData.append('front', frontImage);

    if (typeof sizeChartImage === 'string') formData.append('sizeChartImageUrl', sizeChartImage);
    else formData.append('sizeChartImage', sizeChartImage);

    formData.append('sizes', JSON.stringify(sizes));
    Object.entries(sizeImages).forEach(([size, img]) => {
      if (img instanceof File) formData.append('sizeImages', img);
      else if (typeof img === 'string' && img) formData.append('sizeImages', img);
    });

    formData.append('productType', JSON.stringify(selectedProductTypes));

    try {
      const url = initialData ? `${apiUrl}/products/update/${initialData._id}` : `${apiUrl}/products/add`;
      const method = initialData ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!data.success) {
        toast({ description: `${data.message}`, variant: 'destructive' });
      } else {
        toast({
          title: 'Success!',
          description: `Product "${productTitle}" ${initialData ? 'updated' : 'added'} successfully!`,
          variant: 'success',
          className: 'bg-green-500 text-white border-0',
        });
        onProductAdded(data.product);
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${initialData ? 'update' : 'add'} product. Please try again.`,
        variant: 'destructive',
        className: 'bg-red-500 text-white border-0',
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Step 1: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
          <input
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            type="text"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            required
            placeholder="Enter product name"
            disabled={isAdding}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
          <input
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            placeholder="Enter price"
            disabled={isAdding}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand*</label>
        <select
          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          onChange={handleBrandChange}
          disabled={isAdding}
          value={selectedBrand[0] || ''}
        >
          <option value="">Select Brand</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        {selectedBrand.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              {selectedBrand[0]}
            </span>
            <button
              onClick={removeBrand}
              className="text-orange-600 hover:text-orange-800"
              disabled={isAdding}
              type="button"
            >
              <RxCross1 size={16} />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
        <textarea
          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Enter detailed product description"
          rows={4}
          disabled={isAdding}
        />
      </div>
    </div>
  );

  // Step 2: Images
  const renderImages = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Images</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Front Image*</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
            {frontImagePreview ? (
              <div className="relative">
                <img
                  src={frontImagePreview}
                  alt="Front image preview"
                  className="w-full max-h-64 object-contain rounded"
                />
                {typeof frontImage === 'string' && (
                  <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    Existing Image
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">Upload front product image</p>
              </div>
            )}
            <label className="mt-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              {frontImagePreview ? 'Change Image' : 'Select Image'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'front')}
                className="hidden"
                disabled={isAdding}
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Size Chart Image*</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
            {sizeChartImagePreview ? (
              <div className="relative">
                <img
                  src={sizeChartImagePreview}
                  alt="Size chart preview"
                  className="w-full max-h-64 object-contain rounded"
                />
                {typeof sizeChartImage === 'string' && (
                  <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    Existing Image
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">Upload size chart image</p>
              </div>
            )}
            <label className="mt-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              {sizeChartImagePreview ? 'Change Image' : 'Select Image'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'chart')}
                className="hidden"
                disabled={isAdding}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Sizes
  const renderSizes = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Sizes</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes*</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {sizeOptions.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeChange(size)}
              disabled={sizes.includes(size) || isAdding}
              className={`px-3 py-1 rounded-full text-sm ${
                sizes.includes(size)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {sizes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Selected Sizes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sizes.map((size) => (
                <div key={size} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{size}</span>
                    <button
                      onClick={() => removeSize(size)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isAdding}
                      type="button"
                    >
                      <RxCross1 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-500">Size Image (Optional)</label>
                    {sizeImagePreviews[size] ? (
                      <div className="relative">
                        <img
                          src={sizeImagePreviews[size]}
                          alt={`Size ${size} preview`}
                          className="w-full h-24 object-contain border rounded"
                        />
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className="border border-dashed border-gray-300 rounded p-2 text-center">
                          <span className="text-xs text-gray-500">Upload size image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSizeImageChange(e, size)}
                            className="hidden"
                            disabled={isAdding}
                          />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Step 4: Colors
  const renderColors = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Colors</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Colors</label>
          
          {showCustomColorPicker ? (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-16 h-16 cursor-pointer"
                />
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => addColor(customColor)}
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
                  >
                    Add Custom Color
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomColorPicker(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
                  >
                    Back to Swatches
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4">
                {colorSwatches.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => addColor(color)}
                    className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowCustomColorPicker(true)}
                className="text-sm text-orange-600 hover:text-orange-800"
              >
                + Add custom color
              </button>
            </>
          )}
        </div>

        {colors.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Selected Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {colors.map((color, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-mono">{color}</span>
                    </div>
                    <button
                      onClick={() => removeColor(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isAdding}
                      type="button"
                    >
                      <RxCross1 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-500">Color Image (Optional)</label>
                    {colorImagePreviews[index] ? (
                      <div className="relative">
                        <img
                          src={colorImagePreviews[index]}
                          alt={`Color ${color} preview`}
                          className="w-full h-24 object-contain border rounded"
                        />
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className="border border-dashed border-gray-300 rounded p-2 text-center">
                          <span className="text-xs text-gray-500">Upload color image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleColorImageChange(e, index)}
                            className="hidden"
                            disabled={isAdding}
                          />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Step 5: Product Types
  const renderProductTypes = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Categories</h3>
      <p className="text-sm text-gray-600">Select all categories that apply to this product</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allProductTypes.map(type => (
          <label key={type} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
            <input
              type="checkbox"
              name={type}
              checked={productType[type]}
              onChange={handleProductTypeChange}
              disabled={isAdding}
              className="rounded text-orange-500 focus:ring-orange-400"
            />
            <span className="text-sm capitalize">
              {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const steps = [
    { title: "Basic Info", component: renderBasicInfo },
    { title: "Images", component: renderImages },
    { title: "Sizes", component: renderSizes },
    { title: "Colors", component: renderColors },
    { title: "Categories", component: renderProductTypes },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              {initialData ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentStep === index + 1 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isAdding}
          >
            <RxCross1 size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {steps[currentStep - 1].component()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={isAdding}
              >
                <RxChevronLeft size={18} />
                Previous
              </button>
            ) : (
              <div></div> // Empty div to maintain space
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                disabled={isAdding}
              >
                Next
                <RxChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {initialData ? 'Updating...' : 'Adding...'}
                  </>
                ) : initialData ? (
                  'Update Product'
                ) : (
                  'Add Product'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;