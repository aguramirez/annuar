// src/apps/website/pages/SeatSelection.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import showService from '../../../common/services/showService';
import reservationService from '../../../common/services/reservationService';
import { useAuth } from '../../../auth/AuthContext';

interface SeatSelectionParams {
  showId: string;
}

interface Seat {
  id: string;
  row: string;
  number: string;
  seatType: string;
  status: string;
}

const SeatSelection: React.FC = () => {
  const { showId } = useParams<SeatSelectionParams>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [showDetails, setShowDetails] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // Precio base por tipo de asiento - en una aplicación real, esto vendría del backend
  const seatPrices = {
    'standard': 800,
    'vip': 1200,
    'premium': 1500,
    'accessible': 800
  };

  useEffect(() => {
    const fetchShowAndSeats = async () => {
      if (!showId) return;
      
      try {
        setLoading(true);
        // Obtener detalles de la función
        const showData = await showService.getShow(showId);
        setShowDetails(showData);
        
        // Obtener asientos disponibles
        const seatsData = await showService.getSeatsForShow(showId);
        setSeats(seatsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching show and seats:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowAndSeats();
  }, [showId]);

  // Determinar el precio según el tipo de asiento
  const getSeatPrice = (seat: Seat) => {
    return seatPrices[seat.seatType.toLowerCase() as keyof typeof seatPrices] || seatPrices.standard;
  };

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    
    // No permitir seleccionar asientos ocupados
    if (seat?.status === 'occupied') return;
    
    setSelectedSeats(prevSelected => {
      if (prevSelected.includes(seatId)) {
        // Deseleccionar asiento
        const newSelected = prevSelected.filter(id => id !== seatId);
        // Eliminar el tipo de entrada asignado
        const newTicketTypes = { ...ticketTypes };
        delete newTicketTypes[seatId];
        setTicketTypes(newTicketTypes);
        return newSelected;
      } else {
        // Seleccionar asiento y asignar tipo de entrada "ADULTO" por defecto
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

    // Si no está autenticado, redirigir al login primero
    if (!isAuthenticated) {
      // Guardar la información de la selección en sessionStorage para recuperarla después
      sessionStorage.setItem('selectedSeats', JSON.stringify({
        showId,
        seats: selectedSeats,
        ticketTypes
      }));
      navigate('/login');
      return;
    }

    try {
      setProcessing(true);
      // Crear reserva
      const reservationRequest = {
        showId: showId || '',
        seats: selectedSeats,
        ticketTypes
      };
      
      const reservation = await reservationService.createReservation(reservationRequest);
      
      // Navegar a la página de pago
      navigate(`/payment/${reservation.id}`);
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError('Hubo un problema al crear tu reserva. Por favor, intenta de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

// src/apps/website/pages/SeatSelection.tsx (continuación)
  // Agrupar asientos por fila para renderizarlos
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);
  
  // Ordenar filas
  const sortedRows = Object.keys(seatsByRow).sort();
  
  // Calcular el total a pagar
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat ? getSeatPrice(seat) : 0);
    }, 0);
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

  if (!showDetails) {
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
                          <div className="d-flex justify-content-between">
                            <span>
                              Asiento {seat.row}{seat.number} ({seat.seatType})
                            </span>
                            <span>${getSeatPrice(seat)}</span>
                          </div>
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
                    disabled={processing}
                  >
                    {processing ? (
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
        </Col>
      </Row>
    </Container>
  );
};

export default SeatSelection;