import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPremiumTickets } from '../../../data/mockData';

interface PremiumTicket {
  id: string;
  issueDate: string;
  expiryDate: string;
  status: 'available' | 'used' | 'expired';
  source: 'monthly' | 'refund';
  usedForMovieId?: string;
  usedForMovieTitle?: string;
  usedDate?: string;
  refundOrderId?: string;
}

const PremiumTicketsComponent: React.FC = () => {
  const [showUseModal, setShowUseModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<PremiumTicket | null>(null);
  const navigate = useNavigate();
  
  // Group tickets by expiry month
  const groupTicketsByExpiryMonth = (tickets: PremiumTicket[]) => {
    const grouped: Record<string, PremiumTicket[]> = {};
    
    tickets.forEach(ticket => {
      const expiryDate = new Date(ticket.expiryDate);
      const monthYear = expiryDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(ticket);
    });
    
    return grouped;
  };
  
  const groupedTickets = groupTicketsByExpiryMonth(mockPremiumTickets);
  
  const handleUseTicket = (ticket: PremiumTicket) => {
    setSelectedTicket(ticket);
    setShowUseModal(true);
  };
  
  const closeModal = () => {
    setShowUseModal(false);
    setSelectedTicket(null);
  };
  
  const confirmUseTicket = () => {
    // In a real app, this would make an API call and navigate
    closeModal();
    // This would typically be: navigate('/movies');
    console.log('Using ticket', selectedTicket?.id);
    navigate('/cartelera');
  };
  
  return (
    <div className="premium-tickets-container">
      <h5 className="mb-3">
        <i className="bi bi-ticket-perforated-fill me-2 text-warning"></i>
        Mis Entradas Premium
      </h5>
      
      {Object.keys(groupedTickets).length > 0 ? (
        Object.entries(groupedTickets).map(([monthYear, tickets]) => (
          <div key={monthYear} className="mb-4">
            <h6 className="text-muted mb-3">
              Expiran en: {monthYear}
            </h6>
            
            <div className="row">
              {tickets.map(ticket => (
                <div key={ticket.id} className="col-md-6 mb-3">
                  <div className={`card h-100 ${ticket.status === 'used' ? 'border-secondary bg-light' : ticket.status === 'expired' ? 'border-danger bg-light' : 'border-warning'}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h6 className="card-subtitle mb-2">
                          Entrada Premium
                          {ticket.source === 'refund' && (
                            <span className="badge bg-info ms-2" style={{ fontSize: '0.7rem' }}>Reembolso</span>
                          )}
                        </h6>
                        {ticket.status === 'used' ? (
                          <span className="badge bg-secondary">Usada</span>
                        ) : ticket.status === 'expired' ? (
                          <span className="badge bg-danger">Expirada</span>
                        ) : (
                          <span className="badge bg-success">Disponible</span>
                        )}
                      </div>

                      <p className="mb-2 small">
                        {ticket.status === 'used' && ticket.usedForMovieTitle ? (
                          <span>
                            Usada para <strong>{ticket.usedForMovieTitle}</strong>
                            <br />
                            {new Date(ticket.usedDate || '').toLocaleDateString('es-AR')}
                          </span>
                        ) : ticket.status === 'expired' ? (
                          <span className="text-danger">
                            Expiró el: <strong>{new Date(ticket.expiryDate).toLocaleDateString('es-AR')}</strong>
                          </span>
                        ) : (
                          <span>
                            Disponible desde: <strong>{new Date(ticket.issueDate).toLocaleDateString('es-AR')}</strong>
                            <br />
                            Válida hasta: <strong>{new Date(ticket.expiryDate).toLocaleDateString('es-AR')}</strong>
                          </span>
                        )}
                      </p>

                      {ticket.status === 'available' && (
                        <button
                          className="btn btn-warning btn-sm w-100"
                          onClick={() => handleUseTicket(ticket)}
                        >
                          Usar ahora
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted">
          <i className="bi bi-ticket-perforated fs-1 mb-3"></i>
          <p>No tienes entradas premium disponibles</p>
        </div>
      )}
      
      {/* Modal for using a ticket */}
      {showUseModal && selectedTicket && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Usar Entrada Premium</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Estás a punto de usar una entrada premium que expira el {selectedTicket && new Date(selectedTicket.expiryDate).toLocaleDateString('es-AR')}.</p>
                <p>¿Deseas continuar y seleccionar una película para usar esta entrada?</p>
                <p className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Las entradas premium te permiten ver cualquier película sin costo adicional.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-warning" onClick={confirmUseTicket}>
                  Continuar y elegir película
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );
};

export default PremiumTicketsComponent;