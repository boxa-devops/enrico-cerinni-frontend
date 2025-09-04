import { Minus, Plus, Trash2 } from 'lucide-react';
import Input from '../forms/Input';

export default function CartItems({
  cart,
  updateQuantity,
  updatePrice,
  removeFromCart
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200/50 flex-1 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">{cart.length}</span>
        </div>
        <h3 className="m-0 text-sm font-semibold text-gray-900">Savat</h3>
      </div>
      {cart.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-xl">🛒</span>
          </div>
          <p className="text-gray-500 text-xs">Savatda mahsulot yo'q</p>
          <p className="text-xs text-gray-400 mt-0.5">Mahsulot qidirish orqali qo'shing</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-2 p-2 bg-gradient-to-br from-white to-gray-50 rounded border border-gray-200 transition-all duration-200 relative overflow-hidden hover:from-gray-50 hover:to-gray-100 hover:-translate-y-[1px] hover:shadow-sm group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="m-0 text-xs font-semibold text-slate-800 leading-tight truncate flex-1">{item.name}</h4>
                  {(item.color_name || item.size_name) && (
                    <div className="flex gap-1 flex-shrink-0">
                      {item.color_name && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-amber-100 text-amber-800">
                          {item.color_name}
                        </span>
                      )}
                      {item.size_name && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-blue-100 text-blue-800">
                          {item.size_name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={isNaN(item.price) ? '' : item.price}
                    onChange={(e) => updatePrice(item.id, e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-[70px] text-xs px-1 py-0.5 border border-gray-300 rounded text-right font-medium text-gray-700"
                  />
                  <span className="text-xs text-gray-500 font-medium">UZS</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 bg-white/80 p-0.5 rounded border border-gray-200 flex-shrink-0">
                <button
                  className="bg-white border border-gray-300 rounded p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400 active:scale-95 min-w-[18px] h-[18px] flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={12} />
                </button>
                <span className="font-semibold text-slate-800 min-w-[20px] text-center text-xs bg-white px-0.5 rounded border border-gray-200">
                  {item.quantity}
                </span>
                <button
                  className="bg-white border border-gray-300 rounded p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400 active:scale-95 min-w-[18px] h-[18px] flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={12} />
                </button>
                <button
                  className="bg-white border border-red-200 rounded p-0.5 text-red-600 hover:bg-red-50 hover:border-red-400 active:scale-95 min-w-[18px] h-[18px] flex items-center justify-center"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 