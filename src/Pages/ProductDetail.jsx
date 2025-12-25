import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { getApiBaseUrl } from '../utils/config';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/products/${productId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();


        if (!response.ok || !data.success) {
          throw new Error(data.message || `Failed to fetch product (Status: ${response.status})`);
        }

        if (!data.product) {
          throw new Error("Product data not found in response");
        }

        setProduct(data.product);
      } catch (err) {

        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAdd = () => {
    if (product) {
      dispatch(addItem(product));
    }
  };

  if (loading) return (
    <div className="container mx-auto py-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p>Loading product details...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto py-8 text-center text-red-500">
      <p>Error: {error}</p>
      <p>Product ID: {productId}</p>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto py-8 text-center">
      <p>No product found with ID: {productId}</p>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 ">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <div className="sticky top-4">
            <img
              src={product.frontImage || "/placeholder.jpg"}
              alt={product.title}
              className="w-full rounded-lg shadow-lg mb-4"
            />
            {product.colorImages?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {product.colorImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.title} - Color ${index + 1}`}
                    className="rounded-lg border cursor-pointer hover:border-blue-500"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-semibold mb-6">₹{product.price}</p>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold  mb-2">Description</h2>
            <p className="text-gray-700">
              {product.description || "No description available"}
            </p>
          </div>

          {/* Sizes */}
          {product.size?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 ">Available Sizes</h2>
              <div className="flex gap-2">
                {product.size.map((size, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 border rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Colors</h2>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-500"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            className="w-full md:w-auto bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;