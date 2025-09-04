import Modal from '../modals/Modal';
import Button from '../ui/Button';
import { PAYMENT_METHODS } from '../../utils/constants';
import { AlertCircle, User } from 'lucide-react';

export default function PaymentConfirmationModal({
  paymentModal,
  setPaymentModal,
  total,
  paymentMethod,
  paidAmount,
  remainingAmount,
  selectedClient,
  clientDebt,
  loading,
  processPayment
}) {
  return (
    <Modal
      isOpen={paymentModal}
      onClose={() => setPaymentModal(false)}
      title="To'lovni tasdiqlash"
      size="md"
    >
      <div className="space-y-6">
        {!selectedClient ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <User size={32} className="text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Mijoz tanlanmagan</h3>
              <p className="text-sm text-gray-600 leading-relaxed">To'lovni davom ettirish uchun avval mijozni tanlang. Bu ma'lumotlar savdo tarixida saqlanadi va keyingi xaridlar uchun foydali bo'ladi.</p>
            </div>
            <div className="pt-2">
              <Button variant="secondary" onClick={() => setPaymentModal(false)} fullWidth>
                Orqaga qaytish
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov ma'lumotlari</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-100">
                    <span className="text-sm font-medium text-gray-600">Mijoz:</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedClient.first_name} {selectedClient.last_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-100">
                    <span className="text-sm font-medium text-gray-600">Jami summa:</span>
                    <span className="text-sm font-bold text-green-600">{(Number(total) || 0).toFixed(2)} UZS</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-100">
                    <span className="text-sm font-medium text-gray-600">To'lov usuli:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {paymentMethod === PAYMENT_METHODS.FULL && 'To\'liq to\'lov'}
                      {paymentMethod === PAYMENT_METHODS.PARTIAL && 'Qisman to\'lov'}
                      {paymentMethod === PAYMENT_METHODS.DEBT && 'Qarzdorlik'}
                    </span>
                  </div>
                  {paymentMethod === PAYMENT_METHODS.PARTIAL && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-blue-100">
                        <span className="text-sm font-medium text-gray-600">To'langan summa:</span>
                        <span className="text-sm font-semibold text-blue-600">{(Number(paidAmount) || 0).toFixed(2)} UZS</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-600">Qolgan summa:</span>
                        <span className="text-sm font-semibold text-red-600">{(Number(remainingAmount) || 0).toFixed(2)} UZS</span>
                      </div>
                    </>
                  )}
                  {selectedClient && (Number(clientDebt) || 0) > 0 && (
                    <div className="flex justify-between items-center py-2 bg-amber-50 px-3 rounded-md border border-amber-200">
                      <span className="text-sm font-medium text-amber-700">Mavjud qarzdorlik:</span>
                      <span className="text-sm font-semibold text-amber-800">{(Number(clientDebt) || 0).toFixed(2)} UZS</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button onClick={processPayment} disabled={loading} fullWidth>
                {loading ? 'Yuklanmoqda...' : 'Tasdiqlash'}
              </Button>
              <Button variant="secondary" onClick={() => setPaymentModal(false)} fullWidth>
                Bekor qilish
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
} 