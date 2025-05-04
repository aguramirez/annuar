// src/common/services/movieService.ts
import { apiRequest } from './apiClient';

export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  durationMinutes: number;
  releaseDate: string;
  endDate: string | null;
  director: string;
  cast: string;
  genre: string;
  rating: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  is3d: boolean;
  isSubtitled: boolean;
  status: string;
}

export interface MovieCreateUpdateRequest {
  title: string;
  synopsis: string;
  durationMinutes: number;
  releaseDate: string;
  endDate?: string;
  director: string;
  cast: string;
  genre: string;
  rating: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  is3d: boolean;
  isSubtitled: boolean;
  status: string;
}

// Funciones para el manejo de películas
const movieService = {
  // Obtener todas las películas en cartelera
  getCurrentlyShowing: async (): Promise<Movie[]> => {
    return apiRequest<Movie[]>({
      method: 'GET',
      url: '/movies',
    });
  },

  // Obtener próximos estrenos
  getComingSoon: async (): Promise<Movie[]> => {
    return apiRequest<Movie[]>({
      method: 'GET',
      url: '/movies/coming-soon',
    });
  },

  // Obtener detalles de una película
  getMovie: async (id: string): Promise<Movie> => {
    return apiRequest<Movie>({
      method: 'GET',
      url: `/movies/${id}`,
    });
  },

  // [Admin] Obtener todas las películas (paginadas)
  getAllMovies: async (page: number = 0, size: number = 10): Promise<{
    content: Movie[];
    totalElements: number;
    totalPages: number;
  }> => {
    return apiRequest({
      method: 'GET',
      url: '/admin/movies',
      params: { page, size },
    });
  },

  // [Admin] Crear una nueva película
  createMovie: async (movie: MovieCreateUpdateRequest): Promise<string> => {
    return apiRequest<string>({
      method: 'POST',
      url: '/admin/movies',
      data: movie,
    });
  },

  // [Admin] Actualizar una película existente
  updateMovie: async (id: string, movie: MovieCreateUpdateRequest): Promise<void> => {
    return apiRequest<void>({
      method: 'PUT',
      url: `/admin/movies/${id}`,
      data: movie,
    });
  },

  // [Admin] Eliminar una película
  deleteMovie: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/admin/movies/${id}`,
    });
  },

  // Buscar películas por título, director o género
  searchMovies: async (query: string, page: number = 0, size: number = 10): Promise<{
    content: Movie[];
    totalElements: number;
    totalPages: number;
  }> => {
    return apiRequest({
      method: 'GET',
      url: '/movies/search',
      params: { query, page, size },
    });
  },
};

export default movieService;