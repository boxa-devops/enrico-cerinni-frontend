import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

const ExpensesTab = ({ 
  expenses, 
  formatCurrency, 
  formatDate, 
  onAddExpense, 
  onEditExpense, 
  onDeleteExpense,
  onViewExpense
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Xarajatlar</h2>
            <p className="text-sm text-gray-600">Barcha xarajatlarni boshqaring</p>
          </div>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
            onClick={onAddExpense}
          >
            <Plus size={16} />
            Yangi xarajat
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          {expenses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">Hali xarajatlar qo'shilmagan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
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
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{expense.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesTab; 