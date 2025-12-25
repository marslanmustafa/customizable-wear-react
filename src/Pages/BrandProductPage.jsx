import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaStar, FaRegStar } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { RiPriceTag3Line } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { BsGrid3X3Gap, BsListUl } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BrandProductPage = () => {
    const { brandName } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [sortOption, setSortOption] = useState('featured');
    const navigate = useNavigate();

    // Filter states
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [expandedFilters, setExpandedFilters] = useState({
        price: true,
        category: true,
    });
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        // Simulate fetching data - in a real app you would fetch from an API
        const fetchData = async () => {
            setLoading(true);
            try {
                // This is where you would fetch from your API
                // const response = await fetch(`/api/bundles?brand=${brandName}`);
                // const data = await response.json();
                
                // For now, we'll use the provided data directly
                const data = {
                    success: true,
                    products: [
                        // ... your product data here ...
                    ]
                };
                
                // Filter products by brand
                const brandProducts = data.products.filter(product => 
                    product.brand.toLowerCase() === brandName.toLowerCase()
                );
                
                setProducts(brandProducts);
                setFilteredProducts(brandProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [brandName]);

    // Extract all available categories from products
    const allCategories = [...new Set(products.flatMap((product) => product.productType || []))].filter(Boolean);

    useEffect(() => {
        if (!products.length) return;

        let results = [...products];

        // Apply price filter
        results = results.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

        // Apply category filter
        if (selectedCategories.length > 0) {
            results = results.filter((product) => 
                product.productType && 
                product.productType.some(type => selectedCategories.includes(type))
            );
        }

        // Apply sorting
        switch (sortOption) {
            case 'price-low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                // Keep original order for 'featured'
                break;
        }

        setFilteredProducts(results);
    }, [products, priceRange, selectedCategories, sortOption]);

    const toggleFilterSection = (section) => {
        setExpandedFilters((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const resetFilters = () => {
        setPriceRange([0, 1000]);
        setSelectedCategories([]);
        setSortOption('featured');
    };

    const toggleCategoryFilter = (category) => {
        setSelectedCategories((prev) => 
            prev.includes(category) 
                ? prev.filter((c) => c !== category) 
                : [...prev, category]
        );
    };

    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? <FaStar key={i} className='text-yellow-400' /> : <FaRegStar key={i} className='text-gray-300' />,
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='flex flex-col md:flex-row gap-8'>
                    {/* Filter sidebar skeleton */}
                    <div className='hidden md:block w-72'>
                        <Skeleton height={40} count={4} className='mb-4' />
                    </div>

                    {/* Product grid skeleton */}
                    <div className='flex-1'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className='bg-white rounded-lg overflow-hidden shadow-sm'>
                                    <Skeleton height={200} />
                                    <div className='p-4'>
                                        <Skeleton count={2} />
                                        <Skeleton width={60} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Breadcrumb and back button */}
            <div className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'>
                    <IoIosArrowBack className='mr-1' />
                    Back to Brands
                </button>
                <span>/</span>
                <span className='font-medium text-gray-900 capitalize'>{brandName}</span>
            </div>

            {/* Page header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 capitalize mb-4 md:mb-0'>
                    {brandName} Bundles
                    <span className='ml-2 text-sm font-normal text-gray-500'>({filteredProducts.length} products)</span>
                </h1>

                <div className='flex items-center space-x-4'>
                    {/* View mode toggle */}
                    <div className='hidden sm:flex bg-gray-100 rounded-lg p-1'>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            aria-label='Grid view'>
                            <BsGrid3X3Gap className='text-gray-700' />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            aria-label='List view'>
                            <BsListUl className='text-gray-700' />
                        </button>
                    </div>

                    {/* Sort dropdown */}
                    <div className='relative'>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className='appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                            <option value='featured'>Featured</option>
                            <option value='price-low'>Price: Low to High</option>
                            <option value='price-high'>Price: High to Low</option>
                            <option value='newest'>Newest Arrivals</option>
                        </select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                            <FaChevronDown className='text-xs' />
                        </div>
                    </div>

                    {/* Mobile filter button */}
                    <button
                        className='sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors'
                        onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? <FaTimes /> : <FaFilter />}
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-8'>
                {/* Filters Sidebar */}
                <div
                    className={`${
                        showFilters ? 'block' : 'hidden'
                    } md:block w-full md:w-72 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-8`}>
                    <div className='flex justify-between items-center mb-6'>
                        <h3 className='font-bold text-xl text-gray-900'>Filters</h3>
                        <button
                            onClick={resetFilters}
                            className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'>
                            Reset All
                        </button>
                    </div>

                    {/* Category Filter */}
                    {allCategories.length > 0 && (
                        <div className='border-b border-gray-200 pb-6 mb-6'>
                            <div
                                className='flex justify-between items-center cursor-pointer'
                                onClick={() => toggleFilterSection('category')}>
                                <div className='flex items-center'>
                                    <BiCategory className='mr-2 text-gray-500' />
                                    <h4 className='font-medium text-gray-900'>Categories</h4>
                                </div>
                                {expandedFilters.category ? (
                                    <FaChevronUp className='text-gray-500' />
                                ) : (
                                    <FaChevronDown className='text-gray-500' />
                                )}
                            </div>

                            {expandedFilters.category && (
                                <div className='mt-4 space-y-2'>
                                    {allCategories.map((category, index) => (
                                        <button
                                            key={index}
                                            className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                selectedCategories.includes(category)
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                            onClick={() => toggleCategoryFilter(category)}>
                                            <span className='truncate capitalize'>{category}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Price Filter */}
                    <div className='border-b border-gray-200 pb-6 mb-6'>
                        <div
                            className='flex justify-between items-center cursor-pointer'
                            onClick={() => toggleFilterSection('price')}>
                            <div className='flex items-center'>
                                <RiPriceTag3Line className='mr-2 text-gray-500' />
                                <h4 className='font-medium text-gray-900'>Price Range</h4>
                            </div>
                            {expandedFilters.price ? (
                                <FaChevronUp className='text-gray-500' />
                            ) : (
                                <FaChevronDown className='text-gray-500' />
                            )}
                        </div>

                        {expandedFilters.price && (
                            <div className='mt-4'>
                                <div className='flex justify-between text-sm text-gray-600 mb-3'>
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                                <div className='px-2 mb-4'>
                                    <input
                                        type='range'
                                        min='0'
                                        max='1000'
                                        step='10'
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className='w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer'
                                    />
                                </div>
                                <div className='flex gap-3'>
                                    <div className='flex-1'>
                                        <label className='block text-xs text-gray-500 mb-1'>Min</label>
                                        <div className='relative'>
                                            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>$</span>
                                            <input
                                                type='number'
                                                min='0'
                                                max={priceRange[1]}
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                                className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <label className='block text-xs text-gray-500 mb-1'>Max</label>
                                        <div className='relative'>
                                            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>$</span>
                                            <input
                                                type='number'
                                                min={priceRange[0]}
                                                max='1000'
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Grid/List */}
                <div className='flex-1'>
                    {filteredProducts.length === 0 ? (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
                            <h3 className='text-xl font-medium text-gray-900 mb-2'>No products found</h3>
                            <p className='text-gray-600 mb-6'>Try adjusting your filters or search for something else.</p>
                            <button
                                onClick={resetFilters}
                                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
                                Reset All Filters
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className='bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group'
                                    onClick={() => navigate(`/product/${product._id}`)}>
                                    <div className='relative pt-[100%] bg-gray-50'>
                                        <img
                                            src={product.frontImage || product.image || 'https://via.placeholder.com/300'}
                                            alt={product.title}
                                            className='absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform group-hover:scale-105'
                                            loading='lazy'
                                        />
                                        {new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                                            <span className='absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <div className='p-4'>
                                        <h3 className='font-semibold text-gray-900 line-clamp-1 mb-1'>{product.title}</h3>
                                        <p className='text-gray-500 text-sm line-clamp-2 mb-3'>{product.description}</p>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-lg font-bold text-gray-900'>${product.price.toFixed(2)}</p>
                                            <div className='flex items-center'>
                                                {product.colors && product.colors.length > 0 && (
                                                    <div className='flex -space-x-2'>
                                                        {product.colors.slice(0, 3).map((color, index) => (
                                                            <div 
                                                                key={index}
                                                                className='w-5 h-5 rounded-full border border-gray-200'
                                                                style={{ backgroundColor: color }}
                                                                title={`Color option ${index + 1}`}
                                                            />
                                                        ))}
                                                        {product.colors.length > 3 && (
                                                            <div className='w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs'>
                                                                +{product.colors.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className='bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group flex'
                                    onClick={() => navigate(`/product/${product._id}`)}>
                                    <div className='w-1/3 relative bg-gray-50'>
                                        <img
                                            src={product.frontImage || product.image || 'https://via.placeholder.com/300'}
                                            alt={product.title}
                                            className='w-full h-full object-contain p-6'
                                            loading='lazy'
                                        />
                                    </div>
                                    <div className='w-2/3 p-6'>
                                        <h3 className='font-semibold text-lg text-gray-900 mb-2'>{product.title}</h3>
                                        <p className='text-gray-600 mb-4 line-clamp-2'>{product.description}</p>
                                        <div className='mb-4'>
                                            {product.productType && (
                                                <div className='flex flex-wrap gap-2 mb-3'>
                                                    {product.productType.map((type, index) => (
                                                        <span 
                                                            key={index} 
                                                            className='px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize'
                                                        >
                                                            {type}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-xl font-bold text-gray-900'>${product.price.toFixed(2)}</p>
                                            <div className='flex -space-x-2'>
                                                {product.colors && product.colors.slice(0, 3).map((color, index) => (
                                                    <div 
                                                        key={index}
                                                        className='w-6 h-6 rounded-full border border-gray-200'
                                                        style={{ backgroundColor: color }}
                                                        title={`Color option ${index + 1}`}
                                                    />
                                                ))}
                                                {product.colors && product.colors.length > 3 && (
                                                    <div className='w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs'>
                                                        +{product.colors.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandProductPage;