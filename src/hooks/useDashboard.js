import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { dashboardAPI } from '../api';

export function useDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalClients: 0,
    clientsWithDebts: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    totalOrders: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState({
    cashflow: [],
    profit: [],
    salesPerformance: [],
    expenseBreakdown: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState('1month');
  const [chartLoading, setChartLoading] = useState(false);
  const { loading, error, callApi } = useApi();

  const loadChartData = async (period = selectedPeriod) => {
    try {
      setChartLoading(true);
      
      // Load chart data in parallel for better performance
      const [cashflowResponse, profitResponse, salesResponse, expenseResponse] = await Promise.allSettled([
        callApi(() => dashboardAPI.getCashflowData(period)),
        callApi(() => dashboardAPI.getProfitData(period)),
        callApi(() => dashboardAPI.getSalesPerformanceData(period)),
        callApi(() => dashboardAPI.getExpenseBreakdownData(period)),
      ]);

      // Update chart data with API responses or keep default values
      const newChartData = {
        cashflow: cashflowResponse.status === 'fulfilled' && cashflowResponse.value.success 
          ? cashflowResponse.value.data : [],
        profit: profitResponse.status === 'fulfilled' && profitResponse.value.success 
          ? profitResponse.value.data : [],
        salesPerformance: salesResponse.status === 'fulfilled' && salesResponse.value.success 
          ? salesResponse.value.data : [],
        expenseBreakdown: expenseResponse.status === 'fulfilled' && expenseResponse.value.success 
          ? expenseResponse.value.data : [],
      };
      
      console.log('Dashboard chart data loaded:', newChartData);
      setChartData(newChartData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load dashboard statistics
      const statsResponse = await callApi(dashboardAPI.getStats);
      console.log('Dashboard stats response:', statsResponse);
      if (statsResponse.success && statsResponse.data) {
        const apiData = statsResponse.data;
        const newStats = {
          totalSales: apiData.total_sales || 0,
          totalProducts: apiData.total_products || 0,
          totalClients: apiData.total_clients || 0,
          clientsWithDebts: apiData.clients_with_debts || 0,
          monthlyRevenue: apiData.total_revenue || 0,
          monthlyExpenses: apiData.monthly_expenses || 0,
          totalOrders: apiData.total_orders || 0,
        };
        console.log('Dashboard stats mapped:', newStats);
        setStats(newStats);
      }

      // Load recent transactions
      const transactionsResponse = await callApi(() => dashboardAPI.getRecentTransactions(10));
      if (transactionsResponse.success && transactionsResponse.data) {
        setRecentTransactions(transactionsResponse.data || []);
      }

      // Load initial chart data
      await loadChartData();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handlePeriodChange = async (newPeriod) => {
    setSelectedPeriod(newPeriod);
    await loadChartData(newPeriod);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    stats,
    recentTransactions,
    chartData,
    selectedPeriod,
    loading,
    chartLoading,
    error,
    refreshData: loadDashboardData,
    handlePeriodChange,
  };
} 