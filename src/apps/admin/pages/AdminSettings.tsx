// src/apps/admin/pages/AdminSettings.tsx
import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';

const AdminSettings: React.FC = () => {
  const [cinemaSettings, setCinemaSettings] = useState({
    name: 'Annuar Shopping Cine',
    address: 'Avda. Independencia 135',
    city: 'San Salvador de Jujuy',
    state: 'Jujuy',
    postalCode: '4600',
    phone: '388-123-4567',
    email: 'info@annuarshoppingcine.com',
    website: 'www.annuarshoppingcine.com',
    logo: 'https://via.placeholder.com/150'
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@annuarshoppingcine.com',
    smtpPassword: '********',
    fromEmail: 'noreply@annuarshoppingcine.com',
    fromName: 'Annuar Shopping Cine'
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    mercadoPagoApiKey: '********',
    mercadoPagoAccessToken: '********',
    paymentMethods: ['credit_card', 'debit_card', 'efectivo', 'mercado_pago'],
    currency: 'ARS',
    taxRate: 21
  });
  
  const [ticketSettings, setTicketSettings] = useState({
    ticketPrefix: 'ASC',
    ticketValidity: 30, // minutos
    reservationExpiry: 15, // minutos
    enableQRCode: true,
    showLogo: true,
    footerText: 'Gracias por su visita. Las entradas no son reembolsables.'
  });
  
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  const handleSave = (section: string) => {
    // Simular guardado
    setSaveStatus(`${section} guardado exitosamente.`);
    
    // Limpiar mensaje después de un tiempo
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Configuración del Sistema</h1>
      
      {saveStatus && (
        <Alert variant="success" className="mb-4">
          {saveStatus}
        </Alert>
      )}
      
      <Tabs defaultActiveKey="cinema" className="mb-4">
        <Tab eventKey="cinema" title="Información del Cine">
          <Card>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del Cine</Form.Label>
                      <Form.Control 
                        type="text"
                        value={cinemaSettings.name}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, name: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control 
                        type="text"
                        value={cinemaSettings.address}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, address: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Control 
                        type="text"
                        value={cinemaSettings.city}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, city: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Provincia</Form.Label>
                      <Form.Control 
                        type="text"
                        value={cinemaSettings.state}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, state: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código Postal</Form.Label>
                      <Form.Control 
                        type="text"
                        value={cinemaSettings.postalCode}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, postalCode: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control 
                        type="text"
                        value={cinemaSettings.phone}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, phone: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email"
                        value={cinemaSettings.email}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, email: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sitio Web</Form.Label>
                      <Form.Control 
                        type="text"
                        value={cinemaSettings.website}
                        onChange={(e) => setCinemaSettings({...cinemaSettings, website: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Logo URL</Form.Label>
                  <Form.Control 
                    type="text"
                    value={cinemaSettings.logo}
                    onChange={(e) => setCinemaSettings({...cinemaSettings, logo: e.target.value})}
                  />
                </Form.Group>
                
                {cinemaSettings.logo && (
                  <div className="text-center mb-3">
                    <p>Vista previa del logo:</p>
                    <img 
                      src={cinemaSettings.logo} 
                      alt="Logo del cine" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '150px' }} 
                    />
                  </div>
                )}
                
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={() => handleSave('Información del cine')}>
                    Guardar Cambios
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="email" title="Configuración de Email">
          <Card>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Servidor SMTP</Form.Label>
                      <Form.Control 
                        type="text"
                        value={emailSettings.smtpServer}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Puerto SMTP</Form.Label>
                      <Form.Control 
                        type="text"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Usuario SMTP</Form.Label>
                      <Form.Control 
                        type="text"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña SMTP</Form.Label>
                      <Form.Control 
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email del Remitente</Form.Label>
                      <Form.Control 
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del Remitente</Form.Label>
                      <Form.Control 
                        type="text"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-between">
                  <Button variant="outline-primary">
                    Probar Conexión
                  </Button>
                  <Button variant="primary" onClick={() => handleSave('Configuración de email')}>
                    Guardar Cambios
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="payment" title="Configuración de Pagos">
          <Card>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>API Key de MercadoPago</Form.Label>
                      <Form.Control 
                        type="password"
                        value={paymentSettings.mercadoPagoApiKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoApiKey: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Access Token de MercadoPago</Form.Label>
                      <Form.Control 
                        type="password"
                        value={paymentSettings.mercadoPagoAccessToken}
                        onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoAccessToken: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Métodos de Pago Habilitados</Form.Label>
                  <div>
                    <Form.Check 
                      type="checkbox"
                      id="pay-credit"
                      label="Tarjeta de Crédito"
                      checked={paymentSettings.paymentMethods.includes('credit_card')}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.paymentMethods, 'credit_card']
                          : paymentSettings.paymentMethods.filter(m => m !== 'credit_card');
                        setPaymentSettings({...paymentSettings, paymentMethods: methods});
                      }}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="checkbox"
                      id="pay-debit"
                      label="Tarjeta de Débito"
                      checked={paymentSettings.paymentMethods.includes('debit_card')}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.paymentMethods, 'debit_card']
                          : paymentSettings.paymentMethods.filter(m => m !== 'debit_card');
                        setPaymentSettings({...paymentSettings, paymentMethods: methods});
                      }}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="checkbox"
                      id="pay-cash"
                      label="Efectivo"
                      checked={paymentSettings.paymentMethods.includes('efectivo')}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.paymentMethods, 'efectivo']
                          : paymentSettings.paymentMethods.filter(m => m !== 'efectivo');
                        setPaymentSettings({...paymentSettings, paymentMethods: methods});
                      }}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="checkbox"
                      id="pay-mp"
                      label="MercadoPago"
                      checked={paymentSettings.paymentMethods.includes('mercado_pago')}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.paymentMethods, 'mercado_pago']
                          : paymentSettings.paymentMethods.filter(m => m !== 'mercado_pago');
                        setPaymentSettings({...paymentSettings, paymentMethods: methods});
                      }}
                    />
                  </div>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Moneda</Form.Label>
                      <Form.Select 
                        value={paymentSettings.currency}
                        onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                      >
                        <option value="ARS">Peso Argentino (ARS)</option>
                        <option value="USD">Dólar Estadounidense (USD)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tasa de Impuesto (%)</Form.Label>
                      <Form.Control 
                        type="number"
                        value={paymentSettings.taxRate}
                        onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={() => handleSave('Configuración de pagos')}>
                    Guardar Cambios
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="tickets" title="Configuración de Entradas">
          <Card>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prefijo de Entradas</Form.Label>
                      <Form.Control 
                        type="text"
                        value={ticketSettings.ticketPrefix}
                        onChange={(e) => setTicketSettings({...ticketSettings, ticketPrefix: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Validez de Entradas (minutos)</Form.Label>
                      <Form.Control 
                        type="number"
                        value={ticketSettings.ticketValidity}
                        onChange={(e) => setTicketSettings({...ticketSettings, ticketValidity: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tiempo de Expiración de Reservas (minutos)</Form.Label>
                      <Form.Control 
                        type="number"
                        value={ticketSettings.reservationExpiry}
                        onChange={(e) => setTicketSettings({...ticketSettings, reservationExpiry: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="d-flex align-items-center">
                    <Form.Group className="mb-3 w-100">
                      <Form.Check 
                        type="switch"
                        id="enable-qr"
                        label="Habilitar Código QR"
                        checked={ticketSettings.enableQRCode}
                        onChange={(e) => setTicketSettings({...ticketSettings, enableQRCode: e.target.checked})}
                      />
                      <Form.Check 
                        type="switch"
                        id="show-logo"
                        label="Mostrar Logo en Entradas"
                        checked={ticketSettings.showLogo}
                        onChange={(e) => setTicketSettings({...ticketSettings, showLogo: e.target.checked})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Texto de Pie de Página en Entradas</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    value={ticketSettings.footerText}
                    onChange={(e) => setTicketSettings({...ticketSettings, footerText: e.target.value})}
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={() => handleSave('Configuración de entradas')}>
                    Guardar Cambios
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminSettings;