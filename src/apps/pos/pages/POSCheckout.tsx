// src/apps/pos/pages/POSCheckout.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Item types for type checking
interface TicketItem {
  type: 'ticket';
  name: string;
  details: {
    date: string;
    time: string;
    room: string;
    seats: string[];
    ticketTypes: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  total: number;
}

interface CandyItem {
  type: 'candy';
  name: string;
  quantity: number;
  price: number;
  total: number;
}

type OrderItem = TicketItem | CandyItem;

// Type guard to check if item is a ticket item
function isTicketItem(item: OrderItem): item is TicketItem {
  return item.type === 'ticket';
}

// Type guard to check if item is a candy item
function isCandyItem(item: OrderItem): item is CandyItem {
  return item.type === 'candy';
}

// Mock order data (in a real app, this would come from a context or state management)
const mockOrder = {
  id: 'ORD-4582',
  date: new Date(),
  items: [
    {
      type: 'ticket' as const,
      name: 'Minecraft',
      details: {
        date: '2025-05-13',
        time: '14:30',
        room: 'Sala 1',
        seats: ['A12', 'A13', 'A14'],
        ticketTypes: [
          { name: 'Adulto', quantity: 2, price: 1000 },
          { name: 'Niño', quantity: 1, price: 700 }
        ]
      },
      total: 2700
    },
    {
      type: 'candy' as const,
      name: 'Combo Familiar',
      quantity: 1,
      price: 2000,
      total: 2000
    },
    {
      type: 'candy' as const,
      name: 'Gaseosa Grande',
      quantity: 1,
      price: 400,
      total: 400
    }
  ],
  paymentMethod: 'cash',
  totalAmount: 5100,
  customer: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '123-456-7890'
  }
};

// QR code mock URL (in a real app, this would be generated)
const mockQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ORD-4582';

