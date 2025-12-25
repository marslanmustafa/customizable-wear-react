import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import promoCodeReducer from './promoCodeSlice';
import authReducer from './authSlice';
import orderReducer from './orderSlice';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Persist config for auth
// const authPersistConfig = {
// 	key: 'auth',
// 	storage,
// 	whitelist: ['token', 'user', 'isAuthenticated'],
// };

// Persist config for cart
const cartPersistConfig = {
	key: 'cart',
	storage,
	whitelist: ['items'], // Only persist the cart items
};

// Persist config for promoCode
const promoCodePersistConfig = {
	key: 'promoCode',
	storage,
	whitelist: ['code', 'discount'], // Persist the active promo code and discount
};

// Combine reducers with their respective persist configs
const rootReducer = combineReducers({
	auth: authReducer,
	cart: persistReducer(cartPersistConfig, cartReducer),
	promoCode: persistReducer(promoCodePersistConfig, promoCodeReducer),
	order: orderReducer, // No persistence for orders
});

// Create the store
const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

// Create the persistor
export const persistor = persistStore(store);

// Export the store
export { store };
export default store;
