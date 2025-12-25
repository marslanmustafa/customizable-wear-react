import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useToast } from "@/components/ui/use-toast";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Helper for color/size structure
const getDefaultProduct = () => ({
  image: null,
  colors: [],
  existingImage: null,
});

const ImageUpload = ({ onUpload, disabled, existingImageUrl }) => (
  <div className="mb-4">
    <h1 className="text-xl">Product Image</h1>
    {existingImageUrl && (
      <div className="mb-2">
        <p className="text-sm text-gray-500 mb-1">Current Image:</p>
        <img
          src={existingImageUrl}
          alt="Current product"
          className="h-20 w-20 object-cover rounded-md border"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/100x100?text=Image+Not+Found";
          }}
        />
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
      }}
      className="border border-gray-300 p-2 rounded-md w-full mt-2"
      disabled={disabled}
    />
  </div>
);

const Popup = ({
  closePopup,
  onBundleCreated,
  bundleToUpdate = null,
  isUpdateMode = false,
}) => {
  const { toast } = useToast();

  // Set up products initial state
  const defaultProductCount = 2; // Change as needed
  const initialProducts =
    isUpdateMode && bundleToUpdate && Array.isArray(bundleToUpdate.BundleData)
      ? bundleToUpdate.BundleData.map((productData, idx) => {
          const productImage = bundleToUpdate.productImages?.find(
            (img) => img.productIndex === idx
          );
          const colorsWithImages = productData.colors.map((color, colorIdx) => {
            const colorImage = bundleToUpdate.colorImages?.find(
              (img) => img.productIndex === idx && img.colorIndex === colorIdx
            );
            return {
              ...color,
              image: null,
              existingImage: colorImage?.url || null,
              sizes: color.sizes || [],
            };
          });
          return {
            image: null,
            colors: colorsWithImages,
            existingImage: productImage?.url || null,
          };
        })
      : Array.from({ length: defaultProductCount }, getDefaultProduct);

  const [products, setProducts] = useState(initialProducts);

  const [selectedCategories, setSelectedCategories] = useState(() => {
    if (isUpdateMode && bundleToUpdate?.categories) {
      const cats = { solo1: false, solo2: false, everyday: false };
      bundleToUpdate.categories.forEach((cat) => {
        if (cats.hasOwnProperty(cat)) cats[cat] = true;
      });
      return cats;
    }
    return { solo1: false, solo2: false, everyday: false };
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState(
    isUpdateMode && bundleToUpdate ? bundleToUpdate.thumbnail : null
  );
  const [title, setTitle] = useState(
    isUpdateMode && bundleToUpdate ? bundleToUpdate.title : ""
  );
  const [price, setPrice] = useState(
    isUpdateMode && bundleToUpdate ? bundleToUpdate.price : ""
  );
  const [description, setDescription] = useState(
    isUpdateMode && bundleToUpdate
      ? bundleToUpdate.description
      : "Premium custom bundle"
  );
  const [sizeChartImage, setSizeChartImage] = useState(null);
  const [existingSizeChartImage, setExistingSizeChartImage] = useState(
    isUpdateMode && bundleToUpdate?.sizeChartImage
      ? bundleToUpdate.sizeChartImage
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (fileData, productIndex) => {
    setProducts((products) => {
      const updated = [...products];
      updated[productIndex].image = fileData;
      return updated;
    });
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setExistingThumbnail(previewUrl);
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "sizeChartImage") setSizeChartImage(file);
  };

  const handleColorImageChange = (e, productIndex, colorIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    setProducts((products) => {
      const updated = [...products];
      updated[productIndex].colors[colorIndex].image = file;
      return updated;
    });
  };

  const addColor = (productIndex) => {
    setProducts((products) => {
      const updated = [...products];
      updated[productIndex].colors.push({
        color: "#000000",
        image: null,
        sizes: [],
        existingImage: null,
      });
      return updated;
    });
  };

  const handleColorChange = (productIndex, colorIndex, value) => {
    setProducts((products) => {
      const updated = [...products];
      updated[productIndex].colors[colorIndex].color = value;
      return updated;
    });
  };

  const handleSizeChange = (productIndex, colorIndex, size) => {
    setProducts((products) => {
      const updated = products.map((product, pIdx) => {
        if (pIdx !== productIndex) return product;
        return {
          ...product,
          colors: product.colors.map((color, cIdx) => {
            if (cIdx !== colorIndex) return color;
            const updatedSizes = color.sizes.includes(size)
              ? color.sizes.filter((s) => s !== size)
              : [...color.sizes, size];
            return { ...color, sizes: updatedSizes };
          }),
        };
      });
      return updated;
    });
  };

  const removeColor = (productIndex, colorIndex) => {
    setProducts((products) => {
      const updated = [...products];
      updated[productIndex].colors.splice(colorIndex, 1);
      return updated;
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    if (!title.trim()) {
      toast({
        description: "Please enter a title for the bundle",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!price || isNaN(price)) {
      toast({
        description: "Please enter a valid price for the bundle",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (!thumbnail && !existingThumbnail) {
      toast({
        description: "Please upload a thumbnail image",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);

    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (sizeChartImage) {
      formData.append("sizeChartImage", sizeChartImage);
    } else if (isUpdateMode && existingSizeChartImage) {
      formData.append("sizeChartImage", existingSizeChartImage);
    }

    const bundleData = products.map((product, productIndex) => ({
      productIndex,
      colors: product.colors.map((color, colorIndex) => ({
        color: color.color,
        sizes: color.sizes,
        existingImage: color.existingImage || null,
      })),
      existingImage: product.existingImage || null,
    }));
    formData.append("BundleData", JSON.stringify(bundleData));
    const activeCategories = Object.keys(selectedCategories).filter(
      (cat) => selectedCategories[cat]
    );
    formData.append("categories", JSON.stringify(activeCategories));

    products.forEach((product, productIndex) => {
      if (product.image) {
        formData.append(`productImage_${productIndex}`, product.image);
      }
      product.colors.forEach((color, colorIndex) => {
        if (color.image) {
          formData.append(
            `colorImage_${productIndex}_${colorIndex}`,
            color.image
          );
        }
      });
    });

    try {
      const url = isUpdateMode
        ? `${apiUrl}/bundle/${bundleToUpdate._id}`
        : `${apiUrl}/bundle`;
      const method = isUpdateMode ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${isUpdateMode ? "update" : "create"} bundle`
        );
      }

      const data = await response.json();
      if (onBundleCreated) {
        onBundleCreated(data.bundle || data);
      }

      toast({
        title: "Success!",
        description: `Bundle "${title}" ${
          isUpdateMode ? "updated" : "created"
        } successfully!`,
        variant: "success",
        className: "bg-green-500 text-white border-0",
      });
      closePopup();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.message ||
          `An error occurred while ${
            isUpdateMode ? "updating" : "creating"
          } the bundle.`,
        variant: "destructive",
        className: "bg-red-500 text-white border-0",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-md shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={closePopup}
            disabled={isSubmitting}
            className="absolute top-4 right-4 p-2 text-white bg-red-500 rounded-full hover:bg-red-600"
          >
            <IoClose size={24} />
          </button>

          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-xl font-semibold mb-4">Basic Information</h1>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Bundle Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter bundle title"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Price*</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-xl font-semibold">Bundle Thumbnail*</h1>
              <p className="text-sm text-gray-500 mb-2">
                This will be the main image shown in listings
              </p>
              {(existingThumbnail || thumbnail) && (
                <img
                  src={
                    existingThumbnail?.startsWith?.("blob:")
                      ? existingThumbnail
                      : existingThumbnail?.startsWith?.("http")
                      ? existingThumbnail
                      : thumbnail
                      ? URL.createObjectURL(thumbnail)
                      : null
                  }
                  alt="Thumbnail preview"
                  className="h-20 w-20 object-cover rounded-md border mb-2"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/100x100?text=Image+Not+Found";
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="border border-gray-300 p-2 rounded-md w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-1">Size chart image</p>
              {existingSizeChartImage && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Current Size Chart:</p>
                  <img
                    src={
                      existingSizeChartImage.startsWith("http")
                        ? existingSizeChartImage
                        : `${apiUrl}/${existingSizeChartImage}`
                    }
                    alt="Current size chart"
                    className="h-20 w-20 object-cover rounded-md border"
                  />
                </div>
              )}
              <input
                className="w-full p-2 border rounded"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "sizeChartImage")}
                disabled={isSubmitting}
              />
            </div>

            {products.map((product, productIndex) => (
              <div
                key={productIndex}
                className="border p-4 mb-4 rounded-md shadow-md"
              >
                <h4 className="font-semibold text-lg mb-2">
                  Product {productIndex + 1}
                </h4>
                <ImageUpload
                  onUpload={(file) => handleImageUpload(file, productIndex)}
                  disabled={isSubmitting}
                  existingImageUrl={
                    product.existingImage
                      ? product.existingImage.startsWith("http")
                        ? product.existingImage
                        : `${apiUrl}/${product.existingImage}`
                      : null
                  }
                />
                <button
                  onClick={() => addColor(productIndex)}
                  disabled={isSubmitting}
                  className="w-full py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 mt-3 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    "Add Color"
                  )}
                </button>
                {product.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="mb-4 mt-4 p-3 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.color}
                        onChange={(e) =>
                          handleColorChange(
                            productIndex,
                            colorIndex,
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-md w-20 h-10"
                        disabled={isSubmitting}
                      />
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: color.color,
                          borderRadius: "5px",
                        }}
                      />
                      {color.existingImage && (
                        <img
                          src={
                            color.existingImage.startsWith("http")
                              ? color.existingImage
                              : `${apiUrl}/${color.existingImage}`
                          }
                          alt="Color preview"
                          className="h-10 w-10 object-cover rounded-md border"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100x100?text=Image+Not+Found";
                          }}
                        />
                      )}
                    </div>
                    <div className="mt-3">
                      <label className="block text-gray-700">
                        Color Image*
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleColorImageChange(e, productIndex, colorIndex)
                        }
                        className="border border-gray-300 p-2 rounded-md w-full mt-1"
                        disabled={isSubmitting}
                      />
                    </div>
                    <button
                      onClick={() => removeColor(productIndex, colorIndex)}
                      disabled={isSubmitting}
                      className="mt-3 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
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
                          Processing...
                        </>
                      ) : (
                        "Remove Color"
                      )}
                    </button>
                    <label className="block text-gray-700 mt-3">
                      Select Sizes*
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["S", "M", "L", "XL", "2XL","3XL","4XL","5XL"].map(
                        (size, sizeIndex) => (
                          <label key={sizeIndex} className="flex items-center">
                            <input
                              type="checkbox"
                              value={size}
                              checked={color.sizes.includes(size)}
                              onChange={() =>
                                handleSizeChange(productIndex, colorIndex, size)
                              }
                              className="mr-2"
                              disabled={isSubmitting}
                            />
                            {size}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800">
                Select Product Categories*
              </label>
              <div className="flex flex-col gap-4 mt-2">
                {["solo1", "solo2", "everyday"].map((category, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories[category]}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-400"
                      disabled={isSubmitting}
                    />
                    <span className="text-gray-700 text-base">
                      {category === "solo1"
                        ? "Solo Starter Bundle 1"
                        : category === "solo2"
                        ? "Solo Starter Bundle 2"
                        : "Everyday Bundle"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-3 font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
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
                  {isUpdateMode ? "Updating Bundle..." : "Creating Bundle..."}
                </>
              ) : isUpdateMode ? (
                "Update Bundle"
              ) : (
                "Create Bundle"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
