import React, { useState, useEffect } from 'react';
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

interface NavbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  showBackButton = false,
  onBack
}) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      className={`navbar py-3 ${scrolled ? 'navbar-scrolled' : ''}`}
      fixed="top"
    >
      <Container>
        <div className="d-flex align-items-center">
          {showBackButton && onBack && (
            <button
              className="btn btn-back me-3"
              onClick={onBack}
              aria-label="Volver"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          )}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/src/assets/logo.jpg"
              alt="Annuar Shopping Cine"
              className="logo-img"
            />
            <span>Annuar Shopping Cine</span>
          </Link>
        </div>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <i className="bi bi-house-door me-1"></i> Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/" className={`nav-link ${isActive('/movies') ? 'active' : ''}`}>
              <i className="bi bi-film me-1"></i> Cartelera
            </Nav.Link>
            <Nav.Link as={Link} to="/" className={`nav-link ${isActive('/promos') ? 'active' : ''}`}>
              <i className="bi bi-ticket-perforated me-1"></i> Promociones
            </Nav.Link>
            <Nav.Link as={Link} to="/" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
              <i className="bi bi-envelope me-1"></i> Contacto
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center ms-lg-4">
            <ThemeToggle />
            <button className="btn-user ms-3">
              <i className="bi bi-person-circle"></i>
            </button>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;