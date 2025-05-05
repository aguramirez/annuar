// src/apps/validator/pages/ScanQR.tsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import qrCodeService from '../../../common/services/qrCodeService';
import showService from '../../../common/services/showService';

enum ValidationStatus {
  IDLE = 'idle',
  SCANNING = 'scanning',
  VALID = 'valid',
  INVALID = 'invalid',
  ERROR = 'error'
}

interface Show {
  id: string;
  movieTitle: string;
  roomName: string;
  startTime: string;
}

const ScanQR: React.FC = () => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(ValidationStatus.IDLE);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [ticketData, setTicketData] = useState<any>(null);
  const [qrContent, setQrContent] = useState<string>('');
  const [activeShow, setActiveShow] = useState<string>('');
  const [availableShows, setAvailableShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Cargar funciones en curso al iniciar
  useEffect(() => {
    const fetchCurrentShows = async () => {
      try {
        setLoading(true);
        const shows = await showService.getCurrentlyPlayingShows();
        setAvailableShows(shows);
        
        if (shows.length > 0) {
          setActiveShow(shows[0].id);
        }
      } catch (error) {
        console.error('Error al cargar funciones actuales:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentShows();
  }, []);
  
  // Simulación de escaneo de QR
  const startScanning = () => {
    setValidationStatus(ValidationStatus.SCANNING);
    
    // Aquí iría la lógica para acceder a la cámara y escanear el QR
    // Por ahora simplemente simulamos un input
    const mockQrCode = prompt('Ingresa el contenido del QR (simulación):');
    
    if (mockQrCode) {
      setQrContent(mockQrCode);
      validateQR(mockQrCode);
    } else {
      setValidationStatus(ValidationStatus.IDLE);
    }
  };
  
  // Validar QR con el backend
  const validateQR = async (qrContent: string) => {
    try {
      setLoading(true);
      const result = await qrCodeService.validateQrCode(qrContent);
      
      if (result.success) {
        setValidationStatus(ValidationStatus.VALID);
        setValidationMessage(result.message || 'Entrada válida');
        
        // Simular datos de ticket - en una implementación real vendría de la API
        setTicketData({
          orderId: 'ORD-123456',
          movieTitle: availableShows.find(s => s.id === activeShow)?.movieTitle || 'Película',
          showtime: availableShows.find(s => s.id === activeShow)?.startTime || new Date().toISOString(),
          seat: 'F12',
          customerName: 'Juan Pérez'
        });
      } else {
        setValidationStatus(ValidationStatus.INVALID);
        setValidationMessage(result.message || 'Entrada inválida');
        setTicketData(null);
      }
    } catch (error) {
      console.error('Error validando QR:', error);
      setValidationStatus(ValidationStatus.ERROR);
      setValidationMessage('Error de conexión al validar el QR');
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const resetScanner = () => {
    setValidationStatus(ValidationStatus.IDLE);
    setValidationMessage('');
    setQrContent('');
    setTicketData(null);
  };
  
  // Clase y color según el estado de validación
  const getStatusClass = () => {
    switch (validationStatus) {
      case ValidationStatus.VALID:
        return 'validation-success';
      case ValidationStatus.INVALID:
      case ValidationStatus.ERROR:
        return 'validation-error';
      default:
        return '';
    }
  };
  
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Validador de Entradas</h1>
      
      {/* Selector de función */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Función Activa</h5>
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : availableShows.length > 0 ? (
            <select 
              className="form-select" 
              value={activeShow}
              onChange={(e) => setActiveShow(e.target.value)}
              disabled={validationStatus !== ValidationStatus.IDLE}
            >
              {availableShows.map(show => (
                <option key={show.id} value={show.id}>
                  {show.movieTitle} - {show.roomName} - {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </option>
              ))}
            </select>
          ) : (
            <Alert variant="warning">
              No hay funciones en curso en este momento.
            </Alert>
          )}
        </Card.Body>
      </Card>
      
      {/* Escáner de QR */}
      <Card className={`validation-card ${getStatusClass()}`}>
        <Card.Body className="text-center p-5">
          {validationStatus === ValidationStatus.IDLE && (
            <>
              <div className="scanner-icon-container mb-4">
                <i className="bi bi-qr-code-scan scanner-icon"></i>
              </div>
              <h3 className="mb-4">Listo para Escanear</h3>
              <p className="mb-4">Presiona el botón para comenzar a escanear el código QR de la entrada.</p>
              <Button 
                variant="primary" 
                size="lg" 
                className="scan-btn px-5"
                onClick={startScanning}
                disabled={!activeShow || loading}
              >
                <i className="bi bi-camera me-2"></i>
                Iniciar Escaneo
              </Button>
            </>
          )}

          {validationStatus === ValidationStatus.SCANNING && (
            <>
              <div className="camera-container mb-4">
                <div className="camera-viewport">
                  <div className="scanning-overlay">
                    <div className="scanning-line"></div>
                  </div>
                </div>
              </div>
              <h3 className="mb-3">Escaneando código QR...</h3>
              <p className="mb-3">Acerca el código QR de la entrada a la cámara.</p>
              <Button 
                variant="secondary" 
                onClick={resetScanner}
                disabled={loading}
              >
                Cancelar
              </Button>
            </>
          )}

          {(validationStatus === ValidationStatus.VALID || 
            validationStatus === ValidationStatus.INVALID || 
            validationStatus === ValidationStatus.ERROR) && (
            <>
              <div className={`result-icon mb-4 ${
                validationStatus === ValidationStatus.VALID ? 'valid-icon' : 'invalid-icon'
              }`}>
                <i className={`bi ${
                  validationStatus === ValidationStatus.VALID 
                    ? 'bi-check-circle-fill' 
                    : 'bi-x-circle-fill'
                }`}></i>
              </div>
              
              <h2 className="mb-3">{validationMessage}</h2>
              
              {validationStatus === ValidationStatus.VALID && ticketData && (
                <div className="ticket-details text-start mb-4">
                  <div className="detail-item">
                    <span className="detail-label">Película:</span>
                    <span className="detail-value">{ticketData.movieTitle}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Función:</span>
                    <span className="detail-value">
                      {new Date(ticketData.showtime).toLocaleString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Asiento:</span>
                    <span className="detail-value">{ticketData.seat}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cliente:</span>
                    <span className="detail-value">{ticketData.customerName}</span>
                  </div>
                </div>
              )}
              
              <div className="d-flex justify-content-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="me-3"
                  onClick={resetScanner}
                  disabled={loading}
                >
                  Escanear Otro
                </Button>
                
                {validationStatus === ValidationStatus.VALID && (
                  <Button 
                    variant="success" 
                    size="lg"
                    disabled={loading}
                  >
                    Permitir Acceso
                  </Button>
                )}
              </div>
            </>
          )}
          
          {loading && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Estadísticas */}
      <Card className="mt-4">
        <Card.Body>
          <h5 className="mb-3">Estadísticas de Validación</h5>
          <div className="d-flex justify-content-around text-center">
            <div className="stat-item">
              <div className="stat-value">42</div>
              <div className="stat-label">Validadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">3</div>
              <div className="stat-label">Rechazadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">63%</div>
              <div className="stat-label">Ocupación</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ScanQR;