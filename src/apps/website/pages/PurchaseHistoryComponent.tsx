  return (
    <div className="purchase-history-container">
      <h4 className="mb-4">Historial de Compras</h4>
      
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}
      
      {purchases.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <i className="bi bi-cart-x fs-1 mb-3"></i>
          <p>No tienes compras registradas</p>
        </div>
      ) : (
        purchases.map(purchase => (
          <div key={purchase.id} className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-bold">{new Date(purchase.date).toLocaleDateString('es-AR')}</span>
                <span className="text-muted ms-2">#{purchase.id}</span>
              </div>
              <div>
                {purchase.status === 'active' && (
                  <span className="badge bg-success">Activa</span>
                )}
                {purchase.status === 'completed' && (
                  <span className="badge bg-primary">Completada</span>
                )}
                {purchase.status === 'canceled' && (
                  <span className="badge bg-danger">Cancelada</span>
                )}
                {purchase.status === 'refunded' && (
                  <span className="badge bg-info">Reembolsada</span>
                )}
                {purchase.status === 'partial_refund' && (
                  <span className="badge bg-warning text-dark">Reembolso Parcial</span>
                )}
              </div>
            </div>
            
            <div className="card-body">
              <div className="order-items mb-3">
                {purchase.items.map((item, index) => (
                  <div key={index} className="order-item mb-2 p-2 border rounded">
                    {item.type === 'ticket' ? (
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="fw-bold">{item.movie}</div>
                          <div className="text-muted small">
                            {new Date(item.showtime).toLocaleDateString('es-AR')} {item.showtime.split(' ')[1]} - {item.room}
                          </div>
                          <div className="text-muted small">
                            Asientos: {item.seats.join(', ')}
                          </div>
                        </div>
                        <div className="text-end">
                          <span>{item.quantity} x ${item.unitPrice}</span>
                          <div className="text-muted small">
                            ${item.quantity * item.unitPrice}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between">
                        <div>
                          <div>{item.name}</div>
                        </div>
                        <div className="text-end">
                          <span>{item.quantity} x ${item.unitPrice}</span>
                          <div className="text-muted small">
                            ${item.quantity * item.unitPrice}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-bold">Total: ${purchase.total}</div>
                <div>
                  {purchase.status === 'active' && purchase.canCancel && (
                    <button
                      className="btn btn-outline-danger btn-sm me-2"
                      onClick={() => handleCancel(purchase)}
                    >
                      Cancelar Reserva
                    </button>
                  )}
                  
                  {(purchase.status === 'active' || purchase.status === 'completed') && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleRequestRefund(purchase)}
                    >
                      Solicitar Reembolso
                    </button>
                  )}
                  
                  {purchase.status === 'canceled' && purchase.refundStatus === 'completed' && (
                    <div className="text-success small">
                      <i className="bi bi-check-circle-fill me-1"></i>
                      Reembolso: ${purchase.refundAmount}
                    </div>
                  )}
                </div>
              </div>
              
              {purchase.status === 'canceled' && purchase.canceledReason && (
                <div className="mt-3 small">
                  <strong>Motivo de cancelación:</strong> {purchase.canceledReason}
                </div>
              )}
            </div>
          </div>
        ))
      )}
      
      {/* Cancel Modal */}
      {showCancelModal && selectedPurchase && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancelar Reserva</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p>Estás a punto de cancelar tu reserva para:</p>
                <ul className="mb-3">
                  {selectedPurchase.items
                    .filter(item => item.type === 'ticket')
                    .map((item, index) => (
                      <li key={index}>
                        <strong>{item.movie}</strong> - {new Date(item.showtime).toLocaleDateString('es-AR')} {item.showtime.split(' ')[1]}
                      </li>
                    ))}
                </ul>
                
                <div className="form-group mb-3">
                  <label className="form-label">Motivo de cancelación</label>
                  <select 
                    className="form-select" 
                    value={cancelReason} 
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un motivo</option>
                    <option value="Cambio de planes">Cambio de planes</option>
                    <option value="No puedo asistir">No puedo asistir</option>
                    <option value="Quiero cambiar la función">Quiero cambiar la función</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Importante:</strong> Esta acción no puede deshacerse. Si cancelas, podrás solicitar un reembolso completo.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Volver
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmCancel}
                  disabled={!cancelReason}
                >
                  Confirmar Cancelación
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
      
      {/* Refund Modal */}
      {showRefundModal && selectedPurchase && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Solicitar Reembolso</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p>Selecciona los productos para los que deseas solicitar reembolso:</p>
                
                {selectedPurchase.items.map((item, index) => (
                  <div key={index} className="form-check mb-2 border-bottom pb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`refund-item-${index}`}
                      checked={refundSelection[index] || false}
                      onChange={() => toggleItemRefund(index)}
                    />
                    <label className="form-check-label w-100" htmlFor={`refund-item-${index}`}>
                      <div className="d-flex justify-content-between">
                        <div>
                          {item.type === 'ticket' ? (
                            <>
                              <strong>{item.movie}</strong> - {item.seats.join(', ')}
                            </>
                          ) : (
                            <strong>{item.name}</strong>
                          )}
                        </div>
                        <div className="text-end">
                          ${item.unitPrice * item.quantity}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
                
                <div className="alert alert-info mt-3">
                  <div className="d-flex justify-content-between">
                    <span>Monto a reembolsar:</span>
                    <strong>${calculateRefundAmount()}</strong>
                  </div>
                </div>
                
                <div className="alert alert-warning">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <strong>Política de reembolso:</strong> Los reembolsos se procesarán en un plazo de 7-14 días hábiles en la misma forma de pago original.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={confirmRefund}
                  disabled={calculateRefundAmount() <= 0}
                >
                  Solicitar Reembolso
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );