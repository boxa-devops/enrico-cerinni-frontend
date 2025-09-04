/**
 * useReports Hook
 * 
 * Custom hook for managing reports functionality including
 * generating reports, fetching data, and handling report state.
 */

import { useState, useCallback, useEffect } from 'react';
import { reportsAPI } from '../api';
import logger from '../utils/logger';

export const useReports = (initialReportType = 'sales') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentReportType, setCurrentReportType] = useState(initialReportType);
  const [filters, setFilters] = useState({});

  /**
   * Generate a report by type
   */
  const generateReport = useCallback(async (reportType, reportFilters = {}, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      logger.info(`Generating ${reportType} report`, { filters: reportFilters, options });
      
      const response = await reportsAPI.reportUtils.getReportByType(
        reportType, 
        reportFilters, 
        options.useTestApi || false
      );
      
      if (response.success) {
        setReportData(response.data);
        setCurrentReportType(reportType);
        setFilters(reportFilters);
        logger.info(`Successfully generated ${reportType} report`);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to generate report');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate report';
      setError(errorMessage);
      logger.error('Report generation failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate sales report
   */
  const generateSalesReport = useCallback(async (reportFilters = {}, useTestApi = false) => {
    return generateReport('sales', reportFilters, { useTestApi });
  }, [generateReport]);

  /**
   * Generate finance report
   */
  const generateFinanceReport = useCallback(async (reportFilters = {}, useTestApi = false) => {
    return generateReport('finance', reportFilters, { useTestApi });
  }, [generateReport]);

  /**
   * Generate inventory report
   */
  const generateInventoryReport = useCallback(async (useTestApi = false) => {
    return generateReport('inventory', {}, { useTestApi });
  }, [generateReport]);

  /**
   * Generate clients report
   */
  const generateClientsReport = useCallback(async (reportFilters = {}, useTestApi = false) => {
    return generateReport('clients', reportFilters, { useTestApi });
  }, [generateReport]);

  /**
   * Generate performance report
   */
  const generatePerformanceReport = useCallback(async (reportFilters = {}, useTestApi = false) => {
    return generateReport('performance', reportFilters, { useTestApi });
  }, [generateReport]);

  /**
   * Save current report
   */
  const saveReport = useCallback(async (name, description = '') => {
    if (!reportData || !currentReportType) {
      throw new Error('No report data to save');
    }

    setLoading(true);
    try {
      const response = await reportsAPI.generateReport({
        report_type: currentReportType,
        filters,
        format: 'json',
        save_report: true,
        name,
        description
      });

      if (response.success) {
        logger.info('Report saved successfully', { name, type: currentReportType });
        await fetchSavedReports(); // Refresh saved reports list
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to save report');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to save report';
      setError(errorMessage);
      logger.error('Failed to save report', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reportData, currentReportType, filters]);

  /**
   * Fetch saved reports
   */
  const fetchSavedReports = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await reportsAPI.getSavedReports(page, limit);
      
      if (response.success) {
        setSavedReports(response.data.reports || []);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch saved reports');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch saved reports';
      setError(errorMessage);
      logger.error('Failed to fetch saved reports', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch report templates
   */
  const fetchTemplates = useCallback(async (reportType = null) => {
    try {
      const response = await reportsAPI.getReportTemplates(reportType);
      
      if (response.success) {
        setTemplates(response.data || []);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch templates');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch templates';
      setError(errorMessage);
      logger.error('Failed to fetch templates', err);
    }
  }, []);

  /**
   * Export report
   */
  const exportReport = useCallback(async (format = 'pdf', includeCharts = true) => {
    if (!reportData || !currentReportType) {
      throw new Error('No report data to export');
    }

    setLoading(true);
    try {
      const response = await reportsAPI.exportReport({
        report_type: currentReportType,
        format,
        filters,
        include_charts: includeCharts
      });

      if (response.success) {
        logger.info('Report export initiated', { format, type: currentReportType });
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to export report');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to export report';
      setError(errorMessage);
      logger.error('Failed to export report', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reportData, currentReportType, filters]);

  /**
   * Clear current report data
   */
  const clearReport = useCallback(() => {
    setReportData(null);
    setError(null);
    setFilters({});
  }, []);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Get default date range
   */
  const getDefaultDateRange = useCallback(() => {
    return reportsAPI.reportUtils.getDefaultDateRange();
  }, []);

  // Initialize with default date range
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setFilters(getDefaultDateRange());
    }
  }, [filters, getDefaultDateRange]);

  return {
    // State
    loading,
    error,
    reportData,
    savedReports,
    templates,
    currentReportType,
    filters,

    // Actions
    generateReport,
    generateSalesReport,
    generateFinanceReport,
    generateInventoryReport,
    generateClientsReport,
    generatePerformanceReport,
    saveReport,
    fetchSavedReports,
    fetchTemplates,
    exportReport,
    clearReport,
    updateFilters,
    setCurrentReportType,

    // Utilities
    getDefaultDateRange,
    formatDateForApi: reportsAPI.reportUtils.formatDateForApi
  };
};

/**
 * Hook for managing specific report type
 */
export const useReportType = (reportType) => {
  const reports = useReports(reportType);

  const generateCurrentReport = useCallback(async (reportFilters = {}, useTestApi = false) => {
    return reports.generateReport(reportType, reportFilters, { useTestApi });
  }, [reports.generateReport, reportType]);

  return {
    ...reports,
    generateCurrentReport,
    reportType
  };
};

export default useReports;
