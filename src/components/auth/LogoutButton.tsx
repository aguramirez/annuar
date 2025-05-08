// src/components/auth/LogoutButton.tsx
import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useFirebaseAuth } from '../../auth/FirebaseAuthContext';

interface LogoutButtonProps {
  variant?: string;
  size?: 'sm' | 'lg' | undefined;
  className?: string;
  iconOnly?: boolean;
  onLogoutSuccess?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'outline-light',
  size,
  className = '',
  iconOnly = false,
  onLogoutSuccess
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useFirebaseAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      {isLoggingOut ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className={iconOnly ? undefined : "me-2"}
        />
      ) : (
        <i className={`bi bi-box-arrow-right${iconOnly ? '' : ' me-2'}`}></i>
      )}
      {!iconOnly && (isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión')}
    </Button>
  );
};

export default LogoutButton;