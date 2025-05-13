// src/apps/pos/pages/POSHome.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner, Tabs, Tab, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Mock data for movies
const movies = [
  {
    id: 1,
    title: "Minecraft",
    director: "María González",
    genre: ["Drama", "Ciencia Ficción"],
    duration: 128,
    releaseDate: "2024-03-15",
    poster: "https://i.pinimg.com/736x/36/96/05/369605adcd515e808b8d950bb1997b8c.jpg",
    heroImage: "https://img.megaplextheatres.com/FilmBackdrop/HO00003457",
    rating: 4.7,
    showtimes: [
      {
        date: "2025-05-13",
        times: [
          { id: "s1", time: "14:30", room: "Sala 1", available: 45, total: 120 },
          { id: "s2", time: "17:45", room: "Sala 2", available: 78, total: 120 },
          { id: "s3", time: "20:15", room: "Sala 1", available: 102, total: 120 }
        ]
      },
      {
        date: "2025-05-14",
        times: [
          { id: "s4", time: "15:00", room: "Sala 1", available: 80, total: 120 },
          { id: "s5", time: "18:00", room: "Sala 3", available: 65, total: 120 },
          { id: "s6", time: "21:00", room: "Sala 2", available: 120, total: 120 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Capitan America: Un Nuevo Mundo",
    director: "Carlos Vidal",
    genre: ["Thriller", "Misterio"],
    duration: 115,
    releaseDate: "2024-04-05",
    poster: "https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    heroImage: "https://i0.wp.com/tomatazos.buscafs.com/2025/03/snow-white-2025.jpg?quality=75&strip=all",
    rating: 4.5,
    showtimes: [
      {
        date: "2025-05-13",
        times: [
          { id: "s7", time: "15:30", room: "Sala 3", available: 55, total: 120 },
          { id: "s8", time: "18:15", room: "Sala 1", available: 40, total: 120 },
          { id: "s9", time: "21:30", room: "Sala 2", available: 95, total: 120 }
        ]
      },
      {
        date: "2025-05-14",
        times: [
          { id: "s10", time: "14:00", room: "Sala 2", available: 120, total: 120 },
          { id: "s11", time: "17:30", room: "Sala 3", available: 75, total: 120 },
          { id: "s12", time: "20:45", room: "Sala 1", available: 60, total: 120 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Blanca Nieves",
    director: "Laura Sánchez",
    genre: ["Romance", "Musical"],
    duration: 132,
    releaseDate: "2024-03-22",
    poster: "https://lumiere-a.akamaihd.net/v1/images/image003_f1e9732d.jpeg?region=0,0,662,827",
    heroImage: "https://i0.wp.com/tomatazos.buscafs.com/2025/03/snow-white-2025.jpg?quality=75&strip=all",
    rating: 4.9,
    showtimes: [
      {
        date: "2025-05-13",
        times: [
          { id: "s13", time: "14:00", room: "Sala 2", available: 100, total: 120 },
          { id: "s14", time: "17:00", room: "Sala 1", available: 70, total: 120 },
          { id: "s15", time: "20:00", room: "Sala 3", available: 85, total: 120 }
        ]
      },
      {
        date: "2025-05-14",
        times: [
          { id: "s16", time: "15:30", room: "Sala 3", available: 110, total: 120 },
          { id: "s17", time: "18:30", room: "Sala 2", available: 80, total: 120 },
          { id: "s18", time: "21:30", room: "Sala 1", available: 65, total: 120 }
        ]
      }
    ]
  }
];

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

const POSHome: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Get today's date
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  // Filter movies by search term
  const filteredMovies = searchTerm 
    ? movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : movies;
  
  // Get selected movie details
  const selectedMovie = movies.find(movie => movie.id === selectedMovieId);
  
  // Get available dates for selected movie
  const availableDates = selectedMovie 
    ? selectedMovie.showtimes.map(showtime => showtime.date) 
    : [];
  
  // Get available showtimes for selected date
  const availableShowtimes = selectedMovie && selectedDate
    ? selectedMovie.showtimes.find(showtime => showtime.date === selectedDate)?.times || []
    : [];
    
  // Get selected showtime details
  const selectedShowtime = selectedMovie && selectedDate && selectedShowtimeId
    ? availableShowtimes.find(showtime => showtime.id === selectedShowtimeId)
    : null;
  
  // Calculate total tickets and price
  const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const totalPrice = selectedTickets.reduce((sum, ticket) => {
    const ticketType = ticketTypes.find(t => t.id === ticket.type);
    return sum + (ticketType?.price || 0) * ticket.quantity;
  }, 0);
  
  // Handle ticket quantity change
  const handleTicketQuantityChange = (typeId: string, quantity: number) => {
    if (quantity < 0) return;
    
    if (quantity === 0) {
      // Remove ticket type if quantity is 0
      setSelectedTickets(prev => prev.filter(ticket => ticket.type !== typeId));
    } else {
      setSelectedTickets(prev => {
        const existingTicket = prev.find(ticket => ticket.type === typeId);
        
        if (existingTicket) {
          // Update existing ticket quantity
          return prev.map(ticket => 
            ticket.type === typeId ? { ...ticket, quantity } : ticket
          );
        } else {
          // Add new ticket type
          return [...prev, { type: typeId, quantity }];
        }
      });
    }
  };
  
  // Get ticket quantity for a specific type
  const getTicketQuantity = (typeId: string): number => {
    const ticket = selectedTickets.find(t => t.type === typeId);
    return ticket ? ticket.quantity : 0;
  };
  
  // Handle customer info change
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };
  
  // Reset ticket selection
  const resetTicketSelection = () => {
    setSelectedTickets([]);
  };
  
  // Process order
  const processOrder = () => {
    if (!selectedShowtimeId || totalTickets === 0) return;
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Reset after showing success for 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedMovieId(null);
        setSelectedDate('');
        setSelectedShowtimeId(null);
        resetTicketSelection();
        setCustomerInfo({
          name: '',
          phone: '',
          email: ''
        });
      }, 3000);
    }, 1500);
  };
  
  // Handle date selection
  useEffect(() => {
    if (selectedMovie && availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [selectedMovie, availableDates, selectedDate]);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format percentage for seat availability
  const formatAvailabilityPercentage = (available: number, total: number): number => {
    return Math.round((available / total) * 100);
  };
  
  // Determine availability status class
  const getAvailabilityStatusClass = (percentage: number): string => {
    if (percentage >= 70) return 'success';
    if (percentage >= 30) return 'warning';
    return 'danger';
  };
  
  return (
    <Container fluid className="py-3">
      {/* Success alert */}
      {showSuccess && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-toast"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill fs-4 me-2"></i>
            <div>
              <strong>¡Venta completada con éxito!</strong>
              <div>Las entradas han sido impresas correctamente</div>
            </div>
          </div>
        </Alert>
      )}
      
      <Row>
        <Col lg={8}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">
                  {selectedMovie ? (
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setSelectedMovieId(null);
                          setSelectedDate('');
                          setSelectedShowtimeId(null);
                        }}
                      >
                        <i className="bi bi-arrow-left"></i>
                      </Button>
                      {selectedMovie.title}
                    </div>
                  ) : (
                    'Seleccionar Película'
                  )}
                </h4>
                {!selectedMovie && (
                  <Form.Control
                    type="search"
                    placeholder="Buscar películas..."
                    className="w-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                )}
              </div>
              
              {!selectedMovie ? (
                // Movie selection
                <Row xs={1} md={2} lg={3} className="g-3">
                  {filteredMovies.map(movie => (
                    <Col key={movie.id}>
                      <Card 
                        className="h-100 movie-card"
                        onClick={() => setSelectedMovieId(movie.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Img 
                          variant="top" 
                          src={movie.poster} 
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Card.Body className="p-3">
                          <Card.Title className="h6 mb-1">{movie.title}</Card.Title>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">{movie.duration} min</small>
                            <Badge bg="primary">{movie.genre[0]}</Badge>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="w-100"
                            onClick={() => setSelectedMovieId(movie.id)}
                          >
                            Seleccionar
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : selectedShowtimeId ? (
                // Ticket selection
                <div className="ticket-selection">
                  <div className="showtime-info mb-4">
                    <h5 className="mb-3">Detalles de la Función</h5>
                    <div className="d-flex flex-wrap">
                      <div className="me-4 mb-2">
                        <strong>Película:</strong> {selectedMovie.title}
                      </div>
                      <div className="me-4 mb-2">
                        <strong>Fecha:</strong> {formatDate(selectedDate)}
                      </div>
                      <div className="me-4 mb-2">
                        <strong>Hora:</strong> {selectedShowtime?.time}
                      </div>
                      <div className="me-4 mb-2">
                        <strong>Sala:</strong> {selectedShowtime?.room}
                      </div>
                      <div className="mb-2">
                        <strong>Asientos disponibles:</strong> {selectedShowtime?.available}/{selectedShowtime?.total}
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="mb-3">Seleccionar Entradas</h5>
                  <div className="ticket-types mb-4">
                    <Row>
                      {ticketTypes.map(type => (
                        <Col key={type.id} sm={6} md={3} className="mb-3">
                          <Card className="h-100">
                            <Card.Body className="p-3">
                              <Card.Title className="h6 mb-1">{type.name}</Card.Title>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="ticket-price">${type.price}</div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => handleTicketQuantityChange(type.id, getTicketQuantity(type.id) - 1)}
                                >
                                  <i className="bi bi-dash"></i>
                                </Button>
                                <span className="mx-2">{getTicketQuantity(type.id)}</span>
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => handleTicketQuantityChange(type.id, getTicketQuantity(type.id) + 1)}
                                >
                                  <i className="bi bi-plus"></i>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              ) : (
                // Showtime selection
                <div className="showtime-selection">
                  <h5 className="mb-3">Seleccionar Horario</h5>
                  
                  {/* Date tabs */}
                  <Tabs
                    activeKey={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="mb-4"
                  >
                    {availableDates.map(date => (
                      <Tab 
                        key={date} 
                        eventKey={date} 
                        title={formatDate(date)}
                      />
                    ))}
                  </Tabs>
                  
                  {/* Showtimes */}
                  <Row xs={2} md={3} lg={4} className="g-3">
                    {availableShowtimes.map(showtime => {
                      const availabilityPercentage = formatAvailabilityPercentage(showtime.available, showtime.total);
                      const statusClass = getAvailabilityStatusClass(availabilityPercentage);
                      
                      return (
                        <Col key={showtime.id}>
                          <Card 
                            className={`h-100 showtime-card ${selectedShowtimeId === showtime.id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedShowtimeId(showtime.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">{showtime.time}</h5>
                                <Badge bg={statusClass}>
                                  {availabilityPercentage}%
                                </Badge>
                              </div>
                              <div className="text-muted mb-2">{showtime.room}</div>
                              <div className="d-flex align-items-center">
                                <div className="progress w-100" style={{ height: '10px' }}>
                                  <div 
                                    className={`progress-bar bg-${statusClass}`} 
                                    role="progressbar" 
                                    style={{ width: `${availabilityPercentage}%` }}
                                    aria-valuenow={availabilityPercentage} 
                                    aria-valuemin={0} 
                                    aria-valuemax={100}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-end mt-2">
                                <small className="text-muted">
                                  {showtime.available} asientos disponibles
                                </small>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="pos-cart-card">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart3 me-2"></i>
                Resumen de Venta
              </h5>
            </Card.Header>
            <Card.Body>
              {(!selectedMovie || !selectedShowtimeId || totalTickets === 0) ? (
                <div className="text-center py-4">
                  <i className="bi bi-ticket-perforated text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="mb-0 mt-3 text-muted">No hay entradas seleccionadas</p>
                  <small className="text-muted">
                    {!selectedMovie 
                      ? 'Selecciona una película para comenzar'
                      : !selectedShowtimeId
                        ? 'Selecciona un horario para la función'
                        : 'Agrega entradas para continuar'
                    }
                  </small>
                </div>
              ) : (
                <>
                  <div className="order-summary mb-3">
                    <h6 className="mb-3">Detalles de la Venta</h6>
                    <div className="d-flex mb-2">
                      <div style={{ width: '120px' }}>
                        <img 
                          src={selectedMovie.poster} 
                          alt={selectedMovie.title} 
                          className="img-fluid rounded"
                          style={{ maxWidth: '100px' }}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1">{selectedMovie.title}</h6>
                        <div className="text-muted small mb-1">{formatDate(selectedDate)}</div>
                        <div className="text-muted small mb-1">{selectedShowtime?.time} - {selectedShowtime?.room}</div>
                      </div>
                    </div>
                    
                    <div className="tickets-summary mb-3">
                      <h6 className="mb-2">Entradas:</h6>
                      {selectedTickets.map(ticket => {
                        const ticketType = ticketTypes.find(t => t.id === ticket.type);
                        return ticketType ? (
                          <div 
                            key={ticket.type} 
                            className="d-flex justify-content-between align-items-center mb-1"
                          >
                            <div>
                              {ticketType.name} x{ticket.quantity}
                            </div>
                            <div>
                              ${ticketType.price * ticket.quantity}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                  
                  <div className="customer-info mb-3">
                    <h6>Información del Cliente (opcional)</h6>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Nombre del cliente"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleCustomerInfoChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="email"
                        placeholder="Email (para recibo)"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        type="tel"
                        placeholder="Teléfono"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleCustomerInfoChange}
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="payment-method mb-3">
                    <h6>Método de Pago</h6>
                    <div className="d-flex gap-2">
                      <Button
                        variant={paymentMethod === 'cash' ? 'primary' : 'outline-secondary'}
                        className="flex-grow-1"
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <i className="bi bi-cash me-2"></i>
                        Efectivo
                      </Button>
                      <Button
                        variant={paymentMethod === 'card' ? 'primary' : 'outline-secondary'}
                        className="flex-grow-1"
                        onClick={() => setPaymentMethod('card')}
                      >
                        <i className="bi bi-credit-card me-2"></i>
                        Tarjeta
                      </Button>
                      <Button
                        variant={paymentMethod === 'mp' ? 'primary' : 'outline-secondary'}
                        className="flex-grow-1"
                        onClick={() => setPaymentMethod('mp')}
                      >
                        <i className="bi bi-wallet2 me-2"></i>
                        MP
                      </Button>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={processOrder}
                      disabled={isProcessing || totalTickets === 0}
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
                        <>
                          <i className="bi bi-bag-check me-2"></i>
                          Completar Venta (${totalPrice})
                        </>
                      )}
                    </Button>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        className="flex-grow-1"
                        onClick={resetTicketSelection}
                        disabled={isProcessing}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Limpiar
                      </Button>
                      <Button
                        variant="success"
                        className="flex-grow-1"
                        onClick={() => navigate('/pos/products')}
                        disabled={isProcessing}
                      >
                        <i className="bi bi-cup-straw me-2"></i>
                        Agregar Candy
                      </Button>
                    </div>
                    <Button
                      variant="success"
                      onClick={() => navigate('/pos/checkout')}
                      disabled={totalTickets === 0 || isProcessing}
                    >
                      <i className="bi bi-printer me-2"></i>
                      Imprimir Entradas
                    </Button>
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

export default POSHome;