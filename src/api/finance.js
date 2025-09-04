import api from './client';
import { validateApiResponse } from '../utils/api';

export const financeAPI = {
  // Expenses
  getExpenses: async (params = {}) => {
    try {
      const response = await api.get('/finance/expenses', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get expenses API error:', error);
      throw error;
    }
  },

  createExpense: async (expenseData) => {
    try {
      const response = await api.post('/finance/expenses', expenseData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create expense API error:', error);
      throw error;
    }
  },

  updateExpense: async (expenseId, expenseData) => {
    try {
      const response = await api.put(`/finance/expenses/${expenseId}`, expenseData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update expense API error:', error);
      throw error;
    }
  },

  deleteExpense: async (expenseId) => {
    try {
      const response = await api.delete(`/finance/expenses/${expenseId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete expense API error:', error);
      throw error;
    }
  },

  getExpenseStats: async (params = {}) => {
    try {
      const response = await api.get('/finance/expenses/stats', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get expense stats API error:', error);
      throw error;
    }
  },

  // Suppliers
  getSuppliers: async (params = {}) => {
    try {
      const response = await api.get('/finance/suppliers', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get suppliers API error:', error);
      throw error;
    }
  },

  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/finance/suppliers', supplierData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create supplier API error:', error);
      throw error;
    }
  },

  updateSupplier: async (supplierId, supplierData) => {
    try {
      const response = await api.put(`/finance/suppliers/${supplierId}`, supplierData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update supplier API error:', error);
      throw error;
    }
  },

  deleteSupplier: async (supplierId) => {
    try {
      const response = await api.delete(`/finance/suppliers/${supplierId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete supplier API error:', error);
      throw error;
    }
  },

  // Employees
  getEmployees: async (params = {}) => {
    try {
      const response = await api.get('/finance/employees', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get employees API error:', error);
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/finance/employees', employeeData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create employee API error:', error);
      throw error;
    }
  },

  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await api.put(`/finance/employees/${employeeId}`, employeeData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update employee API error:', error);
      throw error;
    }
  },

  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`/finance/employees/${employeeId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete employee API error:', error);
      throw error;
    }
  },

  // Salary Payments
  getSalaryPayments: async (params = {}) => {
    try {
      const response = await api.get('/finance/salary-payments', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get salary payments API error:', error);
      throw error;
    }
  },

  createSalaryPayment: async (paymentData) => {
    try {
      const response = await api.post('/finance/salary-payments', paymentData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create salary payment API error:', error);
      throw error;
    }
  },

  updateSalaryPayment: async (paymentId, paymentData) => {
    try {
      const response = await api.put(`/finance/salary-payments/${paymentId}`, paymentData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update salary payment API error:', error);
      throw error;
    }
  },

  deleteSalaryPayment: async (paymentId) => {
    try {
      const response = await api.delete(`/finance/salary-payments/${paymentId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete salary payment API error:', error);
      throw error;
    }
  },
}; 