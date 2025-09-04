import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import Input from '../forms/Input';
import { AlertCircle, Smartphone, Bot, Send, Users, UserCheck, Search, CheckCircle, XCircle } from 'lucide-react';
import { marketingAPI } from '../../api/marketing';

export default function ClientMessagingModal({ 
  isOpen, 
  onClose, 
  client,
  selectedClients,
  allClients
}) {
  const [messageType, setMessageType] = useState('sms'); // 'sms' or 'telegram'
  const [message, setMessage] = useState('');
  const [selectedClientsForMessage, setSelectedClientsForMessage] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [telegramStatus, setTelegramStatus] = useState(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  // Initialize selected clients when modal opens
  useEffect(() => {
    if (isOpen) {
      if (client) {
        // Single client selected
        setSelectedClientsForMessage([client.id]);
        setSendToAll(false);
      } else if (selectedClients.length > 0) {
        // Multiple clients selected from table
        setSelectedClientsForMessage(selectedClients);
        setSendToAll(false);
      } else {
        // No specific clients selected
        setSelectedClientsForMessage([]);
        setSendToAll(true);
      }
      setMessage('');
      setError('');
      setSuccess('');
      setImage(null);
      testTelegramConnection();
    }
  }, [isOpen, client, selectedClients]);

  const testTelegramConnection = async () => {
    try {
      const response = await marketingAPI.testTelegramConnection();
      if (response.success) {
        setTelegramStatus(response.data);
      } else {
        setTelegramStatus({ connected: false, error: response.message });
      }
    } catch (error) {
      setTelegramStatus({ connected: false, error: error.message });
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setError('');
  };

  const handleSendToAllChange = (e) => {
    setSendToAll(e.target.checked);
    if (e.target.checked) {
      setSelectedClientsForMessage([]);
    }
  };

  const handleClientSelection = (clientId) => {
    setSelectedClientsForMessage(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
    setSendToAll(false);
  };

  const handleSelectAllClients = () => {
    setSelectedClientsForMessage(allClients.map(client => client.id));
    setSendToAll(false);
  };

  const handleClearSelection = () => {
    setSelectedClientsForMessage([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Rasm hajmi 10MB dan katta bo\'lishi mumkin emas');
        return;
      }
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('Xabar matni kiritilmagan');
      return;
    }

    if (!sendToAll && selectedClientsForMessage.length === 0) {
      setError('Kamida bitta mijoz tanlanishi kerak');
      return;
    }

    if (messageType === 'telegram' && !telegramStatus?.connected) {
      setError('Telegram bot ulanmagan. Iltimos, avval ulanishni tekshiring.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const broadcastData = {
        message: message.trim(),
        client_ids: sendToAll ? [] : selectedClientsForMessage,
        send_to_all: sendToAll,
      };

      let response;
      if (messageType === 'sms') {
        response = await marketingAPI.sendSMSBroadcast(broadcastData);
      } else {
        const formData = new FormData();
        formData.append('message', message.trim());
        formData.append('client_ids', JSON.stringify(sendToAll ? [] : selectedClientsForMessage));
        formData.append('send_to_all', sendToAll);
        
        if (image) {
          formData.append('image', image);
        }

        response = await marketingAPI.sendTelegramBroadcast(formData);
      }

      if (response.success) {
        setSuccess(`${messageType === 'sms' ? 'SMS' : 'Telegram'} xabar muvaffaqiyatli yuborildi`);
        setMessage('');
        setImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Xabar yuborishda xatolik');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Xabar yuborishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setSelectedClientsForMessage([]);
    setSendToAll(false);
    setError('');
    setSuccess('');
    setImage(null);
    setSearchTerm('');
    onClose();
  };

  const filteredClients = allClients.filter(client =>
    client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  const selectedClientsCount = selectedClientsForMessage.length;
  const totalClients = allClients.length;

  const getConnectionStatus = () => {
    if (!telegramStatus) return { connected: false, message: 'Ulanish tekshirilmoqda...' };
    return telegramStatus.connected 
      ? { connected: true, message: 'Telegram bot ulangan' }
      : { connected: false, message: 'Telegram bot ulanmagan' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Mijozlarga xabar yuborish"
      size="lg"
    >
      <div className="">
        {/* Message Type Selection */}
        <div className="">
          <button
            className=""
            onClick={() => setMessageType('sms')}
          >
            <Smartphone size={20} />
            <span>SMS</span>
          </button>
          <button
            className=""
            onClick={() => setMessageType('telegram')}
          >
            <Bot size={20} />
            <span>Telegram</span>
          </button>
        </div>

        {/* Telegram Connection Status */}
        {messageType === 'telegram' && (
          <div className="">
            <div className="">
              {connectionStatus.connected ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span>{connectionStatus.message}</span>
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
        )}

        {/* Message Input */}
        <div className="">
          <h3>Xabar matni</h3>
          <textarea
            className=""
            value={message}
            onChange={handleMessageChange}
            placeholder="Xabar matnini kiriting..."
            rows={4}
            maxLength={messageType === 'sms' ? 160 : 4096}
          />
          <div className="">
            {message.length}/{messageType === 'sms' ? 160 : 4096} belgi
          </div>
        </div>

        {/* Image Upload for Telegram */}
        {messageType === 'telegram' && (
          <div className="">
            <h3>Rasm (ixtiyoriy)</h3>
            <div className="">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className=""
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Rasm tanlash
              </Button>
              {image && (
                <div className="">
                  <span>{image.name}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    O'chirish
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipients Selection */}
        <div className="">
          <h3>Qabul qiluvchilar</h3>
          
          <div className="">
            <label className="">
              <input
                type="checkbox"
                checked={sendToAll}
                onChange={handleSendToAllChange}
                className=""
              />
              <span>Barcha mijozlarga yuborish ({totalClients} ta)</span>
            </label>
          </div>

          {!sendToAll && (
            <div className="">
              <div className="">
                <span>Tanlangan mijozlar: {selectedClientsCount} ta</span>
                <div className="">
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

              <div className="">
                <Search size={18} className="" />
                <Input
                  placeholder="Mijozlarni qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=""
                />
              </div>

              <div className="">
                {filteredClients.length === 0 ? (
                  <div className="">
                    <Users size={48} />
                    <p>Mijozlar topilmadi</p>
                  </div>
                ) : (
                  filteredClients.map(client => (
                    <label key={client.id} className="">
                      <input
                        type="checkbox"
                        checked={selectedClientsForMessage.includes(client.id)}
                        onChange={() => handleClientSelection(client.id)}
                        className=""
                      />
                      <div className="">
                        <span className="">
                          {client.first_name} {client.last_name}
                        </span>
                        <span className="">{client.phone}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Actions */}
        <div className="">
          <Button
            onClick={handleSendMessage}
            disabled={loading || !message.trim() || (!sendToAll && selectedClientsCount === 0) || (messageType === 'telegram' && !connectionStatus.connected)}
            loading={loading}
            className=""
          >
            <Send size={20} />
            <span>{messageType === 'sms' ? 'SMS' : 'Telegram'} Yuborish</span>
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Bekor qilish
          </Button>
        </div>
      </div>
    </Modal>
  );
} 