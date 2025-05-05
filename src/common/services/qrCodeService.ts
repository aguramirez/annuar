// src/common/services/qrCodeService.ts
import { apiRequest } from './apiClient';

export interface TicketValidationRequest {
  qrContent: string;
}

const qrCodeService = {
  // Validar un código QR
  validateQrCode: async (qrContent: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>({
      method: 'POST',
      url: '/gate/validate',
      data: { qrContent },
    });
  },
};

export default qrCodeService;