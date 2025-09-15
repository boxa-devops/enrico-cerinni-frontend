'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingDown, Plus, Search, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import ExpenseModal from '../../components/modals/ExpenseModal';
import SupplierModal from '../../components/modals/SupplierModal';
import EmployeeModal from '../../components/modals/EmployeeModal';
import { LoadingSpinner, Card } from '../../components/ui';
import { 
  FinanceStats, 
  FinanceTabs, 
  ExpensesTab, 
  SuppliersTab, 
  SalaryTab 
} from '../../components/finance';
import { useFinance } from '../../hooks/useFinance';
import { formatCurrency, formatDate } from '../../utils/finance';

// Finance header component similar to inventory
const FinanceHeader = ({ stats, loading, onAddExpense, onAddSupplier, onAddEmployee, activeTab }) => {
  const getTabInfo = () => {
    switch (activeTab) {
      case 'expenses':
        return { title: 'Xarajatlar', subtitle: 'Umumiy xarajatlarni boshqaring', action: onAddExpense, actionText: 'Xarajat qo\'shish' };
      case 'suppliers':
        return { title: 'Yetkazib beruvchilar', subtitle: 'Yetkazib beruvchilarni boshqaring', action: onAddSupplier, actionText: 'Yetkazib beruvchi qo\'shish' };
      case 'salary':
        return { title: 'Xodimlar', subtitle: 'Xodimlar va ish haqini boshqaring', action: onAddEmployee, actionText: 'Xodim qo\'shish' };
      default:
        return { title: 'Moliyaviy boshqaruv', subtitle: 'Xarajatlar va moliyaviy ma\'lumotlar', action: onAddExpense, actionText: 'Qo\'shish' };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <Card className="mb-4 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
            <TrendingDown className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 m-0">
              {tabInfo.title}
            </h1>
            <p className="text-sm text-gray-600 m-0 hidden sm:block">
              {tabInfo.subtitle}
            </p>
          </div>
        </div>
        
        {/* Summary Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Jami xarajat:</span>
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
              {loading ? '...' : formatCurrency(stats.totalExpenses)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Oylik:</span>
            <span className="inline-flex items-center justify-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
              {loading ? '...' : formatCurrency(stats.monthlyExpenses)}
            </span>
          </div>
          <button
            onClick={tabInfo.action}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} className="mr-1" />
            {tabInfo.actionText}
          </button>
        </div>
      </div>
    </Card>
  );
};

// Loading component for finance page
const FinanceLoading = ({ message = "Moliya ma'lumotlari yuklanmoqda..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner 
      message={message} 
      size="lg" 
    />
  </div>
);

// Skeleton loading for stats
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, idx) => (
      <Card key={idx} className="p-4">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-3 bg-gray-300 rounded mb-2 w-20"></div>
              <div className="h-6 bg-gray-300 rounded mb-1 w-16"></div>
              <div className="h-2 bg-gray-300 rounded w-12"></div>
            </div>
            <div className="w-2 h-12 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// Skeleton for tabs
const TabsSkeleton = () => (
  <Card className="p-1">
    <div className="animate-pulse flex space-x-1">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="flex-1 h-10 bg-gray-300 rounded-md"></div>
      ))}
    </div>
  </Card>
);

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Modal states
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const {
    loading,
    dataLoading,
    error,
    expenses,
    suppliers,
    employees,
    stats,
    handleDeleteExpense,
    handleDeleteSupplier,
    handleDeleteEmployee,
    loadData,
    refreshData
  } = useFinance();

  // Set data loaded flag when loading completes
  useEffect(() => {
    if (!loading) {
      setDataLoaded(true);
    }
  }, [loading]);

  // Modal handlers
  const handleAddExpense = () => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleExpenseModalClose = () => {
    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleExpenseSuccess = () => {
    loadData();
    handleExpenseModalClose();
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierModalOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierModalOpen(true);
  };

  const handleSupplierModalClose = () => {
    setSupplierModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSupplierSuccess = () => {
    loadData();
    handleSupplierModalClose();
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEmployeeModalOpen(true);
  };

  const handleEmployeeModalClose = () => {
    setEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleEmployeeSuccess = () => {
    loadData();
    handleEmployeeModalClose();
  };

  // Show initial loading only on first load
  if (loading && !dataLoaded) {
    return (
      <Layout>
        <PageLayout 
          maxWidth="7xl"
          spacing="sm"
          className="bg-gradient-to-br from-gray-50 to-red-50/30 min-h-screen"
        >
          <FinanceLoading />
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout 
        maxWidth="7xl"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-red-50/30 min-h-screen"
      >
        <div className="space-y-4">
          {/* Header */}
          <FinanceHeader
            stats={stats}
            loading={loading}
            onAddExpense={handleAddExpense}
            onAddSupplier={handleAddSupplier}
            onAddEmployee={handleAddEmployee}
            activeTab={activeTab}
          />

          {error && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="text-red-600" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Xatolik yuz berdi</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={refreshData}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Yuklanmoqda...' : 'Qayta urinish'}
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Stats */}
          {loading && !dataLoaded ? (
            <StatsSkeleton />
          ) : (
            <FinanceStats stats={stats} formatCurrency={formatCurrency} />
          )}

          {/* Tabs */}
          {loading && !dataLoaded ? (
            <TabsSkeleton />
          ) : (
            <FinanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'expenses' && (
            <ExpensesTab
              expenses={expenses}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              loading={loading && !dataLoaded}
            />
          )}
          
          {activeTab === 'suppliers' && (
            <SuppliersTab
              suppliers={suppliers}
              formatDate={formatDate}
              onAddSupplier={handleAddSupplier}
              onEditSupplier={handleEditSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              loading={loading && !dataLoaded}
            />
          )}
          
          {activeTab === 'salary' && (
            <SalaryTab
              employees={employees}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onAddEmployee={handleAddEmployee}
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              loading={loading && !dataLoaded}
            />
          )}

          {/* Modals */}
          <ExpenseModal
            isOpen={expenseModalOpen}
            onClose={handleExpenseModalClose}
            expense={editingExpense}
            onSuccess={handleExpenseSuccess}
          />

          <SupplierModal
            isOpen={supplierModalOpen}
            onClose={handleSupplierModalClose}
            supplier={editingSupplier}
            onSuccess={handleSupplierSuccess}
          />

          <EmployeeModal
            isOpen={employeeModalOpen}
            onClose={handleEmployeeModalClose}
            employee={editingEmployee}
            onSuccess={handleEmployeeSuccess}
          />
        </div>
      </PageLayout>
    </Layout>
  );
};

export default FinancePage; 