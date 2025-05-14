import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

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
    times: string[];
  }[];
}

interface FeaturedMovieSlideProps {
  movie: Movie;
  onSelectMovie: () => void;
}

const FeaturedMovieSlide: React.FC<FeaturedMovieSlideProps> = ({ movie, onSelectMovie }) => {
  return (
    <div className="featured-movie-slide" style={{
      backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 100%), url(${movie.heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="featured-movie-content">
        <div className="featured-movie-info">
          {/* <div className="featured-movie-tag mb-2">Destacada</div> */}
          <h2 className="featured-movie-title">{movie.title}</h2>
          <div className="featured-movie-meta mb-3">
            <div className="featured-movie-rating">
              <i className="bi bi-star-fill me-1"></i>
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
          <p className="featured-movie-synopsis mb-4">{movie.synopsis.substring(0, 150)}...</p>
          <div className="featured-movie-buttons">
            <Link to={`/movie/${movie.id}`} onClick={onSelectMovie}>
              <button className="btn btn-primary featured-movie-btn me-3">
                <i className="bi bi-ticket-perforated me-2"></i>
                Comprar entradas
              </button>
            </Link>
            <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
              <button className="btn btn-outline-light featured-movie-btn">
                <i className="bi bi-play-fill me-2"></i>
                Ver trailer
              </button>
            </a>
          </div>
        </div>
        <div className="featured-movie-image-container">
          <img src={movie.poster} alt={movie.title} className="featured-movie-image" />
          <div className="featured-movie-poster-shadow"></div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovieSlide;