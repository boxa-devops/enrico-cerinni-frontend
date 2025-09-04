
const FinanceTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'expenses', name: 'Xarajatlar' },
    { id: 'suppliers', name: 'Yetkazib beruvchilar' },
    { id: 'salary', name: 'Xodimlar' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-red-50 text-red-600 shadow-sm border border-red-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FinanceTabs; 