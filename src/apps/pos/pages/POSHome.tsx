// src/apps/pos/pages/POSHome.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

interface Movie {
  id: number;
  title: string;
  poster: string;
  showtimes: {
    id: number;
    date: string;
    time: string;
  }[];
}

const POSHome: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // En un caso real, esto sería una llamada a la API
    const fetchMovies = async () => {
      // Datos de ejemplo
      const moviesData = [
        {
          id: 1,
          title: 'Minecraft',
          poster: 'https://i.pinimg.com/736x/36/96/05/369605adcd515e808b8d950bb1997b8c.jpg',
          showtimes: [
            { id: 101, date: '2025-05-04', time: '14:30' },
            { id: 102, date: '2025-05-04', time: '17:45' },
            { id: 103, date: '2025-05-04', time: '20:15' },
            { id: 104, date: '2025-05-05', time: '15:00' },
          ]
        },
        {
          id: 2,
          title: 'Capitan America: Un Nuevo Mundo',
          poster: 'https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
          showtimes: [
            { id: 201, date: '2025-05-04', time: '15:30' },
            { id: 202, date: '2025-05-04', time: '18:15' },
            { id: 203, date: '2025-05-05', time: '14:00' },
          ]
        },
        {
          id: 3,
          title: 'Blanca Nieves',
          poster: 'https://lumiere-a.akamaihd.net/v1/images/image003_f1e9732d.jpeg?region=0,0,662,827',
          showtimes: [
            { id: 301, date: '2025-05-04', time: '14:00' },
            { id: 302, date: '2025-05-04', time: '19:00' },
            { id: 303, date: '2025-05-05', time: '16:30' },
          ]
        },
      ];

      setMovies(moviesData);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const dates = [
    { value: '2025-05-04', label: 'Hoy', day: '4', month: 'Mayo' },
    { value: '2025-05-05', label: 'Mañana', day: '5', month: 'Mayo' },
    { value: '2025-05-06', label: '', day: '6', month: 'Mayo' },
    { value: '2025-05-07', label: '', day: '7', month: 'Mayo' },
    { value: '2025-05-08', label: '', day: '8', month: 'Mayo' },
  ];

  const handleSelectMovie = (movie: Movie, showtimeId: number) => {
    // Aquí redirigirías a la selección de asientos con estos datos
    console.log(`Seleccionado: ${movie.title}, Función ID: ${showtimeId}`);
  };

  const filteredMovies = movies.filter(movie => 
    movie.showtimes.some(showtime => showtime.date === selectedDate)
  );

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Venta de Entradas</h1>
      
      {/* Selector de fecha */}
      <div className="date-selector mb-4">
        <div className="d-flex overflow-auto pb-2">
          {dates.map((date) => (
            <Card 
              key={date.value}
              className={`date-card me-3 ${selectedDate === date.value ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date.value)}
            >
              <Card.Body className="text-center p-3">
                {date.label && <div className="date-label mb-1">{date.label}</div>}
                <div className="date-day">{date.day}</div>
                <div className="date-month">{date.month}</div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Lista de películas */}
      <Row>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Col key={movie.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 pos-movie-card">
                <div className="d-flex pos-movie-content">
                  <div className="pos-movie-poster">
                    <img src={movie.poster} alt={movie.title} />
                  </div>
                  <div className="pos-movie-details p-3">
                    <h5>{movie.title}</h5>
                    <div className="showtimes-container mt-3">
                      <p className="mb-2 fw-bold">Horarios:</p>
                      <div className="d-flex flex-wrap">
                        {movie.showtimes
                          .filter(showtime => showtime.date === selectedDate)
                          .map((showtime) => (
                            <Button 
                              key={showtime.id}
                              variant="outline-primary" 
                              size="sm"
                              className="me-2 mb-2 time-btn"
                              onClick={() => handleSelectMovie(movie, showtime.id)}
                            >
                              {showtime.time}
                            </Button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <h4>No hay funciones disponibles para esta fecha</h4>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default POSHome;