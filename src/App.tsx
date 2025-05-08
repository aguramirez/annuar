// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './common/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import FirebaseAuthProvider from './auth/FirebaseAuthContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <FirebaseAuthProvider>
            <AppRoutes />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </FirebaseAuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;