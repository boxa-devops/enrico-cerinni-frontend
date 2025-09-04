'use client';

import { useState, useRef } from 'react';
import { Bot, Send, Image, Users, UserCheck, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button, Card } from '../ui';

const TelegramBroadcast = ({
  loading,
  clients,
  telegramForm,
  setTelegramForm,
  handleTelegramBroadcast,
  telegramStatus,
  testTelegramConnection,
}) => {
  const fileInputRef = useRef(null);

  const handleMessageChange = (e) => {
    setTelegramForm(prev => ({
      ...prev,
      message: e.target.value
    }));
  };

  const handleSendToAllChange = (e) => {
    setTelegramForm(prev => ({
      ...prev,
      sendToAll: e.target.checked,
      selectedClients: e.target.checked ? [] : prev.selectedClients
    }));
  };

  const handleClientSelection = (clientId) => {
    setTelegramForm(prev => ({
      ...prev,
      selectedClients: prev.selectedClients.includes(clientId)
        ? prev.selectedClients.filter(id => id !== clientId)
        : [...prev.selectedClients, clientId]
    }));
  };

  const handleSelectAllClients = () => {
    setTelegramForm(prev => ({
      ...prev,
      selectedClients: clients.map(client => client.id),
      sendToAll: false
    }));
  };

  const handleClearSelection = () => {
    setTelegramForm(prev => ({
      ...prev,
      selectedClients: []
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Rasm hajmi 10MB dan katta bo\'lishi mumkin emas');
        return;
      }
      setTelegramForm(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleRemoveImage = () => {
    setTelegramForm(prev => ({
      ...prev,
      image: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedClientsCount = telegramForm.selectedClients.length;
  const totalClients = clients.length;

  const getConnectionStatus = () => {
    if (!telegramStatus) return { connected: false, message: 'Ulanish tekshirilmoqda...' };
    return telegramStatus.connected 
      ? { connected: true, message: 'Telegram bot ulangan' }
      : { connected: false, message: 'Telegram bot ulanmagan' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            connectionStatus.connected 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {connectionStatus.connected ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span className="text-sm font-medium">{connectionStatus.message}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={testTelegramConnection}
            disabled={loading}
          >
            Ulanishni tekshirish
          </Button>
        </div>
      </Card>

      {/* Message Input */}
      <Card className="p-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Xabar matni</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            value={telegramForm.message}
            onChange={handleMessageChange}
            placeholder="Xabar matnini kiriting..."
            rows={4}
          />
        </div>
      </Card>

      {/* Image Upload */}
      <Card className="p-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Rasm (ixtiyoriy)</label>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors duration-200">
              {telegramForm.image ? (
                <div className="relative inline-block">
                  <img 
                    src={URL.createObjectURL(telegramForm.image)} 
                    alt="Preview" 
                    className="max-w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Image size={24} className="mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Rasm tanlash uchun bosing</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Recipients Selection */}
      <Card className="p-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Qabul qiluvchilar</label>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={telegramForm.sendToAll}
                onChange={handleSendToAllChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">Barcha mijozlarga yuborish ({totalClients} ta)</span>
            </label>
          </div>

          {!telegramForm.sendToAll && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tanlangan mijozlar: {selectedClientsCount} ta</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllClients}
                    disabled={selectedClientsCount === totalClients}
                  >
                    Hammasini tanlash
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    disabled={selectedClientsCount === 0}
                  >
                    Tozalash
                  </Button>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                {clients.map(client => (
                  <label key={client.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={telegramForm.selectedClients.includes(client.id)}
                      onChange={() => handleClientSelection(client.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </span>
                      <span className="block text-xs text-gray-500">{client.phone}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Send Button */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Jami mijozlar: {totalClients} ta</span>
            </div>
            {!telegramForm.sendToAll && (
              <div className="flex items-center gap-2">
                <UserCheck size={16} />
                <span>Tanlangan: {selectedClientsCount} ta</span>
              </div>
            )}
            {telegramForm.image && (
              <div className="flex items-center gap-2 text-green-600">
                <Image size={16} />
                <span>Rasm qo'shilgan</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleTelegramBroadcast}
            disabled={loading || (!telegramForm.sendToAll && selectedClientsCount === 0) || !telegramForm.message.trim() || !connectionStatus.connected}
            loading={loading}
            className="flex items-center gap-2"
          >
            <Send size={20} />
            <span>Telegram Yuborish</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TelegramBroadcast;