import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://stayora-89i1.onrender.com/api/hotels';

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE_URL}?${query}` : API_BASE_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch hotels');
    return response.json();
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchHotelById',
  async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch hotel');
    return response.json();
  }
);

export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (formData) => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create hotel');
    return response.json();
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, formData }) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update hotel');
    return response.json();
  }
);

export const removeHotel = createAsyncThunk(
  'hotels/removeHotel',
  async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete hotel');
    return id; 
  }
);

const initialState = {
  items: [],
  currentPage: 1,
  limit: 10,
  totalCount: 0,
  totalPages: 0,
  status: 'idle',
  error: null,
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.hotels || [];
        state.currentPage = action.payload.currentPage;
        state.limit = action.payload.limit;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        const index = state.items.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        const index = state.items.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeHotel.fulfilled, (state, action) => {
        state.items = state.items.filter(h => h.id !== action.payload);
      });
  }
});

export default hotelsSlice.reducer;
