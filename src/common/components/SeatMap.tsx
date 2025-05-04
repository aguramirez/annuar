// src/common/components/SeatMap.tsx
import React, { useState, useEffect } from 'react';

export type SeatType = 'standard' | 'vip' | 'premium' | 'accessible';
export type SeatStatus = 'available' | 'selected' | 'occupied' | 'disabled';

export interface Seat {
  id: string;
  row: string;
  number: string;
  type: SeatType;
  status: SeatStatus;
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  maxSelections?: number;
  onSeatClick: (seatId: string) => void;
  showLegend?: boolean;
}

const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeats,
  maxSelections = 10,
  onSeatClick,
  showLegend = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [seatsByRow, setSeatsByRow] = useState<Record<string, Seat[]>>({});

  useEffect(() => {
    // Agrupar asientos por fila
    const groupedSeats: Record<string, Seat[]> = {};
    seats.forEach(seat => {
      if (!groupedSeats[seat.row]) {
        groupedSeats[seat.row] = [];
      }
      groupedSeats[seat.row].push(seat);
    });
    
    // Ordenar filas alfabéticamente
    const sortedRows = Object.keys(groupedSeats).sort();
    const sortedGroupedSeats: Record<string, Seat[]> = {};
    
    sortedRows.forEach(row => {
      // Ordenar asientos por número
      sortedGroupedSeats[row] = groupedSeats[row].sort((a, b) => 
        parseInt(a.number) - parseInt(b.number)
      );
    });
    
    setSeatsByRow(sortedGroupedSeats);
    
    // Trigger animation after loading
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [seats]);

  const getSeatClass = (seat: Seat) => {
    let className = `seat seat-${seat.type}`;
    
    if (selectedSeats.includes(seat.id)) {
      className += ' seat-selected';
    } else if (seat.status === 'occupied') {
      className += ' seat-occupied';
    } else if (seat.status === 'disabled') {
      className += ' seat-disabled';
    } else {
      className += ' seat-available';
    }
    
    return className;
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied' || seat.status === 'disabled') {
      return;
    }
    
    // Si el asiento ya está seleccionado, permitir deseleccionar
    if (selectedSeats.includes(seat.id)) {
      onSeatClick(seat.id);
      return;
    }
    
    // Si no ha alcanzado el máximo de selecciones, permitir seleccionar
    if (selectedSeats.length < maxSelections) {
      onSeatClick(seat.id);
    }
  };

  return (
    <div className={`seat-map-container ${isLoaded ? 'seat-map-loaded' : ''}`}>
      <div className="screen-container">
        <div className="screen">
          <div className="screen-text">PANTALLA</div>
        </div>
      </div>
      
      <div className="seat-rows-container">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats">
              {rowSeats.map(seat => (
                <div
                  key={seat.id}
                  className={getSeatClass(seat)}
                  onClick={() => handleSeatClick(seat)}
                >
                  <span className="seat-number">{seat.number}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {showLegend && (
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
          <div className="legend-item">
            <div className="legend-box seat-premium"></div>
            <span>Premium</span>
          </div>
          <div className="legend-item">
            <div className="legend-box seat-vip"></div>
            <span>VIP</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;