import { useState } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import Input from '../forms/Input';
import { AlertCircle, DollarSign, User } from 'lucide-react';
import { salesAPI } from '../../api/sales';

export default function DebtPaymentModal({ 
  isOpen, 
  onClose, 
  client, 
  currentDebt, 
  onPaymentComplete 
}) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ensure currentDebt is always a number
  const debtAmount = Number(currentDebt) || 0;

  // Don't render if no client is provided
  if (!client) {
    return null;
  }

  const handlePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      setError('Iltimos, to\'lov summasini kiriting');
      return;
    }

    if (paymentAmount > debtAmount) {
      setError('To\'lov summasi qarzdorlikdan ko\'p bo\'lishi mumkin emas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await salesAPI.processDebtPayment(client.id, paymentAmount);
      
      if (response.success) {
        onPaymentComplete(paymentAmount, response.data.new_debt_amount);
        onClose();
        setPaymentAmount('');
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

  const handleClose = () => {
    setPaymentAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Qarzdorlikni to'lash"
      size="sm"
    >
      <div className="space-y-4">
        {/* Client Info - Compact */}
        {client && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-900 m-0">Mijoz ma'lumotlari</h3>
            </div>
            <div className="text-sm space-y-1">
              <p className="m-0">
                <span className="font-medium">Ism:</span> {client.first_name && client.last_name 
                  ? `${client.first_name} ${client.last_name}`.trim()
                  : client.name || ''}
              </p>
              {client.phone && (
                <p className="m-0">
                  <span className="font-medium">Telefon:</span> {client.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Current Debt - Compact */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <div>
              <span className="text-sm text-red-600 font-medium block">Joriy qarzdorlik</span>
              <span className="text-lg font-bold text-red-700">{debtAmount.toLocaleString()} UZS</span>
            </div>
          </div>
        </div>

        {/* Payment Form - Compact */}
        <div className="space-y-3">
          <Input
            label="To'lov summasi (UZS)"
            type="number"
            min="0"
            max={debtAmount}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            placeholder="To'lov miqdorini kiriting"
            icon={DollarSign}
            className="text-sm"
          />

          {paymentAmount > 0 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-green-600 font-medium block">To'lanadi</span>
                  <span className="text-green-700 font-bold">{paymentAmount.toLocaleString()} UZS</span>
                </div>
                <div>
                  <span className="text-orange-600 font-medium block">Qoladi</span>
                  <span className="text-orange-700 font-bold">{(debtAmount - paymentAmount).toLocaleString()} UZS</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handlePayment}
            disabled={loading || !paymentAmount || paymentAmount <= 0}
            loading={loading}
            className="flex-1"
            size="sm"
          >
            To'lovni amalga oshirish
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            size="sm"
          >
            Bekor qilish
          </Button>
        </div>
      </div>
    </Modal>
  );
} 