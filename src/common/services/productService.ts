// src/common/services/productService.ts
import { apiRequest } from './apiClient';

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  isActive: boolean;
}

const productService = {
  // Obtener productos disponibles para un cine
  getAvailableProducts: async (cinemaId: string): Promise<Product[]> => {
    return apiRequest<Product[]>({
      method: 'GET',
      url: '/products',
      params: { cinemaId },
    });
  },

  // Obtener productos por categoría
  getProductsByCategory: async (cinemaId: string, categoryId: string): Promise<Product[]> => {
    return apiRequest<Product[]>({
      method: 'GET',
      url: '/products',
      params: { cinemaId, categoryId },
    });
  },

  // Obtener categorías de productos
  getProductCategories: async (cinemaId: string): Promise<ProductCategory[]> => {
    return apiRequest<ProductCategory[]>({
      method: 'GET',
      url: '/products/categories',
      params: { cinemaId },
    });
  },

  // Obtener combos disponibles
  getAvailableCombos: async (cinemaId: string): Promise<Combo[]> => {
    return apiRequest<Combo[]>({
      method: 'GET',
      url: '/combos',
      params: { cinemaId },
    });
  },

  // [Admin] Obtener todos los productos
  getAllProducts: async (cinemaId: string, page: number = 0, size: number = 10): Promise<{
    content: Product[];
    totalElements: number;
    totalPages: number;
  }> => {
    return apiRequest({
      method: 'GET',
      url: '/admin/products',
      params: { cinemaId, page, size },
    });
  },

  // [Admin] Crear un producto
  createProduct: async (product: Product): Promise<string> => {
    return apiRequest<string>({
      method: 'POST',
      url: '/admin/products',
      data: product,
    });
  },

  // [Admin] Actualizar un producto
  updateProduct: async (id: string, product: Product): Promise<void> => {
    return apiRequest<void>({
      method: 'PUT',
      url: `/admin/products/${id}`,
      data: product,
    });
  },

  // [Admin] Eliminar un producto
  deleteProduct: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/admin/products/${id}`,
    });
  },

  // [Admin] Obtener todos los combos
  getAllCombos: async (cinemaId: string, page: number = 0, size: number = 10): Promise<{
    content: Combo[];
    totalElements: number;
    totalPages: number;
  }> => {
    return apiRequest({
      method: 'GET',
      url: '/admin/combos',
      params: { cinemaId, page, size },
    });
  },

  // [Admin] Crear un combo
  createCombo: async (combo: Omit<Combo, 'id'>): Promise<string> => {
    return apiRequest<string>({
      method: 'POST',
      url: '/admin/combos',
      data: combo,
    });
  },

  // [Admin] Actualizar un combo
  updateCombo: async (id: string, combo: Omit<Combo, 'id'>): Promise<void> => {
    return apiRequest<void>({
      method: 'PUT',
      url: `/admin/combos/${id}`,
      data: combo,
    });
  },

  // [Admin] Eliminar un combo
  deleteCombo: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/admin/combos/${id}`,
    });
  },
};

export default productService;