import { Printer } from 'lucide-react';
import Modal from '../modals/Modal';
import Button from '../ui/Button';

export default function ReceiptModal({
  showReceipt,
  setShowReceipt,
  currentSale,
  cart,
  selectedClient,
  clientName,
  clientPhone,
  subtotal,
  total,
  paymentMethod,
  paidAmount,
  remainingAmount,
  resetForm
}) {
  const printReceipt = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={showReceipt}
      onClose={() => setShowReceipt(false)}
      title="Chek"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Enrico Cerrini</h2>
          <p className="text-sm text-gray-600 mb-2">Kiyim Do'koni</p>
          <p className="text-xs text-gray-500">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          {currentSale && (
            <p className="text-xs text-gray-500 font-medium mt-1"><strong>Chek raqami:</strong> {currentSale.receipt_number}</p>
          )}
        </div>

        {/* Client Info */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-1">
            <strong>Mijoz:</strong> {selectedClient ? 
              (selectedClient.first_name && selectedClient.last_name 
                ? `${selectedClient.first_name} ${selectedClient.last_name}`.trim()
                : selectedClient.name || '')
              : clientName}
          </p>
          {(selectedClient ? selectedClient.phone : clientPhone) && (
            <p className="text-sm text-gray-600">
              <strong>Telefon:</strong> {selectedClient ? selectedClient.phone : clientPhone}
            </p>
          )}
        </div>

        {/* Products */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Mahsulotlar:</h3>
          <div className="space-y-2">
            {currentSale ? (
              currentSale.items.map(item => (
                <div key={item.product_id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{item.product_name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">{item.quantity} x {item.unit_price} UZS</div>
                    <div className="text-sm font-semibold text-gray-900">{item.total_price} UZS</div>
                  </div>
                </div>
              ))
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    {(item.color_name || item.size_name) && (
                      <div className="flex gap-1 mt-1">
                        {item.color_name && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            {item.color_name}
                          </span>
                        )}
                        {item.size_name && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {item.size_name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">{item.quantity} x {(Number(item.price) || 0)} UZS</div>
                    <div className="text-sm font-semibold text-gray-900">{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)} UZS</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-600">Oraliq summa:</span>
            <span className="text-sm font-medium text-gray-900">{currentSale ? currentSale.total_amount : (Number(subtotal) || 0).toFixed(2)} UZS</span>
          </div>
          <div className="flex justify-between items-center py-1 border-t border-gray-200">
            <span className="text-base font-semibold text-gray-900">Jami:</span>
            <span className="text-base font-bold text-green-600">{currentSale ? currentSale.final_amount : (Number(total) || 0).toFixed(2)} UZS</span>
          </div>
          {paymentMethod === 'partial' && (
            <>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">To'langan:</span>
                <span className="text-sm font-medium text-blue-600">{(Number(paidAmount) || 0).toFixed(2)} UZS</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Qolgan:</span>
                <span className="text-sm font-medium text-red-600">{(Number(remainingAmount) || 0).toFixed(2)} UZS</span>
              </div>
            </>
          )}
        </div>

        {/* Thank you message */}
        <div className="text-center border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 italic">Xaridingiz uchun rahmat!</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={printReceipt} fullWidth>
            <Printer size={16} />
            Chekni chop etish
          </Button>
          <Button
            variant="secondary"
            onClick={resetForm}
            fullWidth
          >
            Yangi sotuv
          </Button>
        </div>
      </div>
    </Modal>
  );
} 