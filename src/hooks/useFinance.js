import { useState, useEffect } from 'react';
import { financeAPI } from '../api';

export const useFinance = () => {
  const [loading, setLoading] = useState(true);
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

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load expenses
      try {
        const expensesResponse = await financeAPI.getExpenses();
        if (expensesResponse.success) {
          setExpenses(expensesResponse.data.items || []);
        }
      } catch (error) {
        console.error('Error loading expenses:', error);
      }

      // Load suppliers
      try {
        const suppliersResponse = await financeAPI.getSuppliers();
        if (suppliersResponse.success) {
          setSuppliers(suppliersResponse.data.items || []);
        }
      } catch (error) {
        console.error('Error loading suppliers:', error);
      }

      // Load employees
      try {
        const employeesResponse = await financeAPI.getEmployees();
        if (employeesResponse.success) {
          setEmployees(employeesResponse.data.items || []);
        }
      } catch (error) {
        console.error('Error loading employees:', error);
      }

      // Load salary payments
      try {
        const salaryPaymentsResponse = await financeAPI.getSalaryPayments();
        if (salaryPaymentsResponse.success) {
          setSalaryPayments(salaryPaymentsResponse.data.items || []);
        }
      } catch (error) {
        console.error('Error loading salary payments:', error);
      }

      // Load expense stats
      try {
        const statsResponse = await financeAPI.getExpenseStats();
        if (statsResponse.success) {
          const totalExpenses = parseFloat(statsResponse.data.total_expenses) || 0;
          const byCategory = statsResponse.data.by_category || {};
          
          setStats({
            totalExpenses: totalExpenses,
            monthlyExpenses: totalExpenses,
            supplierCosts: parseFloat(byCategory.supplier || byCategory.Supplier || 0),
            dailyExpenses: totalExpenses / 30,
            salaryExpenses: parseFloat(byCategory.salary || byCategory.Salary || 0)
          });
        }
      } catch (error) {
        console.error('Error loading expense stats:', error);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await financeAPI.deleteExpense(id);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Xarajatni o\'chirishda xatolik yuz berdi');
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await financeAPI.deleteSupplier(id);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setError('Yetkazib beruvchini o\'chirishda xatolik yuz berdi');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await financeAPI.deleteEmployee(id);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Xodimni o\'chirishda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    loading,
    error,
    expenses,
    suppliers,
    employees,
    salaryPayments,
    stats,
    loadData,
    handleDeleteExpense,
    handleDeleteSupplier,
    handleDeleteEmployee
  };
}; 