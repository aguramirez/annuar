import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Card, Badge } from 'react-bootstrap';
import Navbar from './shared/Navbar';

interface Movie {
  id: number;
  title: string;
  poster: string;
  // other properties...
}

interface SeatSelectionProps {
  movie: Movie;
  showtime: { date: string; time: string };
  ticketCount: number;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  movie,
  showtime,
  ticketCount,
  selectedSeats,
  setSelectedSeats,
}) => {
  const navigate = useNavigate();
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSeatType, setSelectedSeatType] = useState('Standard');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [animateSelection, setAnimateSelection] = useState<string | null>(null);

  // Precio base por tipo de asiento
  const seatPrices = {
    'Standard': 800,
    'VIP': 1200,
    'Premium': 1500
  };

  // Set diferent pricing zones by row
  const getSeatType = (row: string): 'Standard' | 'VIP' | 'Premium' => {
    if (['A', 'B', 'C'].includes(row)) return 'Standard';
    if (['D', 'E', 'F'].includes(row)) return 'VIP';
    return 'Premium';
  };

  // Generate random occupied seats for demo purposes
  useEffect(() => {
    const generateOccupiedSeats = () => {
      const seats: string[] = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const totalSeats = rows.length * 10;
      const occupiedCount = Math.floor(totalSeats * 0.3); // 30% seats are occupied

      while (seats.length < occupiedCount) {
        const row = rows[Math.floor(Math.random() * rows.length)];
        const col = Math.floor(Math.random() * 10) + 1;
        const seat = `${row}${col}`;

        if (!seats.includes(seat)) {
          seats.push(seat);
        }
      }

      return seats;
    };

    setOccupiedSeats(generateOccupiedSeats());

    // Animation trigger after component mounts
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [movie.id, showtime]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleSeatClick = (seat: string) => {
    if (occupiedSeats.includes(seat)) {
      return; // Can't select occupied seats
    }

    // Animate selection
    setAnimateSelection(seat);
    setTimeout(() => setAnimateSelection(null), 600);

    if (selectedSeats.includes(seat)) {
      // Deselect the seat
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
      setError('');
    } else if (selectedSeats.length < ticketCount) {
      // Select the seat
      setSelectedSeats([...selectedSeats, seat]);
      setError('');
    } else {
      setError(`Solo puedes seleccionar ${ticketCount} asiento(s).`);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === ticketCount) {
      navigate('/login');
    } else {
      setError(`Por favor selecciona exactamente ${ticketCount} asiento(s).`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const row = seat.charAt(0);
      const seatType = getSeatType(row);
      return total + seatPrices[seatType];
    }, 0);
  };

  // Generate seat grid
  const renderSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
      <div className="cinema-layout">
        <div className="screen-container">
          <div className="screen">
            <div className="screen-text">PANTALLA</div>
          </div>
        </div>

        <div className="seat-zones">
          <div className="zone standard-zone">
            <div className="zone-label">STANDARD</div>
          </div>
          <div className="zone vip-zone">
            <div className="zone-label">VIP</div>
          </div>
          <div className="zone premium-zone">
            <div className="zone-label">PREMIUM</div>
          </div>
        </div>

        <div className="seats-wrapper">
          <div className="seats-container">
            {rows.map(row => {
              const seatType = getSeatType(row);
              return (
                <div key={row} className={`seat-row ${seatType.toLowerCase()}-row`}>
                  <div className="row-label">{row}</div>
                  {cols.map(col => {
                    const seat = `${row}${col}`;
                    let seatClass = `seat seat-available ${seatType.toLowerCase()}-seat`;

                    if (selectedSeats.includes(seat)) {
                      seatClass = `seat seat-selected ${seatType.toLowerCase()}-seat`;
                    } else if (occupiedSeats.includes(seat)) {
                      seatClass = `seat seat-occupied ${seatType.toLowerCase()}-seat`;
                    }

                    if (animateSelection === seat) {
                      seatClass += ' seat-animate';
                    }

                    return (
                      <div
                        key={seat}
                        className={seatClass}
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => setShowTooltip(seat)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <div className="seat-number">{col}</div>
                        {showTooltip === seat && !occupiedSeats.includes(seat) && (
                          <div className="seat-tooltip">
                            <div>{seat}</div>
                            <div className="seat-price">${seatPrices[seatType]}</div>
                            <div className="seat-type">{seatType}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <Navbar showBackButton onBack={handleBack} />

      <Container className="py-4">
        <h1 className="page-heading">Selección de Asientos</h1>

        <Row className={`mb-4 ${isLoaded ? 'slide-up' : ''}`}>
          <Col lg={4} className="mb-4">
            <Card className="h-100 movie-info-card">
              <Card.Body>
                <div className="d-flex mb-3">
                  <div className="movie-thumbnail me-3">
                    <img src={movie.poster} alt={movie.title} className="img-fluid rounded" style={{maxHeight: '100px'}} />
                  </div>
                  <div>
                    <h5 className="mb-1">{movie.title}</h5>
                    <Badge bg="primary" className="mb-2">{showtime.time}</Badge>
                  </div>
                </div>
                <div className="info-item mb-2">
                  <i className="bi bi-calendar-event text-primary me-2"></i>
                  <span>{formatDate(showtime.date)}</span>
                </div>
                <div className="info-item mb-2">
                  <i className="bi bi-ticket-perforated text-primary me-2"></i>
                  <span>{ticketCount} entrada(s)</span>
                </div>

                <hr />

                <div className="pricing-guide">
                  <h6 className="mb-3">Guía de precios</h6>
                  <div className="price-item d-flex justify-content-between mb-2">
                    <div>
                      <div className="color-box standard-color"></div>
                      <span>Standard</span>
                    </div>
                    <span>${seatPrices.Standard}</span>
                  </div>
                  <div className="price-item d-flex justify-content-between mb-2">
                    <div>
                      <div className="color-box vip-color"></div>
                      <span>VIP</span>
                    </div>
                    <span>${seatPrices.VIP}</span>
                  </div>
                  <div className="price-item d-flex justify-content-between">
                    <div>
                      <div className="color-box premium-color"></div>
                      <span>Premium</span>
                    </div>
                    <span>${seatPrices.Premium}</span>
                  </div>
                </div>

                <hr />

                <div className="seat-legend">
                  <h6 className="mb-3">Referencias</h6>
                  <div className="legend-items">
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
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <div className="seat-selection-container mb-4">
              {renderSeats()}
            </div>

            <Card className="selected-seats-card mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Asientos seleccionados: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Ninguno'}</h5>
                    <p className="mb-0 text-muted">Has seleccionado {selectedSeats.length} de {ticketCount} asientos.</p>
                  </div>
                  <div className="text-end">
                    <div className="total-price mb-2">Total: ${calculateTotal()}</div>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleContinue}
                      disabled={selectedSeats.length !== ticketCount}
                      className={selectedSeats.length === ticketCount ? 'btn-pulse' : ''}
                    >
                      <i className="bi bi-credit-card me-2"></i>
                      Continuar al pago
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SeatSelection;
