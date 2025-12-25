import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBox, FaChartBar, FaUsers, FaShoppingCart, FaTimes } from 'react-icons/fa';
import Orders from './orders';
import Products from './products';
import Earnings from './earnings';
import Customers from './customers';
import Logout from './logout';
import PromoCodes from './PromoCodes';
import Bundle from './bundle';
import { getApiBaseUrl } from '../utils/config';

const SellerDashboard = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('Dashboard');
	const [totalOrders, setTotalOrders] = useState(0);
	const [totalProducts, setTotalProducts] = useState(0);
	const [totalEarnings, setTotalEarnings] = useState(0);
	const [totalCustomers, setTotalCustomers] = useState(0);

	const navigate = useNavigate();
	// const apiUrl = import.meta.env.VITE_API_BASE_URL; 

	// ✅ Check if the user is an admin before allowing access
	const checkAdminStatus = async () => {
		// const token = localStorage.getItem('authToken');

		// if (!token) {
		// 	console.error('❌ No auth token found! Redirecting to login.');
		// 	alert('Unauthorized access! Please log in as an admin.');
		// 	navigate('/login');
		// 	return;
		// }

		try {
			const response = await fetch(`${getApiBaseUrl()}/auth/isAdmin`, {
				method: 'GET',
				headers: {
					// Authorization: `Bearer ${token}`, // ✅ Send Token
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			const data = await response.json();


			if (!response.ok || !data.success || !data.isAdmin) {

				alert('Unauthorized access! You are not an admin.');
				// localStorage.removeItem('authToken'); // 🔹 Remove invalid token
				navigate('/login');
			}
		} catch (error) {

			alert('An error occurred. Redirecting to login.');
			navigate('/login');
		}
	};

	// ✅ Fetch Dashboard Data
	const fetchDashboardData = async () => {
		// const token = localStorage.getItem('authToken');

		// if (!token) {
		//   console.error('❌ No auth token found! Redirecting...');
		//   navigate('/login');
		//   return;
		// }

		try {
			const [ordersRes, productsRes, customersRes, earningsRes] = await Promise.all([
				fetch(`${getApiBaseUrl()}/orders/count`, {
					//   headers: { Authorization: `Bearer ${token}` },
					credentials: 'include',
				}),
				fetch(`${getApiBaseUrl()}/products/count`, {
					//   headers: { Authorization: `Bearer ${token}` },
					credentials: 'include',
				}),
				fetch(`${getApiBaseUrl()}/orders/customers`, {
					//   headers: { Authorization: `Bearer ${token}` },
					credentials: 'include',
				}),
				fetch(`${getApiBaseUrl()}/orders/earnings`, {
					//   headers: { Authorization: `Bearer ${token}` },
					credentials: 'include',
				}),
			]);

			if (!ordersRes.ok || !productsRes.ok || !customersRes.ok || !earningsRes.ok) {
				throw new Error('Failed to fetch dashboard data.');
			}

			const ordersData = await ordersRes.json();
			const productsData = await productsRes.json();
			const customersData = await customersRes.json();
			const earningsData = await earningsRes.json();

			setTotalOrders(ordersData.count || 0);
			setTotalProducts(productsData.count || 0);
			setTotalCustomers(customersData.count || 0);
			setTotalEarnings(earningsData.totalEarnings || 0); // Update totalEarnings state
		} catch (error) {

		}
	};

	// ✅ Run admin check and fetch data on component mount
	useEffect(() => {
		checkAdminStatus();
		fetchDashboardData();
	}, []);

	// Function to toggle the sidebar
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const renderContent = () => {
		switch (activeTab) {
			case 'Orders':
				return (
					<div className='p-4'>
						<Orders />
					</div>
				);
			case 'Products':
				return (
					<div className='p-4'>
						<Products />
					</div>
				);
			case 'Earnings':
				return (
					<div className='p-4'>
						<Earnings />
					</div>
				);
			case 'Customers':
				return (
					<div className='p-4'>
						<Customers />
					</div>
				);
			case 'PromoCodes':
				return (
					<div className='p-4'>
						<PromoCodes />
					</div>
				);

			case 'Bundles':
				return (
					<div className='p-4'>
						<Bundle />
					</div>
				);

			case 'Dashboard':
				return (
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
						<DashboardCard title='Orders' value={totalOrders} icon={<FaShoppingCart className='text-orange-600' />} />
						<DashboardCard title='Products' value={totalProducts} icon={<FaBox className='text-orange-600' />} />
						<DashboardCard
							title='Earnings'
							value={`£${totalEarnings.toLocaleString()}`}
							icon={<FaChartBar className='text-orange-600' />}
						/>
						<DashboardCard title='Customers' value={totalCustomers} icon={<FaUsers className=' text-orange-600' />} />
					</div>
				);
			default:
				return <div className='p-4'>Select an option from the menu</div>;
		}
	};

	return (
		<div className='flex  bg-gray-100'>
			{/* Sidebar */}
			<div
				className={`fixed top-0 left-0 z-40 h-full bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
					} transition-transform duration-300 sm:translate-x-0 sm:w-64`}>
				<div className='flex items-center justify-between p-4 bg-orange-400'>
					<h2 className='text-white text-xl font-bold'>Seller Dashboard</h2>
					<button className='text-white sm:hidden' onClick={toggleSidebar}>
						<FaTimes />
					</button>
				</div>
				<nav className='p-4'>
					<ul className='space-y-4'>
						<MenuItem
							icon={<FaChartBar />}
							text='Dashboard'
							isActive={activeTab === 'Dashboard'}
							onClick={() => setActiveTab('Dashboard')}
						/>
						<MenuItem
							icon={<FaShoppingCart />}
							text='Orders'
							isActive={activeTab === 'Orders'}
							onClick={() => setActiveTab('Orders')}
						/>
						<MenuItem
							icon={<FaBox />}
							text='Products'
							isActive={activeTab === 'Products'}
							onClick={() => setActiveTab('Products')}
						/>
						<MenuItem
							icon={<FaChartBar />}
							text='Earnings'
							isActive={activeTab === 'Earnings'}
							onClick={() => setActiveTab('Earnings')}
						/>
						<MenuItem
							icon={<FaUsers />}
							text='Customers'
							isActive={activeTab === 'Customers'}
							onClick={() => setActiveTab('Customers')}
						/>
						<MenuItem
							icon={<FaChartBar />}
							text='Promo Codes'
							isActive={activeTab === 'PromoCodes'}
							onClick={() => setActiveTab('PromoCodes')}
						/>
						<MenuItem
							icon={<FaChartBar />}
							text='Bundle Products'
							isActive={activeTab === 'Bundles'}
							onClick={() => setActiveTab('Bundles')}
						/>
						<Logout />
					</ul>
				</nav>
			</div>

			{/* Main Content */}
			<div className='flex flex-col flex-grow sm:ml-64'>
				<header className='flex items-center justify-between p-4 bg-white shadow-md sm:hidden'>
					<h2 className='text-lg font-semibold'>{activeTab}</h2>
					<button onClick={toggleSidebar} className='text-orange-600'>
						<FaBars />
					</button>
				</header>
				<main className='flex-grow p-4'>{renderContent()}</main>
			</div>
		</div>
	);
};

const MenuItem = ({ icon, text, isActive, onClick }) => (
	<li>
		<button
			onClick={onClick}
			className={`flex items-center p-2 w-full text-left ${isActive ? 'text-orange-600 bg-gray-100' : 'text-gray-700'
				} hover:text-orange-600 hover:bg-gray-100 rounded-lg transition`}>
			<span className='mr-2'>{icon}</span>
			{text}
		</button>
	</li>
);

const DashboardCard = ({ title, value, icon }) => (
	<div className='flex items-center p-4 bg-white shadow rounded-lg'>
		<div className='p-3 bg-gray-100 rounded-full'>{icon}</div>
		<div className='ml-4'>
			<h3 className='text-lg font-medium text-gray-700'>{title}</h3>
			<p className='text-2xl font-bold text-gray-900'>{value}</p>
		</div>
	</div>
);

export default SellerDashboard;
