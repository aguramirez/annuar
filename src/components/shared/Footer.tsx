// src/components/shared/Footer.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer py-5 mt-auto">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading mb-4">Annuar Shopping Cine</h5>
            <p className="footer-text mb-3">
              La mejor experiencia cinematográfica de Jujuy, con la última tecnología y el mayor confort.
            </p>
            <div className="footer-contact">
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                Avda. Independencia 135, San Salvador de Jujuy
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                388-123-4567
              </p>
              <p className="mb-0">
                <i className="bi bi-envelope me-2"></i>
                info@annuarshoppingcine.com
              </p>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading mb-4">Enlaces</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2">
                <Link to="/" className="footer-link">
                  <i className="bi bi-chevron-right me-2"></i>
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cartelera" className="footer-link">
                  <i className="bi bi-chevron-right me-2"></i>
                  Cartelera
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/promociones" className="footer-link">
                  <i className="bi bi-chevron-right me-2"></i>
                  Promociones
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/sobre-nosotros" className="footer-link">
                  <i className="bi bi-chevron-right me-2"></i>
                  Sobre Nosotros
                </Link>
              </li>
              <li className="mb-0">
                <Link to="/contacto" className="footer-link">
                  <i className="bi bi-chevron-right me-2"></i>
                  Contacto
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading mb-4">Horarios</h5>
            <ul className="footer-hours list-unstyled">
              <li className="d-flex justify-content-between mb-2">
                <span>Lunes - Jueves:</span>
                <span>13:00 - 00:00</span>
              </li>
              <li className="d-flex justify-content-between mb-2">
                <span>Viernes:</span>
                <span>13:00 - 01:00</span>
              </li>
              <li className="d-flex justify-content-between mb-2">
                <span>Sábado:</span>
                <span>11:00 - 01:00</span>
              </li>
              <li className="d-flex justify-content-between mb-0">
                <span>Domingo:</span>
                <span>11:00 - 00:00</span>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6}>
            <h5 className="footer-heading mb-4">Síguenos</h5>
            <div className="footer-social mb-4">
              <a href="#" className="social-link me-3" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-link me-3" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-link me-3" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="social-link" aria-label="WhatsApp">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
            
            <h5 className="footer-heading mb-3">Suscríbete</h5>
            <p className="footer-text mb-3">
              Recibe nuestras novedades y promociones.
            </p>
            <form className="footer-subscribe">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Tu email"
                  aria-label="Dirección de email"
                />
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </form>
          </Col>
        </Row>
        
        <hr className="footer-divider my-4" />
        
        <div className="footer-bottom text-center">
          <p className="mb-0">
            &copy; {currentYear} Annuar Shopping Cine. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;