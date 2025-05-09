// src/apps/website/pages/DebugAuth.tsx
import React from 'react';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import { useFirebaseAuth } from '../../../auth/FirebaseAuthContext';
import { useNavigate } from 'react-router-dom';

const DebugAuth: React.FC = () => {
  const { currentUser, isAuthenticated, isLoading, logout } = useFirebaseAuth();
  const navigate = useNavigate();

  return (
    <Container className="py-4">
      <h1>Debug Autenticación</h1>
      <Card>
        <Card.Body>
          <h5>Estado de autenticación:</h5>
          <p><strong>isLoading:</strong> {isLoading ? 'Sí' : 'No'}</p>
          <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'Sí' : 'No'}</p>
          
          {currentUser ? (
            <>
              <h5>Información de Usuario:</h5>
              <p><strong>UID:</strong> {currentUser.uid}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Nombre:</strong> {currentUser.displayName}</p>
              {/* Este es el error, no podemos poner un Alert dentro de un <p> */}
              <div><strong>Rol:</strong> <Alert variant="info" className="d-inline-block py-1 px-2">{currentUser.role}</Alert></div>
              
              <div className="mt-3">
                <Button variant="primary" className="me-2" onClick={() => navigate('/admin')}>
                  Ir a Admin
                </Button>
                <Button variant="secondary" onClick={() => logout()}>
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <Alert variant="warning">No hay usuario autenticado</Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DebugAuth;