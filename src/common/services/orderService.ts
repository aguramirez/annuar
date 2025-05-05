// src/common/services/orderService.ts
import { apiRequest } from './apiClient';

export interface OrderRequest {
  reservationId: string;
  productItems?: {
    productId: string;
    quantity: number;
  }[];
  comboItems?: {
    comboId: string;
    quantity: number;
  }[];
  promotionCode?: string;
  customerEmail?: string;
  customerName?: string;
}

export interface OrderResponse {
  id: string;
  reservationId: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export interface OrderDetailsResponse {
  id: string;
  movieTitle: string;
  showDate: string;
  showTime: string;
  roomName: string;
  tickets: {
    seatId: string;
    row: string;
    number: string;
    ticketType: string;
    price: number;
  }[];
  products: {
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: string;
  status: string;
  qrCodes?: string[];
}

const orderService = {
  createOrder: async (order: OrderRequest): Promise<OrderResponse> => {
    return apiRequest<OrderResponse>({
      method: 'POST',
      url: '/orders',
      data: order,
    });
  },

  getOrderDetailsById: async (id: string): Promise<OrderDetailsResponse> => {
    return apiRequest<OrderDetailsResponse>({
      method: 'GET',
      url: `/orders/${id}`,
    });
  },

  getOrderTickets: async (id: string): Promise<OrderDetailsResponse> => {
    return apiRequest<OrderDetailsResponse>({
      method: 'GET',
      url: `/orders/${id}/tickets`,
    });
  },

  getUserOrders: async (page: number = 0, size: number = 10): Promise<{
    content: OrderResponse[];
    totalElements: number;
    totalPages: number;
  }> => {
    return apiRequest({
      method: 'GET',
      url: '/users/me/orders',
      params: { page, size },
    });
  },

  // [Admin] Obtener todas las órdenes
  getAllOrders: async (cinemaId?: string, status?: string, page: number = 0, size: number = 10): Promise<{
    content: OrderResponse[];
    totalElements: number;
    totalPages: number;
  }> => {
    return apiRequest({
      method: 'GET',
      url: '/admin/orders',
      params: { 
        ...(cinemaId ? { cinemaId } : {}), 
        ...(status ? { status } : {}), 
        page, 
        size 
      },
    });
  },

  // [Admin] Cancelar una orden
  cancelOrder: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>({
      method: 'POST',
      url: `/admin/orders/${id}/cancel`,
    });
  },

  // [POS] Crear orden en taquilla
  createPosOrder: async (order: OrderRequest): Promise<OrderResponse> => {
    return apiRequest<OrderResponse>({
      method: 'POST',
      url: '/pos/orders',
      data: order,
    });
  },

  // [POS] Imprimir tickets
  printTickets: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>({
      method: 'POST',
      url: `/pos/orders/${id}/print`,
    });
  },
};

export default orderService;