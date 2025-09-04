import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import Input from '../forms/Input';
import { AlertCircle, DollarSign, Search, User } from 'lucide-react';
import { salesAPI } from '../../api/sales';
import { clientsAPI } from '../../api/clients';

export default function ClientPaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentComplete 
}) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Load clients with debt
  useEffect(() => {
    if (isOpen) {
      loadClientsWithDebt();
    }
  }, [isOpen]);

  const loadClientsWithDebt = async () => {
    try {
      const response = await clientsAPI.getClients({ 
        limit: 100,
        offset: 0
      });
      
      if (response.success && response.data) {
        // Filter clients with debt
        const clientsWithDebt = (response.data.items || []).filter(
          client => (client.debt_amount || 0) > 0
        );
        setClients(clientsWithDebt);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      setError('Mijozlarni yuklashda xatolik yuz berdi');
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setPaymentAmount('');
    setError('');
  };

  const handlePayment = async () => {
    if (!selectedClient) {
      setError('Iltimos, mijozni tanlang');
      return;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      setError('Iltimos, to\'lov summasini kiriting');
      return;
    }

    const currentDebt = Number(selectedClient.debt_amount) || 0;
    if (paymentAmount > currentDebt) {
      setError('To\'lov summasi qarzdorlikdan ko\'p bo\'lishi mumkin emas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await salesAPI.processDebtPayment(selectedClient.id, paymentAmount);
      
      if (response.success) {
        onPaymentComplete(paymentAmount, response.data.new_debt_amount, selectedClient);
        onClose();
        resetModal();
      } else {
        setError(response.message || 'To\'lovni amalga oshirishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.detail || 'To\'lovni amalga oshirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedClient(null);
    setPaymentAmount('');
    setSearchTerm('');
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const filteredClients = clients.filter(client =>
    client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  const currentDebt = selectedClient ? (Number(selectedClient.debt_amount) || 0) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Mijozdan to'lov qabul qilish"
      size="lg"
    >
      <div className="">
        <div className="">
          <h3>Mijozni tanlang</h3>
          
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
                <User size={48} />
                <p>Qarzdor mijozlar topilmadi</p>
              </div>
            ) : (
              filteredClients.map(client => (
                <div
                  key={client.id}
                  className=""
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="">
                    <h4>{client.first_name} {client.last_name}</h4>
                    {client.phone && <p>{client.phone}</p>}
                  </div>
                  <div className="">
                    <span>Qarz: {(Number(client.debt_amount) || 0).toFixed(2)} UZS</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedClient && (
          <div className="">
            <h3>To'lov ma'lumotlari</h3>
            
            <div className="">
              <h4>Tanlangan mijoz</h4>
              <p><strong>Ism:</strong> {selectedClient.first_name} {selectedClient.last_name}</p>
              {selectedClient.phone && <p><strong>Telefon:</strong> {selectedClient.phone}</p>}
              <p><strong>Joriy qarz:</strong> {currentDebt.toFixed(2)} UZS</p>
            </div>

            <div className="">
              <Input
                label="To'lov summasi (UZS)"
                type="number"
                min="0"
                max={currentDebt}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                placeholder="0"
                icon={DollarSign}
              />

              {paymentAmount > 0 && (
                <div className="">
                  <span>To'lanadi: {paymentAmount.toFixed(2)} UZS</span>
                  <span>Qoladi: {(currentDebt - paymentAmount).toFixed(2)} UZS</span>
                </div>
              )}

              {error && (
                <div className="">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="">
          <Button
            onClick={handlePayment}
            disabled={loading || !selectedClient || !paymentAmount || paymentAmount <= 0}
            className=""
          >
            {loading ? 'Yuklanmoqda...' : 'To\'lovni amalga oshirish'}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Bekor qilish
          </Button>
        </div>
      </div>
    </Modal>
  );
} 