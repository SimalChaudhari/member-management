import axios from 'axios';
import { getStoredAccessToken, clearSsoTokens } from 'services/sso';
import { paths } from 'routes/paths';

/**
 * Shared axios instance for all API calls (Redux actions, components).
 * Use: import axiosInstance from 'config/axios';
 */
const API_URL = 'https://eservices-isca--uat.sandbox.my.site.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSsoTokens();
      window.location.href = paths.auth.login;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
