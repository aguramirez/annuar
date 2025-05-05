// src/components/TestIntegration.tsx
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import movieService from '../common/services/movieService';

const TestIntegration: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBackendConnection = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // Intentar obtener películas en cartelera
      const movies = await movieService.getCurrentlyShowing();
      
      setResult(movies);
      setStatus('success');
    } catch (err: any) {
      console.error('Error testing backend connection:', err);
      setError(err.message || 'Error al conectar con el backend');
      setStatus('error');
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Header>
          <h3>Prueba de Integración Backend-Frontend</h3>
        </Card.Header>
        <Card.Body>
          <p>Este componente prueba la conexión con el backend haciendo una solicitud para obtener las películas en cartelera.</p>
          
          <div className="mb-3">
            <Button 
              variant="primary" 
              onClick={testBackendConnection}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Probando conexión...' : 'Probar Conexión'}
            </Button>
          </div>
          
          {status === 'success' && (
            <Alert variant="success">
              <h5>¡Conexión exitosa!</h5>
              <p>Se han recibido {result.length} películas del backend.</p>
              <pre className="mt-3 bg-light p-3 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Alert>
          )}
          
          {status === 'error' && (
            <Alert variant="danger">
              <h5>Error de conexión</h5>
              <p>{error}</p>
              <div className="mt-3">
                <h6>Posibles causas:</h6>
                <ul>
                  <li>El servidor backend no está en ejecución</li>
                  <li>La URL del API no está configurada correctamente</li>
                  <li>Problemas de CORS en el backend</li>
                  <li>Error en los servicios de API</li>
                </ul>
              </div>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestIntegration;