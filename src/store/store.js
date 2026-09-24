import { configureStore } from '@reduxjs/toolkit';
import hotelsReducer from './hotelsSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('stayora_hotels_v5');
    if (serializedState === null) {
      return undefined; // Use initial state (the 20 default hotels)
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('stayora_hotels_v5', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    hotels: hotelsReducer,
  },
  preloadedState
});

// Subscribe to store changes to save them
store.subscribe(() => {
  saveState({
    hotels: store.getState().hotels
  });
});
