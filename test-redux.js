import { configureStore } from '@reduxjs/toolkit';
import hotelsReducer, { deleteHotel } from './src/store/hotelsSlice.js';

const store = configureStore({
  reducer: {
    hotels: hotelsReducer,
  },
});

console.log("Before:", store.getState().hotels.items.length);
store.dispatch(deleteHotel('1'));
console.log("After:", store.getState().hotels.items.length);
