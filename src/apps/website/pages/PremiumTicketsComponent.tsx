import React, { useState } from 'react';

// Mock data for premium tickets - in real app, this would come from context or API
const mockPremiumTickets = [
  {
    id: 'pt-1',
    issueDate: '2025-03-01',
    expiryDate: '2025-05-31',
    status: 'available'
  },
  {
    id: 'pt-2',
    issueDate: '2025-03-01',
    expiryDate: '2025-05-31',
    status: 'available'
  },
  {
    id: 'pt-3',
    issueDate: '2025-02-01',
    expiryDate: '2025-04-30',
    status: 'available'
  },
  {
    id: 'pt-4',
    issueDate: '2025-02-01',
    expiryDate: '2025-04-30',
    status: 'used',
    usedForMovieId: '2',
    usedForMovieTitle: 'Capitan America: Un Nuevo Mundo',
    usedDate: '2025-03-15'
  }
];

const PremiumTicketsComponent = () => {
  const [showUseModal, setShowUseModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Group tickets by expiry month
  const groupedTickets = {};
  mockPremiumTickets.forEach(ticket => {
    const expiryDate = new Date(ticket.expiryDate);
    const monthYear = expiryDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!groupedTickets[monthYear]) {
      groupedTickets[monthYear] = [];
    }
    
    groupedTickets[monthYear].push(ticket);
  });
  
  const handleUseTicket = (ticket) => {
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
    alert('Navigating to movies page to select a movie');
  };
  
  return (
    <div className="premium-tickets-container">
      <h5 className="mb-3">
        <i className="bi bi-ticket-perforated-fill me-2 text-warning"></i>
        Mis Entradas Premium
      </h5>
      
      {Object.entries(groupedTickets).map(([monthYear, tickets]) => (
        <div key={monthYear} className="mb-4">
          <h6 className="text-muted mb-3">
            Expiran en: {monthYear}
          </h6>
          
          <div className="row">
            {tickets.map(ticket => (
              <div key={ticket.id} className="col-md-6 mb-3">
                <div className={`card h-100 ${ticket.status === 'used' ? 'border-secondary bg-light' : 'border-warning'}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h6 className="card-subtitle mb-2">
                        Entrada Premium
                      </h6>
                      {ticket.status === 'used' ? (
                        <span className="badge bg-secondary">Usada</span>
                      ) : (
                        <span className="badge bg-success">Disponible</span>
                      )}
                    </div>

                    <p className="mb-2 small">
                      {ticket.status === 'used' && ticket.usedForMovieTitle ? (
                        <span>
                          Usada para <strong>{ticket.usedForMovieTitle}</strong>
                          <br />
                          {new Date(ticket.usedDate).toLocaleDateString('es-AR')}
                        </span>
                      ) : (
                        <span>
                          Disponible desde: <strong>{new Date(ticket.issueDate).toLocaleDateString('es-AR')}</strong>
                          <br />
                          Válida hasta: <strong>{new Date(ticket.expiryDate).toLocaleDateString('es-AR')}</strong>
                        </span>
                      )}
                    </p>

                    {ticket.status !== 'used' && (
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
      ))}
      
      {Object.keys(groupedTickets).length === 0 && (
        <div className="text-center py-4 text-muted">
          <i className="bi bi-ticket-perforated fs-1 mb-3"></i>
          <p>No tienes entradas premium disponibles</p>
        </div>
      )}
      
      {/* Modal for using a ticket */}
      {showUseModal && (
        <div className="modal show d-block">
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