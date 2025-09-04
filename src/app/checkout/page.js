/**
 * Checkout Page
 * 
 * Point of sale interface for processing customer transactions.
 * Includes product search, cart management, client selection, and payment processing.
 * 
 * @page
 */

'use client';

import { useEffect, Suspense } from 'react';
import { DollarSign } from 'lucide-react';
import logger from '../../utils/logger';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import ClientModal from '../../components/modals/ClientModal';
import { LoadingSpinner, Card, Button } from '../../components/ui';
import {
  ProductSearch,
  CartItems,
  ClientSection,
  PaymentSection,
  PaymentConfirmationModal,
  DebtWarningModal,
  ReceiptModal
} from '../../components/checkout';
import { useCheckout } from '../../hooks/useCheckout';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

// Checkout header component
const CheckoutHeader = ({ cart, total, onCheckout, loading }) => (
  <Card className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <DollarSign className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">
            Sotuv tizimi
          </h1>
          <p className="text-sm text-gray-600 m-0 hidden sm:block">
            Mahsulotlarni qo'shing va to'lovni amalga oshiring
          </p>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mahsulotlar:</span>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {cart.length}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 m-0">Jami summa:</p>
          <p className="text-lg font-bold text-green-600 m-0">
            {(Number(total) || 0).toLocaleString()} UZS
          </p>
        </div>
        <Button
          onClick={onCheckout}
          disabled={cart.length === 0 || loading}
          loading={loading}
          size="lg"
          className="whitespace-nowrap"
        >
          Sotuvni amalga oshirish
        </Button>
      </div>
    </div>
  </Card>
);

// Main checkout content component
const CheckoutContent = () => {
  const checkout = useCheckout();

  return (
    <div className="space-y-4">
      {/* Header */}
      <CheckoutHeader
        cart={checkout.cart}
        total={checkout.total}
        onCheckout={checkout.handleCheckout}
        loading={checkout.loading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 min-h-[600px]">
        {/* Left Column - Product Search & Cart */}
        <div className="space-y-4">
          <ProductSearch
            searchTerm={checkout.searchTerm}
            setSearchTerm={checkout.setSearchTerm}
            searchResults={checkout.searchResults}
            searchLoading={checkout.searchLoading}
            isSearchFocused={checkout.isSearchFocused}
            setIsSearchFocused={checkout.setIsSearchFocused}
            addToCart={checkout.addToCart}
            onBarcodeScan={checkout.handleBarcodeScan}
          />

          <CartItems
            cart={checkout.cart}
            updateQuantity={checkout.updateQuantity}
            updatePrice={checkout.updatePrice}
            removeFromCart={checkout.removeFromCart}
          />
        </div>

        {/* Right Column - Client & Payment */}
        <div className="space-y-4">
          <ClientSection
            selectedClient={checkout.selectedClient}
            clientDebt={checkout.clientDebt}
            setShowClientModal={checkout.setShowClientModal}
            setSelectedClient={checkout.setSelectedClient}
          />

          <PaymentSection
            paymentMethod={checkout.paymentMethod}
            setPaymentMethod={checkout.setPaymentMethod}
            paidAmount={checkout.paidAmount}
            setPaidAmount={checkout.setPaidAmount}
            total={checkout.total}
            remainingAmount={checkout.remainingAmount}
            clientDebt={checkout.clientDebt}
          />
        </div>
      </div>

      {/* Modals */}
      <ClientModal
        isOpen={checkout.showClientModal}
        onClose={() => checkout.setShowClientModal(false)}
        onClientSelect={checkout.selectClient}
        selectedClient={checkout.selectedClient}
      />

      <PaymentConfirmationModal
        paymentModal={checkout.paymentModal}
        setPaymentModal={checkout.setPaymentModal}
        total={checkout.total}
        paymentMethod={checkout.paymentMethod}
        paidAmount={checkout.paidAmount}
        remainingAmount={checkout.remainingAmount}
        selectedClient={checkout.selectedClient}
        clientDebt={checkout.clientDebt}
        loading={checkout.loading}
        processPayment={checkout.processPayment}
      />

      <DebtWarningModal
        showDebtWarning={checkout.showDebtWarning}
        setShowDebtWarning={checkout.setShowDebtWarning}
        debtWarning={checkout.debtWarning}
        onContinue={checkout.handleCheckoutContinue}
        paymentMethod={checkout.paymentMethod}
      />

      <ReceiptModal
        showReceipt={checkout.showReceipt}
        setShowReceipt={checkout.setShowReceipt}
        currentSale={checkout.currentSale}
        cart={checkout.cart}
        selectedClient={checkout.selectedClient}
        clientName={checkout.clientName}
        clientPhone={checkout.clientPhone}
        subtotal={checkout.subtotal}
        total={checkout.total}
        paymentMethod={checkout.paymentMethod}
        paidAmount={checkout.paidAmount}
        remainingAmount={checkout.remainingAmount}
        resetForm={checkout.resetForm}
      />
    </div>
  );
};

// Loading component
const CheckoutLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner 
      message="Autentifikatsiya tekshirilmoqda..." 
      size="lg" 
    />
  </div>
);

/**
 * Main Checkout Page Component
 */
export default function CheckoutPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Handle authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        logger.info('Redirecting to login - not authenticated');
        window.location.href = '/login';
      } else {
        logger.debug('Authentication successful, staying on checkout page');
      }
    } else {
      logger.debug('Still loading authentication...');
    }
  }, [authLoading, user, isAuthenticated]);

  // Show loading during authentication check
  if (authLoading) {
    return (
      <Layout>
        <PageLayout>
          <CheckoutLoading />
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout 
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen"
      >
        <Suspense fallback={<CheckoutLoading />}>
          <CheckoutContent />
        </Suspense>
      </PageLayout>
    </Layout>
  );
} 