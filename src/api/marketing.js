import api from './client';
import { validateApiResponse } from '../utils/api';

export const marketingAPI = {
  // Send SMS broadcast
  sendSMSBroadcast: async (data) => {
    try {
      const response = await api.post('/marketing/sms/broadcast', data);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Error sending SMS broadcast:', error);
      throw error;
    }
  },

  // Send Telegram broadcast
  sendTelegramBroadcast: async (data) => {
    try {
      const response = await api.post('/marketing/telegram/broadcast', data);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Error sending Telegram broadcast:', error);
      throw error;
    }
  },

  // Get marketing statistics
  getMarketingStats: async () => {
    try {
      const response = await api.get('/marketing/stats');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching marketing stats:', error);
      throw error;
    }
  },

  // Get broadcast history
  getBroadcastHistory: async (params = {}) => {
    try {
      const response = await api.get('/marketing/history', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching broadcast history:', error);
      throw error;
    }
  },

  // Test Telegram bot connection
  testTelegramConnection: async () => {
    try {
      const response = await api.get('/marketing/telegram/test');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Error testing Telegram connection:', error);
      throw error;
    }
  },

  // Get client list for marketing
  getMarketingClients: async (params = {}) => {
    try {
      const response = await api.get('/marketing/clients', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching marketing clients:', error);
      throw error;
    }
  },
}; 