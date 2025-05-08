// src/components/auth/FirebaseLogin.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useFirebaseAuth } from '../../auth/FirebaseAuthContext';

const FirebaseLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { 
    signInWithEmail, 
    signInWithGoogle, 
    signInWithFacebook,
    isAuthenticated, 
    isLoading, 
    error,
    clearError
  } = useFirebaseAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the "from" path from location state, or default to home
  const from = (location.state as any)?.from?.pathname || '/';
  
  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setLocalError('Por favor ingresa tu email y contraseña');
      return;
    }
    
    setIsSubmitting(true);
    setLocalError(null);
    
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      // Error handling is done by the context
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error handling is done by the context
    }
  };
  
  // Handle Facebook login
  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (err) {
      // Error handling is done by the context
    }
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
              {localError && <Alert variant="danger">{localError}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="mb-4">
                <Button 
                  variant="outline-danger" 
                  className="w-100 mb-2"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <i className="bi bi-google me-2"></i>
                  Continuar con Google
                </Button>
                
                <Button 
                  variant="outline-primary" 
                  className="w-100 mb-3"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                >
                  <i className="bi bi-facebook me-2"></i>
                  Continuar con Facebook
                </Button>
                
                <div className="separator text-center mb-3">
                  <span className="bg-white px-2 text-muted">O</span>
                </div>
              </div>
              
              <Form onSubmit={handleEmailLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || isLoading}
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
                    disabled={isSubmitting || isLoading}
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

export default FirebaseLogin;