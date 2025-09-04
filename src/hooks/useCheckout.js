import { useState, useEffect, useCallback } from 'react';
import { productsAPI, salesAPI, clientsAPI } from '../api';
import { useCart } from './useCart';
import { useProductSearch } from './useProductSearch';
import { usePayment } from './usePayment';
import { useApp } from '../contexts/AppContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import logger from '../utils/logger';

export const useCheckout = () => {
  const { showError, showSuccess } = useApp();
  
  // Use the smaller, focused hooks
  const cart = useCart();
  const productSearch = useProductSearch();
  const [clientDebt, setClientDebt] = useState(0);
  
  // Checkout-specific state
  const [showReceipt, setShowReceipt] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  // Initialize payment hook with cart total and client debt
  const payment = usePayment(cart.total, clientDebt);

  // Load client debt when client is selected
  useEffect(() => {
    if (selectedClient) {
      loadClientDebt(selectedClient.id);
    } else {
      setClientDebt(0);
    }
  }, [selectedClient]);

  const loadClientDebt = async (clientId) => {
    try {
      const response = await clientsAPI.getClient(clientId);
      if (response.success && response.data) {
        setClientDebt(response.data.current_debt || 0);
      }
    } catch (error) {
      logger.error('Error loading client debt:', error);
      setClientDebt(0);
    }
  };

  const handleBarcodeScan = async (barcode) => {
    try {
      logger.debug('Scanning SKU', barcode);
      const response = await productsAPI.getProductByBarcode(barcode);
      
      logger.debug('Product by barcode response', response);
      
      if (response.success && response.data) {
        const product = response.data;
        logger.debug('Product found', product);
        
        // The API now returns the full product with all variants
        // Find the specific variant that matches the scanned barcode
        if (product.variants && product.variants.length > 0) {
          const scannedVariant = product.variants.find(variant => 
            variant.sku && variant.sku.toLowerCase() === barcode.toLowerCase()
          );
          
          if (scannedVariant && scannedVariant.stock_quantity > 0) {
            // Return the full product with variants so ProductSearch can show variant modal
            logger.debug('Variant found with stock', scannedVariant.stock_quantity);
            return Promise.resolve(product);
          } else if (scannedVariant) {
            throw new Error(ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK);
          } else {
            throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
          }
        } else {
          // Single product without variants
          if (product.stock_quantity > 0) {
            return Promise.resolve(product);
          } else {
            throw new Error(ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK);
          }
        }
      } else {
        throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }
    } catch (error) {
      logger.error('Error scanning barcode', error);
      throw error;
    }
  };

  const validateCheckout = () => {
    if (!selectedClient && !clientName.trim()) {
      showError(ERROR_MESSAGES.CLIENT_REQUIRED);
      return false;
    }

    if (cart.cart.length === 0) {
      showError(ERROR_MESSAGES.CART_EMPTY);
      return false;
    }

    if (!payment.validatePayment()) {
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateCheckout()) {
      return;
    }

    setPaymentModal(true);
  };

  const handleCheckoutContinue = async () => {
    // This function is called when user acknowledges the debt warning
    // and wants to continue with the checkout
    setPaymentModal(true);
  };

  const processPayment = async () => {
    setLoading(true);

    try {
      // Calculate amounts
      const total_amount = Number(cart.subtotal.toFixed(2));
      const discount_amount = 0; // No discount for now
      const final_amount = Number(cart.total.toFixed(2));
      const paid_amount = Number(payment.paidAmount || 0);
      const remaining_amount = Number(payment.remainingAmount || 0);

      logger.debug('Cart items before processing', cart.cart);
      logger.debug('Payment details', {
        paymentMethod: payment.paymentMethod,
        paidAmount: paid_amount,
        remainingAmount: remaining_amount,
        total: final_amount
      });
      
      let saleData = {
        client_id: selectedClient ? selectedClient.id : null,
        total_amount: total_amount,
        discount_amount: discount_amount,
        final_amount: final_amount,
        payment_method: payment.getBackendPaymentMethod(),
        paid_amount: paid_amount,
        remaining_amount: remaining_amount,
        notes: '',
        items: cart.cart.map(item => {
          logger.debug('Processing item', item);
          return {
            product_variant_id: item.id,
            quantity: item.quantity,
            unit_price: Number(parseFloat(item.price || 0).toFixed(2)),
            discount_amount: 0
          };
        })
      };

      const response = await salesAPI.createSale(saleData);
      
      if (response.success && response.data) {
        setCurrentSale(response.data);
        setShowReceipt(true);
        setPaymentModal(false);
        showSuccess(SUCCESS_MESSAGES.SALE_CREATED);
      } else {
        throw new Error('Sale creation failed');
      }
    } catch (error) {
      logger.error('Error processing checkout', error);
      showError('Sotuvni amalga oshirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    cart.clearCart();
    setClientName('');
    setClientPhone('');
    setCurrentSale(null);
    setShowReceipt(false);
    setSelectedClient(null);
    payment.resetPayment();
    setClientDebt(0);
    productSearch.clearSearch();
  };

  const selectClient = (client) => {
    setSelectedClient(client);
    const fullName = client.first_name && client.last_name 
      ? `${client.first_name} ${client.last_name}`.trim()
      : client.name || '';
    setClientName(fullName);
    setClientPhone(client.phone || '');
  };

  return {
    // Cart state and actions
    ...cart,
    
    // Product search state and actions
    ...productSearch,
    
    // Payment state and actions
    ...payment,
    
    // Checkout-specific state
    showReceipt,
    clientName,
    clientPhone,
    loading,
    currentSale,
    selectedClient,
    showClientModal,
    paymentModal,
    clientDebt,
    
    // Checkout-specific actions
    setShowReceipt,
    setClientName,
    setClientPhone,
    setShowClientModal,
    setPaymentModal,
    
    // Functions
    handleBarcodeScan,
    handleCheckout,
    handleCheckoutContinue,
    processPayment,
    resetForm,
    selectClient,
    loadClientDebt,
  };
}; 