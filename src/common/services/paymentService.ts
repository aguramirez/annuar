// src/common/services/paymentService.ts
import { apiRequest } from './apiClient';

export interface PaymentRequest {
  paymentMethod: string;
  cardNumber?: string;
  cardholderName?: string;
  expirationDate?: string;
  cvv?: string;
  installments?: number;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  status: string;
  redirectUrl?: string;
  message: string;
}

const paymentService = {
  // Procesar un pago
  processPayment: async (orderId: string, paymentData: PaymentRequest): Promise<PaymentResponse> => {
    return apiRequest<PaymentResponse>({
      method: 'POST',
      url: `/orders/${orderId}/pay`,
      data: paymentData,
    });
  },

  // [Admin] Reembolsar un pago
  refundPayment: async (orderId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>({
      method: 'POST',
      url: `/admin/orders/${orderId}/refund`,
    });
  },

  // Confirmar un pago (para webhook - normalmente no se llama directamente desde el frontend)
  confirmPayment: async (paymentId: string, status: string): Promise<void> => {
    return apiRequest<void>({
      method: 'POST',
      url: `/payments/webhook`,
      data: {
        data: {
          id: paymentId
        },
        type: 'payment',
        status: status
      },
    });
  },
};

export default paymentService;