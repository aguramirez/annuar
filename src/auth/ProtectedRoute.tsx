// src/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    // Mostrar spinner de carga
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!roles.includes(user.role)) {
      // Redirigir a una página de acceso denegado o al home según el rol
      if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      } else if (user.role === 'STAFF') {
        return <Navigate to="/pos" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }
  
  // Si está autenticado y tiene el rol adecuado, renderizar los children
  return <>{children}</>;
};

export default ProtectedRoute;