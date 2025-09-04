'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, User, Phone, MapPin, FileText, ArrowLeft } from 'lucide-react';
import Modal from './Modal';
import Button from '../ui/Button';
import Input from '../forms/Input';
import { clientsAPI } from '../../api';

const ClientModal = ({ 
  isOpen, 
  onClose, 
  onClientSelect,
  selectedClient = null 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Load initial clients list
  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await clientsAPI.getClients({ 
        limit: 20 
      });
      
      if (response.success && response.data) {
        setClients(response.data.items || []);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search clients
  const searchClients = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await clientsAPI.getClients({ 
        search: term, 
        limit: 10 
      });
      
      if (response.success && response.data) {
        setSearchResults(response.data.items || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching clients:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Load initial clients when modal opens
  useEffect(() => {
    if (isOpen && !showCreateForm) {
      loadClients();
    }
  }, [isOpen, showCreateForm, loadClients]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchClients(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchClients]);

  // Handle client selection
  const handleClientSelect = (client) => {
    onClientSelect(client);
    onClose();
    setSearchTerm('');
    setSearchResults([]);
    setShowCreateForm(false);
    setNewClient({ first_name: '', last_name: '', phone: '', address: '', notes: '' });
  };

  // Handle create new client
  const handleCreateClient = async () => {
    if (!newClient.first_name.trim() || !newClient.last_name.trim()) {
      alert('Iltimos, mijoz ismi va familiyasini kiriting');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await clientsAPI.createClient(newClient);
      
      if (response.success && response.data) {
        handleClientSelect(response.data);
      } else {
        throw new Error('Client creation failed');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Mijoz yaratishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setSearchTerm('');
    setSearchResults([]);
    setShowCreateForm(false);
    setNewClient({ first_name: '', last_name: '', phone: '', address: '', notes: '' });
  };

  // Determine which clients to display
  const displayClients = searchTerm.trim() ? searchResults : clients;
  const isSearching = searchTerm.trim() && searchLoading;
  const showInitialList = !searchTerm.trim() && !loading && clients.length > 0;
  const showNoResults = searchTerm.trim() && !searchLoading && searchResults.length === 0;
  const showEmptyState = !searchTerm.trim() && !loading && clients.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={showCreateForm ? "Yangi mijoz yaratish" : "Mijozni tanlash"}
      size="md"
    >
      <div className="space-y-6">
        {!showCreateForm ? (
          <>
            {/* Search Section */}
            <div className="space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <Input
                  placeholder="Mijoz ismi yoki telefon bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Loading state */}
              {(loading || isSearching) && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-600">{loading ? 'Mijozlar yuklanmoqda...' : 'Qidirilmoqda...'}</p>
                  </div>
                </div>
              )}
              
              {/* Search results */}
              {!isSearching && !loading && searchTerm.trim() && searchResults.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map(client => (
                    <div
                      key={client.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 group"
                      onClick={() => handleClientSelect(client)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {client.first_name} {client.last_name}
                        </h4>
                        {client.phone && (
                          <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                            <Phone size={12} />
                            {client.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Initial clients list */}
              {showInitialList && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Mavjud mijozlar</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{clients.length} mijoz</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {clients.map(client => (
                      <div
                        key={client.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 group"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {client.first_name} {client.last_name}
                          </h4>
                          {client.phone && (
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                              <Phone size={12} />
                              {client.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* No search results */}
              {showNoResults && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">Mijoz topilmadi</h4>
                    <p className="text-sm text-gray-600">Qidiruv natijasiga mos mijoz mavjud emas</p>
                  </div>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Yangi mijoz yaratish
                  </Button>
                </div>
              )}

              {/* Empty state */}
              {showEmptyState && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">Mijozlar mavjud emas</h4>
                    <p className="text-sm text-gray-600">Hali hech qanday mijoz qo'shilmagan</p>
                  </div>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Birinchi mijozni yaratish
                  </Button>
                </div>
              )}

              {/* Initial empty state */}
              {!searchTerm.trim() && !loading && !showInitialList && !showEmptyState && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Search size={32} className="text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">Mijoz qidirish</h4>
                    <p className="text-sm text-gray-600">Mijozni topish uchun nom yoki telefon kiriting</p>
                  </div>
                </div>
              )}
            </div>

            {/* Create New Client Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="secondary"
                className="w-full justify-center gap-2"
              >
                <Plus size={16} />
                Yangi mijoz yaratish
              </Button>
            </div>
          </>
        ) : (
          /* Create Client Form */
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setShowCreateForm(false)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={16} />
                Orqaga
              </button>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ism"
                  value={newClient.first_name}
                  onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
                  placeholder="Mijoz ismini kiriting"
                  required
                />
                
                <Input
                  label="Familiya"
                  value={newClient.last_name}
                  onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
                  placeholder="Mijoz familiyasini kiriting"
                  required
                />
              </div>
              
              <Input
                label="Telefon raqami"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="Telefon raqamini kiriting"
              />
              
              <Input
                label="Manzil"
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                placeholder="Mijoz manzilini kiriting"
              />
              
              <Input
                label="Izohlar"
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                placeholder="Qo'shimcha ma'lumotlar..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleCreateClient}
                disabled={!newClient.first_name.trim() || !newClient.last_name.trim() || createLoading}
                className="flex-1"
              >
                {createLoading ? 'Yaratilmoqda...' : 'Mijozni yaratish'}
              </Button>
              
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="secondary"
                className="flex-1"
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ClientModal; 