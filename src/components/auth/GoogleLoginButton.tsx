// src/components/auth/GoogleLoginButton.tsx
import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useFirebaseAuth } from '../../auth/FirebaseAuthContext';

interface GoogleLoginButtonProps {
  className?: string;
  onError?: (message: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  className = '', 
  onError 
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { signInWithGoogle } = useFirebaseAuth();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      if (onError) {
        onError(error.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline-danger" 
      className={className}
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          Conectando...
        </>
      ) : (
        <>
          <i className="bi bi-google me-2"></i>
          Continuar con Google
        </>
      )}
    </Button>
  );
};

export default GoogleLoginButton;