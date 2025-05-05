// src/auth/AuthProvider.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../common/services/authService';
import config from '../config/config';

// Update your config.ts to include REFRESH_TOKEN_KEY
// const config = {
//   API_URL: import.meta.env.NODE_ENV === 'production' 
//     ? 'https://tu-dominio.com/api' 
//     : 'http://localhost:8080/api',
//   TOKEN_KEY: 'annuar-token',
//   USER_KEY: 'annuar-user',
//   REFRESH_TOKEN_KEY: 'annuar-refresh-token',
// };

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
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem(config.USER_KEY);
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // If JSON parsing fails, clear storage
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        localStorage.removeItem(config.REFRESH_TOKEN_KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });
      
      // Save token and user
      localStorage.setItem(config.TOKEN_KEY, response.token);
      localStorage.setItem(config.USER_KEY, JSON.stringify(response.user));
      
      // Save refresh token if present
      if (response.refreshToken) {
        localStorage.setItem(config.REFRESH_TOKEN_KEY, response.refreshToken);
      }
      
      setUser(response.user);
      
      // Redirect based on role
      if (response.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.user.role === 'STAFF') {
        navigate('/pos');
      } else {
        navigate('/');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Call the logout service
    authService.logout()
      .catch(err => console.error('Logout error:', err))
      .finally(() => {
        // Clear local storage and state
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        localStorage.removeItem(config.REFRESH_TOKEN_KEY);
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

export default AuthProvider;