// src/apps/website/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import movieService, { Movie } from '../../../common/services/movieService';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getCurrentlyShowing();
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('No se pudieron cargar las películas. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
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
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Películas en Cartelera</h1>
      <Row>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} className="mb-4">
              <Card className="h-100 movie-card">
                <Card.Img 
                  variant="top" 
                  src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
                  alt={movie.title} 
                />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <div className="movie-card-info mb-2">
                    <span className="badge bg-primary me-2">{movie.genre}</span>
                    <span>{movie.durationMinutes} min</span>
                  </div>
                  <Card.Text>
                    {movie.synopsis && movie.synopsis.length > 100 
                      ? `${movie.synopsis.substring(0, 100)}...` 
                      : movie.synopsis}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/movie/${movie.id}`} className="btn btn-primary w-100">
                    Ver Detalles
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No hay películas disponibles en este momento.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Home;