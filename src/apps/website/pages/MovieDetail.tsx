// src/apps/website/pages/MovieDetail.tsx (Updated version)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { useTheme } from '../../../common/context/ThemeContext';

// Interfaz para la estructura de película en movies.json
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
    times: {
      id?: string;
      time: string;
      room?: string;
      available?: number;
      total?: number;
    }[];
  }[];
}

interface MovieDetailParams {
  id: string;
  [key: string]: string | undefined;
}

const MovieDetail: React.FC = () => {
  const { theme } = useTheme();
  const { id } = useParams<MovieDetailParams>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Cargar datos del archivo JSON local
        const moviesData = await import('../../../data/movies.json');
        const allMovies: Movie[] = moviesData.movies;
        
        // Buscar la película por ID
        const movieData = allMovies.find(movie => movie.id === parseInt(id));
        
        if (movieData) {
          setMovie(movieData);
          
          // Establecer la primera fecha disponible como seleccionada
          if (movieData.showtimes.length > 0) {
            setSelectedDate(movieData.showtimes[0].date);
          }
          
          setError(null);
        } else {
          setError('No se encontró la película solicitada.');
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('No se pudieron cargar los detalles de la película. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleSelectShow = (showId: string) => {
    navigate(`/seats/${showId}`);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Calcular disponibilidad de asientos en porcentaje (para el indicador)
  const calculateAvailabilityPercentage = (available?: number, total?: number) => {
    if (available === undefined || total === undefined || total === 0) return 100;
    return Math.round((available / total) * 100);
  };

  // Determinar la clase para el indicador de disponibilidad
  const getAvailabilityStatusClass = (percentage: number) => {
    if (percentage >= 70) return 'success';
    if (percentage >= 30) return 'warning';
    return 'danger';
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

  if (!movie) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No se encontró la película solicitada.</Alert>
      </Container>
    );
  }

  // Obtener las funciones para la fecha seleccionada
  const selectedShowtimes = selectedDate 
    ? movie.showtimes.find(st => st.date === selectedDate)?.times || []
    : [];

  return (
    <Container className="movie-detail-container py-5">
      <Row className="mb-5">
        <Col md={4}>
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="movie-poster img-fluid rounded shadow mb-4"
          />
        </Col>
        <Col md={8}>
          <h1 className="movie-title mb-3">{movie.title}</h1>
          
          <div className="movie-meta mb-4">
            <Badge bg="primary" className="me-2">{movie.rating.toFixed(1)} ★</Badge>
            {movie.genre.map((genre, index) => (
              <Badge key={index} bg="secondary" className="me-2">{genre}</Badge>
            ))}
            <span className="ms-2">{movie.duration} minutos</span>
          </div>
          
          <div className="movie-synopsis mb-4">
            <h5>Sinopsis</h5>
            <p>{movie.synopsis}</p>
          </div>
          
          <div className="movie-details mb-4">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Estreno:</strong> {formatDate(movie.releaseDate)}</p>
          </div>
          
          <div className="movie-actions">
            <a 
              href={movie.trailerUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline-primary me-3"
            >
              <i className="bi bi-play-circle me-2"></i>
              Ver Trailer
            </a>
          </div>
        </Col>
      </Row>
      
      <Card className="mb-5">
        <Card.Header>
          <h3 className="mb-0">Funciones Disponibles</h3>
        </Card.Header>
        <Card.Body>
          {movie.showtimes.length > 0 ? (
            <>
              {/* Tabs de fechas */}
              <Tabs
                activeKey={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="mb-4"
              >
                {movie.showtimes.map(showtime => (
                  <Tab 
                    key={showtime.date} 
                    eventKey={showtime.date} 
                    title={formatDate(showtime.date)}
                  />
                ))}
              </Tabs>
              
              {/* Horarios para la fecha seleccionada */}
              <Row xs={2} md={3} lg={4} className="g-3">
                {selectedShowtimes.map((showtime, index) => {
                  // Asignar ID si no existe (para navigación)
                  const showtimeId = showtime.id || `${movie.id}-${selectedDate}-${index}`;
                  
                  // Calcular disponibilidad para mostrar en UI
                  const availabilityPercentage = calculateAvailabilityPercentage(
                    showtime.available, 
                    showtime.total
                  );
                  const statusClass = getAvailabilityStatusClass(availabilityPercentage);
                  
                  return (
                    <Col key={showtimeId}>
                      <Card 
                        className="showtime-card h-100"
                        onClick={() => handleSelectShow(showtimeId)}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">{showtime.time}</h5>
                            <Badge bg={statusClass}>
                              {availabilityPercentage}%
                            </Badge>
                          </div>
                          
                          <div className="text-muted mb-2">{showtime.room || 'Sala Principal'}</div>
                          
                          <div className="progress" style={{ height: '10px' }}>
                            <div 
                              className={`progress-bar bg-${statusClass}`} 
                              role="progressbar" 
                              style={{ width: `${availabilityPercentage}%` }}
                              aria-valuenow={availabilityPercentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                              {showtime.available !== undefined && showtime.total !== undefined ? 
                                `${showtime.available} de ${showtime.total} asientos` : 
                                'Asientos disponibles'
                              }
                            </small>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectShow(showtimeId);
                              }}
                            >
                              Comprar
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
              
              {selectedShowtimes.length === 0 && (
                <Alert variant="info">
                  No hay funciones disponibles para la fecha seleccionada.
                </Alert>
              )}
            </>
          ) : (
            <Alert variant="info">
              No hay funciones programadas para esta película en este momento.
            </Alert>
          )}
        </Card.Body>
      </Card>
      
      {movie.trailerUrl && (
        <Card>
          <Card.Header>
            <h3 className="mb-0">Trailer</h3>
          </Card.Header>
          <Card.Body>
            <div className="trailer-container mb-0">
              <iframe
                src={movie.trailerUrl}
                title={`Trailer de ${movie.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MovieDetail;