// src/apps/website/pages/Profile.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Badge, Button, Alert, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../common/context/ThemeContext';
import './Profile.css'; // Importamos los estilos

// Definimos los tipos para nuestros datos mockeados
interface UserPreferences {
  genres: string[];
  notifications: boolean;
  emailMarketing: boolean;
  smsMarketing: boolean;
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  memberSince: string;
  isPremium: boolean;
  premiumUntil: string;
  premiumTicketsLeft: number;
  premiumTicketsTotal: number;
  points: number;
  preferences: UserPreferences;
}

interface TicketItem {
  type: 'ticket';
  movie: string;
  quantity: number;
  showtime: string;
  seats: string[];
  room: string;
}

interface ProductItem {
  type: 'product';
  name: string;
  quantity: number;
}

type PurchaseItem = TicketItem | ProductItem;

interface Purchase {
  id: string;
  date: string;
  total: number;
  items: PurchaseItem[];
  status: string;
  qrCode: boolean;
}

interface UsedForInfo {
  movie: string;
  date: string;
  showtime: string;
}

interface FreeTicket {
  id: string;
  expires: string;
  used: boolean;
  usedFor?: UsedForInfo;
}

// Mock data for user profile
const mockUser: MockUser = {
  id: 'user123',
  name: 'Alberto Rodríguez',
  email: 'alberto.rodriguez@gmail.com',
  phone: '388-155-123456',
  birthdate: '1985-05-15',
  address: 'Av. San Martín 456, San Salvador de Jujuy',
  memberSince: '2023-03-10',
  isPremium: true,
  premiumUntil: '2025-03-10',
  premiumTicketsLeft: 1,
  premiumTicketsTotal: 2,
  points: 850,
  preferences: {
    genres: ['Acción', 'Ciencia Ficción', 'Thriller'],
    notifications: true,
    emailMarketing: true,
    smsMarketing: false
  }
};

// Mock data for purchase history
const mockPurchases: Purchase[] = [
  {
    id: 'order123',
    date: '2025-05-10',
    total: 2400,
    items: [
      {
        type: 'ticket',
        movie: 'Minecraft',
        quantity: 2,
        showtime: '2025-05-10 15:30',
        seats: ['A5', 'A6'],
        room: 'Sala 1'
      },
      {
        type: 'product',
        name: 'Combo Pareja',
        quantity: 1
      }
    ],
    status: 'completed',
    qrCode: true
  },
  {
    id: 'order456',
    date: '2025-04-25',
    total: 3200,
    items: [
      {
        type: 'ticket',
        movie: 'Thunderbolts',
        quantity: 3,
        showtime: '2025-04-25 19:45',
        seats: ['C10', 'C11', 'C12'],
        room: 'Sala 2'
      },
      {
        type: 'product',
        name: 'Combo Familiar',
        quantity: 1
      }
    ],
    status: 'completed',
    qrCode: true
  },
  {
    id: 'order789',
    date: '2025-04-12',
    total: 1200,
    items: [
      {
        type: 'ticket',
        movie: 'Karate Kid',
        quantity: 2,
        showtime: '2025-04-12 21:00',
        seats: ['F8', 'F9'],
        room: 'Sala 3'
      }
    ],
    status: 'completed',
    qrCode: true
  },
  {
    id: 'order101',
    date: '2025-03-30',
    total: 750,
    items: [
      {
        type: 'product',
        name: 'Popcorn Grande',
        quantity: 1
      },
      {
        type: 'product',
        name: 'Gaseosa Mediana',
        quantity: 2
      }
    ],
    status: 'completed',
    qrCode: false
  }
];

// Mock data for free tickets (for premium users)
const mockFreeTickets: FreeTicket[] = [
  {
    id: 'ticket123',
    expires: '2025-05-31',
    used: false
  },
  {
    id: 'ticket456',
    expires: '2025-05-31',
    used: true,
    usedFor: {
      movie: 'Blanca Nieves',
      date: '2025-05-01',
      showtime: '19:00'
    }
  }
];

