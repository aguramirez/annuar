import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Navbar } from 'react-bootstrap';

interface Movie {
  id: number;
  title: string;
  showtime: any;
ticketCount:any;
    selectedSeats:any;
}

interface PaymentProps {
  movie: Movie;
  showtime: { date: string; time: string } | null;
  ticketCount: number;
  selectedSeats: string[];
}

const Payment: React.FC<PaymentProps> = ({
  movie,
  showtime,
  ticketCount,
  selectedSeats,
}) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  const ticketPrice = 950; // Price in Argentine Pesos
  const totalAmount = ticketPrice * ticketCount;
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 1500);
  };
  
  return (
    <>
      <Container className="py-4">
        <Button 
          variant="outline-secondary" 
          className="mb-4" 
          onClick={() => navigate(-1)}
          disabled={isProcessing || isComplete}
        >
          &lt; Volver
        </Button>
        
        <h1 className="page-heading">Pago de Entradas</h1>
        
        {isComplete ? (
          <Card className="text-center p-4">
            <Card.Body>
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h2 className="mb-3">¡Pago Completado!</h2>
              <p className="mb-4">Tus entradas han sido reservadas correctamente.</p>
              <div className="payment-summary mb-4">
                <h5>{movie.title}</h5>
                {/* <p className="mb-1"><strong>Fecha:</strong> {formatDate(showtime.date)}</p> */}
                <p className="mb-1"><strong>Horario:</strong> {showtime?.time}</p>
                <p className="mb-1"><strong>Entradas:</strong> {ticketCount}</p>
                <p className="mb-1"><strong>Asientos:</strong> {selectedSeats.join(', ')}</p>
                <p className="mb-0"><strong>Total:</strong> ${totalAmount.toLocaleString('es-AR')}</p>
              </div>
              <p className="text-muted mb-4">Se ha enviado un correo electrónico con los detalles de tu compra.</p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/')}
              >
                Volver al Inicio
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="p-4 payment-form">
                <Card.Body>
                  <h4 className="mb-4">Información de Pago</h4>
                  
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <h5 className="mb-3">Método de Pago</h5>
                      <div className="d-flex flex-wrap gap-3">
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          id="credit"
                          label="Tarjeta de crédito"
                          checked={paymentMethod === 'credit'}
                          onChange={() => setPaymentMethod('credit')}
                          className="me-3"
                        />
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          id="debit"
                          label="Tarjeta de débito"
                          checked={paymentMethod === 'debit'}
                          onChange={() => setPaymentMethod('debit')}
                          className="me-3"
                        />
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          id="transfer"
                          label="Transferencia bancaria"
                          checked={paymentMethod === 'transfer'}
                          onChange={() => setPaymentMethod('transfer')}
                        />
                      </div>
                    </div>
                    
                    {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Número de tarjeta</Form.Label>
                          <Form.Control type="text" placeholder="1234 5678 9012 3456" required />
                        </Form.Group>
                        
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Fecha de vencimiento</Form.Label>
                              <Form.Control type="text" placeholder="MM/AA" required />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Código de seguridad</Form.Label>
                              <Form.Control type="text" placeholder="123" required />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre en la tarjeta</Form.Label>
                          <Form.Control type="text" placeholder="Juan Pérez" required />
                        </Form.Group>
                      </>
                    )}
                    
                    {paymentMethod === 'transfer' && (
                      <Alert variant="info" className="mb-4">
                        <h6>Datos para la transferencia</h6>
                        <p className="mb-1"><strong>Banco:</strong> Banco Nación</p>
                        <p className="mb-1"><strong>CBU:</strong> 0110012340000012345678</p>
                        <p className="mb-1"><strong>Alias:</strong> ANNUAR.CINE.VENTAS</p>
                        <p className="mb-0"><strong>CUIT:</strong> 30-12345678-9</p>
                      </Alert>
                    )}
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Email para recibir los tickets</Form.Label>
                      <Form.Control type="email" placeholder="ejemplo@email.com" required />
                    </Form.Group>
                    
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Procesando...' : `Pagar $${totalAmount.toLocaleString('es-AR')}`}
                      </Button>
                    </div>
                    
                    {/* <div className="text-center mt-3">
                      <img 
                        src=" " 
                        alt="Mercado Pago Secure" 
                        className="payment-security-img" 
                      />
                    </div> */}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="p-4">
                <Card.Body>
                  <h4 className="mb-4">Resumen de Compra</h4>
                  
                  <div className="payment-summary">
                    <h5>{movie.title}</h5>
                    {/* <p className="mb-1"><strong>Fecha:</strong> {formatDate(showtime.date)}</p> */}
                    <p className="mb-1"><strong>Horario:</strong> {showtime?.time}</p>
                    <p className="mb-1"><strong>Entradas:</strong> {ticketCount}</p>
                    <p className="mb-0"><strong>Asientos:</strong> {selectedSeats.join(', ')}</p>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Precio por entrada:</span>
                    <span>${ticketPrice.toLocaleString('es-AR')}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Cantidad:</span>
                    <span>{ticketCount}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${totalAmount.toLocaleString('es-AR')}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Impuestos:</span>
                    <span>Incluidos</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-0 fw-bold">
                    <span>Total:</span>
                    <span>${totalAmount.toLocaleString('es-AR')}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Payment;