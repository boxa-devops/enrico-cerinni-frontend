/**
 * Reports API
 * 
 * API functions for interacting with reports endpoints.
 * Provides functions for generating, retrieving, and managing reports.
 */

import { request } from './helpers';
import api from './client';

const REPORTS_BASE_URL = '/reports';

/**
 * Generate a new report
 * @param {Object} reportRequest - Report generation request
 * @param {string} reportRequest.report_type - Type of report (sales, finance, etc.)
 * @param {Object} reportRequest.filters - Report filters
 * @param {string} reportRequest.format - Report format (json, pdf, excel, csv)
 * @param {boolean} reportRequest.save_report - Whether to save the report
 * @param {string} reportRequest.name - Report name (if saving)
 * @param {string} reportRequest.description - Report description (if saving)
 * @returns {Promise<Object>} Generated report data
 */
export const generateReport = async (reportRequest) => {
  return request(api.post(`${REPORTS_BASE_URL}/generate`, reportRequest));
};

/**
 * Get sales report
 * @param {Object} filters - Report filters
 * @param {string} filters.start_date - Start date (YYYY-MM-DD)
 * @param {string} filters.end_date - End date (YYYY-MM-DD)
 * @param {number[]} filters.client_ids - Client IDs to filter
 * @param {string[]} filters.payment_methods - Payment methods to filter
 * @returns {Promise<Object>} Sales report data
 */
export const getSalesReport = async (filters = {}) => {
  const params = {};
    
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.client_ids?.length) params.client_ids = filters.client_ids;
  if (filters.payment_methods?.length) params.payment_methods = filters.payment_methods;
  
  return request(api.get(`${REPORTS_BASE_URL}/sales`, { params }));
};

/**
 * Get finance report
 * @param {Object} filters - Report filters
 * @param {string} filters.start_date - Start date (YYYY-MM-DD)
 * @param {string} filters.end_date - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Finance report data
 */
export const getFinanceReport = async (filters = {}) => {
  const params = {};
  
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  
  return request(api.get(`${REPORTS_BASE_URL}/finance`, { params }));
};

/**
 * Get inventory report
 * @returns {Promise<Object>} Inventory report data
 */
export const getInventoryReport = async () => {
  return request(api.get(`${REPORTS_BASE_URL}/inventory`));
};

/**
 * Get clients report
 * @param {Object} filters - Report filters
 * @param {string} filters.start_date - Start date (YYYY-MM-DD)
 * @param {string} filters.end_date - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Clients report data
 */
export const getClientsReport = async (filters = {}) => {
  const params = {};
  
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  
  return request(api.get(`${REPORTS_BASE_URL}/clients`, { params }));
};

/**
 * Get performance report
 * @param {Object} filters - Report filters
 * @param {string} filters.start_date - Start date (YYYY-MM-DD)
 * @param {string} filters.end_date - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Performance report data
 */
export const getPerformanceReport = async (filters = {}) => {
  const params = {};
  
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  
  return request(api.get(`${REPORTS_BASE_URL}/performance`, { params }));
};

/**
 * Get saved reports
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Saved reports list
 */
export const getSavedReports = async (page = 1, limit = 10) => {
  const params = { page, limit };
  return request(api.get(`${REPORTS_BASE_URL}/saved`, { params }));
};

/**
 * Get report templates
 * @param {string} reportType - Filter by report type (optional)
 * @returns {Promise<Object>} Report templates list
 */
export const getReportTemplates = async (reportType = null) => {
  const params = {};
  if (reportType) params.report_type = reportType;
  
  return request(api.get(`${REPORTS_BASE_URL}/templates`, { params }));
};

/**
 * Export report
 * @param {Object} exportRequest - Export request
 * @param {number} exportRequest.report_id - Report ID (optional)
 * @param {string} exportRequest.report_type - Report type
 * @param {string} exportRequest.format - Export format (pdf, excel, csv)
 * @param {Object} exportRequest.filters - Report filters (optional)
 * @param {boolean} exportRequest.include_charts - Include charts in export
 * @returns {Promise<Object>} Export response with download URL
 */
export const exportReport = async (exportRequest) => {
  return request(api.post(`${REPORTS_BASE_URL}/export`, exportRequest));
};

// Test endpoints (without authentication)
export const testApi = {
  /**
   * Test sales report endpoint
   * @param {Object} filters - Report filters
   * @returns {Promise<Object>} Sales report data
   */
  getSalesReport: async (filters = {}) => {
    const params = {};
    
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    return request(api.get(`${REPORTS_BASE_URL}/test/sales`, { params }));
  },

  /**
   * Test finance report endpoint
   * @param {Object} filters - Report filters
   * @returns {Promise<Object>} Finance report data
   */
  getFinanceReport: async (filters = {}) => {
    const params = {};
    
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    return request(api.get(`${REPORTS_BASE_URL}/test/finance`, { params }));
  },

  /**
   * Test inventory report endpoint
   * @returns {Promise<Object>} Inventory report data
   */
  getInventoryReport: async () => {
    return request(api.get(`${REPORTS_BASE_URL}/test/inventory`));
  },

  /**
   * Test clients report endpoint
   * @param {Object} filters - Report filters
   * @returns {Promise<Object>} Clients report data
   */
  getClientsReport: async (filters = {}) => {
    const params = {};
    
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    return request(api.get(`${REPORTS_BASE_URL}/test/clients`, { params }));
  },

  /**
   * Test performance report endpoint
   * @param {Object} filters - Report filters
   * @returns {Promise<Object>} Performance report data
   */
  getPerformanceReport: async (filters = {}) => {
    const params = {};
    
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    return request(api.get(`${REPORTS_BASE_URL}/test/performance`, { params }));
  }
};

// Utility functions for common report operations
export const reportUtils = {
  /**
   * Get report data by type
   * @param {string} reportType - Type of report
   * @param {Object} filters - Report filters
   * @param {boolean} useTestApi - Whether to use test API endpoints
   * @returns {Promise<Object>} Report data
   */
  getReportByType: async (reportType, filters = {}, useTestApi = false) => {
    const api = useTestApi ? testApi : {
      getSalesReport,
      getFinanceReport,
      getInventoryReport,
      getClientsReport,
      getPerformanceReport
    };

    switch (reportType) {
      case 'sales':
        return api.getSalesReport(filters);
      case 'finance':
        return api.getFinanceReport(filters);
      case 'inventory':
        return api.getInventoryReport();
      case 'clients':
        return api.getClientsReport(filters);
      case 'performance':
        return api.getPerformanceReport(filters);
      default:
        throw new Error(`Unsupported report type: ${reportType}`);
    }
  },

  /**
   * Format date for API requests
   * @param {Date} date - Date object
   * @returns {string} Formatted date string (YYYY-MM-DD)
   */
  formatDateForApi: (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  },

  /**
   * Get default date range (last 30 days)
   * @returns {Object} Date range object with start_date and end_date
   */
  getDefaultDateRange: () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    return {
      start_date: reportUtils.formatDateForApi(startDate),
      end_date: reportUtils.formatDateForApi(endDate)
    };
  }
};
