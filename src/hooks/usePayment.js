import { useState, useEffect } from 'react';
import { PAYMENT_METHODS, ERROR_MESSAGES } from '../utils/constants';

export const usePayment = (total, clientDebt = 0) => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.FULL);
  const [paidAmount, setPaidAmount] = useState(0);
  const [showDebtWarning, setShowDebtWarning] = useState(false);
  const [debtWarning, setDebtWarning] = useState('');

  // Update paid amount when payment method changes
  useEffect(() => {
    const validTotal = Number(total) || 0;
    
    if (paymentMethod === PAYMENT_METHODS.FULL) {
      setPaidAmount(validTotal);
    } else if (paymentMethod === PAYMENT_METHODS.DEBT) {
      setPaidAmount(0);
    } else if (paymentMethod === PAYMENT_METHODS.PARTIAL) {
      // For partial payment, don't auto-set the amount, let user input it
      // But if current paidAmount is greater than total, reset it
      if (paidAmount > validTotal) {
        setPaidAmount(0);
      }
    }
  }, [paymentMethod, total]);

  const remainingAmount = (Number(total) || 0) - (Number(paidAmount) || 0);

  const validatePayment = () => {
    // For partial payment validation
    if (paymentMethod === PAYMENT_METHODS.PARTIAL) {
      if (paidAmount >= total) {
        setDebtWarning(ERROR_MESSAGES.PAYMENT_VALIDATION.FULL_PAYMENT_ENTERED);
        setShowDebtWarning(true);
        return false;
      }
      
      if (paidAmount <= 0) {
        setDebtWarning(ERROR_MESSAGES.PAYMENT_VALIDATION.AMOUNT_REQUIRED);
        setShowDebtWarning(true);
        return false;
      }
    }

    // For debt payment - allow it even if client has existing debt
    // The warning should be shown but not block the payment
    if (paymentMethod === PAYMENT_METHODS.DEBT && clientDebt > 0) {
      // Show warning but don't block the payment
      setDebtWarning(`${ERROR_MESSAGES.PAYMENT_VALIDATION.CLIENT_DEBT} ${clientDebt.toFixed(2)} UZS. Davom etishni xohlaysizmi?`);
      setShowDebtWarning(true);
      // Return true to allow the payment to proceed
      return true;
    }

    return true;
  };

  const getBackendPaymentMethod = () => {
    switch (paymentMethod) {
      case PAYMENT_METHODS.FULL:
      case PAYMENT_METHODS.PARTIAL:
        return PAYMENT_METHODS.CASH;
      case PAYMENT_METHODS.DEBT:
        return PAYMENT_METHODS.TRANSFER;
      default:
        return PAYMENT_METHODS.CASH;
    }
  };

  const resetPayment = () => {
    setPaymentMethod(PAYMENT_METHODS.FULL);
    setPaidAmount(0);
    setShowDebtWarning(false);
    setDebtWarning('');
  };

  return {
    paymentMethod,
    paidAmount,
    remainingAmount,
    showDebtWarning,
    debtWarning,
    setPaymentMethod,
    setPaidAmount,
    setShowDebtWarning,
    setDebtWarning,
    validatePayment,
    getBackendPaymentMethod,
    resetPayment,
  };
}; 