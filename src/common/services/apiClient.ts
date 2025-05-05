// src/common/services/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import config from '../../config/config';
import authService from './authService';

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Almacenar las solicitudes que necesitan ser reintentadas después de renovar el token
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

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (Unauthorized) y no es un intento de renovación
    if (error.response?.status === 401 && 
        originalRequest && 
        !(originalRequest as any)._retry && 
        originalRequest.url !== '/auth/refresh-token') {
      
      if (isRefreshing) {
        // Si ya estamos renovando el token, agregamos la solicitud a la cola
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

      // Marcar que estamos renovando el token
      (originalRequest as any)._retry = true;
      isRefreshing = true;

      // Obtener el refresh token del localStorage
      const refreshToken = localStorage.getItem(config.REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        // Si no hay refresh token, redirigir al login
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        localStorage.removeItem(config.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        // Intentar renovar el token
        const response = await authService.refreshToken(refreshToken);
        
        // Si se renovó con éxito
        localStorage.setItem(config.TOKEN_KEY, response.token);
        
        // Si el servicio devuelve un nuevo refresh token, actualizar
        if (response.refreshToken) {
          localStorage.setItem(config.REFRESH_TOKEN_KEY, response.refreshToken);
        }
        
        // Actualizar el token para todas las solicitudes en cola
        processQueue(null, response.token);
        
        // Actualizar el token para la solicitud original
        originalRequest.headers.Authorization = `Bearer ${response.token}`;
        
        // Reintentar la solicitud original
        return axios(originalRequest);
      } catch (refreshError) {
        // Si la renovación falló, procesar la cola con error
        processQueue(refreshError, null);
        
        // Limpiar almacenamiento local y redirigir al login
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        localStorage.removeItem(config.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Para otros errores, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

// Función genérica para peticiones HTTP
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    // Personalizar mensajes de error para una mejor experiencia de usuario
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const errorMsg = error.response.data?.message || 'Ha ocurrido un error en el servidor';
      console.error('API Error Response:', errorMsg);
      throw new Error(errorMsg);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('API No Response:', error.request);
      throw new Error('No se recibió respuesta del servidor. Verifica tu conexión a internet.');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('API Request Error:', error.message);
      throw new Error('Error al realizar la solicitud: ' + error.message);
    }
  }
};

export default apiClient;