import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Category = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products/`, {
        credentials: "include",
        method: "GET",
      });
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Group products by productType (store only the first product of each type)
  const groupedProducts = {};
  products.forEach((product) => {
    if (!groupedProducts[product.productType]) {
      groupedProducts[product.productType] = product;
    }
  });

  return (
		<div className=' mx-auto md:px-4'>
			<div className='flex items-center justify-between'>
				<div className='text-2xl md:text-4xl font-bold'>
					<span className='text-[#002DA1]'>Shop </span> Our Best Sellers
				</div>
				{/* <div className="flex space-x-2">
          <button
            className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-[#4bf6d4] transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600 hover:text-white" />
          </button>
          <button
            className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-[#4bf6d4] transition-colors"
          >
            <FaArrowRight className="text-xl text-gray-600 hover:text-white" />
          </button>
        </div> */}
			</div>
			<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 pt-5'>
				{Object.values(groupedProducts).map((product) => (
					<div
						key={product._id}
						className='bg-[#1A1A1A] h-60 md:h-80 flex-shrink-0 rounded-lg shadow-md relative cursor-pointer'
						onClick={() => navigate(`/products/${product.productType}`)}>
						<div className='h-full flex flex-col justify-between'>
							<div className='relative w-full h-full'>
								<img
									src={product.frontImage}
									alt={product.name}
									className='w-full h-full p-3 object-cover drop-shadow-md rounded-lg'
								/>
								<div className='absolute top-3/4 left-0 w-1/2 bg-white text-black text-sm font-semibold text-center py-1'>
									{String(product.productType || '').toUpperCase()}
								</div>
							</div>
							<div className='text-center mt-2 font-semibold text-gray-700'>
								{String(product.name || '').toUpperCase()}
							</div>
							<div className='text-center text-gray-500'>{String(product.category || '').toUpperCase()}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Category;
