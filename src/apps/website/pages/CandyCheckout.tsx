// src/apps/website/pages/CandyCheckout.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../common/context/CartContext';
import { useFirebaseAuth } from '../../../auth/FirebaseAuthContext';

const CandyCheckout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useFirebaseAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: ''
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: ''
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si el carrito está vacío
  if (cart.items.length === 0 && !paymentComplete) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Carrito vacío</h4>
          <p>No hay productos en tu carrito. Por favor agrega algunos productos antes de continuar.</p>
          <Button variant="primary" onClick={() => navigate('/candy')}>
            Ir a la tienda Candy
          </Button>
        </Alert>
      </Container>
    );
  }

  // Manejar el envío del pago
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar los datos según el método de pago
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardholderName || !cardDetails.expirationDate || !cardDetails.cvv) {
        setError('Por favor, completa todos los campos de la tarjeta.');
        return;
      }
    }
    
    // Validar información del cliente
    if (!customerInfo.name || !customerInfo.email) {
      setError('Por favor, completa tu nombre y email para recibir la confirmación.');
      return;
    }
    
    // Simular procesamiento del pago
    setProcessingPayment(true);
    setError(null);
    
    // Simular una respuesta exitosa después de 1.5 segundos
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentComplete(true);
      
      // Limpiar el carrito después del pago exitoso
      clearCart();
    }, 1500);
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Finalizar Compra</h1>
      
      {paymentComplete ? (
        <Card className="text-center p-5">
          <Card.Body>
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="mb-3">¡Pago Completado!</h2>
            <p className="mb-4">Tu pedido ha sido procesado correctamente.</p>
            <p>Hemos enviado un correo electrónico con los detalles y tu código QR para retirar los productos.</p>
            
            <div className="mt-4">
              <Button variant="primary" className="me-3" onClick={() => window.print()}>
                <i className="bi bi-printer me-2"></i>
                Imprimir Comprobante
              </Button>
              <Button variant="success" onClick={() => navigate('/')}>
                <i className="bi bi-house me-2"></i>
                Volver al Inicio
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>
                <h4 className="mb-0">Detalles de tu Pedido</h4>
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
                      {cart.items.map(item => (
                        <tr key={item.product.id}>
                          <td>{item.product.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">${item.product.price}</td>
                          <td className="text-end">${item.product.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={3} className="text-end">Total</th>
                        <th className="text-end">${cart.total}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="mb-4">
              <Card.Header>
                <h4 className="mb-0">Información de Contacto</h4>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={customerInfo.name} 
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono (opcional)</Form.Label>
                        <Form.Control 
                          type="tel" 
                          value={customerInfo.phone} 
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={customerInfo.email} 
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                    />
                    <Form.Text className="text-muted">
                      Enviaremos la confirmación y el código QR a este email.
                    </Form.Text>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header>
                <h4 className="mb-0">Información de Pago</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmitPayment}>
                  <Form.Group className="mb-4">
                    <Form.Label>Método de Pago</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check 
                        type="radio" 
                        id="card-payment" 
                        label="Tarjeta de Crédito/Débito" 
                        name="payment-method"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <Form.Check 
                        type="radio" 
                        id="mercadopago-payment" 
                        label="MercadoPago" 
                        name="payment-method"
                        checked={paymentMethod === 'mercadopago'}
                        onChange={() => setPaymentMethod('mercadopago')}
                      />
                    </div>
                  </Form.Group>
                  
                  {paymentMethod === 'card' && (
                    <div className="card-payment-form">
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
                          placeholder="Como aparece en la tarjeta"
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
                            <Form.Label>CVV</Form.Label>
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
                    </div>
                  )}
                  
                  {paymentMethod === 'mercadopago' && (
                    <div className="mercadopago-info p-3 bg-light rounded text-center">
                      <p>Serás redirigido a MercadoPago para completar el pago de manera segura.</p>
                      <img 
                        src="https://via.placeholder.com/200x60?text=MercadoPago" 
                        alt="MercadoPago" 
                        className="img-fluid my-3" 
                      />
                    </div>
                  )}
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      type="submit" 
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
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
                        <>Pagar ${cart.total}</>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/candy')}
                      disabled={processingPayment}
                    >
                      Volver a la tienda
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="mb-4 summary-card">
              <Card.Header>
                <h4 className="mb-0">Resumen de Compra</h4>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${cart.total}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Impuestos</span>
                  <span>$0</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span>$0</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>${cart.total}</span>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="info-card">
              <Card.Body>
                <h5><i className="bi bi-info-circle me-2"></i>Información</h5>
                <p className="mb-0">Los productos podrán ser retirados en el cine presentando el código QR que recibirás por email.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CandyCheckout;