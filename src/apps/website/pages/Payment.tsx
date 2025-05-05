// src/apps/website/pages/Payment.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import reservationService from '../../../common/services/reservationService';
import orderService from '../../../common/services/orderService';
import paymentService from '../../../common/services/paymentService';
import productService from '../../../common/services/productService';

interface PaymentParams {
  reservationId: string;
  [key: string]: string | undefined;
}

const Payment: React.FC = () => {
  const { reservationId } = useParams<PaymentParams>();
  const navigate = useNavigate();
  
  const [reservation, setReservation] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{id: string, quantity: number}[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<{id: string, quantity: number}[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: ''
  });
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!reservationId) return;
      
      try {
        setLoading(true);
        // Obtener detalles de la reserva
        const reservationData = await reservationService.getReservationById(reservationId);
        setReservation(reservationData);
        
        // Obtener productos y combos disponibles
        if (reservationData.cinemaId) {
          const productsData = await productService.getAvailableProducts(reservationData.cinemaId);
          setProducts(productsData);
          
          const combosData = await productService.getAvailableCombos(reservationData.cinemaId);
          setCombos(combosData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reservationId]);

  const handleProductSelect = (productId: string, quantity: number) => {
    if (quantity === 0) {
      // Eliminar producto si la cantidad es 0
      setSelectedProducts(prevProducts => 
        prevProducts.filter(p => p.id !== productId)
      );
    } else {
      // Verificar si el producto ya está seleccionado
      const existingProduct = selectedProducts.find(p => p.id === productId);
      
      if (existingProduct) {
        // Actualizar cantidad
        setSelectedProducts(prevProducts => 
          prevProducts.map(p => p.id === productId ? { ...p, quantity } : p)
        );
      } else {
        // Agregar nuevo producto
        setSelectedProducts(prevProducts => 
          [...prevProducts, { id: productId, quantity }]
        );
      }
    }
  };

  const handleComboSelect = (comboId: string, quantity: number) => {
    if (quantity === 0) {
      // Eliminar combo si la cantidad es 0
      setSelectedCombos(prevCombos => 
        prevCombos.filter(c => c.id !== comboId)
      );
    } else {
      // Verificar si el combo ya está seleccionado
      const existingCombo = selectedCombos.find(c => c.id === comboId);
      
      if (existingCombo) {
        // Actualizar cantidad
        setSelectedCombos(prevCombos => 
          prevCombos.map(c => c.id === comboId ? { ...c, quantity } : c)
        );
      } else {
        // Agregar nuevo combo
        setSelectedCombos(prevCombos => 
          [...prevCombos, { id: comboId, quantity }]
        );
      }
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationId) return;
    
    try {
      setProcessing(true);
      setError(null);
      
      // 1. Crear orden
      const orderRequest = {
        reservationId,
        productItems: selectedProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity
        })),
        comboItems: selectedCombos.map(c => ({
          comboId: c.id,
          quantity: c.quantity
        })),
        customerEmail,
        promotionCode: ''
      };
      
      const order = await orderService.createOrder(orderRequest);
      setOrderId(order.id);
      
      // 2. Procesar pago
      if (paymentMethod === 'card') {
        const paymentRequest = {
          paymentMethod,
          cardNumber: cardDetails.cardNumber,
          cardholderName: cardDetails.cardholderName,
          expirationDate: cardDetails.expirationDate,
          cvv: cardDetails.cvv
        };
        
        const paymentResult = await paymentService.processPayment(order.id, paymentRequest);
        
        if (paymentResult.success) {
          // Pago exitoso
          setSuccess(true);
        } else {
          // Error en el pago
          setError(paymentResult.message || 'Hubo un problema con el pago. Por favor, intenta de nuevo.');
        }
      } else if (paymentMethod === 'mercadopago') {
        // Implementar integración con MercadoPago
        const paymentRequest = {
          paymentMethod: 'mercadopago'
        };
        
        const paymentResult = await paymentService.processPayment(order.id, paymentRequest);
        
        if (paymentResult.redirectUrl) {
          // Redirigir a MercadoPago para completar el pago
          window.location.href = paymentResult.redirectUrl;
          return;
        } else {
          setError('No se pudo iniciar el proceso de pago con MercadoPago.');
        }
      }
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError(err.response?.data?.message || 'Hubo un problema al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  // Calcular subtotal de productos y combos
  const calculateProductsTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateCombosTotal = () => {
    return selectedCombos.reduce((total, item) => {
      const combo = combos.find(c => c.id === item.id);
      return total + (combo ? combo.price * item.quantity : 0);
    }, 0);
  };

  // Calcular total general
  const calculateTotal = () => {
    if (!reservation) return 0;
    
    return reservation.totalAmount + calculateProductsTotal() + calculateCombosTotal();
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
              <Button variant="primary" onClick={() => navigate(`/orders/${orderId}/tickets`)}>
                Ver mis entradas
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
              <p className="mb-1"><strong>Función:</strong> {new Date(reservation.startTime).toLocaleString([], { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p className="mb-1"><strong>Sala:</strong> {reservation.roomName}</p>
              <p className="mb-3"><strong>Asientos:</strong> {reservation.seats.map((s: any) => `${s.row}${s.number}`).join(', ')}</p>
              
              <div className="d-flex justify-content-between fw-bold">
                <span>Subtotal Entradas:</span>
                <span>${reservation.totalAmount}</span>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">¿Deseas agregar productos?</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Productos</h5>
                  {products.map(product => {
                    const selectedProduct = selectedProducts.find(p => p.id === product.id);
                    const quantity = selectedProduct ? selectedProduct.quantity : 0;
                    
                    return (
                      <div key={product.id} className="product-item mb-3 p-2 border rounded">
                        <div className="d-flex justify-content-between mb-2">
                          <span>{product.name}</span>
                          <span>${product.price}</span>
                        </div>
                        <div className="d-flex justify-content-end">
                          <div className="quantity-control">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleProductSelect(product.id, Math.max(0, quantity - 1))}
                            >
                              -
                            </Button>
                            <span className="mx-2">{quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleProductSelect(product.id, quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Col>
                
                <Col md={6}>
                  <h5 className="mb-3">Combos</h5>
                  {combos.map(combo => {
                    const selectedCombo = selectedCombos.find(c => c.id === combo.id);
                    const quantity = selectedCombo ? selectedCombo.quantity : 0;
                    
                    return (
                      <div key={combo.id} className="combo-item mb-3 p-2 border rounded">
                        <div className="d-flex justify-content-between mb-2">
                          <span>{combo.name}</span>
                          <span>${combo.price}</span>
                        </div>
                        <p className="small text-muted">{combo.description}</p>
                        <div className="d-flex justify-content-end">
                          <div className="quantity-control">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleComboSelect(combo.id, Math.max(0, quantity - 1))}
                            >
                              -
                            </Button>
                            <span className="mx-2">{quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleComboSelect(combo.id, quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Información de Pago</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <h5 className="mb-3">Método de Pago</h5>
                  <div className="d-flex gap-3 mb-3">
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      id="card"
                      label="Tarjeta de Crédito/Débito"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      id="mercadopago"
                      label="MercadoPago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={() => setPaymentMethod('mercadopago')}
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
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
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
                    `Pagar $${calculateTotal()}`
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
                  <strong>Función:</strong> {new Date(reservation.startTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="mb-1">
                  <strong>Fecha:</strong> {new Date(reservation.startTime).toLocaleDateString()}
                </p>
                <p className="mb-1">
                  <strong>Sala:</strong> {reservation.roomName}
                </p>
                <p className="mb-0">
                  <strong>Asientos:</strong> {reservation.seats.map((s: any) => `${s.row}${s.number}`).join(', ')}
                </p>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal Entradas:</span>
                <span>${reservation.totalAmount}</span>
              </div>
              
              {calculateProductsTotal() > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Productos:</span>
                  <span>${calculateProductsTotal()}</span>
                </div>
              )}
              
              {calculateCombosTotal() > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Combos:</span>
                  <span>${calculateCombosTotal()}</span>
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between fs-5 fw-bold mb-0">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              
              <div className="mt-4 small text-muted">
                <p className="mb-1">
                  <i className="bi bi-shield-check me-1"></i>
                  Pago seguro garantizado
                </p>
                <p className="mb-0">
                  <i className="bi bi-clock-history me-1"></i>
                  Tu reserva expira en: {new Date(reservation.expiresAt).toLocaleTimeString()}
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