'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { clientsAPI } from '../api';

// Optimized debounce hook with proper cleanup
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setDebouncedValue('');
    };
  }, []);

  return debouncedValue;
};

export const useClientManagement = (itemsPerPage = 10) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedClients, setSelectedClients] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add',
    client: null,
    loading: false,
    deleting: false
  });
  const [messagingModalState, setMessagingModalState] = useState({
    isOpen: false,
    client: null
  });

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getClients({ 
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        search: debouncedSearchTerm
      });
      
      if (response.success && response.data) {
        setClients(response.data.items || []);
        setTotalItems(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, itemsPerPage]);

  // Simple filtering without memoization to reduce memory usage
  const filteredClients = debouncedSearchTerm 
    ? clients.filter(client =>
        client.first_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        client.last_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (client.phone && client.phone.includes(debouncedSearchTerm))
      )
    : clients;

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    if (debouncedSearchTerm && selectedClients.length > 0) {
      setSelectedClients([]);
    }
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedClients.length]);

  const openModal = useCallback((mode, client = null) => {
    setModalState({
      isOpen: true,
      mode,
      client,
      loading: false,
      deleting: false
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
      client: null
    }));
  }, []);

  const openMessagingModal = useCallback((client) => {
    setMessagingModalState({
      isOpen: true,
      client
    });
  }, []);

  const closeMessagingModal = useCallback(() => {
    setMessagingModalState({
      isOpen: false,
      client: null
    });
  }, []);

  const handleAddClient = useCallback(async (clientData) => {
    setModalState(prev => ({ ...prev, loading: true }));
    try {
      const response = await clientsAPI.createClient(clientData);
      setClients(prev => [...prev, response.data]);
      closeModal();
      loadClients();
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setModalState(prev => ({ ...prev, loading: false }));
    }
  }, [closeModal, loadClients]);

  const handleEditClient = useCallback(async (clientData) => {
    setModalState(prev => ({ ...prev, loading: true }));
    try {
      const response = await clientsAPI.updateClient(modalState.client.id, clientData);
      setClients(prev => prev.map(c => c.id === modalState.client.id ? response.data : c));
      closeModal();
      loadClients();
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setModalState(prev => ({ ...prev, loading: false }));
    }
  }, [modalState.client, closeModal, loadClients]);

  const handleDeleteClient = useCallback(async (clientId) => {
    setModalState(prev => ({ ...prev, deleting: true }));
    try {
      await clientsAPI.deleteClient(clientId);
      setClients(prev => prev.filter(c => c.id !== clientId));
      setSelectedClients(prev => prev.filter(id => id !== clientId));
      closeModal();
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Mijozni o\'chirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setModalState(prev => ({ ...prev, deleting: false }));
    }
  }, [closeModal, loadClients]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedClients.length === 0) return;
    
    setModalState(prev => ({ ...prev, deleting: true }));
    try {
      for (const clientId of selectedClients) {
        await clientsAPI.deleteClient(clientId);
      }
      
      setClients(prev => prev.filter(c => !selectedClients.includes(c.id)));
      setSelectedClients([]);
      loadClients();
    } catch (error) {
      console.error('Error deleting clients:', error);
      alert('Mijozlarni o\'chirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setModalState(prev => ({ ...prev, deleting: false }));
    }
  }, [selectedClients, loadClients]);

  const handleSelectionChange = useCallback((selectedIds) => {
    setSelectedClients(selectedIds);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    // State
    clients: filteredClients,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    totalItems,
    selectedClients,
    modalState,
    messagingModalState,
    
    // Actions
    openModal,
    closeModal,
    openMessagingModal,
    closeMessagingModal,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleBulkDelete,
    handleSelectionChange,
    handlePageChange,
    
    // Computed
    hasSelectedClients: selectedClients.length > 0,
    selectedClientsCount: selectedClients.length
  };
}; 