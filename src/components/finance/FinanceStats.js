
const FinanceStats = ({ stats, formatCurrency }) => {
  const statCards = [
    {
      title: 'Jami xarajatlar',
      value: stats.totalExpenses,
      subtitle: 'Bu oy',
      color: 'text-red-600'
    },
    {
      title: 'Yetkazib beruvchilar',
      value: stats.supplierCosts,
      subtitle: 'Xarajatlar',
      color: 'text-orange-600'
    },
    {
      title: 'Ish haqi',
      value: stats.salaryExpenses,
      subtitle: 'Xodimlar',
      color: 'text-blue-600'
    },
    {
      title: 'Kunlik xarajatlar',
      value: stats.dailyExpenses,
      subtitle: 'O\'rtacha',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">{card.title}</h3>
              <p className={`text-lg font-bold ${card.color} mb-0.5`}>
                {formatCurrency(card.value)}
              </p>
              <span className="text-xs text-gray-400">{card.subtitle}</span>
            </div>
            <div className={`w-2 h-12 rounded-full ${
              card.color.includes('red') ? 'bg-red-100' :
              card.color.includes('orange') ? 'bg-orange-100' :
              card.color.includes('blue') ? 'bg-blue-100' :
              'bg-purple-100'
            }`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinanceStats; 