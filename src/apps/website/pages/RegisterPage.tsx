// src/apps/website/pages/RegisterPage.tsx
import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import UserRegistrationForm from '../../../components/auth/UserRegistrationForm';

const RegisterPage: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Crear cuenta</h4>
            </Card.Header>
            <Card.Body>
              <UserRegistrationForm />
            </Card.Body>
          </Card>
          
          <div className="mt-4">
            <h5>Beneficios de registrarte:</h5>
            <ul className="benefits-list">
              <li>
                <i className="bi bi-clock me-2"></i>
                Compra entradas más rápido
              </li>
              <li>
                <i className="bi bi-calendar-check me-2"></i>
                Accede a tu historial de compras
              </li>
              <li>
                <i className="bi bi-star me-2"></i>
                Recibe ofertas y promociones exclusivas
              </li>
              <li>
                <i className="bi bi-ticket-perforated me-2"></i>
                Acumula puntos en cada compra
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;