// src/apps/pos/pages/POSHome.tsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import showService, { Show } from '../../../common/services/showService';
import movieService, { Movie } from '../../../common/services/movieService';

const POSHome: React.FC = () => {
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const cinemaId = 'your-cinema-id'; // Esto debería venir de la configuración o contexto
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener películas en cartelera
        const moviesData = await movieService.getCurrentlyShowing();
        setMovies(moviesData);
        
        // Cargar funciones del día para todas las películas
        const promises = moviesData.map(movie => 
          showService.getShowsForMovieInCinema(movie.id, cinemaId, selectedDate)
        );
        
        const showsResults = await Promise.all(promises);
        const allShows = showsResults.flat();
        setShows(allShows);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [cinemaId, selectedDate]);
  
  // Obtener las próximas fechas para el selector
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toISOString().split('T')[0];
      let label = '';
      
      if (i === 0) label = 'Hoy';
      else if (i === 1) label = 'Mañana';
      
      dates.push({
        date: formattedDate,
        label,
        day: date.getDate(),
        month: date.toLocaleString('es-ES', { month: 'short' })
      });
    }
    
    return dates;
  };
  
  // Agrupar funciones por película
  const getShowsByMovie = () => {
    const groupedShows: Record<string, Show[]> = {};
    
    shows.forEach(show => {
      if (!groupedShows[show.movieId]) {
        groupedShows[show.movieId] = [];
      }
      groupedShows[show.movieId].push(show);
    });
    
    return groupedShows;
  };
  
  const handleSelectShow = (showId: string) => {
    navigate(`/pos/seats/${showId}`);
  };
  
  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const dates = getDates();
  const showsByMovie = getShowsByMovie();
  
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Venta de Entradas</h1>
      
      {/* Selector de fecha */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Seleccionar Fecha</h5>
          <div className="d-flex overflow-auto date-selector">
            {dates.map((date) => (
              <Card 
                key={date.date}
                className={`date-card me-3 ${selectedDate === date.date ? 'active' : ''}`}
                onClick={() => setSelectedDate(date.date)}
              >
                <Card.Body className="text-center py-2">
                  {date.label && <div className="date-label mb-1">{date.label}</div>}
                  <div className="date-day">{date.day}</div>
                  <div className="date-month">{date.month}</div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Card.Body>
      </Card>
      
      {/* Lista de películas con funciones */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {movies.map(movie => {
            const movieShows = showsByMovie[movie.id] || [];
            
            if (movieShows.length === 0) return null;
            
            return (
              <Col key={movie.id} lg={6} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex mb-3">
                      <img 
                        src={movie.posterUrl || 'https://via.placeholder.com/100x150'} 
                        alt={movie.title} 
                        className="me-3 movie-thumbnail"
                        style={{ width: '80px', height: '120px', objectFit: 'cover' }}
                      />
                      <div>
                        <h5 className="mb-2">{movie.title}</h5>
                        <div className="badge bg-secondary me-2">{movie.durationMinutes} min</div>
                        <div className="badge bg-primary">{movie.genre}</div>
                      </div>
                    </div>
                    
                    <h6 className="mb-2">Horarios:</h6>
                    <div className="d-flex flex-wrap">
                      {movieShows.map(show => (
                        <Button
                          key={show.id}
                          variant="outline-primary"
                          className="me-2 mb-2"
                          onClick={() => handleSelectShow(show.id)}
                        >
                          {formatTime(show.startTime)} - {show.roomName}
                          {show.is3d && <span className="ms-1 badge bg-info">3D</span>}
                        </Button>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          
          {Object.keys(showsByMovie).length === 0 && (
            <Col>
              <div className="alert alert-info">
                No hay funciones disponibles para la fecha seleccionada.
              </div>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default POSHome;