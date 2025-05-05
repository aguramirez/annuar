// src/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../common/services/authService';
import config from '../config/config';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem(config.USER_KEY);
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });
      
      // Guardar token y usuario
      localStorage.setItem(config.TOKEN_KEY, response.token);
      localStorage.setItem(config.USER_KEY, JSON.stringify(response.user));
      
      setUser(response.user);
      
      // Redirigir según el rol
      if (response.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.user.role === 'STAFF') {
        navigate('/pos');
      } else {
        navigate('/');
      }
      
    } catch (err: any) {
      console.error('Error en login:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Llamar al servicio de logout
    authService.logout()
      .catch(err => console.error('Error en logout:', err))
      .finally(() => {
        // Limpiar almacenamiento local y estado
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        setUser(null);
        navigate('/login');
      });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};