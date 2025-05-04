// src/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';
import { UserRole } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // Muestra un spinner o pantalla de carga
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Si se requiere un rol específico
  if (requiredRole && user) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    if (!requiredRoles.includes(user.role)) {
      // Si no tiene el rol adecuado, redirige a una página de acceso denegado o al home
      return <Navigate to="/" />;
    }
  }
  
  // Si está autenticado y tiene el rol adecuado, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;