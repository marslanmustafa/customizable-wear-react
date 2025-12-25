import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
	name: 'order',
	initialState: {
		status: null, // Store order status here
	},
	reducers: {
        setOrderStatus: (state, action) => {
			state.status = action.payload;
		},
		clearOrderStatus: (state) => {
			state.status = null;
		},
	},
});

export const { setOrderStatus, clearOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
