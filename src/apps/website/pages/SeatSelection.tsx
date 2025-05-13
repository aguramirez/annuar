// src/apps/website/pages/SeatSelection.tsx (Updated version)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { useTheme } from '../../../common/context/ThemeContext';

interface SeatSelectionParams {
  showId: string;
  [key: string]: string | undefined;
}

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

interface Seat {
  id: string;
  row: string;
  number: string;
  status: 'available' | 'occupied' | 'selected';
  type: 'standard' | 'vip' | 'premium' | 'accessible';
}

// Ticket types and prices
const ticketTypes = [
  { id: 'adult', name: 'Adulto', price: 1000 },
  { id: 'child', name: 'Niño', price: 700 },
  { id: 'senior', name: 'Jubilado', price: 600 },
  { id: 'student', name: 'Estudiante', price: 800 }
];

interface SelectedTicket {
  type: string;
  quantity: number;
}

const SeatSelection: React.FC = () => {
  const { theme } = useTheme();
  const { showId } = useParams<SeatSelectionParams>();
  const navigate = useNavigate();
  
  // State
  const [movieData, setMovieData] = useState<{
    movie: Movie | null;
    date: string;
    time: string;
    room: string;
  }>({
    movie: null,
    date: '',
    time: '',
    room: ''
  });
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!showId) return;
      
      try {
        setLoading(true);
        
        // Cargar los datos del JSON local
        const moviesData = await import('../../../data/movies.json');
        const allMovies: Movie[] = moviesData.movies;
        
        // Parsear el ID del show para extraer la información necesaria
        let movie: Movie | null = null;
        let showDate = '';
        let showTime = '';
        let showRoom = 'Sala 1'; // Default
        
        // Formato esperado: movieId-date-index o un formato personalizado
        // Para este ejemplo, usaremos un formato simple movieId-date-index
        const parts = showId.split('-');
        
        if (parts.length >= 3) {
          const movieId = parseInt(parts[0]);
          movie = allMovies.find(m => m.id === movieId) || null;
          
          if (movie) {
            showDate = parts[1];
            const timeIndex = parseInt(parts[2]);
            const showtimeEntry = movie.showtimes.find(st => st.date === showDate);
            
            if (showtimeEntry && showtimeEntry.times[timeIndex]) {
              showTime = showtimeEntry.times[timeIndex].time;
              showRoom = showtimeEntry.times[timeIndex].room || 'Sala 1';
            }
          }
        } else {
          // Intenta buscar un showId como un ID directo en caso de que sea uno de los IDs ya definidos
          for (const movieItem of allMovies) {
            let found = false;
            
            for (const showtime of movieItem.showtimes) {
              for (const time of showtime.times) {
                if (time.id === showId) {
                  movie = movieItem;
                  showDate = showtime.date;
                  showTime = time.time;
                  showRoom = time.room || 'Sala 1';
                  found = true;
                  break;
                }
              }
              
              if (found) break;
            }
            
            if (found) break;
          }
        }
        
        if (!movie) {
          setError('No se encontró la película para esta función.');
          setLoading(false);
          return;
        }
        
        // Establecer datos de la película
        setMovieData({
          movie,
          date: showDate,
          time: showTime,
          room: showRoom
        });
        
        // Generar asientos aleatoriamente para la demo
        generateRandomSeats();
        
      } catch (err) {
        console.error('Error fetching movie and seats:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showId]);
  
  // Generar asientos aleatorios para demostración
  const generateRandomSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const generatedSeats: Seat[] = [];
    
    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        // Determinar tipo de asiento basado en la fila
        let type: Seat['type'] = 'standard';
        if (row === 'A' || row === 'B') {
          type = 'premium';
        } else if (row === 'C') {
          type = 'vip';
        } else if (i === 1 || i === seatsPerRow) {
          type = 'accessible';
        }
        
        // Asignar estado - algunas ocupadas aleatoriamente
        const status: Seat['status'] = Math.random() < 0.3 ? 'occupied' : 'available';
        
        generatedSeats.push({
          id: `${row}-${i}`,
          row,
          number: i.toString(),
          status,
          type
        });
      }
    });
    
    setSeats(generatedSeats);
  };
  
  // Manejar selección de asientos
  const handleSeatSelection = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    
    if (!seat || seat.status === 'occupied') return;
    
    setSelectedSeatIds(prev => {
      // Si ya está seleccionado, deseleccionar
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      
      // Si no, añadir a seleccionados
      return [...prev, seatId];
    });
  };
  
  // Manejar cambio de cantidad de tickets
  const handleTicketQuantityChange = (typeId: string, quantity: number) => {
    if (quantity < 0) return;
    
    if (quantity === 0) {
      // Eliminar tipo de entrada si la cantidad es 0
      setSelectedTickets(prev => prev.filter(ticket => ticket.type !== typeId));
    } else {
      setSelectedTickets(prev => {
        const existingTicket = prev.find(ticket => ticket.type === typeId);
        
        if (existingTicket) {
          // Actualizar cantidad de entrada existente
          return prev.map(ticket => 
            ticket.type === typeId ? { ...ticket, quantity } : ticket
          );
        } else {
          // Añadir nuevo tipo de entrada
          return [...prev, { type: typeId, quantity }];
        }
      });
    }
  };
  
  // Obtener cantidad de un tipo de entrada
  const getTicketQuantity = (typeId: string): number => {
    const ticket = selectedTickets.find(t => t.type === typeId);
    return ticket ? ticket.quantity : 0;
  };
  
  // Calcular total de tickets seleccionados
  const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  
  // Calcular precio total
  const calculateTotal = () => {
    return selectedTickets.reduce((sum, ticket) => {
      const ticketType = ticketTypes.find(t => t.id === ticket.type);
      return sum + (ticketType?.price || 0) * ticket.quantity;
    }, 0);
  };
  
  // Continuar con el proceso de compra
  const handleContinue = () => {
    if (selectedSeatIds.length === 0) {
      setError('Por favor selecciona al menos un asiento.');
      return;
    }
    
    if (totalTickets === 0) {
      setError('Por favor selecciona al menos un tipo de entrada.');
      return;
    }
    
    if (selectedSeatIds.length !== totalTickets) {
      setError(`El número de asientos seleccionados (${selectedSeatIds.length}) debe coincidir con el total de entradas (${totalTickets}).`);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulación del proceso de reserva
    setTimeout(() => {
      setIsProcessing(false);
      
      // Mock de ID de reserva - en una aplicación real, esto vendría del backend
      const reservationId = `RES-${Date.now()}`;
      
      // Navegar a la página de pago
      navigate(`/payment/${reservationId}`, { 
        state: { 
          fromTicketSelection: true,
          movieTitle: movieData.movie?.title,
          showDate: movieData.date,
          showTime: movieData.time,
          room: movieData.room,
          seats: selectedSeatIds.map(id => {
            const seat = seats.find(s => s.id === id);
            return seat ? `${seat.row}${seat.number}` : id;
          }),
          ticketTypes: selectedTickets,
          totalAmount: calculateTotal()
        } 
      });
    }, 1500);
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
  
  // Agrupar asientos por fila para mostrarlos
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);
  
  // Determinar el precio de un asiento según su tipo
  const getSeatPrice = (seatType: Seat['type']): number => {
    switch (seatType) {
      case 'premium': return 1200;
      case 'vip': return 1500;
      case 'accessible': return 800;
      default: return 1000;
    }
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
  
  if (error && !isProcessing) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );
  }
  
  if (!movieData.movie) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No se encontró la función solicitada.</Alert>
        <Button variant="secondary" onClick={() => navigate('/movies')}>Ver cartelera</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Selección de Asientos</h1>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <div className="show-details mb-4">
        <h2>{movieData.movie.title}</h2>
        <Row>
          <Col md={6}>
            <p><strong>Fecha:</strong> {formatDate(movieData.date)}</p>
            <p><strong>Hora:</strong> {movieData.time}</p>
          </Col>
          <Col md={6}>
            <p><strong>Sala:</strong> {movieData.room}</p>
            <p><strong>Entradas seleccionadas:</strong> {selectedSeatIds.length}</p>
          </Col>
        </Row>
      </div>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Selección de Asientos</h4>
            </Card.Header>
            <Card.Body>
              <div className="cinema-layout mb-4">
                <div className="screen"></div>
                <div className="mt-5 text-center text-muted small">
                  ↓ PANTALLA ↓
                </div>
                
                <div className="seats-container mt-5">
                  {Object.keys(seatsByRow).sort().map(row => (
                    <div key={row} className="seat-row mb-2">
                      <div className="row-label me-2">{row}</div>
                      <div className="d-flex">
                        {seatsByRow[row].map(seat => (
                          <div 
                            key={seat.id}
                            className={`seat seat-${seat.type} ${seat.status === 'occupied' ? 'seat-occupied' : ''} ${selectedSeatIds.includes(seat.id) ? 'seat-selected' : 'seat-available'}`}
                            onClick={() => handleSeatSelection(seat.id)}
                          >
                            {seat.number}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="seat-legend">
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <div className="legend-item">
                    <div className="legend-box seat-available"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box seat-selected"></div>
                    <span>Seleccionado</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box seat-occupied"></div>
                    <span>Ocupado</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box seat-standard"></div>
                    <span>Standard - ${getSeatPrice('standard')}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box seat-vip"></div>
                    <span>VIP - ${getSeatPrice('vip')}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box seat-premium"></div>
                    <span>Premium - ${getSeatPrice('premium')}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Entradas</h4>
            </Card.Header>
            <Card.Body>
              <h5 className="mb-3">Tipos de Entrada</h5>
              
              {ticketTypes.map(type => (
                <div key={type.id} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{type.name}</strong>
                      <div className="text-muted small">${type.price}</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleTicketQuantityChange(type.id, Math.max(0, getTicketQuantity(type.id) - 1))}
                      >
                        <i className="bi bi-dash"></i>
                      </Button>
                      <span className="mx-3">{getTicketQuantity(type.id)}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleTicketQuantityChange(type.id, getTicketQuantity(type.id) + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <hr className="my-4" />
              
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              
              <div className="text-muted small mb-4">
                Por favor, selecciona la misma cantidad de asientos que de entradas.
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                onClick={handleContinue}
                disabled={isProcessing || selectedSeatIds.length === 0 || totalTickets === 0}
              >
                {isProcessing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Procesando...
                  </>
                ) : (
                  'Continuar al pago'
                )}
              </Button>
              
              <Button 
                variant="outline-secondary" 
                className="w-100 mt-2"
                onClick={() => navigate(-1)}
                disabled={isProcessing}
              >
                Volver
              </Button>
            </Card.Body>
          </Card>
          
          <Card className="order-summary">
            <Card.Header>
              <h5 className="mb-0">Resumen</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex mb-2">
                  <img 
                    src={movieData.movie.poster} 
                    alt={movieData.movie.title} 
                    className="me-3" 
                    style={{ width: '60px', height: '90px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1">{movieData.movie.title}</h6>
                    <div className="text-muted small">{formatDate(movieData.date)}</div>
                    <div className="text-muted small">{movieData.time} - {movieData.room}</div>
                  </div>
                </div>
                
                {selectedSeatIds.length > 0 && (
                  <div className="mt-2">
                    <strong>Asientos:</strong>{' '}
                    {selectedSeatIds.map(id => {
                      const seat = seats.find(s => s.id === id);
                      return seat ? `${seat.row}${seat.number}` : id;
                    }).join(', ')}
                  </div>
                )}
              </div>
              
              {selectedTickets.length > 0 && (
                <>
                  <hr className="my-3" />
                  <div>
                    <strong>Entradas:</strong>
                    <ul className="list-unstyled mt-2">
                      {selectedTickets.map(ticket => {
                        const ticketType = ticketTypes.find(t => t.id === ticket.type);
                        return ticketType ? (
                          <li key={ticket.type} className="d-flex justify-content-between">
                            <span>{ticketType.name} x{ticket.quantity}</span>
                            <span>${ticketType.price * ticket.quantity}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SeatSelection;