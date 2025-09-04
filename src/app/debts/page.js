'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, DollarSign, AlertCircle, User, Eye, CreditCard, Receipt, Send, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import Table from '../../components/tables/Table';
import DebtPaymentModal from '../../components/modals/DebtPaymentModal';
import { DebtFilters, DebtTrendChart } from '../../components/debts';
import { LoadingSpinner, Card, Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { clientsAPI, salesAPI } from '../../api';

export default function DebtsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDebts, setClientDebts] = useState([]);
  const [clientTransactions, setClientTransactions] = useState([]);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [activeTab, setActiveTab] = useState('sales'); // 'sales' or 'transactions'
  const [stats, setStats] = useState({
    totalDebt: 0,
    totalClients: 0,
    averageDebt: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    start_date: '',
    end_date: '',
    min_debt: '',
    max_debt: '',
    sort_by: 'debt_amount_desc'
  });
  const [trendData, setTrendData] = useState([]);
  const [paymentTrendData, setPaymentTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        window.location.href = '/login';
      }
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      loadClientsWithDebts();
      loadDebtStats();
      loadDebtTrend();
      loadPaymentTrend();
    }
  }, [authLoading]);

  // Effect for filtering
  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      const delayedSearch = setTimeout(() => {
        loadClientsWithDebts();
      }, 300);
      return () => clearTimeout(delayedSearch);
    }
  }, [filters]);

  const loadClientsWithDebts = async (filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        has_debt: true,
        ...filterParams,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };
      const response = await clientsAPI.getClients(params);
      if (response.success && response.data) {
        setClients(response.data.items || []);
      }
    } catch (error) {
      console.error('Error loading clients with debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDebtStats = async () => {
    try {
      const response = await salesAPI.getDebtStats();
      if (response?.success && response?.data) {
        setStats(response.data);
      } else {
        console.warn('Debt stats API returned unsuccessful response');
      }
    } catch (error) {
      console.warn('Debt stats API not available or failed:', {
        message: error?.message || 'Unknown error',
        status: error?.response?.status || 'No status',
        statusText: error?.response?.statusText || 'No status text',
        url: error?.config?.url || 'No URL'
      });
    }
  };

  const loadDebtTrend = async () => {
    setTrendLoading(true);
    try {
      const response = await salesAPI.getDebtTrend({ days: 30 });
      if (response.success && response.data) {
        setTrendData(response.data);
      } else {
        console.warn('Debt trend API returned unsuccessful response, using mock data');
        generateMockDebtData();
      }
    } catch (error) {
      console.warn('Debt trend API not available or failed:', {
        message: error?.message || 'Unknown error',
        status: error?.response?.status || 'No status',
        statusText: error?.response?.statusText || 'No status text',
        url: error?.config?.url || 'No URL'
      });
      generateMockDebtData();
    } finally {
      setTrendLoading(false);
    }
  };

  const generateMockDebtData = () => {
    const mockData = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      mockData.push({
        date: date.toISOString().split('T')[0],
        total_debt: Math.random() * 10000000 + 5000000,
        client_count: Math.floor(Math.random() * 50) + 20
      });
    }
    setTrendData(mockData);
  };

  const loadPaymentTrend = async () => {
    try {
      const response = await salesAPI.getPaymentTrend({ days: 30 });
      if (response.success && response.data) {
        setPaymentTrendData(response.data);
      } else {
        // If API returns but with no success, use mock data
        console.warn('Payment trend API returned unsuccessful response, using mock data');
        generateMockPaymentData();
      }
    } catch (error) {
      // Better error logging with more details
      console.warn('Payment trend API not available or failed:', {
        message: error?.message || 'Unknown error',
        status: error?.response?.status || 'No status',
        statusText: error?.response?.statusText || 'No status text',
        url: error?.config?.url || 'No URL'
      });
      // Use mock data when API fails
      generateMockPaymentData();
    }
  };

  const generateMockPaymentData = () => {
    const mockData = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      mockData.push({
        date: date.toISOString().split('T')[0],
        total_payments: Math.random() * 2000000 + 500000,
        payment_count: Math.floor(Math.random() * 15) + 5
      });
    }
    setPaymentTrendData(mockData);
  };

  const handleViewClientDebts = async (client) => {
    try {
      // Load both sales and transactions
      const [salesResponse, transactionsResponse] = await Promise.all([
        salesAPI.getClientDebts(client.id),
        salesAPI.getClientDebtHistory(client.id)
      ]);
      
      if (salesResponse.success && salesResponse.data) {
        setClientDebts(salesResponse.data);
      }
      
      if (transactionsResponse.success && transactionsResponse.data) {
        setClientTransactions(transactionsResponse.data);
      }
      
      setSelectedClient(client);
      setShowDebtModal(true);
      setActiveTab('sales'); // Default to sales tab
    } catch (error) {
      console.error('Error loading client debts:', error);
    }
  };

  const handlePaymentClick = (client) => {
    setSelectedClient(client);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async (clientId, paymentAmount) => {
    try {
      const response = await salesAPI.processDebtPayment(clientId, paymentAmount);
      if (response.success) {
        alert('To\'lov muvaffaqiyatli amalga oshirildi');
        setShowPaymentModal(false);
        setSelectedClient(null);
        setClientDebts([]);
        setClientTransactions([]);
        loadClientsWithDebts();
        loadDebtStats();
        loadDebtTrend();
        loadPaymentTrend();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('To\'lovni amalga oshirishda xatolik yuz berdi');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      start_date: '',
      end_date: '',
      min_debt: '',
      max_debt: '',
      sort_by: 'debt_amount_desc'
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('uz-UZ');
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'sale':
        return 'Sotuv';
      case 'debt_payment':
        return 'To\'lov';
      default:
        return type;
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'sale':
        return '#dc2626'; // red
      case 'debt_payment':
        return '#059669'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'client_name',
      label: 'Mijoz',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{row.first_name} {row.last_name}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Telefon',
      render: (value) => value || '—'
    },
    {
      key: 'debt_amount',
      label: 'Qarzdorlik miqdori',
      render: (value) => (
        <span style={{ 
          color: '#dc2626', 
          fontWeight: '600',
          fontSize: '0.875rem'
        }}>
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewClientDebts(row);
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Ko'rish
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePaymentClick(row);
            }}
            className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
          >
            To'lov
          </button>
        </div>
      )
    }
  ];

  if (authLoading) {
    return (
      <Layout>
        <PageLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner 
              message="Autentifikatsiya tekshirilmoqda..." 
              size="lg" 
            />
          </div>
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout 
        title="Qarzdorliklar"
        subtitle="Mijozlar qarzdorliklarini boshqarish va to'lovlarni kuzatish"
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen"
      >
        {/* Header with Compact Stats */}
        <Card className="mb-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                <DollarSign className="text-white" size={18} />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium m-0">Jami qarz</p>
                <p className="text-xl font-bold text-red-700 m-0">{formatCurrency(stats.totalDebt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <User className="text-white" size={18} />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium m-0">Qarzdor mijozlar</p>
                <p className="text-xl font-bold text-blue-700 m-0">{stats.totalClients} ta</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                <AlertCircle className="text-white" size={18} />
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium m-0">O'rtacha qarz</p>
                <p className="text-xl font-bold text-yellow-700 m-0">{formatCurrency(stats.averageDebt)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Debt Trend Chart - Temporarily disabled for debugging */}
        {/* <DebtTrendChart data={trendData} paymentData={paymentTrendData} loading={trendLoading} /> */}

        {/* Main Content */}
        <Card>
          {/* Search and Action Buttons */}
          <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mijoz ismi yoki telefon raqami bo'yicha qidirish..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                <Filter size={16} />
                <span>Filtrlar</span>
              </button>
              <button
                onClick={() => {
                  loadClientsWithDebts();
                  loadDebtStats();
                  loadDebtTrend();
                  loadPaymentTrend();
                }}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ''} />
                <span>Yangilash</span>
              </button>
            </div>
          </div>
          
          {/* Filters - Temporarily disabled for debugging */}
          {/* <DebtFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showFilters={showFilters}
          /> */}
          
          {/* Table Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner message="Ma'lumotlar yuklanmoqda..." size="lg" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DollarSign size={64} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qarzdorliklar topilmadi</h3>
              <p className="text-gray-600">Qarzdorligi bo'lgan mijozlar mavjud emas</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table
                columns={columns}
                data={clients}
                loading={loading}
                emptyMessage="Qarzdorligi bo'lgan mijozlar mavjud emas"
                sortable={true}
              />
            </div>
          )}
        </Card>

        {/* Debt Details Modal */}
        {showDebtModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowDebtModal(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Compact Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 m-0">{selectedClient.first_name} {selectedClient.last_name}</h2>
                    <p className="text-sm text-gray-600 m-0">Qarzdorlik tafsilotlari</p>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowDebtModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="p-4">
                {/* Compact Debt Summary */}
                <Card className="mb-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-red-600" size={20} />
                      <div>
                        <span className="text-sm text-red-600 font-medium block">Jami qarzdorlik</span>
                        <span className="text-xl font-bold text-red-700">{formatCurrency(selectedClient.debt_amount)}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Compact Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'sales' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('sales')}
                  >
                    <Receipt size={14} />
                    <span>Sotuvlar</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'transactions' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    <CreditCard size={14} />
                    <span>Tranzaksiyalar</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="max-h-60 overflow-y-auto mb-4">
                  {activeTab === 'sales' && (
                    <div className="space-y-2">
                      {clientDebts.length > 0 ? (
                        clientDebts.map((sale) => (
                          <div key={sale.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900 text-sm">Chek #{sale.receipt_number}</span>
                              <span className="text-xs text-gray-500">{formatDate(sale.created_at)}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <span className="text-gray-600">Jami: <span className="font-medium text-gray-900">{formatCurrency(sale.total_amount)}</span></span>
                              <span className="text-gray-600">To'langan: <span className="font-medium text-green-600">{formatCurrency(sale.paid_amount)}</span></span>
                              <span className="text-gray-600">
                                Qoldi: <span className="font-medium text-red-600">{formatCurrency(sale.total_amount - sale.paid_amount)}</span>
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-6 text-sm">Qarzdorlik sotuvlari topilmadi</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'transactions' && (
                    <div className="space-y-2">
                      {clientTransactions.length > 0 ? (
                        clientTransactions.map((transaction) => (
                          <div key={transaction.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span 
                                className="font-semibold px-2 py-1 rounded text-xs"
                                style={{ 
                                  color: getTransactionTypeColor(transaction.type),
                                  backgroundColor: `${getTransactionTypeColor(transaction.type)}20`
                                }}
                              >
                                {getTransactionTypeLabel(transaction.type)}
                              </span>
                              <span className="text-xs text-gray-500">{formatDateTime(transaction.created_at)}</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-600">Miqdori: <span className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</span></span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-6 text-sm">Qarzdorlik tranzaksiyalari topilmadi</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Compact Payment Section */}
                <Card className="bg-green-50 border-green-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">To'lov qilish</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To'lov miqdori (UZS)</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="To'lov miqdorini kiriting"
                        max={selectedClient.debt_amount}
                        step="0.01"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <small className="text-gray-500 text-xs">Maksimal: {formatCurrency(selectedClient.debt_amount)}</small>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProcessPayment(selectedClient.id, Number(paymentAmount))}
                        disabled={!paymentAmount || Number(paymentAmount) <= 0}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        To'lovni amalga oshirish
                      </button>
                      <button 
                        onClick={() => setShowDebtModal(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        Yopish
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Debt Payment Modal */}
        <DebtPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          client={selectedClient}
          currentDebt={selectedClient?.debt_amount || 0}
          onPaymentComplete={(paymentAmount, newDebtAmount) => {
            handleProcessPayment(selectedClient.id, paymentAmount);
          }}
        />
      </PageLayout>
    </Layout>
  );
} 