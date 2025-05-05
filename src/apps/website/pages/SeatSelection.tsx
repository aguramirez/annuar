// src/apps/website/pages/SeatSelection.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { useAuth } from '../../../auth/AuthContext';
import { SeatSelectionParams } from '../types/routeParams';
import { useQuery } from '@tanstack/react-query';
import showService, { Seat } from '../../../common/services/showService';
import { useCreateReservation } from '../../../common/hooks/useReservationQueries';

const SeatSelection: React.FC = () => {
  const { showId } = useParams<SeatSelectionParams>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  // Get show details using React Query
  const { 
    data: showDetails, 
    isLoading: isLoadingShow,
    error: showError 
  } = useQuery({
    queryKey: ['shows', showId],
    queryFn: () => showService.getShow(showId || ''),
    enabled: !!showId
  });
  
  // Get seats for the show using React Query
  const { 
    data: seats, 
    isLoading: isLoadingSeats,
    error: seatsError 
  } = useQuery({
    queryKey: ['shows', showId, 'seats'],
    queryFn: () => showService.getSeatsForShow(showId || ''),
    enabled: !!showId
  });
  
  // Mutation for creating reservation
  const createReservation = useCreateReservation();
  
  // Price base by seat type - in a real app, this would come from the backend
  const seatPrices = {
    'standard': 800,
    'vip': 1200,
    'premium': 1500,
    'accessible': 800
  };

  // Determine seat price based on its type
  const getSeatPrice = (seat: Seat) => {
    return seatPrices[seat.seatType.toLowerCase() as keyof typeof seatPrices] || seatPrices.standard;
  };

  const handleSeatClick = (seatId: string) => {
    const seat = seats?.find(s => s.id === seatId);
    
    // Don't allow selecting occupied seats
    if (seat?.status === 'occupied') return;
    
    setSelectedSeats(prevSelected => {
      if (prevSelected.includes(seatId)) {
        // Deselect seat
        const newSelected = prevSelected.filter(id => id !== seatId);
        // Remove assigned ticket type
        const newTicketTypes = { ...ticketTypes };
        delete newTicketTypes[seatId];
        setTicketTypes(newTicketTypes);
        return newSelected;
      } else {
        // Select seat and assign default "ADULT" ticket type
        setTicketTypes({
          ...ticketTypes,
          [seatId]: 'ADULT'
        });
        return [...prevSelected, seatId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      setError('Por favor, selecciona al menos un asiento.');
      return;
    }

    // If not authenticated, redirect to login first
    if (!isAuthenticated) {
      // Save selection info in sessionStorage to recover it later
      sessionStorage.setItem('selectedSeats', JSON.stringify({
        showId,
        seats: selectedSeats,
        ticketTypes
      }));
      navigate('/login');
      return;
    }

    try {
      // Create reservation
      const reservationRequest = {
        showId: showId || '',
        seats: selectedSeats,
        ticketTypes
      };
      
      const reservation = await createReservation.mutateAsync(reservationRequest);
      
      // Navigate to payment page
      navigate(`/payment/${reservation.id}`);
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError('Hubo un problema al crear tu reserva. Por favor, intenta de nuevo.');
    }
  };

  // Group seats by row for rendering
  const seatsByRow = seats?.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>) || {};
  
  // Sort rows
  const sortedRows = Object.keys(seatsByRow).sort();
  
  // Calculate total to pay
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats?.find(s => s.id === seatId);
      return total + (seat ? getSeatPrice(seat) : 0);
    }, 0);
  };

  const isLoading = isLoadingShow || isLoadingSeats || createReservation.isPending;
  const loadingError = showError || seatsError;

  if (isLoading && !loadingError) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (loadingError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {loadingError instanceof Error 
            ? loadingError.message 
            : 'Error al cargar los datos. Por favor, intenta de nuevo más tarde.'}
        </Alert>
      </Container>
    );
  }

  if (!showDetails || !seats) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No se encontró la función solicitada.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Selección de Asientos</h1>
      
      <div className="show-details mb-4">
        <h2>{showDetails.movieTitle}</h2>
        <p>Sala: {showDetails.roomName}</p>
        <p>Fecha: {new Date(showDetails.startTime).toLocaleDateString()}</p>
        <p>Hora: {new Date(showDetails.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="screen-container text-center mb-4">
                <div className="screen">PANTALLA</div>
              </div>
              
              <div className="seat-map">
                {sortedRows.map(row => (
                  <div key={row} className="seat-row">
                    <div className="row-label">{row}</div>
                    <div className="seats">
                      {seatsByRow[row].map(seat => {
                        let seatClass = 'seat';
                        if (selectedSeats.includes(seat.id)) {
                          seatClass += ' selected';
                        } else if (seat.status === 'occupied') {
                          seatClass += ' occupied';
                        } else {
                          seatClass += ' available';
                        }
                        seatClass += ` ${seat.seatType.toLowerCase()}`;
                        
                        return (
                          <div 
                            key={seat.id}
                            className={seatClass}
                            onClick={() => handleSeatClick(seat.id)}
                          >
                            {seat.number}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="seat-legend mt-4">
                <div className="legend-item">
                  <div className="legend-box available"></div>
                  <span>Disponible</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box selected"></div>
                  <span>Seleccionado</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box occupied"></div>
                  <span>Ocupado</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box standard"></div>
                  <span>Standard - ${seatPrices.standard}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box vip"></div>
                  <span>VIP - ${seatPrices.vip}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box premium"></div>
                  <span>Premium - ${seatPrices.premium}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Asientos Seleccionados</h4>
            </Card.Header>
            <Card.Body>
              {selectedSeats.length > 0 ? (
                <>
                  <ul className="selected-seats-list">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId);
                      return seat ? (
                        <li key={seatId} className="selected-seat-item">
                          <div className="d-flex justify-content-between mb-2">
                            <span>
                              Asiento {seat.row}{seat.number} ({seat.seatType})
                            </span>
                            <span>${getSeatPrice(seat)}</span>
                          </div>
                          <Form.Group className="mb-3">
                            <Form.Label>Tipo de Entrada</Form.Label>
                            <Form.Select
                              value={ticketTypes[seatId] || 'ADULT'}
                              onChange={(e) => {
                                setTicketTypes({
                                  ...ticketTypes,
                                  [seatId]: e.target.value
                                });
                              }}
                            >
                              <option value="ADULT">Adulto</option>
                              <option value="CHILD">Niño</option>
                              <option value="SENIOR">Jubilado</option>
                              <option value="STUDENT">Estudiante</option>
                            </Form.Select>
                          </Form.Group>
                        </li>
                      ) : null;
                    })}
                  </ul>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={handleContinue}
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
                      'Continuar'
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-3">
                  <p>No has seleccionado ningún asiento.</p>
                  <p>Haz clic en los asientos para seleccionarlos.</p>
                </div>
              )}
            </Card.Body>
          </Card>

          <Button
            variant="outline-secondary"
            className="w-100 mb-3"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver a la película
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SeatSelection;