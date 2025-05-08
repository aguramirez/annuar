// src/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Constants
const TOKEN_KEY = 'annuar-token';
const USER_KEY = 'annuar-user';
const API_URL = 'http://localhost:8080/api'; // Ajusta esto a tu URL de backend

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Setup axios defaults
  axios.defaults.baseURL = API_URL;
  
  // Add token to requests if available
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        // Invalid stored user, clear localStorage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Update state
      setUser(user);
      
      // Redirect based on role
      redirectBasedOnRole(user);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión. Por favor intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google function
  const loginWithGoogle = async (googleToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/google', { token: googleToken });
      
      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Update state
      setUser(user);
      
      // Redirect based on role
      redirectBasedOnRole(user);
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión con Google. Por favor intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to redirect based on user role
  const redirectBasedOnRole = (user: User) => {
    if (user.role === 'ADMIN') {
      navigate('/admin');
    } else if (user.role === 'STAFF') {
      navigate('/pos');
    } else {
      navigate('/');
    }
  };

  // Logout function
  const logout = () => {
    // Call logout endpoint (optional)
    axios.post('/auth/logout')
      .catch(err => console.error('Logout API error:', err))
      .finally(() => {
        // Clear localStorage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        
        // Update state
        setUser(null);
        
        // Redirect to login
        navigate('/login');
      });
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Create context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;