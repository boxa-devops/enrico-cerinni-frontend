import { DollarSign, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function RecentTransactions({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">So'nggi operatsiyalar</h2>
        <div className="flex flex-col gap-3">
          <p className="text-gray-500 text-center py-4">No recent transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">So'nggi operatsiyalar</h2>
      <div className="flex flex-col gap-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 transition-colors hover:bg-gray-100">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                {transaction.type === 'sale' ? (
                  <DollarSign size={16} className="text-green-600" />
                ) : (
                  <Package size={16} className="text-blue-600" />
                )}
                <span>
                  {transaction.type === 'sale' 
                    ? `${transaction.client || 'Unknown'}ga sotuv`
                    : `${transaction.supplier || 'Unknown'}dan xarid`
                  }
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No date'}
              </span>
            </div>
            <div className="text-sm font-semibold">
              <span className={(transaction.amount || 0) > 0 ? 'text-green-600' : 'text-red-600'}>
                {(transaction.amount || 0) > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount || 0))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 