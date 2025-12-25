import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";
import TShirtSelector from "../components/Tshirtselector";
import { getApiBaseUrl } from '../utils/config';

const Products = ({ showTShirtSelector = true }) => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/products/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();


      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid API response format");
      }
      setProducts(data.products.slice(0, 8));
    } catch (error) {

    }
  };

  const handleAdd = (product) => {

    dispatch(addItem(product));
  };

  return (
    <div className="bg-[#F3F4F6] ">
      {showTShirtSelector && <TShirtSelector />}

    </div>
  );
};

export default Products;
