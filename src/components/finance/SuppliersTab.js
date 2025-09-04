import { Plus, Eye, Edit, Trash2, Building2 } from 'lucide-react';

const SuppliersTab = ({ 
  suppliers, 
  formatDate, 
  onAddSupplier, 
  onEditSupplier, 
  onDeleteSupplier,
  onViewSupplier
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Yetkazib beruvchilar</h2>
            <p className="text-sm text-gray-600">Barcha yetkazib beruvchilarni boshqaring</p>
          </div>
          <button 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
            onClick={onAddSupplier}
          >
            <Plus size={16} />
            Yangi yetkazib beruvchi
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          {suppliers.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">Hali yetkazib beruvchilar qo'shilmagan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bog'lanish</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manzil</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Building2 size={14} className="text-orange-600" />
                          </div>
                          {supplier.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{supplier.contact_person || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {supplier.phone ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {supplier.phone}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{supplier.email || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{supplier.address || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          {onViewSupplier && (
                            <button 
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-105 transform"
                              onClick={() => onViewSupplier(supplier)}
                              title="Ko'rish"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          <button 
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hover:scale-105 transform"
                            onClick={() => onEditSupplier(supplier)}
                            title="Tahrirlash"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-105 transform"
                            onClick={() => onDeleteSupplier(supplier.id)}
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersTab; 