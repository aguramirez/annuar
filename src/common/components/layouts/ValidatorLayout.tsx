// src/common/components/layouts/ValidatorLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../../components/ThemeToggle';

const ValidatorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigate('/');
  };

  return (
    <div className="validator-layout">
      {/* Top Navbar */}
      <Navbar bg="primary" variant="dark" expand={false} fixed="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/validator">
            <i className="bi bi-qr-code-scan me-2"></i>
            Annuar Validator
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-light" 
              size="sm"
              as={Link}
              to="/validator/settings"
              className="me-3"
            >
              <i className="bi bi-gear-fill"></i>
            </Button>
            <ThemeToggle className="me-3" />
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Salir
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="validator-content pt-5 mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default ValidatorLayout;