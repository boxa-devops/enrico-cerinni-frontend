
import { Receipt, Building2, Users } from 'lucide-react';

const FinanceTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'expenses', name: 'Xarajatlar', icon: Receipt, count: null },
    { id: 'suppliers', name: 'Yetkazib beruvchilar', icon: Building2, count: null },
    { id: 'salary', name: 'Xodimlar', icon: Users, count: null }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-102'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              {tab.count && (
                <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                  activeTab === tab.id ? 'bg-white text-red-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FinanceTabs; 