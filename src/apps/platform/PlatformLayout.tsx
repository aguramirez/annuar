// src/apps/platform/components/layouts/PlatformLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

const PlatformLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="platform-layout">
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/platform">
            <i className="bi bi-buildings me-2"></i>
            CinePlatform Admin
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <ThemeToggle className="me-3" />
            <Navbar.Toggle aria-controls="platform-sidebar-nav" />
          </div>
        </Container>
      </Navbar>

      <div className="platform-container d-flex">
        {/* Sidebar */}
        <div className="sidebar d-none d-lg-block">
          <Nav className="flex-column pt-3">
            <Nav.Link as={Link} to="/platform" className={isActive('/platform') && !isActive('/platform/cinemas') ? 'active' : ''}>
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/platform/cinemas" className={isActive('/platform/cinemas') ? 'active' : ''}>
              <i className="bi bi-building me-2"></i>
              Cines
            </Nav.Link>
            <Nav.Link as={Link} to="/platform/users" className={isActive('/platform/users') ? 'active' : ''}>
              <i className="bi bi-people me-2"></i>
              Usuarios
            </Nav.Link>
            <Nav.Link as={Link} to="/platform/settings" className={isActive('/platform/settings') ? 'active' : ''}>
              <i className="bi bi-gear me-2"></i>
              Configuración Global
            </Nav.Link>

            <div className="sidebar-divider my-3"></div>

            <Nav.Link as={Link} to="/" target="_blank">
              <i className="bi bi-box-arrow-up-right me-2"></i>
              Sitio Principal
            </Nav.Link>
          </Nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PlatformLayout;