import React from 'react';
import { Container, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

interface NavbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  showBackButton = false,
  onBack
}) => {
  return (
    <BootstrapNavbar bg="light" expand="lg" className="mb-4 py-3">
      <Container className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {showBackButton && onBack && (
            <button
              className="btn btn-outline-secondary me-3"
              onClick={onBack}
            >
              <i className="bi bi-arrow-left"></i> Volver
            </button>
          )}
          <Link to="/" className="navbar-brand text-decoration-none">
            <img
              src="/src/assets/logo.jpg"
              alt="Annuar Shopping Cine"
              className="logo-img"
            />
            Home
          </Link>
        </div>
        <ThemeToggle />
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;