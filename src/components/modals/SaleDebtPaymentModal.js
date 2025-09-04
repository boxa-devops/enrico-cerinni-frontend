import { useState } from 'react';
import { DollarSign, AlertCircle, Receipt } from 'lucide-react';
import Modal from './Modal';
import { Button } from '../ui';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Input from '../forms/Input';
import { cn } from '../../utils/cn';

export default function SaleDebtPaymentModal({
  sale,
  isOpen,
  onClose,
  onPayDebt,
  formatCurrency
}) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!sale) return null;

  const totalAmount = Number(sale.total_amount) || 0;
  const paidAmount = Number(sale.paid_amount) || 0;
  const remainingDebt = totalAmount - paidAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentAmount || paymentAmount <= 0) {
      alert('To\'lov miqdorini kiriting');
      return;
    }

    if (Number(paymentAmount) > remainingDebt) {
      alert('To\'lov miqdori qoldi qarzdorlikdan ko\'p bo\'lishi mumkin emas');
      return;
    }

    setLoading(true);
    try {
      await onPayDebt(sale.id, Number(paymentAmount));
      setPaymentAmount('');
    } catch (error) {
      console.error('Error paying debt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentAmount('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Qarzdorlik to'lash"
      size="md"
    >
      <div className="space-y-6">
        {/* Sale Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Receipt className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 m-0">Chek #{sale.receipt_number}</h3>
              <span className="text-sm text-gray-600">
                {new Date(sale.created_at).toLocaleDateString('uz-UZ')}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <strong className="text-gray-700">Mijoz:</strong> 
              <span className="text-gray-900">{sale.client_name || 'Noma\'lum'}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between p-2 bg-white/50 rounded-lg">
                <span className="text-gray-600">Jami summa:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between p-2 bg-white/50 rounded-lg">
                <span className="text-gray-600">To'langan:</span>
                <span className="font-semibold text-green-600">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between p-2 bg-white/50 rounded-lg border-2 border-red-200">
                <span className="text-gray-600 font-medium">Qoldi qarzdorlik:</span>
                <span className="font-bold text-red-600">{formatCurrency(remainingDebt)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" />
              To'lov ma'lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                  To'lov miqdori (UZS)
                </label>
                <Input
                  type="number"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="To'lov miqdorini kiriting"
                  min="0"
                  max={remainingDebt}
                  step="0.01"
                  required
                  className="text-lg font-medium"
                />
                <small className="text-gray-500 text-sm">
                  Maksimal: <span className="font-medium text-red-600">{formatCurrency(remainingDebt)}</span>
                </small>
              </div>

              {remainingDebt > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-800">
                    Bu mijozda {formatCurrency(remainingDebt)} qarzdorlik mavjud
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={loading || !paymentAmount || Number(paymentAmount) <= 0}
                  loading={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? 'To\'lanmoqda...' : 'To\'lovni amalga oshirish'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
} 