const Profile: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [editProfile, setEditProfile] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditProfile(false);
    // In a real app, would save the profile changes
  };

  // Function to show QR code modal
  const handleShowQRCode = (order: Purchase) => {
    setSelectedOrder(order);
    setShowQRModal(true);
  };

  // Calculate points progress
  const pointsToNextLevel = 1000;
  const pointsProgress = (userData.points / pointsToNextLevel) * 100;

  // Utilidad para navegar a una ruta
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={3}>
          {/* Profile sidebar */}
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="avatar-container mb-3">
                <div className="avatar-circle">
                  <span className="avatar-initials">
                    {userData.name.split(' ').map(name => name[0]).join('')}
                  </span>
                </div>
                {userData.isPremium && (
                  <Badge bg="warning" text="dark" className="premium-badge">
                    <i className="bi bi-star-fill me-1"></i>
                    PREMIUM
                  </Badge>
                )}
              </div>
              <h5 className="card-title mb-0">{userData.name}</h5>
              <p className="text-muted small">
                Miembro desde {new Date(userData.memberSince).toLocaleDateString('es-AR')}
              </p>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small">Mis Puntos</span>
                  <span className="small text-primary">{userData.points} / {pointsToNextLevel}</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${pointsProgress}%` }}
                    aria-valuenow={userData.points}
                    aria-valuemin={0}
                    aria-valuemax={pointsToNextLevel}
                  ></div>
                </div>
                <small className="text-muted">
                  {pointsToNextLevel - userData.points} puntos más para tu próximo nivel
                </small>
              </div>

              {!userData.isPremium && (
                <Button
                  variant="warning"
                  className="w-100 mb-2"
                  onClick={() => navigate('/subscription')}
                >
                  <i className="bi bi-star-fill me-2"></i>
                  Hazte Premium
                </Button>
              )}

              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => setEditProfile(true)}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Editar Perfil
              </Button>
            </Card.Body>
          </Card>

          {/* Premium status card */}
          {userData.isPremium && (
            <Card className="mb-4 border-warning">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="bi bi-star-fill me-2"></i>
                  Beneficios Premium
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-2">
                  <strong>Estado:</strong> Activo hasta {new Date(userData.premiumUntil).toLocaleDateString('es-AR')}
                </p>
                <p className="mb-3">
                  <strong>Entradas gratis:</strong> {userData.premiumTicketsLeft} de {userData.premiumTicketsTotal} disponibles este mes
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => navigate('/movies')}
                  >
                    Usar entrada gratis
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate('/subscription')}
                  >
                    Renovar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={9}>
          {/* Tabs for user data */}
          <Card>
            <Card.Header>
              <Nav variant="tabs" className="flex-row">
                <Nav.Item>
                  <Nav.Link eventKey="orders" className="active">Mis Compras</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tickets">Mis Entradas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="profile">Datos Personales</Nav.Link>
                </Nav.Item>
                {userData.isPremium && (
                  <Nav.Item>
                    <Nav.Link eventKey="premium">Premium</Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="orders" active>
                  <h4 className="mb-4">Historial de Compras</h4>

                  {mockPurchases.map((purchase) => (
                    <Card key={purchase.id} className="mb-3 order-card">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="fw-bold">{new Date(purchase.date).toLocaleDateString('es-AR')}</span>
                          <span className="text-muted ms-2">#{purchase.id}</span>
                        </div>
                        <Badge bg="success">Completada</Badge>
                      </Card.Header>

                      <Card.Body>
                        <div className="order-items mb-3">
                          {purchase.items.map((item, index) => (
                            <div key={index} className="order-item mb-2">
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
                                    <span>x{item.quantity}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <div>{item.name}</div>
                                  </div>
                                  <div className="text-end">
                                    <span>x{item.quantity}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-bold">Total: ${purchase.total}</div>
                          <div>
                            {purchase.qrCode && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleShowQRCode(purchase)}
                              >
                                <i className="bi bi-qr-code me-2"></i>
                                Ver QR
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Tab.Pane>

                <Tab.Pane eventKey="tickets">
                  <h4 className="mb-4">Mis Entradas</h4>

                  {userData.isPremium && (
                    <div className="free-tickets-section mb-4">
                      <h5 className="mb-3">
                        <i className="bi bi-ticket-perforated-fill me-2 text-warning"></i>
                        Entradas Gratuitas Premium
                      </h5>

                      <Row xs={1} md={2} className="g-3">
                        {mockFreeTickets.map(ticket => (
                          <Col key={ticket.id}>
                            <Card className={`free-ticket-card ${ticket.used ? 'border-secondary bg-light' : 'border-warning'}`}>
                              <Card.Body>
                                <div className="d-flex justify-content-between">
                                  <h6 className="card-subtitle mb-2">
                                    Entrada Gratuita
                                  </h6>
                                  {ticket.used ? (
                                    <Badge bg="secondary">Usada</Badge>
                                  ) : (
                                    <Badge bg="success">Disponible</Badge>
                                  )}
                                </div>

                                <p className="mb-2 small">
                                  {ticket.used && ticket.usedFor ? (
                                    <span>
                                      Usada para <strong>{ticket.usedFor.movie}</strong>
                                      <br />
                                      {new Date(ticket.usedFor.date).toLocaleDateString('es-AR')} {ticket.usedFor.showtime}
                                    </span>
                                  ) : (
                                    <span>
                                      Válida hasta: <strong>{new Date(ticket.expires).toLocaleDateString('es-AR')}</strong>
                                    </span>
                                  )}
                                </p>

                                {!ticket.used && (
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    className="w-100"
                                    onClick={() => navigate('/movies')}
                                  >
                                    Usar ahora
                                  </Button>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  <h5 className="mb-3">Próximas Funciones</h5>
                  {mockPurchases.slice(0, 2).map((purchase) => (
                    purchase.items
                      .filter((item): item is TicketItem => item.type === 'ticket')
                      .map((item, index) => (
                        <Card key={`${purchase.id}-${index}`} className="mb-3">
                          <Card.Body>
                            <Row>
                              <Col md={3}>
                                <img
                                  src="https://i.pinimg.com/736x/36/96/05/369605adcd515e808b8d950bb1997b8c.jpg"
                                  alt={item.movie}
                                  className="img-fluid rounded"
                                />
                              </Col>
                              <Col md={9}>
                                <h5>{item.movie}</h5>
                                <p className="mb-1">
                                  <strong>Fecha:</strong> {new Date(item.showtime).toLocaleDateString('es-AR')}
                                </p>
                                <p className="mb-1">
                                  <strong>Hora:</strong> {item.showtime.split(' ')[1]}
                                </p>
                                <p className="mb-1">
                                  <strong>Sala:</strong> {item.room} - <strong>Asientos:</strong> {item.seats.join(', ')}
                                </p>
                                <Button variant="outline-secondary" size="sm">
                                  Ver detalles
                                </Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))
                  ))}

                  {mockPurchases.filter(p => p.items.some(item => item.type === 'ticket')).length === 0 && (
                    <Alert variant="info">No tienes entradas compradas actualmente.</Alert>
                  )}
                </Tab.Pane>

                <Tab.Pane eventKey="profile">
                  <h4 className="mb-4">Datos Personales</h4>
                  {editProfile ? (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingresa tu nombre"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Ingresa tu email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Ingresa tu teléfono"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicBirthdate">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                          type="date"
                          value={userData.birthdate}
                          onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingresa tu dirección"
                          value={userData.address}
                          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                        />
                      </Form.Group>

                      <Button variant="primary" type="submit" className="me-2">
                        Guardar Cambios
                      </Button>
                      <Button variant="secondary" onClick={() => setEditProfile(false)}>
                        Cancelar
                      </Button>
                    </Form>
                  ) : (
                    <div>
                      <p><strong>Nombre:</strong> {userData.name}</p>
                      <p><strong>Email:</strong> {userData.email}</p>
                      <p><strong>Teléfono:</strong> {userData.phone}</p>
                      <p><strong>Fecha de Nacimiento:</strong> {new Date(userData.birthdate).toLocaleDateString('es-AR')}</p>
                      <p><strong>Dirección:</strong> {userData.address}</p>
                    </div>
                  )}
                </Tab.Pane>

                {userData.isPremium && (
                  <Tab.Pane eventKey="premium">
                    <h4 className="mb-4">Tu Cuenta Premium</h4>
                    <Alert variant="warning" className="d-flex align-items-center">
                      <i className="bi bi-star-fill me-2"></i>
                      <div>
                        <p className="mb-1">
                          <strong>Estado:</strong> Activo hasta {new Date(userData.premiumUntil).toLocaleDateString('es-AR')}
                        </p>
                        <p className="mb-0">
                          Disfruta de tus beneficios exclusivos. ¡Gracias por ser parte!
                        </p>
                      </div>
                    </Alert>

                    <h5 className="mt-3">Beneficios Actuales:</h5>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i> Entradas gratuitas mensuales</li>
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i> Descuentos especiales en confitería</li>
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i> Acceso anticipado a preventas</li>
                    </ul>

                    <div className="mt-4 d-flex justify-content-between align-items-center">
                      <Button variant="outline-secondary" onClick={() => navigate('/subscription')}>
                        Gestionar Suscripción
                      </Button>
                      <Badge bg="warning" text="dark">PREMIUM</Badge>
                    </div>
                  </Tab.Pane>
                )}
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Código QR de la Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedOrder?.qrCode ? (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=order-${selectedOrder.id}`}
              alt={`QR Code para orden ${selectedOrder.id}`}
              className="img-fluid"
            />
          ) : (
            <Alert variant="warning">El código QR no está disponible para esta compra.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;