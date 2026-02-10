import axios from 'axios';
import { getStoredAccessToken, getStoredInstanceUrl, clearSsoTokens } from 'services/sso';
import { paths } from 'routes/paths';

/**
 * Shared axios instance for all API calls (Redux actions, components).
 * Use: import axiosInstance from 'config/axios';
 */
const API_URL = 'https://eservices-isca--fuat.sandbox.my.site.com';

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

    // In development, send Salesforce API requests through Vite proxy to avoid CORS
    if (import.meta.env.DEV && config.url) {
      const url = config.url.startsWith('http') ? config.url : (config.baseURL || '') + (config.url.startsWith('/') ? config.url : '/' + config.url);
      if (url.includes('salesforce.com') || url.includes('my.site.com')) {
        const parsed = new URL(url);
        config.baseURL = '';
        config.url = '/api/salesforce' + parsed.pathname + parsed.search;
        // Tell the dev server which Salesforce host to proxy to (so token matches instance)
        config.headers['X-Salesforce-Target'] = parsed.origin;
      }
    }

    if (token) {
      // Ensure Authorization header is set correctly with Bearer prefix
      // Token is already trimmed in getStoredAccessToken()
      config.headers.Authorization = `Bearer ${token}`;

      // For Salesforce API endpoints (/services/apexrest/), use instance_url if available
      // This ensures token works with the correct Salesforce instance domain (production only; dev uses proxy)
      if (!import.meta.env.DEV) {
        const instanceUrl = getStoredInstanceUrl();
        if (instanceUrl && config.url && config.url.startsWith('/services/')) {
          // Override baseURL to use instance_url for Salesforce API calls
          config.baseURL = instanceUrl.replace(/\/$/, '');
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's INVALID_SESSION_ID error
      const errorData = error.response?.data;
      if (errorData && typeof errorData === 'object') {
        const errorArray = Array.isArray(errorData) ? errorData : [errorData];
        const invalidSession = errorArray.some(
          (err: unknown) =>
            typeof err === 'object' &&
            err !== null &&
            'errorCode' in err &&
            err.errorCode === 'INVALID_SESSION_ID'
        );
        
        if (invalidSession) {
          // Token expired or invalid - clear and redirect to login
          clearSsoTokens();
          window.location.href = paths.auth.login;
        }
      } else {
        // Generic 401 - clear tokens and redirect
        clearSsoTokens();
        window.location.href = paths.auth.login;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
