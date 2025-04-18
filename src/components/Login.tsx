import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar } from 'react-bootstrap';

interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleSocialLogin = () => {
    // Simulate login
    setIsLoggedIn(true);
    navigate('/payment');
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">
            <img 
              src="/logo.png" 
              alt="Annuar Shopping Cine" 
              className="logo-img" 
            />
            Annuar Shopping Cine
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="login-container py-4">
        <Button 
          variant="outline-secondary" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          &lt; Volver
        </Button>

        <h1 className="page-heading">Inicia Sesión</h1>
        
        <Card className="p-4">
          <Card.Body>
            <p className="text-center mb-4">
              Para continuar con tu compra, inicia sesión con una de las siguientes opciones:
            </p>
            
            <div className="social-login-buttons">
              <Button 
                variant="primary" 
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                onClick={handleSocialLogin}
              >
                <i className="bi bi-facebook me-2"></i> Continuar con Facebook
              </Button>
              
              <Button 
                variant="outline-secondary" 
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                onClick={handleSocialLogin}
              >
                <i className="bi bi-google me-2"></i> Continuar con Google
              </Button>
              
              <Button 
                variant="dark" 
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                onClick={handleSocialLogin}
              >
                <i className="bi bi-apple me-2"></i> Continuar con Apple
              </Button>
              
              <div className="text-center mt-4">
                <p>¿No tienes cuenta? <a href="#" onClick={() => handleSocialLogin()}>Regístrate aquí</a></p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;