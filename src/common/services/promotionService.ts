// src/common/services/promotionService.ts
import { apiRequest } from './apiClient';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromotionValidationRequest {
  code: string;
  subtotal: number;
}

export interface PromotionValidationResponse {
  code: string;
  valid: boolean;
  message: string;
  discountAmount: number | null;
}

const promotionService = {
  // Obtener promociones activas
  getActivePromotions: async (cinemaId: string): Promise<Promotion[]> => {
    return apiRequest<Promotion[]>({
      method: 'GET',
      url: '/promotions',
      params: { cinemaId },
    });
  },

  // Validar un código promocional
  validatePromotion: async (code: string, subtotal: number): Promise<PromotionValidationResponse> => {
    return apiRequest<PromotionValidationResponse>({
      method: 'POST',
      url: '/promotions/validate',
      data: { code, subtotal },
    });
  },

  // [Admin] Crear una promoción
  createPromotion: async (promotion: Omit<Promotion, 'id'>): Promise<string> => {
    return apiRequest<string>({
      method: 'POST',
      url: '/admin/promotions',
      data: promotion,
    });
  },

  // [Admin] Actualizar una promoción
  updatePromotion: async (id: string, promotion: Omit<Promotion, 'id'>): Promise<void> => {
    return apiRequest<void>({
      method: 'PUT',
      url: `/admin/promotions/${id}`,
      data: promotion,
    });
  },

  // [Admin] Desactivar una promoción
  deactivatePromotion: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/admin/promotions/${id}`,
    });
  },
};

export default promotionService;