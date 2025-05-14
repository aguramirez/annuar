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
                          <i className="bi bi-ticket-perforated me-2"></i> Comprar entradas
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
                  src="https://via.placeholder.com/600x300?text=Premium+Membership" 
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