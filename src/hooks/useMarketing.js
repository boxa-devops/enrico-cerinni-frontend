import { useState, useEffect, useCallback } from 'react';
import { marketingAPI } from '../api/marketing';
import { useApp } from '../contexts/AppContext';

export const useMarketing = () => {
  const { showError, showSuccess } = useApp();
  
  // State for marketing functionality
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [broadcastHistory, setBroadcastHistory] = useState([]);
  const [clients, setClients] = useState([]);
  const [telegramStatus, setTelegramStatus] = useState(null);
  
  // Form states
  const [smsForm, setSmsForm] = useState({
    message: '',
    selectedClients: [],
    sendToAll: false,
  });
  
  const [telegramForm, setTelegramForm] = useState({
    message: '',
    image: null,
    selectedClients: [],
    sendToAll: false,
  });

  // Load marketing statistics
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await marketingAPI.getMarketingStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading marketing stats:', error);
      showError('Marketing statistikalarini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load broadcast history
  const loadBroadcastHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await marketingAPI.getBroadcastHistory();
      if (response.success) {
        setBroadcastHistory(response.data);
      }
    } catch (error) {
      console.error('Error loading broadcast history:', error);
      showError('Broadcast tarixini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load clients for marketing
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await marketingAPI.getMarketingClients();
      if (response.success) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Error loading marketing clients:', error);
      showError('Mijozlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Test Telegram connection
  const testTelegramConnection = useCallback(async () => {
    try {
      setLoading(true);
      const response = await marketingAPI.testTelegramConnection();
      if (response.success) {
        setTelegramStatus(response.data);
        showSuccess('Telegram bot ulanishi muvaffaqiyatli');
      } else {
        setTelegramStatus({ connected: false, error: response.message });
        showError('Telegram bot ulanishi muvaffaqiyatsiz');
      }
    } catch (error) {
      console.error('Error testing Telegram connection:', error);
      setTelegramStatus({ connected: false, error: error.message });
      showError('Telegram bot ulanishini tekshirishda xatolik');
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  // Send SMS broadcast
  const sendSMSBroadcast = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await marketingAPI.sendSMSBroadcast(data);
      if (response.success) {
        showSuccess('SMS xabar muvaffaqiyatli yuborildi');
        await loadBroadcastHistory(); // Refresh history
        return true;
      } else {
        showError(response.message || 'SMS yuborishda xatolik');
        return false;
      }
    } catch (error) {
      console.error('Error sending SMS broadcast:', error);
      showError('SMS yuborishda xatolik yuz berdi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess, loadBroadcastHistory]);

  // Send Telegram broadcast
  const sendTelegramBroadcast = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await marketingAPI.sendTelegramBroadcast(data);
      if (response.success) {
        showSuccess('Telegram xabar muvaffaqiyatli yuborildi');
        await loadBroadcastHistory(); // Refresh history
        return true;
      } else {
        showError(response.message || 'Telegram xabar yuborishda xatolik');
        return false;
      }
    } catch (error) {
      console.error('Error sending Telegram broadcast:', error);
      showError('Telegram xabar yuborishda xatolik yuz berdi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess, loadBroadcastHistory]);

  // Validate SMS form
  const validateSmsForm = () => {
    if (!smsForm.message.trim()) {
      showError('Xabar matni kiritilmagan');
      return false;
    }
    
    if (!smsForm.sendToAll && smsForm.selectedClients.length === 0) {
      showError('Kamida bitta mijoz tanlanishi kerak');
      return false;
    }
    
    return true;
  };

  // Validate Telegram form
  const validateTelegramForm = () => {
    if (!telegramForm.message.trim()) {
      showError('Xabar matni kiritilmagan');
      return false;
    }
    
    if (!telegramForm.sendToAll && telegramForm.selectedClients.length === 0) {
      showError('Kamida bitta mijoz tanlanishi kerak');
      return false;
    }
    
    return true;
  };

  // Handle SMS broadcast
  const handleSMSBroadcast = async () => {
    if (!validateSmsForm()) return;

    const broadcastData = {
      message: smsForm.message.trim(),
      client_ids: smsForm.sendToAll ? [] : smsForm.selectedClients,
      send_to_all: smsForm.sendToAll,
    };

    const success = await sendSMSBroadcast(broadcastData);
    if (success) {
      // Reset form
      setSmsForm({
        message: '',
        selectedClients: [],
        sendToAll: false,
      });
    }
  };

  // Handle Telegram broadcast
  const handleTelegramBroadcast = async () => {
    if (!validateTelegramForm()) return;

    const formData = new FormData();
    formData.append('message', telegramForm.message.trim());
    formData.append('client_ids', JSON.stringify(telegramForm.sendToAll ? [] : telegramForm.selectedClients));
    formData.append('send_to_all', telegramForm.sendToAll);
    
    if (telegramForm.image) {
      formData.append('image', telegramForm.image);
    }

    const success = await sendTelegramBroadcast(formData);
    if (success) {
      // Reset form
      setTelegramForm({
        message: '',
        image: null,
        selectedClients: [],
        sendToAll: false,
      });
    }
  };

  // Load initial data
  useEffect(() => {
    loadStats();
    loadBroadcastHistory();
    loadClients();
    testTelegramConnection();
  }, [loadStats, loadBroadcastHistory, loadClients, testTelegramConnection]);

  return {
    // State
    loading,
    stats,
    broadcastHistory,
    clients,
    telegramStatus,
    smsForm,
    telegramForm,
    
    // Actions
    setSmsForm,
    setTelegramForm,
    handleSMSBroadcast,
    handleTelegramBroadcast,
    testTelegramConnection,
    loadStats,
    loadBroadcastHistory,
    loadClients,
  };
}; 