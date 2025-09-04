import api from './client';
import { validateApiResponse } from '../utils/api';

export const colorsAPI = {
  // Get all colors
  getColors: async () => {
    try {
      const response = await api.get('/colors/');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get colors API error:', error);
      throw error;
    }
  },

  // Create new color
  createColor: async (colorData) => {
    try {
      const response = await api.post('/colors/', colorData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create color API error:', error);
      throw error;
    }
  },

  // Get single color by ID
  getColor: async (colorId) => {
    try {
      const response = await api.get(`/colors/${colorId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get color API error:', error);
      throw error;
    }
  },

  // Update color
  updateColor: async (colorId, colorData) => {
    try {
      const response = await api.put(`/colors/${colorId}`, colorData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update color API error:', error);
      throw error;
    }
  },

  // Delete color
  deleteColor: async (colorId) => {
    try {
      const response = await api.delete(`/colors/${colorId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete color API error:', error);
      throw error;
    }
  },
}; 