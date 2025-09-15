import api from './client';
import { validateApiResponse } from '../utils/api';

export const salesAPI = {
  // Create new sale
  createSale: async (saleData) => {
    try {
      const response = await api.post('/sales', saleData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create sale API error:', error);
      throw error;
    }
  },

  // Get all sales with filtering and pagination
  getSales: async (params = {}) => {
    try {
      const response = await api.get('/sales', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get sales API error:', error);
      throw error;
    }
  },

  // Get sales statistics
  getSalesStats: async (filters = {}) => {
    try {
      const response = await api.get('/sales/stats/', { params: filters });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get sales stats API error:', error);
      throw error;
    }
  },

  // Get single sale by ID
  getSale: async (saleId) => {
    try {
      const response = await api.get(`/sales/${saleId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get sale API error:', error);
      throw error;
    }
  },

  // Cancel sale
  cancelSale: async (saleId) => {
    try {
      const response = await api.patch(`/sales/${saleId}/cancel`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Cancel sale API error:', error);
      throw error;
    }
  },

  // Process debt payment
  processDebtPayment: async (clientId, paymentAmount) => {
    try {
      const response = await api.post(`/sales/debt-payment`, {
        client_id: clientId,
        payment_amount: paymentAmount
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Process debt payment API error:', error);
      throw error;
    }
  },

  // Get client debt history
  getClientDebtHistory: async (clientId) => {
    try {
      const response = await api.get(`/sales/client/${clientId}/debt-history`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get client debt history API error:', error);
      throw error;
    }
  },

  // Pay debt for a specific sale
  paySaleDebt: async (saleId, paymentAmount) => {
    try {
      const response = await api.post(`/sales/${saleId}/pay-debt`, null, {
        params: { payment_amount: paymentAmount }
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Pay sale debt API error:', error);
      throw error;
    }
  },

  // Get all debt sales for a specific client
  getClientDebts: async (clientId) => {
    try {
      const response = await api.get(`/sales/client/${clientId}/debts`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get client debts API error:', error);
      throw error;
    }
  },

  // Get debt statistics
  getDebtStats: async () => {
    try {
      const response = await api.get('/sales/debt-stats');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get debt stats API error:', error);
      throw error;
    }
  },

  // Get debt trend data
  getDebtTrend: async (params = {}) => {
    try {
      const response = await api.get('/sales/debt-trend', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get debt trend API error:', error);
      throw error;
    }
  },

  // Get payment trend data
  getPaymentTrend: async (params = {}) => {
    try {
      const response = await api.get('/sales/payment-trend', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get payment trend API error:', error);
      throw error;
    }
  },
}; 