import api from './client';
import { validateApiResponse } from '../utils/api';

export const seasonsAPI = {
  // Get all seasons
  getSeasons: async () => {
    try {
      const response = await api.get('/seasons/');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get seasons API error:', error);
      throw error;
    }
  },

  // Create new season
  createSeason: async (seasonData) => {
    try {
      const response = await api.post('/seasons/', seasonData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create season API error:', error);
      throw error;
    }
  },

  // Get single season by ID
  getSeason: async (seasonId) => {
    try {
      const response = await api.get(`/seasons/${seasonId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get season API error:', error);
      throw error;
    }
  },

  // Update season
  updateSeason: async (seasonId, seasonData) => {
    try {
      const response = await api.put(`/seasons/${seasonId}`, seasonData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update season API error:', error);
      throw error;
    }
  },

  // Delete season
  deleteSeason: async (seasonId) => {
    try {
      const response = await api.delete(`/seasons/${seasonId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete season API error:', error);
      throw error;
    }
  },
}; 