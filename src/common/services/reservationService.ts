// src/common/services/reservationService.ts
import { apiRequest } from './apiClient';

export interface SeatSelection {
  id: string;
  row: string;
  number: string;
  seatType: string;
  price: number;
}

export interface ReservationRequest {
  showId: string;
  seats: string[];
  ticketTypes: Record<string, string>;
}

export interface ReservationResponse {
  id: string;
  showId: string;
  cinemaId: string; // Added this property which was missing
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
  /**
   * Create a new reservation
   */
  createReservation: async (reservation: ReservationRequest): Promise<ReservationResponse> => {
    return apiRequest<ReservationResponse>({
      method: 'POST',
      url: '/reservations',
      data: reservation,
    });
  },

  /**
   * Get details for an existing reservation
   */
  getReservationById: async (id: string): Promise<ReservationResponse> => {
    return apiRequest<ReservationResponse>({
      method: 'GET',
      url: `/reservations/${id}`,
    });
  },

  /**
   * Cancel a reservation
   */
  cancelReservation: async (id: string): Promise<{ success: boolean, message: string }> => {
    return apiRequest<{ success: boolean, message: string }>({
      method: 'DELETE',
      url: `/reservations/${id}`,
    });
  },

  /**
   * Create a reservation at the point of sale (POS)
   */
  createPosReservation: async (reservation: ReservationRequest): Promise<ReservationResponse> => {
    return apiRequest<ReservationResponse>({
      method: 'POST',
      url: '/reservations/pos',
      data: reservation,
    });
  },
};

export default reservationService;