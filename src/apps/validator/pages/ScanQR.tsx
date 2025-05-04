// src/apps/validator/pages/ScanQR.tsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';

enum ValidationStatus {
  IDLE = 'idle',
  SCANNING = 'scanning',
  VALID = 'valid',
  INVALID = 'invalid',
  ERROR = 'error'
}

interface ValidationResult {
  status: ValidationStatus;
  message: string;
  ticketData?: {
    orderId: string;
    movieTitle: string;
    showtime: string;
    seat: string;
    customerName: string;
  };
}

const ScanQR: React.FC = () => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(ValidationStatus.IDLE);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Simulación de escaneo de QR
  const startScanning = () => {
    setValidationStatus(ValidationStatus.SCANNING);
    setIsCameraActive(true);
    
    // Simular un escaneo después de 2 segundos
    setTimeout(() => {
      simulateQRScan();
    }, 2000);
  };
  
  // Función para simular un resultado de escaneo (aleatorio)
  const simulateQRScan = () => {
    const randomResult = Math.random();
    
    if (randomResult > 0.7) {
      // Simular QR válido
      setValidationStatus(ValidationStatus.VALID);
      setValidationResult({
        status: ValidationStatus.VALID,
        message: 'Entrada válida',
        ticketData: {
          orderId: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
          movieTitle: 'Capitan America: Un Nuevo Mundo',
          showtime: '04/05/2025 18:15',
          seat: 'F12',
          customerName: 'Juan Pérez'
        }
      });
    } else if (randomResult > 0.4) {
      // Simular QR inválido
      setValidationStatus(ValidationStatus.INVALID);
      setValidationResult({
        status: ValidationStatus.INVALID,
        message: 'Esta entrada ya ha sido utilizada'
      });
    } else {
      // Simular error
      setValidationStatus(ValidationStatus.ERROR);
      setValidationResult({
        status: ValidationStatus.ERROR,
        message: 'QR no reconocido o formato inválido'
      });
    }
    
    setIsCameraActive(false);
  };
  
  const resetScanner = () => {
    setValidationStatus(ValidationStatus.IDLE);
    setValidationResult(null);
  };
  
  // src/apps/validator/pages/ScanQR.tsx (continuación)
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
    <Container className="py-4 validation-container">
      <h1 className="text-center mb-4">Validador de Entradas</h1>
      
      <Card className={`validation-card ${getStatusClass()}`}>
        <Card.Body className="text-center">
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
              >
                Cancelar
              </Button>
            </>
          )}

          {(validationStatus === ValidationStatus.VALID || 
            validationStatus === ValidationStatus.INVALID || 
            validationStatus === ValidationStatus.ERROR) && validationResult && (
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
              
              <h2 className="mb-3">{validationResult.message}</h2>
              
              {validationStatus === ValidationStatus.VALID && validationResult.ticketData && (
                <div className="ticket-details text-start mb-4">
                  <div className="detail-item">
                    <span className="detail-label">Película:</span>
                    <span className="detail-value">{validationResult.ticketData.movieTitle}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Función:</span>
                    <span className="detail-value">{validationResult.ticketData.showtime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Asiento:</span>
                    <span className="detail-value">{validationResult.ticketData.seat}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cliente:</span>
                    <span className="detail-value">{validationResult.ticketData.customerName}</span>
                  </div>
                </div>
              )}
              
              <div className="d-flex justify-content-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="me-3"
                  onClick={resetScanner}
                >
                  Escanear Otro
                </Button>
                
                {validationStatus === ValidationStatus.VALID && (
                  <Button 
                    variant="success" 
                    size="lg"
                  >
                    Permitir Acceso
                  </Button>
                )}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
      
      <div className="validation-stats mt-4">
        <Card>
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
      </div>
    </Container>
  );
};

export default ScanQR;