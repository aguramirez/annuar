import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Navbar } from 'react-bootstrap';

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

interface MovieDetailProps {
  movie: Movie | null;
  setSelectedShowtime: (showtime: { date: string; time: string }) => void;
  setTicketCount: (count: number) => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ 
  movie, 
  setSelectedShowtime, 
  setTicketCount 
}) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [tickets, setTickets] = useState<number>(1);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setSelectedShowtime({ date: selectedDate, time: selectedTime });
      setTicketCount(tickets);
      navigate('/seats');
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">
            <img 
              src="/logo.png" 
              alt="Annuar Shopping Cine" 
              className="logo-img" 
            />
            Annuar Shopping Cine
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="movie-detail-container">
        <Button 
          variant="outline-secondary" 
          className="mb-4" 
          onClick={() => navigate('/')}
        >
          &lt; Volver a cartelera
        </Button>

        <Row>
          <Col md={4} className="mb-4">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="movie-poster mb-3" 
            />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6>Clasificación</h6>
                <div className="rating fs-4">⭐ {movie.rating.toFixed(1)}</div>
              </div>
              <div>
                <h6>Duración</h6>
                <div className="duration fs-5">{movie.duration} min</div>
              </div>
            </div>
          </Col>
          <Col md={8}>
            <h1 className="mb-3">{movie.title}</h1>
            <div className="mb-3">
              {movie.genre.map((genre, index) => (
                <Badge 
                  key={index} 
                  bg="secondary" 
                  className="me-2"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <p className="mb-3"><strong>Director:</strong> {movie.director}</p>
            <p className="mb-3"><strong>Estreno:</strong> {formatDate(movie.releaseDate)}</p>
            <p className="mb-4">{movie.synopsis}</p>

            <h4 className="mb-3">Trailer</h4>
            <div className="trailer-container">
              <iframe 
                src={movie.trailerUrl} 
                title={`${movie.title} Trailer`} 
                allowFullScreen
              ></iframe>
            </div>

            <h4 className="mt-4 mb-3">Funciones Disponibles</h4>
            <div className="mb-4">
              <h6 className="mb-2">Selecciona una fecha:</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.showtimes.map((showtime, index) => (
                  <Button 
                    key={index} 
                    variant={selectedDate === showtime.date ? "primary" : "outline-primary"} 
                    onClick={() => setSelectedDate(showtime.date)}
                    className="me-2 mb-2"
                  >
                    {formatDate(showtime.date)}
                  </Button>
                ))}
              </div>
              
              {selectedDate && (
                <>
                  <h6 className="mb-2">Selecciona un horario:</h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {movie.showtimes.find(s => s.date === selectedDate)?.times.map((time, index) => (
                      <Button 
                        key={index} 
                        variant={selectedTime === time ? "primary" : "outline-primary"} 
                        onClick={() => setSelectedTime(time)}
                        className="me-2 mb-2"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </>
              )}
              
              {selectedDate && selectedTime && (
                <>
                  <h6 className="mb-2">Número de entradas:</h6>
                  <div className="d-flex align-items-center mb-4">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setTickets(prev => Math.max(prev - 1, 1))}
                    >
                      -
                    </Button>
                    <span className="mx-3">{tickets}</span>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setTickets(prev => Math.min(prev + 1, 10))}
                    >
                      +
                    </Button>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleContinue}
                    className="w-100"
                  >
                    Continuar con la selección de asientos
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MovieDetail;