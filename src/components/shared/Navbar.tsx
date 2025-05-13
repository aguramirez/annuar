// src/components/shared/Navbar.tsx (Updated version)
import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button, NavDropdown, Badge } from 'react-bootstrap';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

// Mock user data (normally would come from auth context)
const mockUser = {
  isAuthenticated: true,
  name: 'Usuario de Prueba',
  email: 'usuario@ejemplo.com',
  isPremium: false // Toggle this to see Premium badge
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Login function
  const handleLogin = () => {
    navigate('/login');
  };
  
  // Logout function
  const handleLogout = () => {
    // Simulate logout
    navigate('/');
  };
  
  // Register function
  const handleRegister = () => {
    navigate('/register');
  };
  
  return (
    <BootstrapNavbar 
      bg="primary" 
      variant="dark" 
      expand="lg" 
      fixed="top" 
      className={`navbar-main ${scrolled ? 'navbar-scrolled' : ''}`}
    >
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
            {/* New Candy Store Link */}
            <Nav.Link as={NavLink} to="/candy">Candy</Nav.Link>
            <Nav.Link as={NavLink} to="/promotions">Promociones</Nav.Link>
          </Nav>
          
          <Nav className="d-flex align-items-center">
            <ThemeToggle className="me-3" />
            
            {mockUser.isAuthenticated ? (
              <>
                {/* User dropdown when authenticated */}
                <NavDropdown 
                  title={
                    <span className="d-flex align-items-center">
                      <i className="bi bi-person-circle me-1"></i>
                      {mockUser.isPremium && (
                        <Badge bg="warning" text="dark" className="me-1" pill>Premium</Badge>
                      )}
                      Mi Cuenta
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders">Mis Entradas</NavDropdown.Item>
                  
                  {/* Premium Subscription link for non-premium users */}
                  {!mockUser.isPremium && (
                    <NavDropdown.Item as={Link} to="/subscription" className="premium-nav-item">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      Hazte Premium
                    </NavDropdown.Item>
                  )}
                  
                  {/* Demo navigation links to other apps */}
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/admin">Panel de Admin</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/pos">POS</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/validator">Validador</NavDropdown.Item>
                  
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                {/* Login/Register buttons when not authenticated */}
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                  onClick={handleLogin}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="light" 
                  size="sm"
                  onClick={handleRegister}
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