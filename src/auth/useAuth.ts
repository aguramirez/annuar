// src/auth/useAuth.ts
import { useContext } from 'react';
import { FirebaseAuthContext } from './FirebaseAuthContext';

export const useAuth = () => {
  const context = useContext(FirebaseAuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un FirebaseAuthProvider');
  }
  
  return context;
};

export default useAuth;