// src/common/components/layouts/POSLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../../../components/ThemeToggle';
import LogoutButton from '../../../components/auth/LogoutButton';
import { useFirebaseAuth } from '../../../auth/FirebaseAuthContext';

const POSLayout: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useFirebaseAuth();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
            {/* Dropdown del usuario */}
            <Dropdown align="end" className="me-3">
              <Dropdown.Toggle variant="outline-light" id="pos-user-dropdown">
                <i className="bi bi-person-circle me-1"></i>
                {currentUser?.displayName || 'Operador'}
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/pos/settings/profile">Mi Perfil</Dropdown.Item>
                <Dropdown.Item as={Link} to="/pos/settings">Configuración</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as="div" className="p-0">
                  <LogoutButton 
                    variant="link" 
                    className="text-danger w-100 text-start ps-3 py-2" 
                  />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <ThemeToggle className="me-3" />
            
            <LogoutButton variant="outline-light" size="sm" />
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
            <Nav.Link as={Link} to="/pos" className={isActive('/pos') && !isActive('/pos/products') && !isActive('/pos/checkout') ? 'active' : ''}>
              <i className="bi bi-ticket-perforated"></i>
              <span>Entradas</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/pos/products" className={isActive('/pos/products') ? 'active' : ''}>
              <i className="bi bi-cup-straw"></i>
              <span>Productos</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/pos/checkout" className={isActive('/pos/checkout') ? 'active' : ''}>
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