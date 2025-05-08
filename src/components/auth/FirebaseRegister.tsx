// src/components/auth/FirebaseRegister.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useFirebaseAuth } from '../../auth/FirebaseAuthContext';

const FirebaseRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithFacebook,
    isAuthenticated, 
    isLoading, 
    error,
    clearError
  } = useFirebaseAuth();
  
  const navigate = useNavigate();
  
  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  // Handle email/password registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Por favor completa todos los campos requeridos.');
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    
    if (!acceptTerms) {
      setLocalError('Debes aceptar los términos y condiciones.');
      return;
    }
    
    // Password strength validation
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    setIsSubmitting(true);
    setLocalError(null);
    
    try {
      await signUpWithEmail(email, password, name);
      // Si el registro es exitoso, redirigir a la página de inicio
      navigate('/');
    } catch (err) {
      // Error handling is done by the context
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle Google registration
  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error handling is done by the context
    }
  };
  
  // Handle Facebook registration
  const handleFacebookRegister = async () => {
    try {
      await signInWithFacebook();
    } catch (err) {
      // Error handling is done by the context
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="text-center bg-primary text-white py-3">
              <h3 className="mb-0">Crear una cuenta</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {localError && <Alert variant="danger">{localError}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="mb-4">
                <Button 
                  variant="outline-danger" 
                  className="w-100 mb-2"
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                >
                  <i className="bi bi-google me-2"></i>
                  Continuar con Google
                </Button>
                
                <Button 
                  variant="outline-primary" 
                  className="w-100 mb-3"
                  onClick={handleFacebookRegister}
                  disabled={isLoading}
                >
                  <i className="bi bi-facebook me-2"></i>
                  Continuar con Facebook
                </Button>
                
                <div className="separator text-center mb-3">
                  <span className="bg-white px-2 text-muted">O</span>
                </div>
              </div>
              
              <Form onSubmit={handleEmailRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting || isLoading}
                    required
                  />
                </Form.Group>
                
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
                
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting || isLoading}
                    required
                  />
                  <Form.Text className="text-muted">
                    La contraseña debe tener al menos 6 caracteres.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting || isLoading}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="accept-terms"
                    label={
                      <span>
                        Acepto los <Link to="/terms">Términos y Condiciones</Link> y la <Link to="/privacy">Política de Privacidad</Link>
                      </span>
                    }
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={isSubmitting || isLoading}
                    required
                  />
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
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  ¿Ya tienes una cuenta?{' '}
                  <Link 
                    to="/login"
                    className="text-decoration-none"
                  >
                    Inicia sesión aquí
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

export default FirebaseRegister;