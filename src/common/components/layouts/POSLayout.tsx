// src/common/components/layouts/POSLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../../components/ThemeToggle';

const POSLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigate('/');
  };

  return (
    <div className="pos-layout">
      {/* Top Navbar */}
      <Navbar bg="primary" variant="dark" expand={false} fixed="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/pos">
            <i className="bi bi-shop me-2"></i>
            Annuar POS
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <ThemeToggle className="me-3" />
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="pos-content pt-5 mt-3">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <Navbar bg="light" fixed="bottom" className="pos-bottom-nav">
        <Container>
          <Nav className="w-100 justify-content-around">
            <Nav.Link as={Link} to="/pos" className={location.pathname === '/pos' ? 'active' : ''}>
              <i className="bi bi-ticket-perforated"></i>
              <span>Entradas</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/pos/products" className={location.pathname === '/pos/products' ? 'active' : ''}>
              <i className="bi bi-cup-straw"></i>
              <span>Productos</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/pos/checkout" className={location.pathname === '/pos/checkout' ? 'active' : ''}>
              <i className="bi bi-cart3"></i>
              <span>Pago</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default POSLayout;