// src/common/services/showService.ts
import { apiRequest } from './apiClient';

export interface Show {
  id: string;
  movieId: string;
  movieTitle: string;
  roomId: string;
  roomName: string;
  startTime: string;
  endTime: string;
  is3d: boolean;
  isSubtitled: boolean;
  language: string;
  status: string;
}

export interface ShowCreateUpdateRequest {
  movieId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  is3d: boolean;
  isSubtitled: boolean;
  language: string;
  status: string;
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  seatType: string;
  status: string;
}

const showService = {
  // Obtener funciones para una película
  getShowsForMovie: async (movieId: string, date?: string): Promise<Show[]> => {
    return apiRequest<Show[]>({
      method: 'GET',
      url: `/movies/${movieId}/shows`,
      params: date ? { date } : {},
    });
  },

  // Obtener funciones para una película en un cine específico
  getShowsForMovieInCinema: async (movieId: string, cinemaId: string, date?: string): Promise<Show[]> => {
    return apiRequest<Show[]>({
      method: 'GET',
      url: `/movies/${movieId}/shows`,
      params: { cinemaId, ...(date ? { date } : {}) },
    });
  },

  // Obtener detalles de una función
  getShow: async (id: string): Promise<Show> => {
    return apiRequest<Show>({
      method: 'GET',
      url: `/shows/${id}`,
    });
  },

  // Obtener asientos disponibles para una función
  getSeatsForShow: async (showId: string): Promise<Seat[]> => {
    return apiRequest<Seat[]>({
      method: 'GET',
      url: `/shows/${showId}/seats`,
    });
  },

  // [Admin] Obtener todas las funciones
  getAllShows: async (cinemaId: string, page: number = 0, size: number = 10): Promise<{
    content: Show[];
    totalElements: number;
    totalPages: number;
  }> => {
    return apiRequest({
      method: 'GET',
      url: '/admin/shows',
      params: { cinemaId, page, size },
    });
  },

  // [Admin] Crear una nueva función
  createShow: async (show: ShowCreateUpdateRequest): Promise<string> => {
    return apiRequest<string>({
      method: 'POST',
      url: '/admin/shows',
      data: show,
    });
  },

  // [Admin] Actualizar una función
  updateShow: async (id: string, show: ShowCreateUpdateRequest): Promise<void> => {
    return apiRequest<void>({
      method: 'PUT',
      url: `/admin/shows/${id}`,
      data: show,
    });
  },

  // [Admin] Cancelar una función
  cancelShow: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/admin/shows/${id}`,
    });
  },

  // [Validator] Obtener funciones que se están reproduciendo actualmente
  getCurrentlyPlayingShows: async (): Promise<Show[]> => {
    return apiRequest<Show[]>({
      method: 'GET',
      url: '/gate/shows/current',
    });
  },
};

export default showService;