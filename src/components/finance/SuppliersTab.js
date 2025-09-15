import { useState, useMemo } from 'react';
import { Plus, Eye, Edit, Trash2, Building2, Search, Filter } from 'lucide-react';
import { Card } from '../../ui';

const SuppliersTab = ({ 
  suppliers, 
  formatDate, 
  onAddSupplier, 
  onEditSupplier, 
  onDeleteSupplier,
  onViewSupplier,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter suppliers based on search
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(supplier =>
        supplier.name?.toLowerCase().includes(searchLower) ||
        supplier.contact_person?.toLowerCase().includes(searchLower) ||
        supplier.phone?.toLowerCase().includes(searchLower) ||
        supplier.email?.toLowerCase().includes(searchLower) ||
        supplier.address?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [suppliers, searchTerm]);

  // Paginated suppliers
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSuppliers.slice(startIndex, endIndex);
  }, [filteredSuppliers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSuppliers.length / pageSize);

  const resetFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-300 rounded w-40"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Search */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Yetkazib beruvchilarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Jami: {filteredSuppliers.length} ta yetkazib beruvchi</span>
            {filteredSuppliers.length !== suppliers.length && (
              <span>({suppliers.length} tadan filtrlangan)</span>
            )}
          </div>
        </div>
      </Card>

      {/* Suppliers Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Yetkazib beruvchilar</h2>
              <p className="text-sm text-gray-600">Barcha yetkazib beruvchilarni boshqaring</p>
            </div>
            <button 
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onAddSupplier}
              disabled={loading}
            >
              <Plus size={16} />
              Yangi yetkazib beruvchi
            </button>
          </div>
        </div>
        
        {paginatedSuppliers.length === 0 ? (
          <div className="p-8 text-center">
            {suppliers.length === 0 ? (
              <div className="space-y-2">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 text-sm">Hali yetkazib beruvchilar qo'shilmagan</p>
                <button
                  onClick={onAddSupplier}
                  className="text-orange-600 text-sm hover:text-orange-700 underline"
                >
                  Birinchi yetkazib beruvchini qo'shing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 text-sm">Filtr bo'yicha yetkazib beruvchi topilmadi</p>
                <button
                  onClick={resetFilters}
                  className="text-orange-600 text-sm hover:text-orange-700 underline"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}
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
                  {paginatedSuppliers.map((supplier) => (
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Sahifa {currentPage} / {totalPages} (Jami: {filteredSuppliers.length})
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Oldingi
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Keyingi
                    </button>
                  </div>
                </div>
              </div>
            )}
        )}
      </Card>
    </div>
  );
};

export default SuppliersTab; 