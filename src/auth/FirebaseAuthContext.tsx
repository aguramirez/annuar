// src/auth/FirebaseAuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

// Tipos
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
}

interface FirebaseAuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

// Hook personalizado
export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth debe usarse dentro de un FirebaseAuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const FirebaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configurar providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // Para debugging - guardar el estado en sessionStorage para ver si persiste
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('DEBUG_currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('DEBUG_currentUser');
    }
  }, [currentUser]);

  // Observador del estado de autenticación
  useEffect(() => {
    console.log('Configurando observador de autenticación');
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 Firebase Auth State Changed:', { firebaseUser });

      if (firebaseUser) {
        try {
          // Obtener token para validación con backend
          const idToken = await firebaseUser.getIdToken();

          // Simulamos la respuesta del backend si estamos en desarrollo
          // Esto es temporal para evitar problemas si el backend no funciona

          let userRole = 'CUSTOMER'; // Rol por defecto
          try {
            // Verificar/crear usuario en el backend
            const response = await axios.post('/api/auth/firebase-auth', {
              firebaseToken: idToken
            });

            console.log('Backend auth response:', response.data);

            // Obtener información de usuario del backend, incluyendo rol
            const userFromBackend = response.data.user;
            console.log('User data from backend:', JSON.stringify(userFromBackend, null, 2));

            // Verificar diferentes formatos de rol
            if (userFromBackend.role) {
              userRole = userFromBackend.role;
            } else if (userFromBackend.roles && Array.isArray(userFromBackend.roles)) {
              // Si es un array de roles
              const roles = userFromBackend.roles;
              if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
                userRole = 'ADMIN';
              } else if (roles.includes('STAFF') || roles.includes('ROLE_STAFF')) {
                userRole = 'STAFF';
              }
            } else if (userFromBackend.authorities && Array.isArray(userFromBackend.authorities)) {
              // Formato común en Spring Security
              const authorities = userFromBackend.authorities;
              const adminAuthority = authorities.find((auth: any) =>
                auth.authority === 'ADMIN' ||
                auth.authority === 'ROLE_ADMIN' ||
                auth === 'ADMIN' ||
                auth === 'ROLE_ADMIN'
              );
              if (adminAuthority) userRole = 'ADMIN';
            }

            console.log('Rol determinado:', userRole);
          } catch (backendError) {
            console.error('Error con el backend:', backendError);
          }

          console.log('👤 Setting authenticated user with role:', userRole);

          // Crear usuario combinando datos de Firebase y backend
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: userRole
          };

          setCurrentUser(user);
        } catch (err) {
          console.error('Error procesando usuario autenticado:', err);
          setCurrentUser(null);
        }
      } else {
        console.log('🚫 No authenticated user');
        setCurrentUser(null);
      }

      setIsLoading(false);
    });

    // Limpiar el observador cuando el componente se desmonte
    return () => {
      console.log('Limpiando observador de autenticación');
      unsubscribe();
    };
  }, []);

  // Iniciar sesión con email y contraseña
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleAuthError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      handleAuthError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar sesión con Facebook
  const signInWithFacebook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, facebookProvider);
    } catch (err) {
      handleAuthError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar usuario con email y contraseña
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar perfil con el nombre proporcionado
      await updateProfile(user, { displayName: name });

    } catch (err) {
      handleAuthError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  // Recuperar contraseña
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleAuthError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const updateData: {
        displayName: string;
        photoURL?: string;
      } = { displayName };

      if (photoURL) {
        updateData.photoURL = photoURL;
      }

      await updateProfile(auth.currentUser, updateData);

      // Actualizar el estado local de usuario
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          displayName,
          photoURL: photoURL || currentUser.photoURL
        });
      }
    } catch (err) {
      handleAuthError(err as AuthError);
    }
  };

  // Cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Primero, notificar al backend
      try {
        await axios.post('/api/auth/logout');
      } catch (err) {
        // Si hay un error en la comunicación con el backend, continuamos con el logout local
        console.warn('No se pudo notificar al backend del logout:', err);
      }

      // Cerrar sesión en Firebase
      await signOut(auth);

      // Limpiar estado local
      setCurrentUser(null);

      // No retornamos nada (void)
    } catch (err) {
      console.error('Error en logout:', err);
      setError('Error al cerrar sesión. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => {
    setError(null);
  };

  // Manejar errores de autenticación
  const handleAuthError = (error: AuthError) => {
    console.error('Error de autenticación:', error);

    // Mapear códigos de error a mensajes amigables
    switch (error.code) {
      case 'auth/invalid-email':
        setError('El correo electrónico no es válido.');
        break;
      case 'auth/user-disabled':
        setError('Esta cuenta ha sido deshabilitada.');
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        setError('Email o contraseña incorrectos.');
        break;
      case 'auth/email-already-in-use':
        setError('Este email ya está registrado.');
        break;
      case 'auth/weak-password':
        setError('La contraseña es demasiado débil.');
        break;
      case 'auth/operation-not-allowed':
        setError('Operación no permitida.');
        break;
      case 'auth/account-exists-with-different-credential':
        setError('Ya existe una cuenta con este email pero con diferente proveedor.');
        break;
      case 'auth/popup-closed-by-user':
        setError('Proceso cancelado. Ventana cerrada antes de completar la autenticación.');
        break;
      default:
        setError(`Error: ${error.message}`);
    }
  };

  // Valor del contexto
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    signInWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signUpWithEmail,
    resetPassword,
    updateUserProfile,
    logout,
    clearError
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export default FirebaseAuthProvider;