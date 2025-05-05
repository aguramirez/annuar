// src/common/services/authService.ts
import { apiRequest } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string; // Added this property
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
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      url: '/auth/register',
      data: userData,
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
  }
};

export default authService;