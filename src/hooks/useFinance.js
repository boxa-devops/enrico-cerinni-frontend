import { useState, useEffect, useCallback } from 'react';
import { financeAPI } from '../api';

// Simple cache for finance data
const financeCache = {
  expenses: null,
  suppliers: null,
  employees: null,
  stats: null,
  timestamp: null,
  isExpired: function() {
    // Cache expires after 2 minutes
    return !this.timestamp || Date.now() - this.timestamp > 2 * 60 * 1000;
  }
};

export const useFinance = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    supplierCosts: 0,
    dailyExpenses: 0,
    salaryExpenses: 0
  });

  // Load critical data first (stats)
  const loadStats = useCallback(async () => {
    try {
      setError(null);
      
      // Check cache first
      if (!financeCache.isExpired() && financeCache.stats) {
        setStats(financeCache.stats);
        return;
      }
      
      const statsResponse = await financeAPI.getExpenseStats();
      if (statsResponse.success) {
        const totalExpenses = parseFloat(statsResponse.data.total_expenses) || 0;
        const byCategory = statsResponse.data.by_category || {};
        
        const newStats = {
          totalExpenses: totalExpenses,
          monthlyExpenses: totalExpenses,
          supplierCosts: parseFloat(byCategory.supplier || byCategory.Supplier || 0),
          dailyExpenses: totalExpenses / 30,
          salaryExpenses: parseFloat(byCategory.salary || byCategory.Salary || 0)
        };
        
        setStats(newStats);
        financeCache.stats = newStats;
        financeCache.timestamp = Date.now();
      }
    } catch (error) {
      console.error('Error loading expense stats:', error);
    }
  }, []);

  // Load detailed data (non-critical)
  const loadDetailedData = useCallback(async () => {
    try {
      setDataLoading(true);
      setError(null);
      
      // Check cache first
      if (!financeCache.isExpired() && financeCache.expenses && financeCache.suppliers && financeCache.employees) {
        setExpenses(financeCache.expenses);
        setSuppliers(financeCache.suppliers);
        setEmployees(financeCache.employees);
        setDataLoading(false);
        return;
      }
      
      // Load all data in parallel
      const [expensesResponse, suppliersResponse, employeesResponse, salaryPaymentsResponse] = await Promise.all([
        financeAPI.getExpenses().catch(err => ({ success: false, error: err })),
        financeAPI.getSuppliers().catch(err => ({ success: false, error: err })),
        financeAPI.getEmployees().catch(err => ({ success: false, error: err })),
        financeAPI.getSalaryPayments().catch(err => ({ success: false, error: err }))
      ]);

      // Update expenses
      if (expensesResponse.success) {
        const expensesData = expensesResponse.data.items || [];
        setExpenses(expensesData);
        financeCache.expenses = expensesData;
      }

      // Update suppliers
      if (suppliersResponse.success) {
        const suppliersData = suppliersResponse.data.items || [];
        setSuppliers(suppliersData);
        financeCache.suppliers = suppliersData;
      }

      // Update employees
      if (employeesResponse.success) {
        const employeesData = employeesResponse.data.items || [];
        setEmployees(employeesData);
        financeCache.employees = employeesData;
      }

      // Update salary payments
      if (salaryPaymentsResponse.success) {
        setSalaryPayments(salaryPaymentsResponse.data.items || []);
      }
      
      // Update cache timestamp
      financeCache.timestamp = Date.now();
    } catch (error) {
      console.error('Error loading finance data:', error);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setDataLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Load stats first (critical)
      await loadStats();
      // Then load detailed data in background
      loadDetailedData();
    } catch (error) {
      console.error('Error loading finance data:', error);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadDetailedData]);

  const refreshData = useCallback(async () => {
    // Clear cache and reload
    financeCache.expenses = null;
    financeCache.suppliers = null;
    financeCache.employees = null;
    financeCache.stats = null;
    financeCache.timestamp = null;
    await loadData();
  }, [loadData]);

  const handleDeleteExpense = useCallback(async (id) => {
    try {
      await financeAPI.deleteExpense(id);
      // Update local state immediately
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      // Clear cache to force refresh on next load
      financeCache.expenses = null;
      financeCache.stats = null;
      // Reload stats
      loadStats();
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Xarajatni o\'chirishda xatolik yuz berdi');
      // Reload data on error
      loadDetailedData();
    }
  }, [loadStats, loadDetailedData]);

  const handleDeleteSupplier = useCallback(async (id) => {
    try {
      await financeAPI.deleteSupplier(id);
      // Update local state immediately
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      // Clear cache to force refresh on next load
      financeCache.suppliers = null;
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setError('Yetkazib beruvchini o\'chirishda xatolik yuz berdi');
      // Reload data on error
      loadDetailedData();
    }
  }, [loadDetailedData]);

  const handleDeleteEmployee = useCallback(async (id) => {
    try {
      await financeAPI.deleteEmployee(id);
      // Update local state immediately
      setEmployees(prev => prev.filter(employee => employee.id !== id));
      // Clear cache to force refresh on next load
      financeCache.employees = null;
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Xodimni o\'chirishda xatolik yuz berdi');
      // Reload data on error
      loadDetailedData();
    }
  }, [loadDetailedData]);

  useEffect(() => {
    loadData();
  }, []);

  return {
    loading,
    dataLoading,
    error,
    expenses,
    suppliers,
    employees,
    salaryPayments,
    stats,
    loadData,
    refreshData,
    loadStats,
    loadDetailedData,
    handleDeleteExpense,
    handleDeleteSupplier,
    handleDeleteEmployee
  };
}; 