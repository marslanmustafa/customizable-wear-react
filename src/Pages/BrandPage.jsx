import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaStar, FaRegStar } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { RiPriceTag3Line } from 'react-icons/ri';
import { BsGrid3X3Gap, BsListUl } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
import { getApiBaseUrl } from '../utils/config';


const BRANDS = [
	{ name: "Kustom Kit", logo: kustomkit },
	{ name: "Fruit of the Loom", logo: fruitOfTheLoom },
	{ name: "Gildan", logo: gildan },
	{ name: "Printer Essentials", logo: printerEssentials },
	{ name: "Result", logo: result },
	{ name: "Jobman Workwear", logo: jobmanWorkwear },
	{ name: "James Harvest", logo: jamesHarvest },
	{ name: "HI-VIS & PPE", logo: hiv, aliases: ["hi vis", "hi-vis", "hi vis & ppe"] },
	{ name: "Beechfield", logo: beechfield },
	{ name: "UCC (Ultimate Clothing Collection)", logo: ucc },
];

const BrandPage = () => {
	const { brandName } = useParams();
	const decodedBrandName = decodeURIComponent(brandName);
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(false);
	const [viewMode, setViewMode] = useState('grid');
	const [sortOption, setSortOption] = useState('featured');
	const navigate = useNavigate();
	// const apiUrl = import.meta.env.VITE_API_BASE_URL;


	const [priceRange, setPriceRange] = useState([0, 1000]);
	const [expandedFilters, setExpandedFilters] = useState({
		price: true,
		category: true,
	});
	const [selectedRatings, setSelectedRatings] = useState([]);





	useEffect(() => {
		fetchProducts();
	}, [brandName]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${getApiBaseUrl()}/products/`, {
				credentials: 'include',
				method: 'GET',
			});
			const data = await response.json();


			if (!data.products || !Array.isArray(data.products)) {
				setProducts([]);
				return;
			}

			setProducts(data.products);
		} catch (error) {
			setProducts([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!products.length) return;

		let results = products.filter((product) => {
			return product.brand?.toLowerCase() === brandName.toLowerCase();
		});

		results = results.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

		if (selectedRatings.length > 0) {
			results = results.filter((product) => selectedRatings.includes(Math.round(product.rating || 0)));
		}

		switch (sortOption) {
			case 'price-low':
				results.sort((a, b) => a.price - b.price);
				break;
			case 'price-high':
				results.sort((a, b) => b.price - a.price);
				break;
			case 'rating':
				results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
				break;
			case 'newest':
				results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				break;
			default:
				break;
		}

		setFilteredProducts(results);
	}, [products, brandName, priceRange, selectedRatings, sortOption]);

	const toggleFilterSection = (section) => {
		setExpandedFilters((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const resetFilters = () => {
		setPriceRange([0, 1000]);
		setSelectedRatings([]);
		setSortOption('featured');
	};

	const toggleRatingFilter = (rating) => {
		setSelectedRatings((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]));
	};

	const brandInfo = BRANDS.find((brand) => {
		// Remove all special characters and normalize spaces
		const normalizeString = (str) =>
			str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

		return normalizeString(brand.name) === normalizeString(decodedBrandName);
	});

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
					<div className='hidden md:block w-72'>
						<Skeleton height={40} count={4} className='mb-4' />
					</div>
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
			<div className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
				<button
					onClick={() => navigate('/')}
					className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'>
					<IoIosArrowBack className='mr-1' />
					Back to Home
				</button>
				<span>/</span>
				<span className='font-medium text-gray-900 capitalize'>{brandName.replace(/-/g, ' ')}</span>
			</div>

			<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>

				<div className='flex  items-center gap-3 sm:gap-4 mb-4 md:mb-0'>

					<div className='text-center sm:text-left'>
						<span className='text-xs sm:text-sm font-normal text-gray-500'>
							({filteredProducts.length} products)
						</span>
					</div>
				</div>
				{brandInfo?.logo && (
					<div className='relative h-10 w-full max-w-[200px] sm:h-12 sm:max-w-[230px] md:h-14 md:max-w-[250px]'>
						<img
							src={brandInfo.logo}
							alt={brandInfo.name}
							className='h-full w-full object-contain object-center'
							loading='lazy'
						/>
					</div>
				)}
				<div className='flex items-center space-x-4'>
					<div className='hidden sm:flex bg-gray-100 rounded-lg p-1'>
						<button
							onClick={() => setViewMode('grid')}
							className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
							<BsGrid3X3Gap className='text-gray-700' />
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
							<BsListUl className='text-gray-700' />
						</button>
					</div>



					<div className='relative'>
						<select
							value={sortOption}
							onChange={(e) => setSortOption(e.target.value)}
							className='appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
							<option value='featured'>Featured</option>
							<option value='price-low'>Price: Low to High</option>
							<option value='price-high'>Price: High to Low</option>
							<option value='rating'>Highest Rated</option>
							<option value='newest'>Newest Arrivals</option>
						</select>
						<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
							<FaChevronDown className='text-xs' />
						</div>
					</div>

					<button
						className='sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors'
						onClick={() => setShowFilters(!showFilters)}>
						{showFilters ? <FaTimes /> : <FaFilter />}
						<span>Filters</span>
					</button>
				</div>
			</div>

			<div className='flex flex-col md:flex-row gap-8'>
				<div
					className={`${showFilters ? 'block' : 'hidden'
						} md:block w-full md:w-72 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-8`}>
					<div className='flex justify-between items-center mb-6'>
						<h3 className='font-bold text-xl text-gray-900'>Filters</h3>
						<button
							onClick={resetFilters}
							className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'>
							Reset All
						</button>
					</div>

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
									<span>£{priceRange[0]}</span>
									<span>£{priceRange[1]}</span>
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

					<div className='pb-6'>
						<h4 className='font-medium text-gray-900 mb-4'>Customer Ratings</h4>
						<div className='space-y-2'>
							{[5, 4, 3, 2, 1].map((rating) => (
								<button
									key={rating}
									onClick={() => toggleRatingFilter(rating)}
									className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors ${selectedRatings.includes(rating) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
										}`}>
									<div className='flex mr-2'>{renderRatingStars(rating)}</div>
									<span className='text-gray-500 text-xs'>& Up</span>
								</button>
							))}
						</div>
					</div>
				</div>

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
											src={product.frontImage || 'https://via.placeholder.com/300'}
											alt={product.title}
											className='absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform group-hover:scale-105'
											loading='lazy'
										/>
										{product.isNew && (
											<span className='absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
												New
											</span>
										)}
									</div>
									<div className='p-4'>
										<h3 className='font-semibold text-gray-900 line-clamp-1 mb-1'>{product.title}</h3>
										<p className='text-gray-500 text-sm line-clamp-2 mb-3'>{product.description}</p>
										<div className='flex items-center justify-between'>
											<p className='text-lg font-bold text-gray-900'>£{product.price.toFixed(2)}</p>
											{product.rating && (
												<div className='flex items-center'>
													<div className='flex mr-1'>{renderRatingStars(Math.round(product.rating))}</div>
													<span className='text-xs text-gray-500'>({product.reviewCount || 0})</span>
												</div>
											)}
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
											src={product.frontImage || 'https://via.placeholder.com/300'}
											alt={product.title}
											className='w-full h-full object-contain p-6'
											loading='lazy'
										/>
									</div>
									<div className='w-2/3 p-6'>
										<h3 className='font-semibold text-lg text-gray-900 mb-2'>{product.title}</h3>
										<p className='text-gray-600 mb-4'>{product.description}</p>
										<div className='flex items-center mb-3'>
											<div className='flex mr-2'>{renderRatingStars(Math.round(product.rating || 0))}</div>
											<span className='text-xs text-gray-500'>({product.reviewCount || 0} reviews)</span>
										</div>
										<p className='text-xl font-bold text-gray-900 mb-4'>${product.price.toFixed(2)}</p>
										<button className='px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors'>
											View Details
										</button>
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

export default BrandPage;
