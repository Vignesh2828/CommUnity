import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://192.168.29.5:5000', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

