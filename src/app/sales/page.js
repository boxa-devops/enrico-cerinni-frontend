'use client';

import { useEffect } from 'react';
import { RefreshCw, DollarSign, Filter, Download, TrendingUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button, LoadingSpinner } from '../../components/ui';
import { 
  SalesFilters, 
  SalesPagination, 
  SaleDetailsModal, 
  SalesTable
} from '../../components/sales';
import SaleDebtPaymentModal from '../../components/modals/SaleDebtPaymentModal';
import { useAuth } from '../../contexts/AuthContext';
import useSales from '../../hooks/useSales';
import { cn } from '../../utils/cn';

// Sales header component
const SalesHeader = ({ stats, showFilters, setShowFilters, onRefresh, onExport, loading, formatCurrency }) => (
  <Card className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
          <TrendingUp className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">
            Sotuvlar
          </h1>
          <p className="text-sm text-gray-600 m-0 hidden sm:block">
            Sotuvlar tarixi va statistikalar
          </p>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 m-0">Jami:</p>
            <p className="text-sm font-semibold text-gray-900 m-0">{stats.total_sales}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 m-0">Tushum:</p>
            <p className="text-sm font-semibold text-green-600 m-0">{formatCurrency(stats.total_revenue)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 m-0">O'rtacha:</p>
            <p className="text-sm font-semibold text-blue-600 m-0">{formatCurrency(stats.avg_order_value)}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "secondary"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="whitespace-nowrap"
          >
            <Filter size={14} className="mr-1" />
            Filtrlar
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            className="whitespace-nowrap"
          >
            <Download size={14} className="mr-1" />
            Eksport
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="px-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ''} />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

// Loading component
const SalesLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner 
      message="Autentifikatsiya tekshirilmoqda..." 
      size="lg" 
    />
  </div>
);

export default function SalesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    // State
    sales,
    loading,
    selectedSale,
    showSaleModal,
    showFilters,
    showDebtPaymentModal,
    selectedDebtSale,
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
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    clearFilters,
    exportReport,
    
    // Utilities
    formatDate,
    formatCurrency,
    getStatusBadge
  } = useSales();

  // Check authentication after loading is complete
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        window.location.href = '/login';
      }
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      loadSales();
      loadStats();
    }
  }, [filters, pagination.page, authLoading]);

  const handlePayDebtClick = (sale) => {
    setSelectedDebtSale(sale);
    setShowDebtPaymentModal(true);
  };

  const handleDebtPayment = async (saleId, paymentAmount) => {
    try {
      await handlePayDebt(saleId, paymentAmount);
      setShowDebtPaymentModal(false);
      setSelectedDebtSale(null);
    } catch (error) {
      console.error('Error processing debt payment:', error);
    }
  };

  const handleRefresh = () => {
    loadSales();
    loadStats();
  };

  // Show loading during authentication check
  if (authLoading) {
    return (
      <Layout>
        <PageLayout>
          <SalesLoading />
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout 
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-green-50/30 min-h-screen"
      >
        <div className="space-y-4">
          {/* Header */}
          <SalesHeader
            stats={stats}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onRefresh={handleRefresh}
            onExport={exportReport}
            loading={loading}
            formatCurrency={formatCurrency}
          />

          {/* Filters */}
          {showFilters && (
            <Card>
              <SalesFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                showFilters={showFilters}
              />
            </Card>
          )}

          {/* Main Content */}
          <Card className="min-h-[600px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner message="Ma'lumotlar yuklanmoqda..." size="lg" />
              </div>
            ) : sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <DollarSign size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hech qanday sotuv topilmadi</h3>
                <p className="text-sm text-gray-500 mb-4">Tanlangan filtrlarda sotuvlar mavjud emas</p>
                <Button onClick={clearFilters} size="sm">
                  Filtrlarni tozalash
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pagination */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <SalesPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>

                {/* Sales Table */}
                <div className="px-6 pb-6">
                  <SalesTable
                    sales={sales}
                    onViewSale={handleViewSale}
                    onCancelSale={handleCancelSale}
                    onPayDebt={handlePayDebtClick}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                    getStatusBadge={getStatusBadge}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Modals */}
          <SaleDetailsModal
            selectedSale={selectedSale}
            showSaleModal={showSaleModal}
            onClose={() => setShowSaleModal(false)}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusBadge={getStatusBadge}
          />

          <SaleDebtPaymentModal
            sale={selectedDebtSale}
            isOpen={showDebtPaymentModal}
            onClose={() => {
              setShowDebtPaymentModal(false);
              setSelectedDebtSale(null);
            }}
            onPayDebt={handleDebtPayment}
            formatCurrency={formatCurrency}
          />
        </div>
      </PageLayout>
    </Layout>
  );
} 