// src/common/services/userService.ts
import { apiRequest } from './apiClient';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profileImage?: string;
  loyaltyPoints?: number;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const userService = {
  /**
   * Get all users with pagination
   */
  getAllUsers: async (page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
    return apiRequest<PageResponse<User>>({
      method: 'GET',
      url: '/admin/users',
      params: { page, size },
    });
  },

  /**
   * Search users by query
   */
  searchUsers: async (query: string, page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
    return apiRequest<PageResponse<User>>({
      method: 'GET',
      url: '/admin/users/search',
      params: { query, page, size },
    });
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    return apiRequest<User>({
      method: 'GET',
      url: `/admin/users/${id}`,
    });
  },

  /**
   * Create a new user (admin function)
   */
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    return apiRequest<User>({
      method: 'POST',
      url: '/admin/users',
      data: userData,
    });
  },

  /**
   * Update a user (admin function)
   */
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    return apiRequest<User>({
      method: 'PUT',
      url: `/admin/users/${id}`,
      data: userData,
    });
  },

  /**
   * Deactivate a user
   */
  deactivateUser: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'POST',
      url: `/admin/users/${id}/deactivate`,
    });
  },

  /**
   * Activate a user
   */
  activateUser: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'POST',
      url: `/admin/users/${id}/activate`,
    });
  },

  /**
   * Reset user password (admin function)
   */
  resetUserPassword: async (id: string, newPassword: string): Promise<void> => {
    return apiRequest<void>({
      method: 'POST',
      url: `/admin/users/${id}/reset-password`,
      data: { password: newPassword },
    });
  },

  /**
   * Get current user profile (for normal users)
   */
  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>({
      method: 'GET',
      url: '/users/me',
    });
  },

  /**
   * Update current user profile (for normal users)
   */
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    profileImage?: string;
  }): Promise<User> => {
    return apiRequest<User>({
      method: 'PUT',
      url: '/users/me',
      data: profileData,
    });
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<{ imageUrl: string }>({
      method: 'POST',
      url: '/users/me/profile-image',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get user loyalty points
   */
  getLoyaltyPoints: async (): Promise<{ points: number; level: string; nextLevel: string; pointsToNextLevel: number }> => {
    return apiRequest({
      method: 'GET',
      url: '/users/me/loyalty',
    });
  },

  /**
   * Get user's purchase history
   */
  getPurchaseHistory: async (page: number = 0, size: number = 10): Promise<PageResponse<any>> => {
    return apiRequest({
      method: 'GET',
      url: '/users/me/orders',
      params: { page, size },
    });
  },
};

export default userService;