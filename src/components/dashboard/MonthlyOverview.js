import { formatCurrency } from '../../utils/format';

export default function MonthlyOverview({ stats }) {
  const netProfit = (stats.monthlyRevenue || 0) - (stats.monthlyExpenses || 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Oylik ko'rinish</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 m-0">Tushum</h3>
          <p className="text-sm font-semibold text-green-600 m-0">{formatCurrency(stats.monthlyRevenue)}</p>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 m-0">Xarajatlar</h3>
          <p className="text-sm font-semibold text-red-600 m-0">{formatCurrency(stats.monthlyExpenses)}</p>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 m-0">Sof foyda</h3>
          <p className="text-sm font-semibold text-green-600 m-0">
            {formatCurrency(netProfit)}
          </p>
        </div>
      </div>
    </div>
  );
} 