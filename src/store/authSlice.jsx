import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import axios from 'axios';

import { getApiBaseUrl } from '../utils/config';

// Remove top-level apiUrl
// const apiUrl = import.meta.env.VITE_API_BASE_URL;

const initialState = {
	token: null,
	user: null,
	isAuthenticated: false,
	loading: false, // Added for async tracking
	error: null, // Added for error handling
};

// Async thunk for logout
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
	try {
		const response = await axios.post(
			`${getApiBaseUrl()}/auth/logout`,
			{},
			{
				withCredentials: true, // Ensure cookies are sent
			},
		);
		dispatch(logout()); // Sync state update
		return response.data;
	} catch (error) {
		return rejectWithValue(error.response?.data || 'Logout failed');
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.token = action.payload.token || null;
			state.user = action.payload.user || null;
			state.isAuthenticated = true;
			state.error = null;
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
			state.isAuthenticated = false;
		},
		setAuthState: (state, action) => {
			state.isAuthenticated = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

// Enhanced checkAuthStatus (compatible with thunk)
export const checkAuthStatus = () => async (dispatch) => {
	try {
		const response = await fetch(`${getApiBaseUrl()}/auth/check`, {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.ok) {
			const userData = await response.json();
			dispatch(
				loginSuccess({
					user: userData,
					token: null, // Assuming token is in cookies
					isAuthenticated: true,
				}),
			);
		} else {
			dispatch(logout());
		}
	} catch (error) {
		dispatch(logout());
	}
};

// Persistence config (updated)
const authPersistConfig = {
	key: 'auth',
	storage,
	whitelist: ['isAuthenticated', 'user'], // Still exclude token
	blacklist: ['loading', 'error'], // Don't persist transient states
};

export const { loginSuccess, logout, setAuthState } = authSlice.actions;
export const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);
export default authSlice.reducer;
