import api from './client';
import { validateApiResponse } from '../utils/api';

export const brandsAPI = {
  // Get all brands
  getBrands: async () => {
    try {
      const response = await api.get('/brands');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get brands API error:', error);
      throw error;
    }
  },

  // Create new brand
  createBrand: async (brandData) => {
    try {
      const response = await api.post('/brands', brandData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create brand API error:', error);
      throw error;
    }
  },

  // Get single brand by ID
  getBrand: async (brandId) => {
    try {
      const response = await api.get(`/brands/${brandId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get brand API error:', error);
      throw error;
    }
  },

  // Update brand
  updateBrand: async (brandId, brandData) => {
    try {
      const response = await api.put(`/brands/${brandId}`, brandData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update brand API error:', error);
      throw error;
    }
  },

  // Delete brand
  deleteBrand: async (brandId) => {
    try {
      const response = await api.delete(`/brands/${brandId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete brand API error:', error);
      throw error;
    }
  },
}; 