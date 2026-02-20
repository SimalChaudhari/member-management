import axios from 'axios';
import { getStoredAccessToken, getStoredInstanceUrl, clearSsoTokens } from 'services/sso';
import { paths } from 'routes/paths';

/** Prefer stored instance URL (from SSO) so token matches the correct Salesforce host */
function getSalesforceOrigin(fullUrl: string): string {
  const instanceUrl = getStoredInstanceUrl();
  if (instanceUrl) return instanceUrl.replace(/\/$/, '');
  try {
    return new URL(fullUrl, 'https://dummy').origin;
  } catch {
    return '';
  }
}

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

    // Build final URL to detect Salesforce requests
    const fullUrl = config.url?.startsWith('http')
      ? config.url
      : (config.baseURL || '') + (config.url?.startsWith('/') ? config.url : '/' + (config.url || ''));
    const isSalesforce =
      fullUrl && (String(fullUrl).includes('salesforce.com') || String(fullUrl).includes('my.site.com'));

    // Send all Salesforce API requests through same-origin proxy (Vite in dev, Vercel in prod) to avoid CORS
    if (isSalesforce) {
      const parsed = new URL(fullUrl, 'https://dummy');
      config.baseURL = '';
      config.url = '/api/salesforce' + parsed.pathname + parsed.search;
      config.headers['X-Salesforce-Target'] = getSalesforceOrigin(fullUrl) || parsed.origin;
    }

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
