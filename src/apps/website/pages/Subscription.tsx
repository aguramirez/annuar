// src/apps/website/pages/Subscription.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../common/context/ThemeContext';

// Mock subscription plans
const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Pago Mensual',
    price: 1200,
    description: 'Acceso a todos los beneficios Premium renovado mensualmente.',
    popular: false,
    billingPeriod: 'mes',
    duration: '1 mes'
  },
  {
    id: 'quarterly',
    name: 'Pago Trimestral',
    price: 3000,
    originalPrice: 3600,
    description: 'Ahorra un 17% con el plan trimestral. Renovación cada 3 meses.',
    popular: true,
    billingPeriod: 'trimestre',
    duration: '3 meses',
    discount: 17
  },
  {
    id: 'annual',
    name: 'Pago Anual',
    price: 9600,
    originalPrice: 14400,
    description: 'Máximo ahorro con el plan anual. Renovación anual.',
    popular: false,
    billingPeriod: 'año',
    duration: '12 meses',
    discount: 33
  }
];

// Mock benefits list
const benefits = [
  {
    icon: 'ticket-perforated-fill',
    title: '2 Entradas Gratis Mensualmente',
    description: 'Cada mes recibirás 2 entradas para cualquier película que desees. *Acumulable por un maximo de 90 dias*'
  },
  {
    icon: 'percent',
    title: 'Descuentos en Candy',
    description: '10% adicional de descuento en todos los productos de la tienda candy y combos.'
  },
  {
    icon: 'calendar-check',
    title: 'Acceso a Pre-Venta',
    description: 'Compra tus entradas antes que el público general para estrenos y eventos especiales.'
  },
  {
    icon: 'currency-dollar',
    title: 'Sin Cargo por Servicio',
    description: 'No pagas cargos por servicio en la compra de entradas online.'
  },
  {
    icon: 'star',
    title: 'Eventos Exclusivos',
    description: 'Invitaciones a avant premieres y eventos especiales durante todo el año.'
  },
  {
    icon: 'person-bounding-box',
    title: 'Atención Personalizada',
    description: 'Línea exclusiva de atención al cliente para miembros Premium.'
  }
];

