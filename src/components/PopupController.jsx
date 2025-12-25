import React, { useState, useEffect } from 'react';

import CookieConsent from './CookieConsent';
import PopupShirtCustomize from './PopupShirtCustomize';
const PopupController = () => {
	const [showWatchPopup, setShowWatchPopup] = useState(false);
	const [showCookiePopup, setShowCookiePopup] = useState(false);

	useEffect(() => {
		const watchTimer = setTimeout(() => setShowWatchPopup(true), 2000);
		const cookieTimer = setTimeout(() => setShowCookiePopup(true), 7000);
		return () => {
			clearTimeout(watchTimer);
			clearTimeout(cookieTimer);
		};
	}, []);

	const closeWatchPopup = () => setShowWatchPopup(false);
	const closeCookiePopup = () => setShowCookiePopup(false);

	return (
		<div className='fixed bottom-4 right-4 z-50 space-y-3'>
			{showWatchPopup && (
			<CookieConsent onClose={closeCookiePopup} />
			)}

            { showCookiePopup && (
                <PopupShirtCustomize onClose={closeWatchPopup} />
				
			)}
		</div>
	);
};

export default PopupController;
