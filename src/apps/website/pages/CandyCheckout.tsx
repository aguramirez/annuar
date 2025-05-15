// src/apps/website/pages/CandyCheckout.tsx (Versión mockeada para funcionar sin backend)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';

// Interfaz para productos candy
interface CandyItem {
  product: {
    id: string;
    name: string;
    price: number;
    discount?: number;
    imageUrl?: string;
    description?: string;
  };
  quantity: number;
}

const CandyCheckout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraer datos de la ubicación (si vienen de CandyStore)
  const stateData = location.state as any;
  
  // Estado para la página
  const [loading, setLoading] = useState(true);
  const [candyItems, setCandyItems] = useState<CandyItem[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para la información de pago
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: ''
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Datos simulados del usuario
  const mockUser = {
    isAuthenticated: true,
    isPremium: true
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Pequeña demora para simular carga
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Si tenemos datos de location.state, los usamos
        if (stateData && stateData.candyItems) {
          setCandyItems(stateData.candyItems);
        } else {
          // Si no, generamos algunos datos de ejemplo
          const mockItems: CandyItem[] = [
            {
              product: {
                id: '1',
                name: 'Combo Familiar',
                description: 'Popcorn grande + 4 Gaseosas medianas + 2 Chocolates',
                price: 2000,
                imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000198.png?v=00002574',
                discount: mockUser.isPremium ? 20 : undefined
              },
              quantity: 1
            },
            {
              product: {
                id: '3',
                name: 'Popcorn Grande',
                description: 'Popcorn recién hecho en balde grande',
                price: 800,
                imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000011.png?v=00002574'
              },
              quantity: 2
            }
          ];
          
          setCandyItems(mockItems);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [stateData]);
  
  // Calcular el total del carrito
  const calculateTotal = () => {
    return candyItems.reduce((total, item) => {
      const price = item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      
      return total + (price * item.quantity);
    }, 0);
  };
  
  // Calcular precio regular (sin descuentos)
  const calculateRegularTotal = () => {
    return candyItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };
  
  // Manejar cambio de método de pago
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  
  // Manejar envío del formulario de pago
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar los datos según el método de pago
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardholderName || 
          !cardDetails.expirationDate || !cardDetails.cvv) {
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
    setProcessing(true);
    setError(null);
    
    // Simular una respuesta exitosa después de 1.5 segundos
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
    }, 1500);
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
  
  if (candyItems.length === 0 && !paymentComplete) {
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
  
  if (paymentComplete) {
    return (
      <Container className="py-5">
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
                    {candyItems.map((item, index) => {
                      const discountedPrice = item.product.discount
                        ? item.product.price * (1 - item.product.discount / 100)
                        : item.product.price;
                      
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.product.imageUrl && (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name} 
                                  style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }} 
                                />
                              )}
                              <div>
                                <div>{item.product.name}</div>
                                {item.product.description && (
                                  <small className="text-muted">{item.product.description}</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">
                            {item.product.discount ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-2">
                                  ${item.product.price.toLocaleString('es-AR')}
                                </span>
                                <span>${discountedPrice.toLocaleString('es-AR')}</span>
                              </>
                            ) : (
                              <span>${item.product.price.toLocaleString('es-AR')}</span>
                            )}
                          </td>
                          <td className="text-end">${(discountedPrice * item.quantity).toLocaleString('es-AR')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={3} className="text-end">Total:</th>
                      <th className="text-end">${calculateTotal().toLocaleString('es-AR')}</th>
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
                      onChange={() => handlePaymentMethodChange('card')}
                    />
                    <Form.Check 
                      type="radio" 
                      id="mercadopago-payment" 
                      label="MercadoPago" 
                      name="payment-method"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={() => handlePaymentMethodChange('mercadopago')}
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
                      src="https://www.mercadopago.com/org-img/Manual/ManualMP/imgs/isologoHorizontal.png" 
                      alt="MercadoPago" 
                      className="img-fluid my-3" 
                      style={{ maxHeight: '60px' }}
                    />
                  </div>
                )}
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    type="submit" 
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
                      <>Pagar ${calculateTotal().toLocaleString('es-AR')}</>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/candy')}
                    disabled={processing}
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
                <span>${calculateRegularTotal().toLocaleString('es-AR')}</span>
              </div>
              
              {calculateTotal() < calculateRegularTotal() && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento Premium</span>
                  <span>-${(calculateRegularTotal() - calculateTotal()).toLocaleString('es-AR')}</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between mb-2">
                <span>Impuestos</span>
                <span>Incluidos</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${calculateTotal().toLocaleString('es-AR')}</span>
              </div>
              
              {mockUser.isPremium && calculateTotal() < calculateRegularTotal() && (
                <Alert variant="success" className="mt-3 p-2 text-center">
                  <small>
                    <i className="bi bi-star-fill me-1"></i>
                    Ahorro Premium: ${(calculateRegularTotal() - calculateTotal()).toLocaleString('es-AR')}
                  </small>
                </Alert>
              )}
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
    </Container>
  );
};

export default CandyCheckout;