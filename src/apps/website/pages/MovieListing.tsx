// src/apps/website/components/MovieListing.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import movieService, { Movie, PageResponse } from '../../../common/services/movieService';

interface MovieListingProps {
  type?: 'current' | 'coming-soon' | 'all';
  showSearch?: boolean;
  showPagination?: boolean;
  itemsPerRow?: 3 | 4 | 6;
  maxItems?: number;
}

// Type guard to check if data is a PageResponse
function isPageResponse(data: any): data is PageResponse<Movie> {
  return data && typeof data === 'object' && 'content' in data && 'totalPages' in data;
}

const MovieListing: React.FC<MovieListingProps> = ({
  type = 'current',
  showSearch = false,
  showPagination = false,
  itemsPerRow = 4,
  maxItems,
}) => {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 12; // Items per page

  // Determine which API function to call based on type
  const fetchMovies = async (): Promise<Movie[] | PageResponse<Movie>> => {
    if (searchTerm) {
      return movieService.searchMovies(searchTerm, page, pageSize);
    }

    switch (type) {
      case 'current':
        return movieService.getCurrentlyShowing();
      case 'coming-soon':
        return movieService.getComingSoon();
      case 'all':
        return movieService.getAllMovies(page, pageSize);
      default:
        return movieService.getCurrentlyShowing();
    }
  };

  // React Query hook for data fetching
  const { data, isLoading, error, refetch, isPending, isFetching } = useQuery({
    queryKey: ['movies', type, searchTerm, page],
    queryFn: fetchMovies,
  });

  // Helper function to determine column size based on itemsPerRow
  const getColSize = () => {
    switch (itemsPerRow) {
      case 3:
        return 4; // 12/3 = 4 (Bootstrap grid system)
      case 4:
        return 3; // 12/4 = 3
      case 6:
        return 2; // 12/6 = 2
      default:
        return 3;
    }
  };

  // Process the data based on its structure (array or paginated)
  let movies: Movie[] = [];
  let totalPages = 1;

  if (data) {
    if (Array.isArray(data)) {
      movies = data;
      totalPages = 1;
    } else if (isPageResponse(data)) {
      movies = data.content;
      totalPages = data.totalPages;
    }

    // Apply maxItems limit if specified
    if (maxItems && movies.length > maxItems) {
      movies = movies.slice(0, maxItems);
    }
  }

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
    refetch();
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Format release date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Rendering states
  if (isLoading || isPending) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-3">
        <Alert variant="danger">
          {error instanceof Error ? error.message : 'Error al cargar las películas'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Search bar */}
      {showSearch && (
        <div className="mb-4">
          <Form onSubmit={handleSearch}>
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                placeholder="Buscar películas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
              <Button type="submit" variant="primary">
                <i className="bi bi-search"></i>
              </Button>
            </Form.Group>
          </Form>
        </div>
      )}

      {/* Movie grid */}
      {movies.length > 0 ? (
        <Row>
          {movies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={getColSize()} className="mb-4">
              <Card className="h-100 movie-card">
                <div className="movie-poster-container">
                  <Card.Img
                    variant="top"
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=Sin+Imagen'}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  {movie.is3d && (
                    <Badge bg="info" className="movie-badge">3D</Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.title}</Card.Title>
                  <div className="movie-meta mb-2">
                    <Badge bg="primary" className="me-1">{movie.genre}</Badge>
                    <small className="text-muted">{movie.durationMinutes} min</small>
                  </div>
                  <Card.Text className="movie-synopsis">
                    {movie.synopsis && movie.synopsis.length > 120
                      ? `${movie.synopsis.substring(0, 120)}...`
                      : movie.synopsis}
                  </Card.Text>
                  <div className="mt-auto">
                    <small className="d-block mb-2 text-muted">
                      {type === 'coming-soon'
                        ? `Estreno: ${formatDate(movie.releaseDate)}`
                        : `En cartelera desde: ${formatDate(movie.releaseDate)}`}
                    </small>
                    <Link to={`/movie/${movie.id}`} className="btn btn-primary w-100">
                      {type === 'coming-soon' ? 'Ver Detalles' : 'Comprar Entradas'}
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No hay películas disponibles{searchTerm ? ' para tu búsqueda' : ''}.
        </Alert>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(0)}
              disabled={page === 0}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(Math.max(0, page - 1))}
              disabled={page === 0}
            />

            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i === page}
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1 || isFetching}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={page === totalPages - 1 || isFetching}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default MovieListing;