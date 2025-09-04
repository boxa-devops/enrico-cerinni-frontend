'use client';

import { useState } from 'react';
import { TrendingDown } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import ExpenseModal from '../../components/modals/ExpenseModal';
import SupplierModal from '../../components/modals/SupplierModal';
import EmployeeModal from '../../components/modals/EmployeeModal';
import { LoadingSpinner } from '../../components/ui';
import { 
  FinanceStats, 
  FinanceTabs, 
  ExpensesTab, 
  SuppliersTab, 
  SalaryTab 
} from '../../components/finance';
import { useFinance } from '../../hooks/useFinance';
import { formatCurrency, formatDate } from '../../utils/finance';

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  
  // Modal states
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const {
    loading,
    error,
    expenses,
    suppliers,
    employees,
    stats,
    handleDeleteExpense,
    handleDeleteSupplier,
    handleDeleteEmployee,
    loadData
  } = useFinance();

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

  if (loading) {
    return (
      <Layout>
        <PageLayout>
          <div className="flex items-center justify-center min-h-64">
            <LoadingSpinner message="Moliya ma'lumotlari yuklanmoqda..." size="lg" />
          </div>
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
        title={(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingDown className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 m-0">
                Moliyaviy boshqaruv
              </h1>
              <p className="text-sm text-gray-600 m-0">
                Xarajatlar, yetkazib beruvchilar va xodimlar boshqaruvi
              </p>
            </div>
          </div>
        )}
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <FinanceStats stats={stats} formatCurrency={formatCurrency} />

          <FinanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'expenses' && (
            <ExpensesTab
              expenses={expenses}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          
          {activeTab === 'suppliers' && (
            <SuppliersTab
              suppliers={suppliers}
              formatDate={formatDate}
              onAddSupplier={handleAddSupplier}
              onEditSupplier={handleEditSupplier}
              onDeleteSupplier={handleDeleteSupplier}
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