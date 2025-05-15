// src/apps/website/pages/Payment.tsx (Versión mockeada para funcionar sin backend)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

interface PaymentParams {
  reservationId: string;
  [key: string]: string | undefined;
}

interface ReservationData {
  id: string;
  movieTitle: string;
  startTime: string;
  endTime?: string;
  roomName: string;
  seats: Array<{row: string, number: string}>;
  totalAmount: number;
}

// Simula los tipos de entradas seleccionadas
interface TicketType {
  type: string;
  quantity: number;
}

// Interfaz para productos candy
interface CandyItem {
  product: {
    id: string;
    name: string;
    price: number;
    discount?: number;
  };
  quantity: number;
}

const Payment: React.FC = () => {
  const { reservationId } = useParams<PaymentParams>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extrae datos de location.state (si existen)
  const stateData = location.state as any;
  
  // Estado para la página
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Estados para la información de pago
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: ''
  });
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    phone: '',
    name: ''
  });
  
  // Mock de la reserva (simula datos que vendrían del backend)
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<TicketType[]>([]);
  const [candyItems, setCandyItems] = useState<CandyItem[]>([]);
  
  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Pequeña demora para simular carga
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Si tenemos datos en location.state, los usamos
        if (stateData) {
          // Construir la reserva a partir de location.state
          const mockReservation: ReservationData = {
            id: reservationId || 'res-mock-123',
            movieTitle: stateData.movieTitle || 'Película de ejemplo',
            startTime: stateData.showDate ? `${stateData.showDate} ${stateData.showTime || '15:30'}` : new Date().toISOString(),
            roomName: stateData.room || 'Sala 1',
            seats: stateData.seats 
              ? Array.isArray(stateData.seats) 
                ? stateData.seats.map((seat: any) => {
                    // Extraer row y number de cada asiento (formato "A1", "B2", etc)
                    const row = seat.match(/[A-Z]/)[0];
                    const number = seat.match(/\d+/)[0];
                    return { row, number };
                  })
                : [{ row: 'A', number: '1' }]
              : [{ row: 'A', number: '1' }, { row: 'A', number: '2' }],
            totalAmount: stateData.totalAmount || 2000
          };
          
          setReservation(mockReservation);
          
          // Si hay tipos de tickets, los configuramos
          if (stateData.ticketTypes) {
            setSelectedTickets(stateData.ticketTypes);
          }
          
          // Si hay items de candy, los configuramos
          if (stateData.candyItems) {
            setCandyItems(stateData.candyItems);
          }
        } else {
          // Si no hay datos de estado, creamos una reserva mock
          const mockReservation: ReservationData = {
            id: reservationId || 'res-mock-123',
            movieTitle: 'Minecraft',
            startTime: '2025-05-20 15:30',
            roomName: 'Sala 1',
            seats: [
              { row: 'A', number: '5' },
              { row: 'A', number: '6' }
            ],
            totalAmount: 2000
          };
          
          setReservation(mockReservation);
          
          // Mock de tipos de tickets
          setSelectedTickets([
            { type: 'adult', quantity: 2 }
          ]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [reservationId, stateData]);
  
  // Manejar cambios en el método de pago
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  
  // Manejar envío del formulario de pago
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardholderName || 
          !cardDetails.expirationDate || !cardDetails.cvv) {
        setError('Por favor completa todos los campos de la tarjeta.');
        return;
      }
    }
    
    if (!customerInfo.email) {
      setError('Por favor ingresa tu email para recibir los tickets.');
      return;
    }
    
    // Iniciar procesamiento
    setProcessing(true);
    setError(null);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      setProcessing(false);
      
      // Simulamos un ID de orden
      const generatedOrderId = `ORD-${Date.now().toString().substring(7)}`;
      setOrderId(generatedOrderId);
      
      // Marcamos como exitoso
      setSuccess(true);
    }, 2000);
  };
  
  // Calcular total de productos candy
  const calculateCandyTotal = () => {
    return candyItems.reduce((total, item) => {
      // Aplicar descuento si existe
      const price = item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      
      return total + (price * item.quantity);
    }, 0);
  };
  
  // Calcular total general
  const calculateTotal = () => {
    if (!reservation) return 0;
    
    return reservation.totalAmount + calculateCandyTotal();
  };
  
  // Formatear fecha/hora
  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateTimeStr;
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (error && !success) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );
  }
  
  if (success) {
    return (
      <Container className="py-5">
        <Card className="text-center p-5">
          <Card.Body>
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="mb-3">¡Pago Completado!</h2>
            <p className="mb-4">Tu compra se ha procesado correctamente.</p>
            <p>Hemos enviado los detalles y los códigos QR a tu correo electrónico.</p>
            
            <div className="mt-4">
              <Button variant="primary" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  if (!reservation) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No se encontró la reserva solicitada.</Alert>
        <Button variant="secondary" onClick={() => navigate('/')}>Volver al inicio</Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Finalizar Compra</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Detalles de tu Reserva</h4>
            </Card.Header>
            <Card.Body>
              <h5>{reservation.movieTitle}</h5>
              <p className="mb-1"><strong>Función:</strong> {formatDateTime(reservation.startTime)}</p>
              <p className="mb-1"><strong>Sala:</strong> {reservation.roomName}</p>
              <p className="mb-3">
                <strong>Asientos:</strong> {reservation.seats.map(s => `${s.row}${s.number}`).join(', ')}
              </p>
              
              <div className="d-flex justify-content-between fw-bold">
                <span>Subtotal Entradas:</span>
                <span>${reservation.totalAmount.toLocaleString('es-AR')}</span>
              </div>
            </Card.Body>
          </Card>
          
          {/* Mostrar productos Candy si hay */}
          {candyItems.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h4 className="mb-0">Productos seleccionados</h4>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Precio Unitario</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candyItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">${item.product.price}</td>
                          <td className="text-end">${(item.product.price * item.quantity).toLocaleString('es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={3} className="text-end">Total Productos:</th>
                        <th className="text-end">${calculateCandyTotal().toLocaleString('es-AR')}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
          
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Información de Pago</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmitPayment}>
                <div className="mb-4">
                  <h5 className="mb-3">Método de Pago</h5>
                  <div className="d-flex gap-3 mb-3">
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      id="card"
                      label="Tarjeta de Crédito/Débito"
                      checked={paymentMethod === 'card'}
                      onChange={() => handlePaymentMethodChange('card')}
                    />
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      id="mercadopago"
                      label="MercadoPago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={() => handlePaymentMethodChange('mercadopago')}
                    />
                  </div>
                </div>
                
                {paymentMethod === 'card' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de Tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre en la Tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Juan Pérez"
                        value={cardDetails.cardholderName}
                        onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha de Vencimiento</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/AA"
                            value={cardDetails.expirationDate}
                            onChange={(e) => setCardDetails({...cardDetails, expirationDate: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Código de Seguridad</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
                
                <Form.Group className="mb-4">
                  <Form.Label>Email para recibir los tickets</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  className="w-100"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Procesando...
                    </>
                  ) : (
                    `Pagar $${calculateTotal().toLocaleString('es-AR')}`
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4 sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h4 className="mb-0">Resumen de Compra</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h5>{reservation.movieTitle}</h5>
                <p className="mb-1">
                  <strong>Función:</strong> {
                    new Date(reservation.startTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  }
                </p>
                <p className="mb-1">
                  <strong>Fecha:</strong> {
                    new Date(reservation.startTime).toLocaleDateString()
                  }
                </p>
                <p className="mb-1">
                  <strong>Sala:</strong> {reservation.roomName}
                </p>
                <p className="mb-0">
                  <strong>Asientos:</strong> {reservation.seats.map(s => `${s.row}${s.number}`).join(', ')}
                </p>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal Entradas:</span>
                <span>${reservation.totalAmount.toLocaleString('es-AR')}</span>
              </div>
              
              {candyItems.length > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Productos Candy:</span>
                  <span>${calculateCandyTotal().toLocaleString('es-AR')}</span>
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between fs-5 fw-bold mb-0">
                <span>Total:</span>
                <span>${calculateTotal().toLocaleString('es-AR')}</span>
              </div>
              
              <div className="mt-4 small text-muted">
                <p className="mb-1">
                  <i className="bi bi-shield-check me-1"></i>
                  Pago seguro garantizado
                </p>
                <p className="mb-0">
                  <i className="bi bi-clock-history me-1"></i>
                  Tu reserva expira en 15 minutos
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;