import { Search, Filter, Calendar, DollarSign, X } from 'lucide-react';
import Input from '../forms/Input';
import { Button } from '../ui';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';

export default function SalesFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  showFilters 
}) {
  return (
    <>
      {showFilters && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter size={18} className="text-blue-600" />
              Filtrlarni sozlash
            </h3>
            <Button 
              variant="secondary" 
              onClick={onClearFilters} 
              className="flex items-center gap-2"
              size="sm"
            >
              <X size={14} />
              <span>Tozalash</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Qidirish</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Chek raqami, mijoz..."
                  value={filters.search}
                  onChange={(e) => onFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Boshlanish sanasi</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => onFilterChange('start_date', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tugash sanasi</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => onFilterChange('end_date', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Holat</label>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  className={cn(
                    "w-full rounded-lg border-2 border-gray-200 bg-white/90 backdrop-blur pl-10 pr-4 py-2",
                    "text-sm font-medium text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    "transition-colors duration-200"
                  )}
                >
                  <option value="">Barcha holatlar</option>
                  <option value="completed">Tugatildi</option>
                  <option value="cancelled">Bekor qilindi</option>
                  <option value="pending">Kutilmoqda</option>
                  <option value="debt">Qarzdorlik</option>
                  <option value="partially_paid">Qisman to'langan</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Minimal summa</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.min_amount}
                  onChange={(e) => onFilterChange('min_amount', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Maksimal summa</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  placeholder="∞"
                  value={filters.max_amount}
                  onChange={(e) => onFilterChange('max_amount', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 