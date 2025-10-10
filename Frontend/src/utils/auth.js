// Authentication utilities for managing tokens and auth state

// Token storage keys
const AUTH_TOKEN_KEY = 'nightsavior-auth-token';
const USER_DATA_KEY = 'nightsavior-user-data';

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Get user data from localStorage
export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Set user data in localStorage
export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } else {
    localStorage.removeItem(USER_DATA_KEY);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const userData = getUserData();
  return !!(token && userData);
};

// Get current user's role
export const getUserRole = () => {
  const userData = getUserData();
  return userData?.role || null;
};

// Check if current user has a specific role
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

// Clear all authentication data
export const clearAuthData = () => {
  removeAuthToken();
  setUserData(null);
};

// API request helper with auth headers
export const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(url, config);
};
