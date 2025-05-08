// src/components/shared/Navbar.tsx
import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../auth/FirebaseAuthContext';
import LogoutButton from '../auth/LogoutButton';
import ThemeToggle from '../ThemeToggle';

const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated } = useFirebaseAuth();
  const navigate = useNavigate();

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" sticky="top" className="navbar-main">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-film me-2"></i>
          <span className="fw-bold">Annuar Cine</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="main-navbar" />
        
        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/movies">Cartelera</Nav.Link>
            <Nav.Link as={NavLink} to="/coming-soon">Próximos Estrenos</Nav.Link>
            <Nav.Link as={NavLink} to="/promotions">Promociones</Nav.Link>
          </Nav>
          
          <Nav className="d-flex align-items-center">
            <ThemeToggle className="me-3" />
            
            {isAuthenticated ? (
              <>
                {/* Usuario autenticado */}
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {currentUser?.displayName || 'Mi Cuenta'}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders">Mis Entradas</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as="div" className="p-0">
                    <LogoutButton 
                      variant="link" 
                      className="text-danger w-100 text-start ps-3 py-2" 
                    />
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                {/* Usuario no autenticado */}
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="light" 
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;