// src/apps/website/pages/Home.tsx (Versión corregida)
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

// Interfaz para la estructura de película en movies.json
interface MovieTime {
  id?: string;
  time: string;
  room?: string;
  available?: number;
  total?: number;
}

interface Movie {
  id: number;
  title: string;
  director: string;
  genre: string[];
  duration: number;
  releaseDate: string;
  poster: string;
  heroImage: string;
  synopsis: string;
  trailerUrl: string;
  rating: number;
  showtimes: {
    date: string;
    times: string[] | MovieTime[];
  }[];
}

interface ProcessedMovie {
  id: number;
  title: string;
  director: string;
  genre: string[];
  duration: number;
  releaseDate: string;
  poster: string;
  heroImage: string;
  synopsis: string;
  trailerUrl: string;
  rating: number;
  showtimes: {
    date: string;
    times: MovieTime[];
  }[];
}

// Función para procesar los horarios (convertir strings a objetos si es necesario)
function processMovieTimes(movies: Movie[]): ProcessedMovie[] {
  return movies.map(movie => {
    const processedShowtimes = movie.showtimes.map(showtime => {
      // Verificar si times es un array de strings
      if (showtime.times.length > 0 && typeof showtime.times[0] === 'string') {
        return {
          ...showtime,
          // Convertir cada string a un objeto MovieTime
          times: (showtime.times as string[]).map(time => ({
            time,
            room: 'Sala 1', // valor por defecto
            available: Math.floor(Math.random() * 100) + 20, // simulación
            total: 120 // simulación
          }))
        };
      }
      return showtime;
    });

    return {
      ...movie,
      showtimes: processedShowtimes
    } as ProcessedMovie;
  });
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<ProcessedMovie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<ProcessedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselLoaded, setCarouselLoaded] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // En un entorno de producción, esto sería una llamada a API
        // Pero para este ejemplo, importamos el JSON directamente
        const moviesData = await import('../../../data/movies.json');
        const rawMovies = moviesData.movies as Movie[];
        
        // Procesar los movies para asegurar la estructura correcta
        const processedMovies = processMovieTimes(rawMovies);
        
        setMovies(processedMovies);
        
        // Seleccionar películas destacadas (las primeras 3 o todas si hay menos)
        setFeaturedMovies(processedMovies.slice(0, Math.min(3, processedMovies.length)));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('No se pudieron cargar las películas. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
        
        // Simular un pequeño retraso antes de mostrar el carrusel para un efecto de animación
        setTimeout(() => {
          setCarouselLoaded(true);
        }, 300);
      }
    };

    fetchMovies();
  }, []);

  // Formatear fecha para mostrar
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

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
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="home-page">
      {/* Carousel de películas destacadas */}
      <div className={`featured-section ${carouselLoaded ? 'carousel-loaded' : ''}`}>
        <Carousel className="featured-carousel">
          {featuredMovies.map(movie => (
            <Carousel.Item key={movie.id}>
              <div 
                className="featured-movie-slide" 
                style={{
                  // backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 100%), url(${movie.heroImage})`,
                }}
              >
                <div className="featured-movie-content">
                  <div className="featured-movie-info">
                    {/* <div className="featured-movie-tag mb-2">Destacada</div> */}
                    <h2 className="featured-movie-title">{movie.title}</h2>
                    <div className="featured-movie-meta mb-3">
                      <div className="featured-movie-rating">
                        {movie.rating.toFixed(1)}
                      </div>
                      <div className="featured-movie-duration">
                        <i className="bi bi-clock me-1"></i>
                        {movie.duration} min
                      </div>
                      <div className="featured-movie-director">
                        <i className="bi bi-camera-reels me-1"></i>
                        {movie.director}
                      </div>
                    </div>
                    <div className="featured-movie-genres mb-3">
                      {movie.genre.map((genre, index) => (
                        <Badge key={index} bg="primary" className="me-2">{genre}</Badge>
                      ))}
                    </div>
                    <p className="featured-movie-synopsis mb-4">
                      {movie.synopsis.length > 150 ? `${movie.synopsis.substring(0, 150)}...` : movie.synopsis}
                    </p>
                    <div className="featured-movie-buttons">
                      <Link to={`/movie/${movie.id}`}>
                        <Button className="btn btn-primary featured-movie-btn me-3">
                          <i className="bi bi-ticket-perforated me-2"></i>
                          Comprar entradas
                        </Button>
                      </Link>
                      <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="btn btn-outline-light featured-movie-btn">
                          <i className="bi bi-play-fill me-2"></i>
                          Ver trailer
                        </Button>
                      </a>
                    </div>
                  </div>
                  <div className="featured-movie-image-container">
                    <img src={movie.poster} alt={movie.title} className="featured-movie-image" />
                    <div className="featured-movie-poster-shadow"></div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Lista de películas en cartelera */}
      <Container className="py-5">
        <div className="section-header d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Películas en Cartelera</h2>
          <Link to="/movies" className="view-all-link">
            Ver todas <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {movies.map(movie => (
            <Col key={movie.id}>
              <Card className="h-100 movie-card">
                <div className="card-img-container">
                  <Card.Img variant="top" src={movie.poster} alt={movie.title} />
                  <div className="card-img-overlay">
                    <div className="overlay-content">
                      <Link to={`/movie/${movie.id}`}>
                        <Button variant="primary" size="sm">
                          <i className="bi bi-ticket-perforated me-2"></i>Comprar entradas
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="movie-card-title">{movie.title}</Card.Title>
                  <div className="movie-card-info mb-2">
                    <span className="movie-card-genres">
                      {movie.genre[0]}
                    </span>
                    <span className="movie-card-rating">
                      <i className="bi bi-star-fill"></i> {movie.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>{movie.duration} min</span>
                    <span>Estreno: {formatDate(movie.releaseDate)}</span>
                  </div>
                </Card.Body>
                {/* <Card.Footer className="bg-white border-0">
                  <Link to={`/movie/${movie.id}`} className="btn btn-primary w-100">
                    <i className="bi bi-ticket-perforated me-2"></i>
                    Comprar entradas
                  </Link>
                </Card.Footer> */}
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      
      {/* Sección promocional */}
      <Container className="mb-5">
        <div className="promo-section">
          <Row className="align-items-center">
            <Col lg={7} className="promo-content">
              <h2 className="promo-title">Hazte Premium y obtén 2 entradas gratis por mes</h2>
              <p className="promo-text">Con tu membresía Premium disfrutarás de descuentos exclusivos, acceso preferencial a estrenos, y 2 entradas gratuitas cada mes para las películas que elijas.</p>
              <Link to="/subscription">
                <Button variant="primary" className="promo-btn">
                  <i className="bi bi-star-fill me-2"></i>
                  Conocer más
                </Button>
              </Link>
            </Col>
            <Col lg={5}>
              <div className="promo-image-container">
                <img 
                  src="data:image/jpeg;base64,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" 
                  alt="Membresía Premium" 
                  className="promo-image img-fluid rounded"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Home;