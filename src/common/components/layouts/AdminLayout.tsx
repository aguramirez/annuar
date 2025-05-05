// src/common/components/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../../../components/ThemeToggle';

const AdminLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closeSidebar = () => setShowSidebar(false);

  return (
    <div className="admin-layout">
      {/* Top Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/admin">
            <i className="bi bi-film me-2"></i>
            Annuar Admin
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <ThemeToggle className="me-3" />
            <Navbar.Toggle
              aria-controls="sidebar-nav"
              onClick={() => setShowSidebar(true)}
            />
          </div>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <div className="admin-container d-flex">
        <div className="sidebar d-none d-lg-block">
          <Nav className="flex-column pt-3">
            <Nav.Link as={Link} to="/admin" className={isActive('/admin') && !isActive('/admin/reports') && !isActive('/admin/settings') ? 'active' : ''}>
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/movies" className={isActive('/admin/movies') ? 'active' : ''}>
              <i className="bi bi-film me-2"></i>
              Películas
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/shows" className={isActive('/admin/shows') ? 'active' : ''}>
              <i className="bi bi-calendar-event me-2"></i>
              Funciones
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className={isActive('/admin/products') ? 'active' : ''}>
              <i className="bi bi-box-seam me-2"></i>
              Productos
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
              <i className="bi bi-people me-2"></i>
              Usuarios
            </Nav.Link>

            <div className="sidebar-divider my-3"></div>

            <Nav.Link as={Link} to="/admin/reports/sales" className={isActive('/admin/reports') ? 'active' : ''}>
              <i className="bi bi-graph-up me-2"></i>
              Reportes
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/settings" className={isActive('/admin/settings') ? 'active' : ''}>
              <i className="bi bi-gear me-2"></i>
              Configuración
            </Nav.Link>

            <div className="sidebar-divider my-3"></div>

            <Nav.Link as={Link} to="/" target="_blank">
              <i className="bi bi-box-arrow-up-right me-2"></i>
              Ver Sitio Web
            </Nav.Link>
          </Nav>
        </div>

        {/* Mobile Sidebar */}
        <Offcanvas show={showSidebar} onHide={closeSidebar} responsive="lg" id="sidebar-nav">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <i className="bi bi-film me-2"></i>
              Annuar Admin
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/admin" onClick={closeSidebar} className={isActive('/admin') && !isActive('/admin/reports') && !isActive('/admin/settings') ? 'active' : ''}>
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/movies" onClick={closeSidebar} className={isActive('/admin/movies') ? 'active' : ''}>
                <i className="bi bi-film me-2"></i>
                Películas
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/shows" onClick={closeSidebar} className={isActive('/admin/shows') ? 'active' : ''}>
                <i className="bi bi-calendar-event me-2"></i>
                Funciones
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/products" onClick={closeSidebar} className={isActive('/admin/products') ? 'active' : ''}>
                <i className="bi bi-box-seam me-2"></i>
                Productos
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/users" onClick={closeSidebar} className={isActive('/admin/users') ? 'active' : ''}>
                <i className="bi bi-people me-2"></i>
                Usuarios
              </Nav.Link>

              <div className="sidebar-divider my-3"></div>

              <Nav.Link as={Link} to="/admin/reports/sales" onClick={closeSidebar} className={isActive('/admin/reports') ? 'active' : ''}>
                <i className="bi bi-graph-up me-2"></i>
                Reportes
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/settings" onClick={closeSidebar} className={isActive('/admin/settings') ? 'active' : ''}>
                <i className="bi bi-gear me-2"></i>
                Configuración
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;