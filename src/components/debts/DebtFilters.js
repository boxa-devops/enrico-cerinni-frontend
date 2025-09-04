import { Search, Filter, Calendar, DollarSign, X, User } from 'lucide-react';
import Input from '../forms/Input';
import Button from '../ui/Button';

export default function DebtFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  showFilters 
}) {
  return (
    <>
      {showFilters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Filtrlarni sozlash</h3>
            </div>
            <Button 
              variant="secondary" 
              onClick={onClearFilters} 
              className="flex items-center gap-1"
              size="sm"
            >
              <X size={12} />
              <span>Tozalash</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Mijoz qidirish</label>
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Mijoz ismi, telefon..."
                  value={filters.search}
                  onChange={(e) => onFilterChange('search', e.target.value)}
                  className="!pl-8 !pr-3 !py-1.5 !text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Boshlanish sanasi</label>
              <div className="relative">
                <Calendar size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => onFilterChange('start_date', e.target.value)}
                  className="!pl-8 !pr-3 !py-1.5 !text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Tugash sanasi</label>
              <div className="relative">
                <Calendar size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => onFilterChange('end_date', e.target.value)}
                  className="!pl-8 !pr-3 !py-1.5 !text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Min. qarz</label>
              <div className="relative">
                <DollarSign size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.min_debt}
                  onChange={(e) => onFilterChange('min_debt', e.target.value)}
                  className="!pl-8 !pr-3 !py-1.5 !text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Max. qarz</label>
              <div className="relative">
                <DollarSign size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  placeholder="∞"
                  value={filters.max_debt}
                  onChange={(e) => onFilterChange('max_debt', e.target.value)}
                  className="!pl-8 !pr-3 !py-1.5 !text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Saralash</label>
              <div className="relative">
                <Filter size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filters.sort_by}
                  onChange={(e) => onFilterChange('sort_by', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white/90 backdrop-blur pl-8 pr-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">Saralash turi</option>
                  <option value="debt_amount_desc">Qarz miqdori (Yuqoridan pastga)</option>
                  <option value="debt_amount_asc">Qarz miqdori (Pastdan yuqoriga)</option>
                  <option value="client_name_asc">Mijoz ismi (A-Z)</option>
                  <option value="client_name_desc">Mijoz ismi (Z-A)</option>
                  <option value="created_at_desc">Sana (Yangi)</option>
                  <option value="created_at_asc">Sana (Eski)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
