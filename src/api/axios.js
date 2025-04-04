import axios from 'axios';
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

export const API_BASE_URL = 
ENVIRONMENT === 'production' 
?import.meta.env.VITE_API_URL
:'http://localhost:7000';

console.log('ENVIRONMENT:',ENVIRONMENT);
console.log('API_BASE_URL',API_BASE_URL);
// Configure axios with the same base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

export default axiosInstance;