import { DollarSign, Wallet, CreditCard, AlertCircle } from 'lucide-react';
import Input from '../forms/Input';
import { PAYMENT_METHODS } from '../../utils/constants';

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  paidAmount,
  setPaidAmount,
  total,
  remainingAmount,
  clientDebt
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded flex items-center justify-center">
          <CreditCard size={14} className="text-white" />
        </div>
        <h3 className="m-0 text-sm font-semibold text-gray-900">To'lov usuli</h3>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          className={`flex items-center gap-2 p-2 border-2 rounded text-left transition-all duration-200 ${paymentMethod === PAYMENT_METHODS.FULL ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'}`}
          onClick={() => setPaymentMethod(PAYMENT_METHODS.FULL)}
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center ${paymentMethod === PAYMENT_METHODS.FULL ? 'bg-blue-500' : 'bg-gray-200'}`}>
            <DollarSign size={14} className={paymentMethod === PAYMENT_METHODS.FULL ? 'text-white' : 'text-gray-600'} />
          </div>
          <h4 className="m-0 text-xs font-semibold text-gray-900">To'liq to'lov</h4>
        </button>

        <button
          className={`flex items-center gap-2 p-2 border-2 rounded text-left transition-all duration-200 ${paymentMethod === PAYMENT_METHODS.PARTIAL ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'}`}
          onClick={() => setPaymentMethod(PAYMENT_METHODS.PARTIAL)}
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center ${paymentMethod === PAYMENT_METHODS.PARTIAL ? 'bg-blue-500' : 'bg-gray-200'}`}>
            <Wallet size={14} className={paymentMethod === PAYMENT_METHODS.PARTIAL ? 'text-white' : 'text-gray-600'} />
          </div>
          <h4 className="m-0 text-xs font-semibold text-gray-900">Qisman to'lov</h4>
        </button>

        <button
          className={`flex items-center gap-2 p-2 border-2 rounded text-left transition-all duration-200 ${paymentMethod === PAYMENT_METHODS.DEBT ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'}`}
          onClick={() => setPaymentMethod(PAYMENT_METHODS.DEBT)}
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center ${paymentMethod === PAYMENT_METHODS.DEBT ? 'bg-blue-500' : 'bg-gray-200'}`}>
            <CreditCard size={14} className={paymentMethod === PAYMENT_METHODS.DEBT ? 'text-white' : 'text-gray-600'} />
          </div>
          <h4 className="m-0 text-xs font-semibold text-gray-900">Qarzdorlik</h4>
        </button>
      </div>

      {paymentMethod === PAYMENT_METHODS.PARTIAL && (
        <div className="mt-1.5 p-1.5 bg-gray-50 rounded border border-gray-200">
          <Input
            label="To'langan summa (UZS)"
            type="number"
            min="0"
            max={Number(total) || 0}
            value={isNaN(paidAmount) ? '' : paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            placeholder="0"
            className="text-xs"
          />
          <div className="flex flex-col gap-0.5 mt-1 p-1.5 bg-gray-100 rounded overflow-hidden max-h-[80px]">
            <span className="text-xs text-gray-700">Jami: {(Number(total) || 0).toFixed(2)} UZS</span>
            <span className="text-xs text-gray-700">To'langan: {(Number(paidAmount) || 0).toFixed(2)} UZS</span>
            <span className="text-xs text-red-600 font-semibold">Qolgan: {(Number(remainingAmount) || 0).toFixed(2)} UZS</span>
          </div>
        </div>
      )}

      {paymentMethod === PAYMENT_METHODS.DEBT && (Number(clientDebt) || 0) > 0 && (
        <div className="flex items-center gap-1 p-1.5 bg-red-50 border border-red-200 rounded mt-1.5">
          <AlertCircle size={12} />
          <span className="text-xs font-medium text-red-600">Mijozda {(Number(clientDebt) || 0).toFixed(2)} UZS qarzdorlik mavjud</span>
        </div>
      )}
    </div>
  );
} 