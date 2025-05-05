// src/common/services/authService.ts (Versión mejorada)
import { apiRequest } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Ampliar la respuesta de registro para proporcionar más información
export interface RegisterResponse extends ApiResponse {
  userId?: string;
  emailSent?: boolean;
}

const authService = {
  /**
   * Log in a user with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
  },

  /**
   * Register a new user with enhanced error handling
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiRequest<RegisterResponse>({
        method: 'POST',
        url: '/auth/register',
        data: userData,
      });
      
      return response;
    } catch (error: any) {
      // Manejo mejorado de errores
      if (error.response?.status === 409) {
        throw new Error('Este email ya está registrado. Por favor usa otro o recupera tu contraseña.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Los datos proporcionados no son válidos.');
      } else {
        throw new Error('Error en el registro. Por favor intenta más tarde.');
      }
    }
  },

  /**
   * Verify email with verification token
   */
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      url: '/auth/verify-email',
      data: { token },
    });
  },

  /**
   * Refresh an authentication token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/refresh-token',
      data: { refreshToken },
    });
  },

  /**
   * Log out the current user
   */
  logout: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      url: '/auth/logout',
    });
  },

  /**
   * Social login integration 
   */
  socialLogin: async (provider: string, token: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/social-login',
      data: { provider, token },
    });
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
    });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      url: '/auth/reset-password',
      data: { token, newPassword },
    });
  },

  /**
   * Check if a user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('annuar-token');
    return !!token;
  },

  /**
   * Get current user data from token (without API call)
   */
  getCurrentUser: () => {
    const userJson = localStorage.getItem('annuar-user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user data', e);
      return null;
    }
  }
};

export default authService;