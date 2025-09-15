import { useState, useMemo } from 'react';
import { Plus, Eye, Edit, Trash2, Search, Filter, Calendar } from 'lucide-react';
import { Card } from '../../ui';

const ExpensesTab = ({ 
  expenses, 
  formatCurrency, 
  formatDate, 
  onAddExpense, 
  onEditExpense, 
  onDeleteExpense,
  onViewExpense,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Get unique categories from expenses
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(expenses.map(expense => expense.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [expenses]);

  // Filter expenses based on search and filters
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description?.toLowerCase().includes(searchLower) ||
        expense.category?.toLowerCase().includes(searchLower) ||
        expense.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [expenses, searchTerm, selectedCategory, dateFilter]);

  // Paginated expenses
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredExpenses.length / pageSize);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setDateFilter('all');
    setCurrentPage(1);
  };
  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
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
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Xarajatlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Barcha kategoriyalar</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Barcha sanalar</option>
              <option value="today">Bugun</option>
              <option value="week">So'nggi hafta</option>
              <option value="month">So'nggi oy</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => {
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={5}>5 ta</option>
              <option value={10}>10 ta</option>
              <option value={20}>20 ta</option>
              <option value={50}>50 ta</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Filter size={14} />
              Tozalash
            </button>
          </div>

          {/* Results summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Jami: {filteredExpenses.length} ta xarajat</span>
            {filteredExpenses.length !== expenses.length && (
              <span>({expenses.length} tadan filtrlangan)</span>
            )}
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Xarajatlar</h2>
              <p className="text-sm text-gray-600">Barcha xarajatlarni boshqaring</p>
            </div>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onAddExpense}
              disabled={loading}
            >
              <Plus size={16} />
              Yangi xarajat
            </button>
          </div>
        </div>
        
        {paginatedExpenses.length === 0 ? (
          <div className="p-8 text-center">
            {expenses.length === 0 ? (
              <div className="space-y-2">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 text-sm">Hali xarajatlar qo'shilmagan</p>
                <button
                  onClick={onAddExpense}
                  className="text-red-600 text-sm hover:text-red-700 underline"
                >
                  Birinchi xarajatni qo'shing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 text-sm">Filtr bo'yicha xarajat topilmadi</p>
                <button
                  onClick={resetFilters}
                  className="text-red-600 text-sm hover:text-red-700 underline"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategoriya</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sana</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Izohlar</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{expense.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">{formatCurrency(expense.amount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(expense.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{expense.notes || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          {onViewExpense && (
                            <button 
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-105 transform"
                              onClick={() => onViewExpense(expense)}
                              title="Ko'rish"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          <button 
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hover:scale-105 transform"
                            onClick={() => onEditExpense(expense)}
                            title="Tahrirlash"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-105 transform"
                            onClick={() => onDeleteExpense(expense.id)}
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
                    Sahifa {currentPage} / {totalPages} (Jami: {filteredExpenses.length})
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
          </>
        )}
      </Card>
    </div>
  );
};

export default ExpensesTab; 