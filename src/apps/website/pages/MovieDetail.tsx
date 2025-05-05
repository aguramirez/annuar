// src/apps/website/pages/MovieDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Tab, Tabs } from 'react-bootstrap';
import movieService, { Movie } from '../../../common/services/movieService';
import showService, { Show } from '../../../common/services/showService';

interface MovieDetailParams {
  id: string;
  [key: string]: string | undefined;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<MovieDetailParams>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Obtener detalles de la película
        const movieData = await movieService.getMovie(id);
        setMovie(movieData);
        
        // Obtener funciones para esta película
        const showsData = await showService.getShowsForMovie(id);
        setShows(showsData);
        
        // Establecer la primera fecha disponible como seleccionada
        if (showsData.length > 0) {
          const dates = [...new Set(showsData.map(show => 
            new Date(show.startTime).toISOString().split('T')[0]
          ))];
          if (dates.length > 0) {
            setSelectedDate(dates[0]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching movie and shows:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id]);

  const handleSelectShow = (showId: string) => {
    navigate(`/seats/${showId}`);
  };

  // Agrupar funciones por fecha
  const groupShowsByDate = () => {
    const grouped: Record<string, Show[]> = {};
    
    shows.forEach(show => {
      const date = new Date(show.startTime).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(show);
    });
    
    return grouped;
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

  // Formatear hora para mostrar
  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="py-5">
        <div className="alert alert-warning">No se encontró la película solicitada.</div>
      </Container>
    );
  }

  const groupedShows = groupShowsByDate();
  const availableDates = Object.keys(groupedShows).sort();

  return (
    <Container className="py-5">
      <Row>
        <Col md={4} className="mb-4">
          <img 
            src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
            alt={movie.title} 
            className="img-fluid rounded"
          />
        </Col>
        <Col md={8}>
          <h1 className="mb-3">{movie.title}</h1>
          <div className="mb-3">
            <Badge bg="primary" className="me-2">{movie.rating}</Badge>
            <Badge bg="secondary" className="me-2">{movie.genre}</Badge>
            <span>{movie.durationMinutes} minutos</span>
          </div>
          <p className="lead mb-4">{movie.synopsis}</p>
          <div className="movie-details mb-4">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Reparto:</strong> {movie.cast}</p>
            <p><strong>Estreno:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p>
              <strong>Idioma:</strong> {movie.language}
              {movie.is3d && <Badge bg="info" className="ms-2">3D</Badge>}
              {movie.isSubtitled && <Badge bg="dark" className="ms-2">Subtitulada</Badge>}
            </p>
          </div>
          
          {movie.trailerUrl && (
            <div className="mb-4">
              <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                <i className="bi bi-play-circle me-2"></i>
                Ver Trailer
              </a>
            </div>
          )}
        </Col>
      </Row>
      
      <hr className="my-4" />
      
      <h2 className="mb-4">Funciones Disponibles</h2>
      
      {availableDates.length > 0 ? (
        <>
          <div className="date-selector mb-4">
            <Tabs
              activeKey={selectedDate}
              onSelect={(date) => setSelectedDate(date || '')}
              className="mb-3"
            >
              {availableDates.map(date => (
                <Tab 
                  key={date} 
                  eventKey={date} 
                  title={formatDate(date)}
                />
              ))}
            </Tabs>
          </div>
          
          <Card>
            <Card.Body>
              <h5 className="mb-3">Horarios para {formatDate(selectedDate)}</h5>
              <div className="d-flex flex-wrap">
                {selectedDate && groupedShows[selectedDate]?.map(show => (
                  <Button
                    key={show.id}
                    variant="outline-primary"
                    className="me-2 mb-2"
                    onClick={() => handleSelectShow(show.id)}
                  >
                    {formatTime(show.startTime)}
                    {show.is3d && <span className="ms-1">3D</span>}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </>
      ) : (
        <div className="alert alert-info">
          No hay funciones disponibles para esta película en este momento.
        </div>
      )}
    </Container>
  );
};

export default MovieDetail;