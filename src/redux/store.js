import {configureStore} from '@reduxjs/toolkit';
import productReducer from '../screens/product/ProductSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
  },
});
