// src/apps/admin/pages/MovieLicenseContracts.tsx
import { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import { mockMovieContracts, mockUpcomingContracts } from '../../../data/mockData';

// Define types for movie license contracts
interface EmployeeVariance {
  type: string;
  amount: number;
  reason: string;
}

interface MovieContract {
  id: number;
  movieTitle: string;
  studio: string;
  licenseType: string;
  startDate: string;
  endDate: string;
  revenueSplit: number; // Percentage that goes to the studio
  minimumGuarantee: number;
  currentRevenue?: number;
  paymentStatus?: string;
  lastPaymentDate?: string;
  nextPaymentDue?: string;
  notes: string;
  attachments?: string[];
  status: 'active' | 'expired' | 'pending_signature' | 'negotiation' | 'confirmed';
  daysLeft: number;
  warningDays?: boolean;
  pendingPaymentAmount?: number;
}

interface UpcomingContract {
  id: number;
  movieTitle: string;
  studio: string;
  licenseType: string;
  startDate: string;
  endDate: string;
  revenueSplit: number;
  minimumGuarantee: number;
  status: 'pending_signature' | 'negotiation' | 'confirmed';
  notes: string;
  daysToStart: number;
}

const MovieLicenseContracts: React.FC = () => {
  const [contracts, setContracts] = useState<MovieContract[]>(mockMovieContracts as MovieContract[]);
  const [upcomingContracts] = useState<UpcomingContract[]>(mockUpcomingContracts as UpcomingContract[]);
  const [selectedContract, setSelectedContract] = useState<MovieContract | UpcomingContract | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  
  // Get today's date
  const today = new Date();
  
  // Filter the contracts based on status and search term
  const filteredContracts = contracts.filter(contract => {
    // Status filter
    if (filterStatus !== 'all' && contract.status !== filterStatus) {
      return false;
    }
    
    // Search term filter (case insensitive)
    if (searchTerm && !contract.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !contract.studio.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Handle contract selection
  const handleSelectContract = (contract: MovieContract | UpcomingContract) => {
    setSelectedContract(contract);
  };
  
  // Calculate total pending payments
  const totalPendingPayments = contracts
    .filter(contract => contract.paymentStatus === 'Pending')
    .reduce((total, contract) => total + (contract.pendingPaymentAmount || 0), 0);
  
  // Calculate contracts expiring soon (within 7 days)
  const contractsExpiringSoon = contracts.filter(contract => 
    contract.status === 'active' && contract.daysLeft <= 7
  ).length;
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('es-AR')}`;
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };
  
  // Handle make payment button
  const handleMakePayment = (contract: MovieContract) => {
    setSelectedContract(contract);
    setPaymentAmount(contract.pendingPaymentAmount?.toString() || '');
    setShowPaymentModal(true);
  };
  
  // Handle view contract
  const handleViewContract = (contract: MovieContract | UpcomingContract) => {
    setSelectedContract(contract);
    setShowContractModal(true);
  };
  
  // Handle close modals
  const handleCloseModals = () => {
    setShowPaymentModal(false);
    setShowContractModal(false);
  };
  
  // Handle submit payment
  const handleSubmitPayment = () => {
    // In a real app, this would make an API call
    if (selectedContract) {
      alert(`Pago de ${formatCurrency(parseFloat(paymentAmount))} registrado para ${selectedContract.movieTitle}`);
    }
    handleCloseModals();
  };
  
  return (
    <div className="movie-license-container">
      <div className="mb-4">
        <h2 className="mb-3">Gestión de Licencias y Contratos</h2>
        <p className="text-muted">
          Administra los contratos de licencias para la proyección de películas y controla los pagos a los estudios.
        </p>
      </div>
      
      {/* Quick overview stats */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="mb-1">{contracts.filter(c => c.status === 'active').length}</h3>
              <p className="text-muted mb-0">Contratos Activos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="mb-1">{upcomingContracts.length}</h3>
              <p className="text-muted mb-0">Próximos Contratos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="mb-1 text-warning">{contractsExpiringSoon}</h3>
              <p className="text-muted mb-0">Por Vencer (7 días)</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="mb-1 text-danger">{formatCurrency(totalPendingPayments)}</h3>
              <p className="text-muted mb-0">Pagos Pendientes</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Buscar</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Buscar por título o estudio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Estado</label>
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100">
                <i className="bi bi-search me-2"></i>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active contracts table */}
      <div className="card mb-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Contratos de Películas</h5>
          <button className="btn btn-sm btn-success">
            <i className="bi bi-plus-lg me-1"></i>
            Nuevo Contrato
          </button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Estudio</th>
                  <th>Tipo</th>
                  <th>Período</th>
                  <th className="text-end">Ingresos</th>
                  <th>Estado Pago</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map(contract => (
                  <tr 
                    key={contract.id} 
                    className={contract.daysLeft <= 7 && contract.status === 'active' ? 'table-warning' : ''}
                  >
                    <td>{contract.movieTitle}</td>
                    <td>{contract.studio}</td>
                    <td>
                      {contract.licenseType === 'Premium' ? (
                        <span className="badge bg-primary">{contract.licenseType}</span>
                      ) : contract.licenseType === 'Standard' ? (
                        <span className="badge bg-secondary">{contract.licenseType}</span>
                      ) : (
                        <span className="badge bg-info">{contract.licenseType}</span>
                      )}
                    </td>
                    <td>
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                      {contract.daysLeft <= 7 && contract.status === 'active' && (
                        <div className="small text-danger">
                          {contract.daysLeft === 0 ? 'Vence hoy' : (
                            contract.daysLeft < 0 ? 'Vencido' : `${contract.daysLeft} días restantes`
                          )}
                        </div>
                      )}
                    </td>
                    <td className="text-end">{formatCurrency(contract.currentRevenue || 0)}</td>
                    <td>
                      {contract.paymentStatus === 'Paid' ? (
                        <span className="badge bg-success">Pagado</span>
                      ) : (
                        <span className="badge bg-danger">Pendiente</span>
                      )}
                    </td>
                    <td>
                      {contract.status === 'active' ? (
                        <span className="badge bg-success">Activo</span>
                      ) : (
                        <span className="badge bg-secondary">Expirado</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1" 
                        onClick={() => handleViewContract(contract)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {contract.paymentStatus === 'Pending' && (
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleMakePayment(contract)}
                        >
                          <i className="bi bi-cash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Upcoming contracts */}
      <div className="card">
        <div className="card-header bg-white">
          <h5 className="mb-0">Próximos Contratos</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Estudio</th>
                  <th>Tipo</th>
                  <th>Período</th>
                  <th>Estado</th>
                  <th>Días para Inicio</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {upcomingContracts.map(contract => (
                  <tr key={contract.id}>
                    <td>{contract.movieTitle}</td>
                    <td>{contract.studio}</td>
                    <td>
                      {contract.licenseType === 'Premium' || contract.licenseType === 'Premium Plus' ? (
                        <span className="badge bg-primary">{contract.licenseType}</span>
                      ) : (
                        <span className="badge bg-secondary">{contract.licenseType}</span>
                      )}
                    </td>
                    <td>
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </td>
                    <td>
                      {contract.status === 'confirmed' ? (
                        <span className="badge bg-success">Confirmado</span>
                      ) : contract.status === 'pending_signature' ? (
                        <span className="badge bg-warning text-dark">Pendiente Firma</span>
                      ) : (
                        <span className="badge bg-info">En Negociación</span>
                      )}
                    </td>
                    <td>
                      <div className={contract.daysToStart <= 30 ? 'text-danger' : ''}>
                        {contract.daysToStart} días
                      </div>
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewContract(contract)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedContract && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Pago</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <div className="modal-body">
                <p>Registro de pago para la película <strong>{selectedContract.movieTitle}</strong> del estudio <strong>{selectedContract.studio}</strong>.</p>
                
                <div className="mb-3">
                  <label className="form-label">Monto a Pagar</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number" 
                      className="form-control"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Fecha de Pago</label>
                  <input 
                    type="date" 
                    className="form-control"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Método de Pago</label>
                  <select className="form-select">
                    <option>Transferencia Bancaria</option>
                    <option>Depósito</option>
                    <option>Otro</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Referencia / Comentarios</label>
                  <textarea className="form-control" rows={3}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleSubmitPayment}>
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
      
      {/* Contract Detail Modal */}
      {showContractModal && selectedContract && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Contrato: {selectedContract.movieTitle}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Información Básica</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <th>Película:</th>
                          <td>{selectedContract.movieTitle}</td>
                        </tr>
                        <tr>
                          <th>Estudio:</th>
                          <td>{selectedContract.studio}</td>
                        </tr>
                        <tr>
                          <th>Tipo de Licencia:</th>
                          <td>{selectedContract.licenseType}</td>
                        </tr>
                        <tr>
                          <th>Período:</th>
                          <td>{formatDate(selectedContract.startDate)} - {formatDate(selectedContract.endDate)}</td>
                        </tr>
                        <tr>
                          <th>Estado:</th>
                          <td>
                            {selectedContract.status === 'active' ? (
                              <span className="badge bg-success">Activo</span>
                            ) : selectedContract.status === 'expired' ? (
                              <span className="badge bg-secondary">Expirado</span>
                            ) : selectedContract.status === 'confirmed' ? (
                              <span className="badge bg-success">Confirmado</span>
                            ) : selectedContract.status === 'pending_signature' ? (
                              <span className="badge bg-warning text-dark">Pendiente Firma</span>
                            ) : (
                              <span className="badge bg-info">En Negociación</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Información Financiera</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <th>Split de Ingresos:</th>
                          <td>{selectedContract.revenueSplit}% / {100 - selectedContract.revenueSplit}%</td>
                        </tr>
                        <tr>
                          <th>Garantía Mínima:</th>
                          <td>{formatCurrency(selectedContract.minimumGuarantee)}</td>
                        </tr>
                        {'currentRevenue' in selectedContract && (
                          <tr>
                            <th>Ingresos Actuales:</th>
                            <td>{formatCurrency(selectedContract.currentRevenue || 0)}</td>
                          </tr>
                        )}
                        {'paymentStatus' in selectedContract && (
                          <tr>
                            <th>Estado de Pago:</th>
                            <td>
                              {selectedContract.paymentStatus === 'Paid' ? (
                                <span className="badge bg-success">Pagado</span>
                              ) : (
                                <span className="badge bg-danger">Pendiente</span>
                              )}
                            </td>
                          </tr>
                        )}
                        {'lastPaymentDate' in selectedContract && selectedContract.lastPaymentDate && (
                          <tr>
                            <th>Último Pago:</th>
                            <td>{formatDate(selectedContract.lastPaymentDate)}</td>
                          </tr>
                        )}
                        {'nextPaymentDue' in selectedContract && selectedContract.nextPaymentDue && (
                          <tr>
                            <th>Próximo Pago:</th>
                            <td>{formatDate(selectedContract.nextPaymentDue)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-12">
                    <h6>Notas</h6>
                    <p>{selectedContract.notes}</p>
                  </div>
                </div>
                
                {'attachments' in selectedContract && selectedContract.attachments && selectedContract.attachments.length > 0 && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6>Documentos Adjuntos</h6>
                      <ul className="list-group">
                        {selectedContract.attachments.map((attachment, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <i className="bi bi-file-earmark-pdf me-2 text-danger"></i>
                              {attachment}
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="bi bi-download"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                  Cerrar
                </button>
                {'status' in selectedContract && selectedContract.status === 'active' && (
                  <>
                    <button type="button" className="btn btn-primary">
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </button>
                    {'paymentStatus' in selectedContract && selectedContract.paymentStatus === 'Pending' && (
                      <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={() => {
                          handleCloseModals();
                          handleMakePayment(selectedContract as MovieContract);
                        }}
                      >
                        <i className="bi bi-cash me-1"></i>
                        Registrar Pago
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );
};

export default MovieLicenseContracts;