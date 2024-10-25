import { combineReducers, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const REVERSE_GEO_TRACK = createAsyncThunk(
    'nhsf/REVERSE_GEO_TRACK',
    async ({ lat, lon }: { lat: number; lon: number }) => {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: 'json',
          lat: lat,
          lon: lon,
          zoom: 18,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'YourAppName/1.0 (your_email@example.com)',
        },
      });
  
      return response.data;
    }
  );

const rootReducers = combineReducers({
   
});

export default rootReducers;
