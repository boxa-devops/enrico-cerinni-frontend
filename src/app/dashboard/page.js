/**
 * Dashboard Page
 * 
 * Main dashboard page displaying key business metrics, charts, and recent transactions.
 * Provides an overview of the store's performance and current status.
 * 
 * @page
 */

'use client';

import { Suspense } from 'react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { DashboardContent } from '../../components/dashboard';
import { useDashboard } from '../../hooks';

// Loading component for dashboard content
const DashboardLoading = () => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner message="Boshqaruv paneli yuklanmoqda..." />
  </div>
);

// Error component for dashboard
const DashboardError = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Ma'lumotlarni yuklashda xatolik
      </h3>
      <p className="text-sm text-gray-600">
        {error || 'Noma\'lum xatolik yuz berdi'}
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Qayta urinish
      </button>
    )}
  </div>
);

// Main dashboard content component
const DashboardPageContent = () => {
  const { 
    stats, 
    recentTransactions, 
    chartData, 
    selectedPeriod, 
    loading, 
    chartLoading, 
    error, 
    handlePeriodChange,
    refetch 
  } = useDashboard();

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError error={error} onRetry={refetch} />;
  }

  return (
    <DashboardContent 
      stats={stats} 
      recentTransactions={recentTransactions}
      chartData={chartData}
      selectedPeriod={selectedPeriod}
      chartLoading={chartLoading}
      onPeriodChange={handlePeriodChange}
    />
  );
};

/**
 * Dashboard Page Component
 */
export default function DashboardPage() {
  return (
    <Layout>
      <PageLayout 
        title="Boshqaruv paneli"
        subtitle="Xush kelibsiz! Mana do'koningizning umumiy ko'rinishi."
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen"
      >
        <Suspense fallback={<DashboardLoading />}>
          <DashboardPageContent />
        </Suspense>
      </PageLayout>
    </Layout>
  );
} 