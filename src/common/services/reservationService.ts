// src/common/services/reservationService.ts
import { apiRequest } from './apiClient';

export interface ReservationRequest {
  showId: string;
  seats: string[];
  ticketTypes: Record<string, string>;
}

export interface ReservationResponse {
  id: string;
  showId: string;
  movieTitle: string;
  roomName: string;
  startTime: string;
  seats: {
    id: string;
    row: string;
    number: string;
    ticketType: string;
    price: number;
  }[];
  expiresAt: string;
  totalAmount: number;
  status: string;
}

const reservationService = {
  createReservation: async (reservation: ReservationRequest): Promise<ReservationResponse> => {
    return apiRequest<ReservationResponse>({
      method: 'POST',
      url: '/reservations',
      data: reservation,
    });
  },

  getReservationById: async (id: string): Promise<ReservationResponse> => {
    return apiRequest<ReservationResponse>({
      method: 'GET',
      url: `/reservations/${id}`,
    });
  },

  cancelReservation: async (id: string): Promise<{ success: boolean, message: string }> => {
    return apiRequest<{ success: boolean, message: string }>({
      method: 'DELETE',
      url: `/reservations/${id}`,
    });
  },

  // [POS] Crear reserva en taquilla
  createPosReservation: async (reservation: ReservationRequest): Promise<ReservationResponse> => {
    return apiRequest<ReservationResponse>({
      method: 'POST',
      url: '/reservations/pos',
      data: reservation,
    });
  },
};

export default reservationService;