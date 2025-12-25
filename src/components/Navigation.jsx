import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaShoppingCart, FaUser, FaUserPlus, FaChevronDown } from 'react-icons/fa';
import logo from '../assets/images/log.png';
import { logoutUser } from '../store/authSlice';
import { useToast } from '../components/ui/use-toast';
import { MdSlowMotionVideo } from 'react-icons/md';

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
	const [isBrandOpen, setIsBrandOpen] = useState(false);
	const cartItems = useSelector((state) => state.cart.items);
	const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
	const { isAuthenticated, loading } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const { toast } = useToast();

	// Brand data
	const brands = [
		{ name: 'Beechfield', path: '/brands/Beechfield' },
		{ name: 'Fruit of the Loom', path: '/brands/Fruit Of The Loom' },
		{ name: 'Gildan', path: '/brands/Gildan' },
		{ name: 'HI-VIS & PPE', path: '/brands/HI-VIS & PPE' },
		{ name: 'Jobman Workwear', path: '/brands/Jobman Workwear' },
		{ name: 'James Harvest', path: '/brands/James Harvest' },
		{ name: 'Kustom Kit', path: '/brands/Kustom Kit' },
		{ name: 'Printer Essentials', path: '/brands/Printer Essentials' },
		{ name: 'Result', path: '/brands/Result' },
		{ name: 'UCC', path: '/brands/UCC (Ultimate Clothing Collection)' },
	];

	const categories = [
		{ name: "Hoodies", path: '/products/hoodie' },
		{ name: "Jackets", path: '/products/jacket' },
		{ name: "Polo Shirts", path: '/products/polo' },
		{ name: "Shirts & Blouses", path: '/products/shirt-blouse' },
		{ name: "SweatShirts", path: '/products/sweatshirt' },
		{ name: "T-Shirts", path: '/products/t-shirt' },
		{ name: "Trousers", path: '/products/trousers' },
	];

	const accessories = [
		{ name: "BackPacks", path: '/products/backpack' },
		{ name: 'HeadWear', path: '/products/headwear' },
		{ name: "HI-VIS", path: '/products/hi-vis' },
		{ name: 'WorkBags', path: '/products/workbag' },

	];

	const toggleMenu = () => setIsOpen(!isOpen);
	const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
	const toggleBrand = () => setIsBrandOpen(!isBrandOpen);
	const toggleAccessories = () => setIsAccessoriesOpen(!isAccessoriesOpen);
	const handleLogout = async () => {
		try {
			await dispatch(logoutUser()).unwrap();
			toast({
				title: 'Logged out successfully',
				variant: 'success',
				className: 'bg-green-500 text-white border-0',
			});
		} catch (error) {
			toast({
				title: 'Logout failed',
				description: error || 'Please try again',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='bg-white sticky z-[60] shadow-md top-0'>
			{/* First Row - Logo, Phone, Cart, Auth */}
			<div className='bg-white text-[#0f2252] py-0 px-4'>
				<div className='max-w-7xl mx-auto flex justify-between items-center'>
					<div className='flex  items-center justify-center space-y-2'>
						<Link to='/'>
							<img className='h-12 md:h-16' src={logo} alt='logo' />
						</Link>
						<p className='text-sm md:text-xl font-bold text-center'>Wear Your Identity</p>
					</div>

					<div className='flex items-center space-x-4 font-bold'>
						<a href='tel:+44 7723233021' className='hover:underline hidden md:flex items-center'>
							<FaPhone className='mr-1' />
							<span>+44 7723233021</span>
						</a>

						<div className=' sm:text-[#0f2252] py-1 px-3 rounded font-bold'>
							<Link
								to='/cart'
								className='relative flex items-center'
								aria-label={`Cart with ${totalCartQuantity} items`}>
								<FaShoppingCart className='h-5 w-5' />
								{totalCartQuantity > 0 && (
									<span className='absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full'>
										{totalCartQuantity > 9 ? '9+' : totalCartQuantity}
									</span>
								)}
							</Link>
						</div>

						<div className='hidden sm:block font-bold'>
							{isAuthenticated ? (
								<button
									onClick={handleLogout}
									disabled={loading}
									className='text-[#0f2252] px-3 py-1 rounded hover:bg-opacity-90 flex items-center text-sm'>
									<FaUser className='mr-1' />
									{loading ? 'Logging out...' : 'Logout'}
								</button>
							) : (
								<div className='flex items-center space-x-2'>
									<Link
										to='/login'
										className='text-[#0f2252] px-2 py-1 rounded hover:bg-opacity-90 flex items-center text-sm'>
										<FaUser className='mr-1' />
										Login
									</Link>
									<Link
										to='/signup'
										className='text-[#0f2252] px-2 py-1 rounded hover:bg-opacity-90 flex items-center text-sm'>
										<FaUserPlus className='mr-1' />
										Sign Up
									</Link>
								</div>
							)}
						</div>

						<div className='flex md:hidden'>
							<button onClick={toggleMenu} className='text-[#0f2252] p-1'>
								<FaBars className='h-6 w-6' />
							</button>
						</div>

						<div className='hidden sm:inline-block sm:text-white bg-[#0f2252] text-white py-1 px-3 rounded'>
							<Link to='/contact' className='hover:text-gray-300 transition'>
								Get a Quote
							</Link>
						</div>
						<div className='hidden sm:inline-block sm:text-white bg-[#0f2252] text-white py-1 px-3 rounded'>
							<a href='https://www.youtube.com/embed/xbxsk-Aszhg?si=OhgFCSDsQVfOPzF8'>
															<MdSlowMotionVideo className='inline-block' /> Watch the Guide
														</a>
							
						</div>
					</div>
				</div>
			</div>

			{/* Second Row - Main Navigation */}
			<div className='bg-[#0f2252] text-white py-4 px-4 hidden md:block font-bold'>
				<div className='max-w-6xl mx-auto flex justify-center items-center space-x-6'>
					<Link to='/' className='hover:text-gray-300 transition'>
						Home
					</Link>
					<Link to='/about' className='hover:text-gray-300 transition'>
						About Us
					</Link>
					{/* <Link to='/products' className='hover:text-gray-300 transition'>
						Customize
					</Link> */}

					{/* Categories Dropdown */}
					<div className='relative group'>
						<button className='hover:text-gray-300 transition flex items-center'>
							Products <FaChevronDown className='ml-1 text-xs' />
						</button>
						<div className='absolute left-0 mt-0 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
							{categories.map((category) => (
								<Link key={category.path} to={category.path} className='block px-4 py-2 hover:bg-gray-100'>
									{category.name}
								</Link>
							))}
						</div>
					</div>

					{/* Categories Dropdown */}
					<div className='relative group'>
						<button className='hover:text-gray-300 transition flex items-center'>
							Accessories <FaChevronDown className='ml-1 text-xs' />
						</button>
						<div className='absolute left-0 mt-0 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
							{accessories.map((accessories) => (
								<Link key={accessories.path} to={accessories.path} className='block px-4 py-2 hover:bg-gray-100'>
									{accessories.name}
								</Link>
							))}
						</div>
					</div>

					{/* Brands Dropdown - Matching Categories Style */}
					<div className='relative group'>
						<button className='hover:text-gray-300 transition flex items-center'>
							Brands <FaChevronDown className='ml-1 text-xs' />
						</button>
						<div className='absolute left-0 mt-0 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
							{brands.map((brand) => (
								<Link key={brand.path} to={brand.path} className='block px-4 py-2 hover:bg-gray-100'>
									{brand.name}
								</Link>
							))}
						</div>
					</div>

					
					<Link to='/contact' className='hover:text-gray-300 transition'>
						Contact Us
					</Link>


				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className='fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden'>
					<div className='absolute top-0 right-0 h-full w-3/4 bg-[#0f2252] text-white shadow-xl'>
						<div className='flex justify-between items-center p-4 border-b'>
							<div className='font-bold'>Menu</div>
							<button onClick={toggleMenu} className='text-white'>
								<FaTimes className='h-6 w-6' />
							</button>
						</div>

						<div className='overflow-y-auto h-full pb-20'>
							<div className='space-y-1 p-4'>
								<Link to='/' className='block py-3 px-4 hover:bg-gray-700 rounded' onClick={toggleMenu}>
									Home
								</Link>
								<Link to='/about' className='block py-3 px-4 hover:bg-gray-700 rounded' onClick={toggleMenu}>
									About Us
								</Link>
								<div className='border-t border-gray-700 pt-2'>
									<button
										onClick={toggleCategory}
										className='w-full flex justify-between items-center py-3 px-4 hover:bg-gray-700 rounded'>
										<span>Categories</span>
										<FaChevronDown className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
									</button>
									{isCategoryOpen && (
										<div className='pl-4'>
											{categories.map((category) => (
												<Link
													key={category.path}
													to={category.path}
													className='block py-2 px-4 hover:bg-gray-700 rounded'
													onClick={toggleMenu}>
													{category.name}
												</Link>
											))}
										</div>
									)}
								</div>

								<div className='border-t border-gray-700 pt-2'>
									<button
										onClick={toggleAccessories}
										className='w-full flex justify-between items-center py-3 px-4 hover:bg-gray-700 rounded'>
										<span>Accessories</span>
										<FaChevronDown className={`transition-transform ${isAccessoriesOpen ? 'rotate-180' : ''}`} />
									</button>
									{isAccessoriesOpen && (
										<div className='pl-4'>
											{accessories.map((accessories) => (
												<Link
													key={accessories.path}
													to={accessories.path}
													className='block py-2 px-4 hover:bg-gray-700 rounded'
													onClick={toggleMenu}>
													{accessories.name}
												</Link>
											))}
										</div>
									)}
								</div>

								<div className='border-t border-gray-700 pt-2'>
									<button
										onClick={toggleBrand}
										className='w-full flex justify-between items-center py-3 px-4 hover:bg-gray-700 rounded'>
										<span>Brands</span>
										<FaChevronDown className={`transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
									</button>
									{isBrandOpen && (
										<div className='pl-4'>
											{brands.map((brand) => (
												<Link
													key={brand.path}
													to={brand.path}
													className='block py-2 px-4 hover:bg-gray-700 rounded'
													onClick={toggleMenu}>
													{brand.name}
												</Link>
											))}
										</div>
									)}
								</div>

								
								<Link to='/contact' className='block py-3 px-4 hover:bg-gray-700 rounded' onClick={toggleMenu}>
									Contact Us
								</Link>
							</div>

							<div className='p-4 border-t border-gray-700'>
								{isAuthenticated ? (
									<button
										onClick={() => {
											handleLogout();
											toggleMenu();
										}}
										disabled={loading}
										className='w-full text-left py-3 px-4 hover:bg-gray-700 rounded'>
										{loading ? 'Logging out...' : 'Logout'}
									</button>
								) : (
									<div className='space-y-2'>
										<Link
											to='/login'
											className='block py-3 px-4 bg-blue-600 text-white rounded text-center'
											onClick={toggleMenu}>
											Login
										</Link>
										<Link
											to='/signup'
											className='block py-3 px-4 bg-white text-[#091638] rounded text-center'
											onClick={toggleMenu}>
											Sign Up
										</Link>
									</div>

									
								)}
								<div className=' space-y-2 mt-8'>
							<Link to='/contact' className='block py-3 px-4 bg-blue-600 text-white rounded text-center'>
								Get a Quote
							</Link>
						</div>

						<div className=' space-y-2 mt-2 block py-3 px-4 bg-blue-600 text-white rounded text-center'>
							<a href='https://www.youtube.com/embed/xbxsk-Aszhg?si=OhgFCSDsQVfOPzF8'>
															<MdSlowMotionVideo className='inline-block' /> Watch the Guide
														</a>
						</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navigation;
