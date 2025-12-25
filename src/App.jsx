import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Navigation from './components/Navigation';
import Cart from './components/Cart';
import Contact from './Pages/Contact';
import About from './Pages/About';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import LoginPage from './Pages/login';
import SignUp from './Pages/signup';
import OtpPage from './Pages/otp';
import SellPage from './Pages/seller';
import Order from './Pages/order';
import OrderDetails from './Pages/order';
import Success from './components/Success';
import CustomerOrders from './Pages/CustomerOrders';
import ProductTypePage from './Pages/ProductTypePage';
import ProductDetailsPage from './Pages/ProductDetailsPage';
import Bundles from './Pages/Bundles';
import BundlesDetailsPage from './Pages/BundlesDetailsPage';
import ProductDetail from './Pages/ProductDetail';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthStatus } from './store/authSlice';
import Disclaimer from './Pages/Disclaimer';
import PaymentInfo from './Pages/PaymentInfo';
import ReturnPolicy from './Pages/ReturnPolicy';
import ShippingPolicy from './Pages/ShippingPolicy';
import OrderSummary from './Pages/OrderDetails';
import AdminLogin from './Pages/AdminLogin';
import BrandPage from './Pages/BrandPage';
import PopupController from './components/PopupController';
import CookiePolicy from './Pages/CookiePolicy';
import FAQs from './Pages/FAQs';
import FAQsPage from './Pages/FAQPage';
import PriceGuide from './Pages/PriceGuide';
import VatInformation from './Pages/VatInformation';
import MaintenancePage from './Pages/maintanance';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
};



const useForceRefreshOnSameRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event) => {
      let target = event.target;
      while (target && target !== document.documentElement) {
        if (target.tagName === 'A') {
          const href = target.getAttribute('href');
          if (href && href === location.pathname) {
            event.preventDefault();
            // Force remount of the route component
            navigate('/force-remount', { replace: true });
            setTimeout(() => navigate(href, { replace: true }), 0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;
        }
        target = target.parentNode;
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [location.pathname, navigate]);
};

import { getApiBaseUrl, setApiBaseUrl } from './utils/config';

// ... existing imports

const App = () => {
  const isMaintenanceMode = false; // Set this to false to turn off maintenance mode

  const location = useLocation();
  const isSellerPage = location.pathname === '/admin/dashboard';
  const dispatch = useDispatch();

  const [backendUrl, setBackendUrl] = React.useState('');

  useEffect(() => {
    setBackendUrl(getApiBaseUrl());
  }, []);

  const handleSaveUrl = () => {
    setApiBaseUrl(backendUrl);
    window.location.reload(); // Reload to apply changes across the app
  };

  useForceRefreshOnSameRoute();
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isMaintenanceMode) {
    return (
      <Routes>
        <Route path="*" element={<MaintenancePage />} />
      </Routes>
    );
  }
  return (
    <>
      <div style={{ padding: '10px', background: '#f0f0f0', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
        <label htmlFor="backendUrl">Backend Base URL:</label>
        <input
          type="text"
          id="backendUrl"
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          placeholder="http://localhost:5000/api"
          style={{ padding: '5px', width: '300px' }}
        />
        <button onClick={handleSaveUrl} style={{ padding: '5px 10px', cursor: 'pointer' }}>Apply</button>
      </div>
      {!isSellerPage && <Navigation />}

      <ScrollToTop />

      <Routes>
        {/* Existing routes */}
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/otp' element={<OtpPage />} />
        <Route path='/order' element={<Order />} />
        <Route path='/orders/:orderId' element={<OrderDetails />} />
        <Route path='/success' element={<Success />} />
        <Route path='/disclaimer' element={<Disclaimer />} />
        <Route path='/payment-info' element={<PaymentInfo />} />
        <Route path='/return-policy' element={<ReturnPolicy />} />
        <Route path='/cookie-policy' element={<CookiePolicy />} />
        <Route path='/shipping-policy' element={<ShippingPolicy />} />
        <Route path='/customers/:customerId/orders' element={<CustomerOrders />} />
        <Route path='/products/:productType' element={<ProductTypePage />} />
        <Route path='/product/:id' element={<ProductDetailsPage />} />
        <Route path='/bundle/:id' element={<BundlesDetailsPage />} />
        <Route path='/bundles' element={<Bundles />} />
        <Route path='/products/:productId' element={<ProductDetail />} />
        <Route path='/ordersSummary/:orderId' element={<OrderSummary />} />
        <Route path='/brands/:brandName' element={<BrandPage />} />
        <Route path='/faqs' element={<FAQsPage />} />
        <Route path='/price-guide' element={<PriceGuide />} />
        <Route path='/vat-information' element={<VatInformation />} />

        {/* Admin routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<SellPage />} />
        <Route path='*' element={<Home />} />
        <Route path='/brands/:brandName' element={<BrandPage />} />

      </Routes>
      <PopupController />
      {!isSellerPage && <Footer />}
    </>
  );
};

export default App;