// src/common/hooks/useMovieQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import movieService, { Movie, MovieCreateUpdateRequest, PageResponse } from '../services/movieService';

/**
 * Hook to get currently showing movies
 */
export const useCurrentlyShowingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'currentlyShowing'],
    queryFn: movieService.getCurrentlyShowing,
  });
};

/**
 * Hook to get coming soon movies
 */
export const useComingSoonMovies = () => {
  return useQuery({
    queryKey: ['movies', 'comingSoon'],
    queryFn: movieService.getComingSoon,
  });
};

/**
 * Hook to get a single movie by ID
 */
export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movies', id],
    queryFn: () => movieService.getMovie(id),
    enabled: !!id, // Only run if id is provided
  });
};

/**
 * Hook to search movies
 */
export const useSearchMovies = (query: string, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['movies', 'search', query, page, size],
    queryFn: () => movieService.searchMovies(query, page, size),
    enabled: query.length > 0, // Only search if query has content
  });
};

/**
 * Hook to get all movies (admin)
 */
export const useAllMovies = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['admin', 'movies', page, size],
    queryFn: () => movieService.getAllMovies(page, size),
  });
};

/**
 * Hook to create a movie
 */
export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (movie: MovieCreateUpdateRequest) => movieService.createMovie(movie),
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
    },
  });
};

/**
 * Hook to update a movie
 */
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, movie }: { id: string; movie: MovieCreateUpdateRequest }) => 
      movieService.updateMovie(id, movie),
    onSuccess: (_, variables) => {
      // Invalidate specific movie and lists
      queryClient.invalidateQueries({ queryKey: ['movies', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
    },
  });
};

/**
 * Hook to delete a movie
 */
export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => movieService.deleteMovie(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: ['movies', id] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
    },
  });
};