import api from './client';
import { validateApiResponse } from '../utils/api';

export const sizesAPI = {
  // Get all sizes
  getSizes: async () => {
    try {
      const response = await api.get('/sizes/');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get sizes API error:', error);
      throw error;
    }
  },

  // Create new size
  createSize: async (sizeData) => {
    try {
      const response = await api.post('/sizes/', sizeData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create size API error:', error);
      throw error;
    }
  },

  // Get single size by ID
  getSize: async (sizeId) => {
    try {
      const response = await api.get(`/sizes/${sizeId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get size API error:', error);
      throw error;
    }
  },

  // Update size
  updateSize: async (sizeId, sizeData) => {
    try {
      const response = await api.put(`/sizes/${sizeId}`, sizeData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update size API error:', error);
      throw error;
    }
  },

  // Delete size
  deleteSize: async (sizeId) => {
    try {
      const response = await api.delete(`/sizes/${sizeId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete size API error:', error);
      throw error;
    }
  },
};