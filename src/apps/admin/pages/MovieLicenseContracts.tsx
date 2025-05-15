import React, { useState } from 'react';

// Mock movie license contracts data
const mockMovieContracts = [
  {
    id: 1,
    movieTitle: "Minecraft",
    studio: "Warner Bros. Pictures",
    licenseType: "Standard",
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    revenueSplit: 60, // Percentage that goes to the studio
    minimumGuarantee: 20000,
    currentRevenue: 85400,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-30",
    notes: "Contrato estándar, 60/40 split durante las primeras 8 semanas.",
    attachments: ["minecraft_contract.pdf", "addendum_1.pdf"],
    status: "active",
    daysLeft: 16
  },
  {
    id: 2,
    movieTitle: "Capitan America: Un Nuevo Mundo",
    studio: "Disney/Marvel",
    licenseType: "Premium",
    startDate: "2025-04-01",
    endDate: "2025-06-15",
    revenueSplit: 70, // Percentage that goes to the studio
    minimumGuarantee: 35000,
    currentRevenue: 124800,
    paymentStatus: "Pending",
    lastPaymentDate: "2025-04-15",
    nextPaymentDue: "2025-05-15",
    notes: "Contrato premium, 70/30 split durante toda la exhibición. Mínimo de 45 funciones por semana.",
    attachments: ["captain_america_contract.pdf"],
    status: "active",
    daysLeft: 31,
    pendingPaymentAmount: 25600
  },
  {
    id: 3,
    movieTitle: "Blanca Nieves",
    studio: "Disney",
    licenseType: "Standard",
    startDate: "2025-03-15",
    endDate: "2025-05-15",
    revenueSplit: 55, // Percentage that goes to the studio
    minimumGuarantee: 15000,
    currentRevenue: 42300,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-30",
    notes: "Película familiar con buen desempeño en sesiones matinales.",
    attachments: ["snow_white_contract.pdf"],
    status: "active",
    daysLeft: 0,
    warningDays: true
  },
  {
    id: 4,
    movieTitle: "Thunderbolts",
    studio: "Disney/Marvel",
    licenseType: "Premium",
    startDate: "2025-04-10",
    endDate: "2025-06-30",
    revenueSplit: 65, // Percentage that goes to the studio
    minimumGuarantee: 30000,
    currentRevenue: 78600,
    paymentStatus: "Pending",
    lastPaymentDate: "2025-04-30",
    nextPaymentDue: "2025-05-15",
    notes: "Contrato premium con exhibición en salas premium obligatoria.",
    attachments: ["thunderbolts_contract.pdf", "marketing_requirements.pdf"],
    status: "active",
    daysLeft: 46,
    pendingPaymentAmount: 18700
  },
  {
    id: 5,
    movieTitle: "Karate Kid",
    studio: "Sony Pictures",
    licenseType: "Standard",
    startDate: "2025-04-01",
    endDate: "2025-05-31",
    revenueSplit: 55, // Percentage that goes to the studio
    minimumGuarantee: 18000,
    currentRevenue: 38200,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-30",
    notes: "Contrato estándar, posibilidad de extensión basada en desempeño.",
    attachments: ["karate_kid_contract.pdf"],
    status: "active",
    daysLeft: 16
  },
  {
    id: 6,
    movieTitle: "Mazel Tov",
    studio: "Warner Bros. Pictures",
    licenseType: "Indie/Special",
    startDate: "2025-03-25",
    endDate: "2025-05-10",
    revenueSplit: 50, // Percentage that goes to the studio
    minimumGuarantee: 8000,
    currentRevenue: 12300,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-15",
    notes: "Película de arte con condiciones especiales, mínimo de 14 funciones por semana.",
    attachments: ["mazel_tov_contract.pdf"],
    status: "expired",
    daysLeft: -5
  }
];

// Upcoming contracts (movies that will be available soon)
const mockUpcomingContracts = [
  {
    id: 101,
    movieTitle: "Dune Parte 3",
    studio: "Warner Bros. Pictures",
    licenseType: "Premium",
    startDate: "2025-06-15",
    endDate: "2025-08-31",
    revenueSplit: 75, // Percentage that goes to the studio
    minimumGuarantee: 45000,
    status: "pending_signature",
    notes: "Contrato premium para una de las películas más esperadas del año.",
    daysToStart: 31
  },
  {
    id: 102,
    movieTitle: "Avatar 3",
    studio: "Disney/20th Century",
    licenseType: "Premium Plus",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    revenueSplit: 80, // Percentage that goes to the studio
    minimumGuarantee: 60000,
    status: "negotiation",
    notes: "En negociación, se espera firmar antes del 30 de mayo.",
    daysToStart: 47
  },
  {
    id: 103,
    movieTitle: "Gladiador II",
    studio: "Paramount Pictures",
    licenseType: "Premium",
    startDate: "2025-06-01",
    endDate: "2025-08-15",
    revenueSplit: 70, // Percentage that goes to the studio
    minimumGuarantee: 40000,
    status: "confirmed",
    notes: "Contrato confirmado, pendiente de recibir documentación final.",
    daysToStart: 17
  }
];

const MovieLicenseContracts = () => {
  const [contracts] = useState(mockMovieContracts);
  const [upcomingContracts] = useState(mockUpcomingContracts);
  const [selectedContract, setSelectedContract] = useState(null);
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
  const handleSelectContract = (contract) => {
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
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('es-AR')}`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };
  
  // Handle make payment button
  const handleMakePayment = (contract) => {
    setSelectedContract(contract);
    setPaymentAmount(contract.pendingPaymentAmount?.toString() || '');
    setShowPaymentModal(true);
  };
  
  // Handle view contract
  const handleViewContract = (contract) => {
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
    alert(`Pago de ${formatCurrency(parseFloat(paymentAmount))} registrado para ${selectedContract.movieTitle}`);
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
                    <td className="text-end">{formatCurrency(contract.currentRevenue)}</td>
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
        <div className="modal show d-block" tabIndex="-1">
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
        <div className="modal show d-block" tabIndex="-1">
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
                        {selectedContract.currentRevenue && (
                          <tr>
                            <th>Ingresos Actuales:</th>
                            <td>{formatCurrency(selectedContract.currentRevenue)}</td>
                          </tr>
                        )}
                        {selectedContract.paymentStatus && (
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
                        {selectedContract.lastPaymentDate && (
                          <tr>
                            <th>Último Pago:</th>
                            <td>{formatDate(selectedContract.lastPaymentDate)}</td>
                          </tr>
                        )}
                        {selectedContract.nextPaymentDue && (
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
                
                {selectedContract.attachments && selectedContract.attachments.length > 0 && (
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
                {selectedContract.status === 'active' && (
                  <>
                    <button type="button" className="btn btn-primary">
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </button>
                    {selectedContract.paymentStatus === 'Pending' && (
                      <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={() => {
                          handleCloseModals();
                          handleMakePayment(selectedContract);
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