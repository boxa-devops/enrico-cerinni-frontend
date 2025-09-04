import api from './client';
import { validateApiResponse } from '../utils/api';

export const clientsAPI = {
  // Get all clients with filtering and pagination
  getClients: async (params = {}) => {
    try {
      const response = await api.get('/clients/', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get clients API error:', error);
      throw error;
    }
  },

  // Get single client by ID
  getClient: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get client API error:', error);
      throw error;
    }
  },

  // Create new client
  createClient: async (clientData) => {
    try {
      const response = await api.post('/clients/', clientData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create client API error:', error);
      throw error;
    }
  },

  // Update client
  updateClient: async (clientId, clientData) => {
    try {
      const response = await api.put(`/clients/${clientId}`, clientData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update client API error:', error);
      throw error;
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    try {
      const response = await api.delete(`/clients/${clientId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete client API error:', error);
      throw error;
    }
  },

  // Update client debt
  updateDebt: async (clientId, debtAmount) => {
    try {
      const response = await api.patch(`/clients/${clientId}/debt`, {
        debt_amount: debtAmount
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update debt API error:', error);
      throw error;
    }
  },
}; 