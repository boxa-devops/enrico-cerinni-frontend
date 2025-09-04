import { AlertCircle } from 'lucide-react';
import Modal from '../modals/Modal';
import Button from '../ui/Button';

export default function DebtWarningModal({
  showDebtWarning,
  setShowDebtWarning,
  debtWarning,
  onContinue,
  paymentMethod
}) {
  // Check if this is a debt warning (allows continuation) vs validation error (blocks)
  const isDebtWarning = debtWarning && debtWarning.includes('Davom etishni xohlaysizmi?');
  
  const handleClose = () => {
    setShowDebtWarning(false);
  };

  const handleContinue = () => {
    setShowDebtWarning(false);
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <Modal
      isOpen={showDebtWarning}
      onClose={handleClose}
      title="Ogohlantirish"
      size="sm"
    >
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} className="text-amber-600" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 leading-relaxed">{debtWarning}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          {isDebtWarning ? (
            <>
              <Button onClick={handleContinue} variant="primary" fullWidth>
                Davom etish
              </Button>
              <Button variant="secondary" onClick={handleClose} fullWidth>
                Bekor qilish
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} fullWidth>
              Tushundim
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
} 