// src/components/ThemeToggle.tsx
import React, { useEffect } from 'react';
import { useTheme } from '../common/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  // Add animation on initial load
  useEffect(() => {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.classList.add('theme-icon-loaded');
    }
  }, []);

  return (
    <button
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
      title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <div className="theme-icon-container">
        {theme === 'light' ? (
          <i className="bi bi-moon-stars-fill theme-icon"></i>
        ) : (
          <i className="bi bi-sun-fill theme-icon"></i>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;