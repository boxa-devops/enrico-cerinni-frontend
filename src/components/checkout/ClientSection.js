import { User, Edit, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function ClientSection({
  selectedClient,
  clientDebt,
  setShowClientModal,
  setSelectedClient
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
        <h3 className="m-0 text-sm font-semibold text-gray-900">Mijoz</h3>
      </div>
      
      {selectedClient ? (
        <div className="flex flex-col gap-1.5">
          <div>
            <h4 className="m-0 mb-0.5 text-xs font-semibold text-gray-900 truncate">{selectedClient.first_name && selectedClient.last_name 
              ? `${selectedClient.first_name} ${selectedClient.last_name}`.trim()
              : selectedClient.name || ''}</h4>
            {selectedClient.phone && <p className="m-0 text-xs text-gray-500">📞 {selectedClient.phone}</p>}
            {(Number(clientDebt) || 0) > 0 && (
              <div className="flex items-center gap-1 p-1 bg-amber-100 border border-amber-500 rounded mt-1">
                <AlertCircle size={12} />
                <span className="text-xs font-medium text-amber-800">Qarzdorlik: {(Number(clientDebt) || 0).toFixed(2)} UZS</span>
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-wrap">
            <Button
              onClick={() => setShowClientModal(true)}
              variant="secondary"
              size="sm"
              className="text-xs px-2 py-1"
            >
              <Edit size={12} />
              O'zgartirish
            </Button>
            <Button
              onClick={() => setSelectedClient(null)}
              variant="secondary"
              size="sm"
              className="text-xs px-2 py-1"
            >
              Bekor qilish
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button
            onClick={() => setShowClientModal(true)}
            className="w-full justify-center text-xs py-2"
          >
            <User size={14} />
            Mijozni tanlash
          </Button>
        </div>
      )}
    </div>
  );
} 