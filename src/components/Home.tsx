import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Navbar } from 'react-bootstrap';

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
  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">
            <img 
              src="/logo.jpg" 
              alt="Annuar Shopping Cine" 
              className="logo-img" 
            />
            Annuar Shopping Cine
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <h1 className="page-heading">Annuar Shopping Cine</h1>
        <h2 className="text-center mb-4">Cartelera</h2>
        
        <Row>
          {movies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} className="mb-4">
              <Card 
                onClick={() => setSelectedMovie(movie)} 
                className="h-100"
              >
                <Card.Img variant="top" src={movie.poster} alt={movie.title} />
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
                      ⭐ {movie.rating.toFixed(1)}
                    </div>
                    <Link 
                      to={`/movie/${movie.id}`} 
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      Ver detalles
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;