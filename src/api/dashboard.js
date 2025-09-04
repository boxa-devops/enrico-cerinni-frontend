import api from './client';
import { validateApiResponse } from '../utils/api';

export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/test/stats');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Dashboard stats API error:', error);
      throw error;
    }
  },

  // Get recent transactions
  getRecentTransactions: async (limit = 10) => {
    try {
      const response = await api.get('/dashboard/test/recent-transactions', {
        params: { limit }
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Recent transactions API error:', error);
      throw error;
    }
  },

  // Get financial summary
  getFinancialSummary: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await api.get('/dashboard/financial-summary', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Financial summary API error:', error);
      throw error;
    }
  },

  // Get cashflow data for charts
  getCashflowData: async (period = '1month') => {
    try {
      const response = await api.get('/dashboard/test/cashflow', {
        params: { period }
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Cashflow data API error:', error);
      throw error;
    }
  },

  // Get profit analysis data
  getProfitData: async (period = '1month') => {
    try {
      const response = await api.get('/dashboard/test/profit-analysis', {
        params: { period }
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Profit data API error:', error);
      throw error;
    }
  },

  // Get sales performance data
  getSalesPerformanceData: async (period = '1month') => {
    try {
      const response = await api.get('/dashboard/test/sales-performance', {
        params: { period }
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Sales performance API error:', error);
      throw error;
    }
  },

  // Get expense breakdown data
  getExpenseBreakdownData: async (period = '1month') => {
    try {
      const response = await api.get('/dashboard/test/expense-breakdown', {
        params: { period }
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Expense breakdown API error:', error);
      throw error;
    }
  },
}; 