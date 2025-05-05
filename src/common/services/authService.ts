// src/common/services/authService.ts
import { apiRequest } from './apiClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/refresh-token',
      params: { refreshToken },
    });
  },

  logout: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      url: '/auth/logout',
    });
  }
};

export default authService;