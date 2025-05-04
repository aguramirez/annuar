import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form } from 'react-bootstrap';
import Navbar from '../../../common/components/Navbar';

interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSocialLogin = (provider: string) => {
    // Simulate login - in real app this would authenticate with provider
    setIsLoggedIn(true);
    navigate('/payment');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app this would validate credentials
    setIsLoggedIn(true);
    navigate('/payment');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="login-page fade-in">
      <Navbar />

      <Container className="py-5">
        <div className="login-container">
          <h1 className="page-heading">Inicia Sesión</h1>
          
          <Card className="login-card mb-4">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <p className="lead">Para continuar con tu compra, inicia sesión con tu cuenta</p>
              </div>
              
              <div className="social-login-container mb-4">
                <Button 
                  variant="primary" 
                  className="social-login-btn facebook-btn w-100 mb-3"
                  onClick={() => handleSocialLogin('facebook')}
                >
                  <i className="bi bi-facebook me-2"></i> Continuar con Facebook
                </Button>
                
                <Button 
                  variant="light" 
                  className="social-login-btn google-btn w-100 mb-3"
                  onClick={() => handleSocialLogin('google')}
                >
                  <i className="bi bi-google me-2"></i> Continuar con Google
                </Button>
                
                <Button 
                  variant="dark" 
                  className="social-login-btn apple-btn w-100"
                  onClick={() => handleSocialLogin('apple')}
                >
                  <i className="bi bi-apple me-2"></i> Continuar con Apple
                </Button>
              </div>
              
              <div className="divider">
                <span>o</span>
              </div>
              
              <Form onSubmit={handleEmailLogin} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com" 
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Tu contraseña"
                    className="form-control-lg"
                    required
                  />
                  <div className="d-flex justify-content-end mt-2">
                    <a href="#" className="forgot-password-link">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg"
                  className="w-100 login-btn"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar sesión
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="register-card">
            <Card.Body className="p-4 text-center">
              <p className="mb-3">¿No tienes una cuenta?</p>
              <Button 
                variant="outline-primary" 
                className="register-btn"
                onClick={() => handleSocialLogin('register')}
              >
                <i className="bi bi-person-plus me-2"></i>
                Crear cuenta nueva
              </Button>
            </Card.Body>
          </Card>
          
          <div className="guest-checkout mt-4 text-center">
            <Button 
              variant="link" 
              className="guest-btn"
              onClick={() => handleSocialLogin('guest')}
            >
              Continuar como invitado
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;