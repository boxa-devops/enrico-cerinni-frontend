import api from './client';
import { validateApiResponse } from '../utils/api';

export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  // Validate current token (cookies are automatically sent)
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');

      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Token validation API error:', error);
      throw error;
    }
  },

  // Refresh access token (cookies are automatically sent)
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Token refresh API error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  },
}; 