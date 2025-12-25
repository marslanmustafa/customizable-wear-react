import React, { useState, useEffect } from 'react';

import Hero from '../components/hero';
import Category from '../components/Category';
// import Products from "./Products";
import Bundles from './Bundles';
import GuideCards from '../components/GuideCards';
import MarketingCard from '../components/MarketingCard';
import BrandCarousel from '../components/Brands';
import PopupShirtCustomize from '../components/PopupShirtCustomize';
import TrustBanner from '../components/TrustBanner';
import FAQs from './FAQs';
import PersonaliseGarments from '../components/personliseBrand';

const Home = () => {
	const [showPopup, setShowPopup] = useState(false);
	useEffect(() => {
		if (typeof window === 'undefined') return;

		try {
			// Safely get and parse the popup state
			const popupStateStr = window.localStorage.getItem('popupState');
			const popupState = popupStateStr ? JSON.parse(popupStateStr) : { shown: false };

			if (!popupState.shown) {
				const timer = setTimeout(() => {
					setShowPopup(true);
					// Update with current timestamp
					window.localStorage.setItem(
						'popupState',
						JSON.stringify({
							shown: true,
							lastShown: new Date().toISOString(),
						}),
					);
				}, 4000);

				return () => clearTimeout(timer);
			}
		} catch (e) {
			console.error('Error handling popup state:', e);
			// Fallback: Don't show popup if there's an error
			window.localStorage.setItem('popupState', JSON.stringify({ shown: true }));
		}
	}, []);
	return (
		<div className='bg-[#F3F4F6]  pb-24 md:py-0  lg:px-0'>
			<div>
				<TrustBanner />
			</div>
			<div className='container mx-auto px-4 md:px-6 pt-4'>
				<Hero />
			</div>

			<div className='container mx-auto '>
				<PersonaliseGarments />
			</div>

			<div className='container mx-auto px-4 md:px-6'>
				<Category />
			</div>

			{/* <div className='container mx-auto px-6 md:px-10 pt-8'>
				<Products showTShirtSelector={false} />
			</div> */}
			<div className='container mx-auto px-6 md:px-10 pt-8'>
				<Bundles />
			</div>
			<div className='container mx-auto px-6 md:px-6 pt-8'>
				<GuideCards />
			</div>
			<div className='container mx-auto px-4 md:px-6 pt-8'>
				<MarketingCard />
			</div>
			<div className='container mx-auto px-6 md:px-10 pt-8'>
				<BrandCarousel />
			</div>
			<div className='container mx-auto px-6 md:px-10 pt-8'>
				<FAQs/>
			</div>
			<PopupShirtCustomize isOpen={showPopup} onClose={() => setShowPopup(false)} />
		</div>
	);
};

export default Home;
