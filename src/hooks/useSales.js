import { useState, useEffect } from 'react';
import { salesAPI } from '../api';

export default function useSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDebtPaymentModal, setShowDebtPaymentModal] = useState(false);
  const [selectedDebtSale, setSelectedDebtSale] = useState(null);
  const [clientDebts, setClientDebts] = useState([]);
  const [debtHistory, setDebtHistory] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    completedSales: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    start_date: '',
    end_date: '',
    client_id: '',
    status: '',
    min_amount: '',
    max_amount: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 0
  });

  const loadSales = async () => {
    setLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filteredParams
      };

      const response = await salesAPI.getSales(params);
      
      if (response.success && response.data) {
        setSales(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 0
        }));
      }
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Check if any date filters are applied
      const hasDateFilters = filters.start_date || filters.end_date;
      
      let statsParams = { ...filters };
      
      // If no date filters are applied, set current month as default
      if (!hasDateFilters) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        statsParams = {
          ...filters,
          start_date: startOfMonth.toISOString().split('T')[0],
          end_date: endOfMonth.toISOString().split('T')[0]
        };
      }
      
      const response = await salesAPI.getSalesStats(statsParams);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleViewSale = async (saleId) => {
    try {
      const response = await salesAPI.getSale(saleId);
      if (response.success && response.data) {
        setSelectedSale(response.data);
        setShowSaleModal(true);
      }
    } catch (error) {
      console.error('Error loading sale details:', error);
    }
  };

  const handleCancelSale = async (saleId) => {
    if (!confirm('Bu sotuvni bekor qilishni xohlaysizmi?')) {
      return;
    }

    try {
      const response = await salesAPI.cancelSale(saleId);
      if (response.success) {
        alert('Sotuv muvaffaqiyatli bekor qilindi');
        loadSales();
        loadStats();
      }
    } catch (error) {
      console.error('Error cancelling sale:', error);
      alert('Sotuvni bekor qilishda xatolik yuz berdi');
    }
  };

  const handlePayDebt = async (saleId, paymentAmount) => {
    try {
      const response = await salesAPI.paySaleDebt(saleId, paymentAmount);
      if (response.success) {
        alert('Qarzdorlik muvaffaqiyatli to\'landi');
        setShowDebtPaymentModal(false);
        setSelectedDebtSale(null);
        loadSales();
        loadStats();
      }
    } catch (error) {
      console.error('Error paying debt:', error);
      alert('Qarzdorlik to\'lashda xatolik yuz berdi');
    }
  };

  const handleViewClientDebts = async (clientId) => {
    try {
      const response = await salesAPI.getClientDebts(clientId);
      if (response.success && response.data) {
        setClientDebts(response.data);
        // You can show this in a modal or navigate to a debt page
        console.log('Client debts:', response.data);
      }
    } catch (error) {
      console.error('Error loading client debts:', error);
    }
  };

  const handleViewDebtHistory = async (clientId) => {
    try {
      const response = await salesAPI.getClientDebtHistory(clientId);
      if (response.success && response.data) {
        setDebtHistory(response.data);
        // You can show this in a modal or navigate to a debt history page
        console.log('Debt history:', response.data);
      }
    } catch (error) {
      console.error('Error loading debt history:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ 
      ...prev, 
      page: 1, 
      limit: parseInt(newSize) 
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      start_date: '',
      end_date: '',
      client_id: '',
      status: '',
      min_amount: '',
      max_amount: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const exportReport = () => {
    // TODO: Implement export functionality
    alert('Hisobot eksport qilish funksiyasi tez orada qo\'shiladi');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { 
        label: 'Tugatildi', 
        className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200' 
      },
      cancelled: { 
        label: 'Bekor qilindi', 
        className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200' 
      },
      pending: { 
        label: 'Kutilmoqda', 
        className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200' 
      },
      debt: { 
        label: 'Qarzdorlik', 
        className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200' 
      },
      partially_paid: { 
        label: 'Qisman to\'langan', 
        className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200' 
      }
    };
    
    const statusInfo = statusMap[status] || { 
      label: status, 
      className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200' 
    };
    
    return (
      <span className={statusInfo.className}>
        {statusInfo.label}
      </span>
    );
  };

  return {
    // State
    sales,
    loading,
    selectedSale,
    showSaleModal,
    showFilters,
    showDebtPaymentModal,
    selectedDebtSale,
    clientDebts,
    debtHistory,
    stats,
    filters,
    pagination,
    
    // Actions
    setShowSaleModal,
    setShowFilters,
    setShowDebtPaymentModal,
    setSelectedDebtSale,
    loadSales,
    loadStats,
    handleViewSale,
    handleCancelSale,
    handlePayDebt,
    handleViewClientDebts,
    handleViewDebtHistory,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    clearFilters,
    exportReport,
    
    // Utilities
    formatDate,
    formatCurrency,
    getStatusBadge
  };
} 