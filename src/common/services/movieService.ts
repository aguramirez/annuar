// src/common/services/movieService.ts
import { apiRequest } from './apiClient';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
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

export interface MovieCreateUpdateRequest {
  title: string;
  originalTitle?: string;
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

const movieService = {
  // Get currently showing movies
  getCurrentlyShowing: async (): Promise<Movie[]> => {
    return apiRequest<Movie[]>({
      method: 'GET',
      url: '/movies',
    });
  },

  // Get coming soon movies
  getComingSoon: async (): Promise<Movie[]> => {
    return apiRequest<Movie[]>({
      method: 'GET',
      url: '/movies/coming-soon',
    });
  },

  // Get movie details
  getMovie: async (id: string): Promise<Movie> => {
    return apiRequest<Movie>({
      method: 'GET',
      url: `/movies/${id}`,
    });
  },

  // Search movies
  searchMovies: async (query: string, page: number = 0, size: number = 10): Promise<PageResponse<Movie>> => {
    return apiRequest<PageResponse<Movie>>({
      method: 'GET',
      url: '/movies/search',
      params: { query, page, size },
    });
  },

  // Admin: Get all movies
  getAllMovies: async (page: number = 0, size: number = 10): Promise<PageResponse<Movie>> => {
    return apiRequest<PageResponse<Movie>>({
      method: 'GET',
      url: '/admin/movies',
      params: { page, size },
    });
  },

  // Admin: Create movie
  createMovie: async (movie: MovieCreateUpdateRequest): Promise<string> => {
    return apiRequest<string>({
      method: 'POST',
      url: '/admin/movies',
      data: movie,
    });
  },

  // Admin: Update movie
  updateMovie: async (id: string, movie: MovieCreateUpdateRequest): Promise<void> => {
    return apiRequest<void>({
      method: 'PUT',
      url: `/admin/movies/${id}`,
      data: movie,
    });
  },

  // Admin: Delete movie
  deleteMovie: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/admin/movies/${id}`,
    });
  },
};

export default movieService;