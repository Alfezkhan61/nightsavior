import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, apiRequest } from '../utils/auth';

// Create Theme Context
const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// API base URL - adjust as needed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

// Helper function to get/set guest session ID
const getGuestSessionId = () => {
  return localStorage.getItem('guestSessionId');
};

const setGuestSessionId = (sessionId) => {
  localStorage.setItem('guestSessionId', sessionId);
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Initialize theme state with default 'dark'
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  // Fetch theme preference from backend
  const fetchThemePreference = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated()) {
        // Fetch authenticated user's theme preference
        const response = await apiRequest(`${API_BASE_URL}/theme/preference`);

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTheme(data.data.themePreference);
          }
        } else {
          console.warn('Failed to fetch user theme preference, using default');
        }
      } else {
        // Fetch guest user's theme preference
        const sessionId = getGuestSessionId();
        const response = await fetch(`${API_BASE_URL}/theme/guest-preference`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTheme(data.data.themePreference);
            setGuestSessionId(data.data.sessionId);
          }
        } else {
          console.warn('Failed to fetch guest theme preference, using default');
        }
      }
    } catch (error) {
      console.error('Error fetching theme preference:', error);
      // Fall back to default theme on error
      setTheme('dark');
    } finally {
      setLoading(false);
    }
  };

  // Save theme preference to backend
  const saveThemePreference = async (newTheme) => {
    try {
      if (isAuthenticated()) {
        // Save authenticated user's theme preference
        const response = await apiRequest(`${API_BASE_URL}/theme/preference`, {
          method: 'PUT',
          body: JSON.stringify({ themePreference: newTheme })
        });

        if (!response.ok) {
          console.error('Failed to save user theme preference');
        }
      } else {
        // Save guest user's theme preference
        const sessionId = getGuestSessionId();
        const response = await fetch(`${API_BASE_URL}/theme/guest-preference`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            sessionId,
            themePreference: newTheme 
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setGuestSessionId(data.data.sessionId);
          }
        } else {
          console.error('Failed to save guest theme preference');
        }
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
  }, [theme]);

  // Fetch theme preference on component mount
  useEffect(() => {
    fetchThemePreference();
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await saveThemePreference(newTheme);
  };

  // Refresh theme preference (useful after login/logout)
  const refreshTheme = () => {
    fetchThemePreference();
  };

  const value = {
    theme,
    toggleTheme,
    refreshTheme,
    loading,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
