import axios from 'axios';

// Export the base URL as a constant
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Configure axios with the same base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

export default axiosInstance;