const Subscription: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id); // Default to quarterly plan
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get selected plan details
  const selectedPlanDetails = subscriptionPlans.find(plan => plan.id === selectedPlan)!;
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Nombre es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Número de tarjeta es requerido';
      if (!formData.expiryDate) newErrors.expiryDate = 'Fecha de expiración es requerida';
      if (!formData.cvv) newErrors.cvv = 'CVV es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Process subscription payment
      setIsProcessing(true);
      
      // Simulate API request
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
      }, 1500);
    }
  };
  
  // Show success screen if subscription is complete
  if (isComplete) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="text-center">
              <Card.Body className="p-5">
                <div className="mb-4 text-success">
                  <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="mb-3">¡Bienvenido al Club Annuar!</h2>
                <p className="mb-4">Tu suscripción {selectedPlanDetails.name} ha sido activada correctamente.</p>
                <div className="alert alert-success">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Hemos enviado un correo electrónico a <strong>{formData.email}</strong> con los detalles de tu suscripción.
                </div>
                
                <div className="mt-4">
                  <p>Ya puedes empezar a disfrutar de todos los beneficios Premium:</p>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i> 2 entradas gratis disponibles cada mes</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i> 10% de descuento adicional en Candy</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i> Acceso a preventas y eventos exclusivos</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate('/movies')}
                  >
                    <i className="bi bi-film me-2"></i>
                    Ver cartelera
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  
  return (
    <Container className="py-1">
      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8}>
          <div className="text-center mb-4">
            <h1 className="display-4 mb-3">Club Annuar +</h1>
            <p className="lead">Disfruta del cine al máximo con beneficios exclusivos</p>
          </div>
          
          <div className="benefits-list my-5">
            <h2 className="text-center mb-4">¿Por qué hacerte del Club Annuar +?</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
              {benefits.map((benefit, index) => (
                <Col key={index}>
                  <Card className="h-100 benefit-card">
                    <Card.Body className="text-center">
                      <div className="benefit-icon mb-3">
                        <i className={`bi bi-${benefit.icon}`} style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}></i>
                      </div>
                      <Card.Title>{benefit.title}</Card.Title>
                      <Card.Text>{benefit.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col lg={7}>
          <div className="subscription-plans mb-4">
            <h2 className="mb-4">Elige tu plan</h2>
            <div className="plans-container">
              <Row xs={1} md={3} className="g-4">
                {subscriptionPlans.map(plan => (
                  <Col key={plan.id}>
                    <Card 
                      className={`h-100 plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
                      border={selectedPlan === plan.id ? 'primary' : undefined}
                    >
                      {plan.popular && (
                        <div className="position-absolute top-0 start-50 translate-middle-x">
                          <Badge bg="warning" text="dark" className="popular-badge px-3 py-2">MÁS POPULAR</Badge>
                        </div>
                      )}
                      
                      <Card.Body className="text-center p-4">
                        <Card.Title className="mb-3">{plan.name}</Card.Title>
                        
                        <div className="price-container mb-3">
                          {plan.originalPrice ? (
                            <>
                              <div className="original-price text-muted text-decoration-line-through">
                                ${plan.originalPrice}
                              </div>
                              <div className="discount-badge">
                                <Badge bg="danger">-{plan.discount}%</Badge>
                              </div>
                            </>
                          ) : null}
                          
                          <div className="current-price">
                            <span className="currency">$</span>
                            <span className="amount">{plan.price}</span>
                            <span className="period">/{plan.billingPeriod}</span>
                          </div>
                        </div>
                        
                        <Card.Text>{plan.description}</Card.Text>
                        
                        <div className="text-center mt-3">
                          <Form.Check
                            type="radio"
                            id={`plan-${plan.id}`}
                            name="subscriptionPlan"
                            label="Seleccionar"
                            checked={selectedPlan === plan.id}
                            onChange={() => setSelectedPlan(plan.id)}
                            className="d-inline-block"
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Información de Pago</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Form.Label>Método de Pago</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="creditCard"
                      label="Tarjeta de Crédito/Débito"
                      name="paymentMethod"
                      checked={paymentMethod === 'creditCard'}
                      onChange={() => setPaymentMethod('creditCard')}
                    />
                    <Form.Check
                      type="radio"
                      id="mercadoPago"
                      label="MercadoPago"
                      name="paymentMethod"
                      checked={paymentMethod === 'mercadoPago'}
                      onChange={() => setPaymentMethod('mercadoPago')}
                    />
                  </div>
                </div>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Nombre completo</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                {paymentMethod === 'creditCard' && (
                  <>
                    <Form.Group className="mb-3" controlId="cardNumber">
                      <Form.Label>Número de tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="0000 0000 0000 0000"
                        isInvalid={!!errors.cardNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="expiryDate">
                          <Form.Label>Fecha de expiración</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            isInvalid={!!errors.expiryDate}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.expiryDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="cvv">
                          <Form.Label>Código de seguridad (CVV)</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            isInvalid={!!errors.cvv}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cvv}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
                
                {paymentMethod === 'mercadoPago' && (
                  <div className="text-center p-4 bg-light rounded">
                    <img
                      src="https://via.placeholder.com/240x80?text=MercadoPago"
                      alt="MercadoPago"
                      className="mb-3"
                    />
                    <p className="mb-0">Serás redirigido a MercadoPago para completar tu pago de forma segura.</p>
                  </div>
                )}
                
                <div className="form-check mt-4">
                  <input className="form-check-input" type="checkbox" id="termsCheck" required />
                  <label className="form-check-label" htmlFor="termsCheck">
                    Acepto los <a href="#terms" onClick={(e) => e.preventDefault()}>Términos y Condiciones</a> y la <a href="#privacy" onClick={(e) => e.preventDefault()}>Política de Privacidad</a>
                  </label>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
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
                      `Suscribirme por $${selectedPlanDetails.price}/${selectedPlanDetails.billingPeriod}`
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={5}>
          <Card className="position-sticky" style={{ top: '1rem' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Resumen de Suscripción</h5>
            </Card.Header>
            <Card.Body>
              <div className="selected-plan mb-4">
                <h6>Plan Seleccionado:</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{selectedPlanDetails.name}</span>
                  <span className="fw-bold">${selectedPlanDetails.price}</span>
                </div>
                <div className="text-muted small">Duración: {selectedPlanDetails.duration}</div>
              </div>
              
              <hr className="my-3" />
              
              <div className="benefits-summary">
                <h6>Beneficios incluidos:</h6>
                <ul className="list-unstyled">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="mb-2">
                      <i className={`bi bi-${benefit.icon} me-2 text-primary`}></i>
                      {benefit.title}
                    </li>
                  ))}
                </ul>
              </div>
              
              <hr className="my-3" />
              
              <div className="subscription-notes small text-muted">
                <p><i className="bi bi-info-circle me-1"></i> La suscripción se renovará automáticamente al final de cada período. Puedes cancelar en cualquier momento desde tu perfil.</p>
                <p><i className="bi bi-shield-lock me-1"></i> Tus datos de pago están protegidos con encriptación de nivel bancario.</p>
              </div>
              
              <hr className="my-3" />
              
              <div className="total-amount">
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total a pagar:</span>
                  <span>${selectedPlanDetails.price}</span>
                </div>
                <div className="text-end text-muted small">IVA incluido</div>
              </div>
            </Card.Body>
          </Card>
          
          <div className="mt-4">
            <Card className="faqs-card">
              <Card.Header>
                <h5 className="mb-0">Preguntas Frecuentes</h5>
              </Card.Header>
              <Card.Body>
                <div className="faq-item mb-3">
                  <h6>¿Cuándo puedo usar mis entradas gratis?</h6>
                  <p className="mb-0">Puedes usar tus 2 entradas gratis en cualquier función regular, de lunes a domingo, excepto estrenos exclusivos.</p>
                </div>
                
                <div className="faq-item mb-3">
                  <h6>¿Puedo cancelar mi suscripción?</h6>
                  <p className="mb-0">Sí, puedes cancelar tu suscripción en cualquier momento desde tu perfil. Seguirás disfrutando de los beneficios hasta el final del período pagado.</p>
                </div>
                
                <div className="faq-item mb-3">
                  <h6>¿Cuándo se renuevan mis entradas gratis?</h6>
                  <p className="mb-0">Las entradas gratis se renuevan el primer día de cada mes calendario.</p>
                </div>
                
                <div className="faq-item">
                  <h6>¿El descuento en Candy aplica a promociones?</h6>
                  <p className="mb-0">Sí, el descuento del 10% es acumulable con otras promociones vigentes.</p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Subscription;