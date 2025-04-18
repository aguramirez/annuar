import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
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
  synopsis: string;
  trailerUrl: string;
  rating: number;
  heroImage: string;
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
  const allGenres = ['Todos', ...new Set(movies.flatMap(movie => movie.genre))];

  return (
    <div className="fade-in">
      <Navbar />

      <Container>
        <div className="text-center mb-4">
          <h1 className="page-heading display-4">Annuar Shopping Cine</h1>
          <p className="lead text-muted mb-5">Descubre los mejores estrenos y disfruta una experiencia única de cine</p>
        </div>

        {/* Carrusel de Películas Destacadas */}
        <div className={`featured-movies-container mb-5 ${isCarouselLoaded ? 'carousel-loaded' : ''}`}>
          <h2 className="section-title mb-4">
            <i className="bi bi-stars me-2"></i>
            Películas Destacadas
          </h2>
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
        </div>

        <div className="genre-filter mb-4">
          <h2 className="section-title mb-3">
            <i className="bi bi-film me-2"></i>
            Cartelera Completa
          </h2>
          <h5 className="mb-3">Filtrar por género:</h5>
          <div className="d-flex flex-wrap gap-2">
            {allGenres.map((genre) => (
              <Button
                key={genre}
                variant={activeGenre === genre ? "primary" : "outline-secondary"}
                className="mb-2"
                onClick={() => setActiveGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        <Row>
          {filteredMovies.map((movie, index) => (
            <Col
              key={movie.id}
              xs={12}
              sm={6}
              md={4}
              className={`mb-4 ${animateCards ? 'slide-up' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                onClick={() => setSelectedMovie(movie)}
                className="h-100"
              >
                <div className="card-img-container">
                  <Card.Img variant="top" src={movie.poster} alt={movie.title} />
                  <div className="card-img-overlay">
                    <div className="overlay-content">
                      <Link
                        to={`/movie/${movie.id}`}
                        className="btn btn-primary"
                        onClick={() => setSelectedMovie(movie)}
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>
                    <small className="text-muted">
                      {movie.genre.join(', ')} | {movie.duration} min
                    </small>
                  </Card.Text>
                  <Card.Text>
                    {movie.synopsis.substring(0, 100)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="rating">
                      {movie.rating.toFixed(1)}
                    </div>
                    <small className="text-muted">Director: {movie.director}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;