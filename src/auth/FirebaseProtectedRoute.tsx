// src/auth/FirebaseProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFirebaseAuth } from './FirebaseAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const FirebaseProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser, isAuthenticated, isLoading } = useFirebaseAuth();
  const location = useLocation();
  
  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If role check is required
  if (requiredRole && currentUser) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!roles.includes(currentUser.role)) {
      // Redirect based on user role if they don't have required role
      switch (currentUser.role) {
        case 'ADMIN':
          return <Navigate to="/admin" replace />;
        case 'STAFF':
          return <Navigate to="/pos" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }
  
  // If authenticated and has required role, render children
  return <>{children}</>;
};

export default FirebaseProtectedRoute;