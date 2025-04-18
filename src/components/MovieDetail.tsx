import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import Navbar from './shared/Navbar';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animation trigger after component mounts
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  if (!movie) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando detalles de la película...</p>
      </Container>
    );
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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="fade-in">
      <Navbar showBackButton onBack={handleBack} />

      <Container className="movie-detail-container">
        <Row className={isLoaded ? "slide-up" : ""}>
          <Col md={4} className="mb-4">
            <div className="position-relative poster-container">
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster mb-3"
              />
              <span className="movie-rating">★ {movie.rating.toFixed(1)}</span>
            </div>
            <div className="movie-info-card p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-1">Duración</h6>
                  <div className="fw-bold">{movie.duration} min</div>
                </div>
                <div className="border-start ps-3">
                  <h6 className="mb-1">Estreno</h6>
                  <div className="fw-bold">{new Date(movie.releaseDate).toLocaleDateString('es-ES')}</div>
                </div>
              </div>
              <h6 className="mb-1">Director</h6>
              <div className="fw-bold mb-3">{movie.director}</div>
              <h6 className="mb-1">Géneros</h6>
              <div>
                {movie.genre.map((genre, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    className="me-1 mb-1"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </Col>
          <Col md={8}>
            <h1 className="movie-title mb-3">{movie.title}</h1>
            <div className="movie-synopsis mb-4">
              <h5 className="mb-2">Sinopsis</h5>
              <p className="lead">{movie.synopsis}</p>
            </div>

            <Card className="mb-4">
              <Card.Header as="h5">
                <i className="bi bi-film me-2"></i>Trailer
              </Card.Header>
              <Card.Body>
                <div className="trailer-container">
                  <iframe
                    src={movie.trailerUrl}
                    title={`${movie.title} Trailer`}
                    allowFullScreen
                  ></iframe>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header as="h5">
                <i className="bi bi-calendar-event me-2"></i>Funciones Disponibles
              </Card.Header>
              <Card.Body>
                <h6 className="mb-3">Selecciona una fecha:</h6>
                <div className="dates-container mb-4">
                  {movie.showtimes.map((showtime, index) => (
                    <div
                      key={index}
                      className={`date-item ${selectedDate === showtime.date ? 'date-selected' : ''}`}
                      onClick={() => setSelectedDate(showtime.date)}
                    >
                      <div className="date-day">{new Date(showtime.date).getDate()}</div>
                      <div className="date-month">{new Date(showtime.date).toLocaleDateString('es-ES', { month: 'short' })}</div>
                    </div>
                  ))}
                </div>

                {selectedDate && (
                  <div className="mb-4 slide-up">
                    <h6 className="mb-3">Selecciona un horario:</h6>
                    <div className="times-container">
                      {movie.showtimes.find(s => s.date === selectedDate)?.times.map((time, index) => (
                        <div
                          key={index}
                          className={`time-item ${selectedTime === time ? 'time-selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="tickets-section p-3 mt-4 slide-up">
                    <h6 className="mb-3">Número de entradas:</h6>
                    <div className="ticket-selector d-flex align-items-center justify-content-between mb-4">
                      <Button
                        variant="outline-secondary"
                        className="ticket-btn"
                        onClick={() => setTickets(prev => Math.max(prev - 1, 1))}
                      >
                        <i className="bi bi-dash-lg"></i>
                      </Button>
                      <div className="ticket-count">{tickets}</div>
                      <Button
                        variant="outline-secondary"
                        className="ticket-btn"
                        onClick={() => setTickets(prev => Math.min(prev + 1, 10))}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </Button>
                    </div>

                    <div className="ticket-summary mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Entradas:</span>
                        <span>{tickets} x $800</span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>${tickets * 800}</span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleContinue}
                      className="w-100"
                    >
                      Continuar con la selección de asientos
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MovieDetail;