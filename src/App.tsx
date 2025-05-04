// src/App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import './admin.css';
import './pos.css';
import './validator.css';
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './common/context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;