const POSCheckout: React.FC = () => {
  const navigate = useNavigate();
  
  // Removed unused state variables
  const [isPrinting, setIsPrinting] = useState(false);
  const [showPrintSuccess, setShowPrintSuccess] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState(mockOrder.customer.email || '');
  
  // Handle print tickets
  const handlePrintTickets = () => {
    setIsPrinting(true);
    
    // Simulate printing process
    setTimeout(() => {
      setIsPrinting(false);
      setShowPrintSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowPrintSuccess(false);
      }, 3000);
    }, 2000);
  };
  
  // Handle email tickets
  const handleEmailTickets = () => {
    // Simulate sending email
    setShowEmailSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowEmailSuccess(false);
    }, 3000);
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleString('es-AR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle new sale button
  const handleNewSale = () => {
    navigate('/pos');
  };
  
  // Check if we have ticket items
  const hasTickets = mockOrder.items.some(item => item.type === 'ticket');
  
  // Check if we have candy items
  const hasCandy = mockOrder.items.some(item => item.type === 'candy');
  
  return (
    <Container className="py-4">
      {/* Success alerts */}
      {showPrintSuccess && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-toast"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-printer-fill fs-4 me-2"></i>
            <div>¡Tickets impresos correctamente!</div>
          </div>
        </Alert>
      )}
      
      {showEmailSuccess && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-toast"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-envelope-fill fs-4 me-2"></i>
            <div>¡Se han enviado los tickets al correo electrónico!</div>
          </div>
        </Alert>
      )}
      
      <h2 className="mb-4">Resumen de la Venta</h2>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Detalles de la Orden #{mockOrder.id}</h5>
                <Badge bg="success">Completada</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <p><strong>Fecha:</strong> {formatDate(mockOrder.date)}</p>
                <p><strong>Cliente:</strong> {mockOrder.customer.name || 'Cliente ocasional'}</p>
                <p><strong>Email:</strong> {mockOrder.customer.email || 'No especificado'}</p>
                <p><strong>Teléfono:</strong> {mockOrder.customer.phone || 'No especificado'}</p>
                <p>
                  <strong>Método de Pago:</strong> {' '}
                  {mockOrder.paymentMethod === 'cash' ? 'Efectivo' : 
                   mockOrder.paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 
                   'MercadoPago'}
                </p>
              </div>
              
              <h6 className="mb-3">Artículos</h6>
              
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="fw-bold">{item.name}</div>
                          {isTicketItem(item) && (
                            <div className="small text-muted">
                              {new Date(item.details.date).toLocaleDateString()} | {item.details.time} | {item.details.room}
                              <div>Asientos: {item.details.seats.join(', ')}</div>
                              <div>
                                {item.details.ticketTypes.map((ticket, i) => (
                                  <span key={i}>
                                    {ticket.quantity}x {ticket.name}
                                    {i < item.details.ticketTypes.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {isCandyItem(item) && (
                            <div className="small text-muted">
                              Producto de candy
                            </div>
                          )}
                        </td>
                        <td className="text-center">
                          {isCandyItem(item) ? item.quantity : 
                           isTicketItem(item) ? item.details.ticketTypes.reduce((sum, t) => sum + t.quantity, 0) : 0}
                        </td>
                        <td className="text-end">
                          {isCandyItem(item) ? `${item.price}` : 'Varios'}
                        </td>
                        <td className="text-end">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={3} className="text-end">Total:</th>
                      <th className="text-end">${mockOrder.totalAmount}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {hasTickets && (
                <div className="mt-4">
                  <h6>Código QR para Entradas</h6>
                  <div className="d-flex justify-content-center my-3">
                    <div className="p-3 border rounded">
                      <img src={mockQrUrl} alt="QR Code" className="img-fluid" style={{ maxWidth: '200px' }} />
                    </div>
                  </div>
                  <p className="text-center text-muted">
                    Este código QR permite el acceso a la sala y la recogida de productos en candy.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Acciones</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                {hasTickets && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePrintTickets}
                    disabled={isPrinting}
                  >
                    {isPrinting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Imprimiendo...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-printer-fill me-2"></i>
                        Imprimir Entradas
                      </>
                    )}
                  </Button>
                )}
                
                {hasCandy && (
                  <Button
                    variant="info"
                    size="lg"
                    onClick={handlePrintTickets}
                    disabled={isPrinting}
                  >
                    {isPrinting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Imprimiendo...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-receipt me-2"></i>
                        Imprimir Recibo Candy
                      </>
                    )}
                  </Button>
                )}
                
                <Button variant="success" size="lg" onClick={handleNewSale}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Nueva Venta
                </Button>
                
                <hr className="my-3" />
                
                <Form.Group className="mb-3">
                  <Form.Label>Enviar tickets por correo electrónico</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="email"
                      placeholder="Email del cliente"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="me-2"
                    />
                    <Button 
                      variant="outline-primary"
                      onClick={handleEmailTickets}
                      disabled={!emailInput}
                    >
                      <i className="bi bi-envelope"></i>
                    </Button>
                  </div>
                </Form.Group>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Pago Recibido</h5>
            </Card.Header>
            <Card.Body>
              <div className="payment-details">
                <div className="bg-light p-3 rounded mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="text-muted">Método:</div>
                    <div className="fw-bold">
                      {mockOrder.paymentMethod === 'cash' ? (
                        <><i className="bi bi-cash me-2"></i>Efectivo</>
                      ) : mockOrder.paymentMethod === 'card' ? (
                        <><i className="bi bi-credit-card me-2"></i>Tarjeta</>
                      ) : (
                        <><i className="bi bi-wallet2 me-2"></i>MercadoPago</>
                      )}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">Total:</div>
                    <div className="fw-bold fs-5">${mockOrder.totalAmount}</div>
                  </div>
                </div>
                
                <div className="bg-success text-white p-3 rounded text-center">
                  <i className="bi bi-check-circle-fill me-2 fs-4"></i>
                  <span className="fs-5">Pago completado</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default POSCheckout;