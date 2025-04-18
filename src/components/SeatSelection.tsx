import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Navbar } from 'react-bootstrap';

interface Movie {
  id: number;
  title: string;
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

  // Generate seat grid
  const renderSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);
    
    return (
      <div className="seats-container">
        <div className="screen"></div>
        
        {rows.map(row => (
          <div key={row} className="seat-row">
            <div className="row-label me-2">{row}</div>
            {cols.map(col => {
              const seat = `${row}${col}`;
              let seatClass = "seat seat-available";
              
              if (selectedSeats.includes(seat)) {
                seatClass = "seat seat-selected";
              } else if (occupiedSeats.includes(seat)) {
                seatClass = "seat seat-occupied";
              }
              
              return (
                <div
                  key={seat}
                  className={seatClass}
                  onClick={() => handleSeatClick(seat)}
                >
                  {col}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">
            <img 
              src="/logo.png" 
              alt="Annuar Shopping Cine" 
              className="logo-img" 
            />
            Annuar Shopping Cine
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Button 
          variant="outline-secondary" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          &lt; Volver
        </Button>
        
        <h1 className="page-heading">Selección de Asientos</h1>
        
        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <h5>{movie.title}</h5>
            <p className="mb-1"><strong>Fecha:</strong> {formatDate(showtime.date)}</p>
            <p><strong>Horario:</strong> {showtime.time}</p>
            <p><strong>Entradas:</strong> {ticketCount}</p>
          </Col>
          
          <Col md={6}>
            <div className="seat-legend">
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
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="seat-selection-container mb-4">
          {renderSeats()}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>Asientos seleccionados: {selectedSeats.join(', ') || 'Ninguno'}</h5>
            <p className="mb-0">Has seleccionado {selectedSeats.length} de {ticketCount} asientos.</p>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleContinue}
            disabled={selectedSeats.length !== ticketCount}
          >
            Continuar al pago
          </Button>
        </div>
      </Container>
    </>
  );
};

export default SeatSelection;