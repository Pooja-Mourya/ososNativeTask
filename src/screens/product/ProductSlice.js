import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  cart: [],
  totalCartItems: 0,
  total: 0,
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    return data;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    increment: (state, action) => {
      const product = state.cart.find(item => item.id === action.payload);
      if (product) {
        product.quantity += 1;
        product.total = product.quantity * product.price;
      }
      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    decrement: (state, action) => {
      const product = state.cart.find(item => item.id === action.payload);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        product.total = product.quantity * product.price;
      } else {
        state.cart = state.cart.filter(item => item.id !== action.payload);
      }
      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    addToCart: (state, action) => {
      const { id, title, price } = action.payload;
      const existingItem = state.cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        const newItem = {
          id,
          title,
          price,
          quantity: 1,
          total: price
        };
        state.cart.push(newItem);
      }

      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { increment, decrement, addToCart, removeFromCart } = productSlice.actions;

export default productSlice.reducer;

export const selectIsInCart = (state, productId) => {
  return state.product.cart.some(item => item.id === productId);
};
