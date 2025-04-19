import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel, Badge } from 'react-bootstrap';
import Navbar from './shared/Navbar';
import { useTheme } from '../context/ThemeContext';
import FeaturedMovieSlide from './FeaturedMovieSlide';

interface Movie {
  id: number;
  title: string;
  director: string;
  genre: string[];
  duration: number;
  releaseDate: string;
  poster: string;
  heroImage: string; // Asegúrate de que tus datos incluyan heroImage para el fondo del carrusel
  synopsis: string;
  trailerUrl: string;
  rating: number;
  showtimes: {
    date: string;
    times: string[];
  }[];
}

interface HomeProps {
  movies: Movie[];
  setSelectedMovie: (movie: Movie) => void;
}

const Home: React.FC<HomeProps> = ({ movies, setSelectedMovie }) => {
  const { theme } = useTheme();
  const [activeGenre, setActiveGenre] = useState<string>('Todos');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const [animateCards, setAnimateCards] = useState(false);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [isCarouselLoaded, setIsCarouselLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateCards(true);

    // Select top 3 movies with highest rating as featured
    const sortedByRating = [...movies].sort((a, b) => b.rating - a.rating);
    setFeaturedMovies(sortedByRating.slice(0, 3));

    // Animate carousel
    setTimeout(() => {
      setIsCarouselLoaded(true);
    }, 300);
  }, [movies]);

  useEffect(() => {
    if (activeGenre === 'Todos') {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(movies.filter(movie => movie.genre.includes(activeGenre)));
    }
  }, [activeGenre, movies]);

  // Extract unique genres from all movies
  const allGenres = ['Todos', ...Array.from(new Set(movies.flatMap(movie => movie.genre)))];

  return (
    <div className="home-page">
      <Navbar />
      
      <div className="hero-section">
        <Container>
          <div className="text-center mb-5">
            <h1 className="display-4 hero-title">Annuar Shopping <span className="text-primary">Cine</span></h1>
            <p className="lead hero-subtitle">Descubre los mejores estrenos y disfruta de una experiencia única</p>
          </div>
        </Container>
      </div>

      {/* Carrusel de Películas Destacadas */}
      <section className={`featured-section mb-5 ${isCarouselLoaded ? 'carousel-loaded' : ''}`}>
        <Container>
          <div className="section-header d-flex align-items-center justify-content-between mb-4">
            <h2 className="section-title">
              <i className="bi bi-stars me-2"></i>
              Películas Destacadas
            </h2>
            <Link to="/movies" className="view-all-link">
              Ver todas <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          
          <Carousel
            className="featured-carousel"
            indicators={true}
            controls={true}
            interval={5000}
          >
            {featuredMovies.map(movie => (
              <Carousel.Item key={movie.id}>
                <FeaturedMovieSlide
                  movie={movie}
                  onSelectMovie={() => setSelectedMovie(movie)}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Filtros por género */}
      <section className="filter-section mb-5">
        <Container>
          <div className="section-header d-flex align-items-center justify-content-between mb-4">
            <h2 className="section-title">
              <i className="bi bi-film me-2"></i>
              Cartelera Completa
            </h2>
          </div>
          
          <div className="genre-filter mb-4">
            <div className="d-flex flex-wrap gap-2">
              {allGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={activeGenre === genre ? "primary" : "outline-secondary"}
                  className="genre-btn"
                  onClick={() => setActiveGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
          
          <Row className="movie-grid">
            {filteredMovies.map((movie, index) => (
              <Col
                key={movie.id}
                xs={6}
                md={4}
                lg={3}
                className={`mb-4 ${animateCards ? 'slide-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card
                  className="movie-card h-100"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="card-img-container">
                    <Card.Img variant="top" src={movie.poster} alt={movie.title} />
                    <div className="card-img-overlay">
                      <div className="overlay-content">
                        <Link
                          to={`/movie/${movie.id}`}
                          className="btn btn-primary card-btn"
                          onClick={() => setSelectedMovie(movie)}
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="movie-card-title">{movie.title}</Card.Title>
                    <div className="movie-card-info">
                      <span className="movie-card-genres">{movie.genre.slice(0, 2).join(' • ')}</span>
                      <span className="movie-card-duration">{movie.duration} min</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="movie-card-rating">
                        <i className="bi bi-star-fill me-1"></i>
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                      <div className="movie-card-release">
                        {new Date(movie.releaseDate).getFullYear()}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Sección de promociones o información adicional */}
      <section className="promo-section py-5 my-4">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <div className="promo-content">
                <h2 className="promo-title mb-3">Disfruta al máximo tu experiencia</h2>
                <p className="promo-text mb-4">
                  Aprovecha nuestras promociones especiales y descuentos exclusivos para miembros.
                  Palomitas, bebidas y mucho más para complementar tu película favorita.
                </p>
                <Button variant="primary" size="lg" className="promo-btn">
                  <i className="bi bi-ticket-perforated me-2"></i>
                  Ver promociones
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <div className="promo-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Promociones de cine" 
                  className="promo-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;