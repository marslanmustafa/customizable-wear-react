	import { createSlice } from '@reduxjs/toolkit';

	const initialState = {
		items: [],
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart: (state, action) => {
			
			state.items = action.payload; // Set the cart items from the API response
		},
		
		addItem: (state, action) => {
				const {
					_id: productId,
					size,
					color,
					method,
					logo,
					frontImage,
					position,
					textLine,
					font,
					notes,
					quantity,
				} = action.payload;
				

				const existingItem = state.items.find(
					(item) =>
						item.productId === productId &&
						item.size === size &&
						item.color === color &&
						item.method === method &&
						item.position === position,
				);

				if (existingItem) {

					// Increase quantity if the same product exists
					existingItem.quantity += quantity || 1;
				} else {
					// Add new item to the cart
					state.items.push({
						...action.payload,
						textLine: textLine || '', // Ensure these fields are stored
						font: font || '',
						notes: notes || '',
						quantity: quantity || 1,
					});
				}

				
			},

			removeItem: (state, action) => {
				// Ensure you are filtering by the correct productId property
				state.items = state.items.filter((item) => item._id !== action.payload);
				
			},

			increaseQuantity: (state, action) => {
				state.items = state.items.map((item) =>
					item._id === action.payload ? { ...item, quantity: item.quantity + 1 } : item,
				);
			},

			decreaseQuantity: (state, action) => {
				const item = state.items.find((item) => item._id === action.payload);

				if (item && item.quantity > 1) {
					// Optimistically decrease the quantity in Redux state
					item.quantity -= 1;
				}
			},
			clearCart: (state) => {
				state.items = []; // Reset cart to empty array
			},
		
		},
	});

	export const { setCart,clearCart, addItem, removeItem, increaseQuantity, decreaseQuantity } = cartSlice.actions;

	export default cartSlice.reducer;
