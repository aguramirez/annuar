// src/common/services/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import config from '../../config/config';

// Update your config.ts to include REFRESH_TOKEN_KEY if not already done
// const config = {
//   API_URL: import.meta.env.NODE_ENV === 'production' 
//     ? 'https://tu-dominio.com/api' 
//     : 'http://localhost:8080/api',
//   TOKEN_KEY: 'annuar-token',
//   USER_KEY: 'annuar-user',
//   REFRESH_TOKEN_KEY: 'annuar-refresh-token',
// };

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store requests that need to be retried after token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (configu) => {
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (token) {
      configu.headers.Authorization = `Bearer ${token}`;
    }
    return configu;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and it's not a token refresh attempt
    if (error.response?.status === 401 && 
        originalRequest && 
        !(originalRequest as any)._retry && 
        originalRequest.url !== '/auth/refresh-token') {
      
      if (isRefreshing) {
        // If already refreshing, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Mark that we're refreshing the token
      (originalRequest as any)._retry = true;
      isRefreshing = true;

      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem(config.REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        // If no refresh token, redirect to login
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        localStorage.removeItem(config.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${config.API_URL}/auth/refresh-token`, { 
          refreshToken 
        });
        
        // If successful
        const newToken = response.data.token;
        localStorage.setItem(config.TOKEN_KEY, newToken);
        
        // If a new refresh token is returned, update it
        if (response.data.refreshToken) {
          localStorage.setItem(config.REFRESH_TOKEN_KEY, response.data.refreshToken);
        }
        
        // Update token for all queued requests
        processQueue(null, newToken);
        
        // Update token for original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, process queue with error
        processQueue(refreshError, null);
        
        // Clear storage and redirect to login
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        localStorage.removeItem(config.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Generic function for HTTP requests
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    // Customize error messages for better user experience
    if (error.response) {
      // Server responded with a status outside of 2xx range
      const errorMsg = error.response.data?.message || 'Error en el servidor';
      console.error('API Error Response:', errorMsg);
      throw new Error(errorMsg);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      throw new Error('No se recibió respuesta del servidor. Verifica tu conexión a internet.');
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
      throw new Error('Error al realizar la solicitud: ' + error.message);
    }
  }
};

export default apiClient;