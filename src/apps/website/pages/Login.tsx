// src/apps/website/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useFirebaseAuth } from '../../../auth/FirebaseAuthContext';
import GoogleLoginButton from '../../../components/auth/GoogleLoginButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { signInWithEmail, error, isAuthenticated, isLoading } = useFirebaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the "from" path from location state, or default to home
  const from = (location.state as any)?.from?.pathname || '/';
  
  // If already authenticated, redirect to the original destination
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!email || !password) {
      setErrorMessage('Por favor ingresa tu email y contraseña');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Use the login function from FirebaseAuthContext
      await signInWithEmail(email, password);
    } catch (error) {
      // Error handling is done in the FirebaseAuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLoginError = (message: string) => {
    setErrorMessage(message);
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Header className="text-center bg-primary text-white py-3">
              <h3 className="mb-0">Iniciar Sesión</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="mb-4">
                <GoogleLoginButton 
                  className="w-100 mb-3"
                  onError={handleGoogleLoginError}
                />
                
                <div className="separator text-center mb-3">
                  <span className="bg-white px-2 text-muted">O</span>
                </div>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <div className="d-flex justify-content-end mt-1">
                    <Link 
                      to="/reset-password"
                      className="text-decoration-none"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </Form.Group>
                
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2"
                  disabled={isSubmitting || isLoading}
                >
                  {(isSubmitting || isLoading) ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  ¿No tienes una cuenta?{' '}
                  <Link 
                    to="/register"
                    className="text-decoration-none"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;