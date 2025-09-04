import Button from '../ui/Button';

export default function OrderSummary({
  subtotal,
  total,
  cart,
  loading,
  handleCheckout
}) {
  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 flex-1 flex flex-col max-h-[150px] overflow-hidden min-h-0 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">₿</span>
          </div>
          <h3 className="m-0 text-base font-semibold text-gray-900">Xulosa</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 text-sm shrink-0">
            <span className="text-gray-600">Oraliq summa:</span>
            <span className="font-medium text-gray-900">{(Number(subtotal) || 0).toFixed(2)} UZS</span>
          </div>
          <div className="flex items-center justify-between py-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 rounded-lg border border-green-200 text-sm font-semibold text-gray-900 shrink-0">
            <span>Jami:</span>
            <span className="text-green-700 text-lg">{(Number(total) || 0).toFixed(2)} UZS</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={cart.length === 0 || loading}
        className="w-full py-4 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {loading ? 'Yuklanmoqda...' : 'Sotuvni amalga oshirish'}
      </Button>
    </>
  );
} 