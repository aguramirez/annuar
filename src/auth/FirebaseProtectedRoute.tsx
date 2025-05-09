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
  
  // Log para depuración
  console.log('🔒 FirebaseProtectedRoute:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    currentUser,
    requiredRole
  });
  
  // Mientras se carga la autenticación, mostrar un spinner
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated || !currentUser) {
    console.log('🚪 No autenticado, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si requiere un rol específico
  if (requiredRole) {
    // Convertir a array si es un solo string
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Asegurarnos de que la comparación sea case-insensitive
    const userRole = (currentUser.role || '').toUpperCase();
    const normalizedRequiredRoles = requiredRoles.map(role => (role || '').toUpperCase());
    
    console.log('🔑 Verificación de rol:', {
      userRole,
      normalizedRequiredRoles,
      hasRequiredRole: normalizedRequiredRoles.includes(userRole)
    });
    
    // Si el usuario no tiene el rol requerido
    if (!normalizedRequiredRoles.includes(userRole)) {
      console.log('⛔ El usuario no tiene el rol requerido');
      
      // IMPORTANTE: No redirigir al usuario a una ruta donde también necesite el mismo rol
      // Esto evita ciclos de redirección
      return <Navigate to="/" replace />;
    }
  }
  
  // Si pasa todas las verificaciones, mostrar el contenido protegido
  console.log('✅ Acceso concedido a ruta protegida');
  return <>{children}</>;
};

export default FirebaseProtectedRoute;