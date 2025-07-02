import axios from 'axios';
/**
 * Creates and configures an axios instance with interceptors and error handling
 */
const API_URL = "https://eservices-isca--uat.sandbox.my.site.com"

const axiosInstance = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
}); 

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = "00DIo000000Gyhr!AQEAQN739zZs01z.OotOSbNZXe0GG2UWf2M0hNUMN0IyieRRk7F1IaiFBhsFIQB.fvGDHsEwrUcJ_lR1J00x4PkuF0odnssf";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

