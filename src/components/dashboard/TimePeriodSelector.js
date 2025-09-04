import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const TIME_PERIODS = [
  { value: '1week', label: '1 Hafta', days: 7 },
  { value: '1month', label: '1 Oy', days: 30 },
  { value: '3months', label: '3 Oy', days: 90 },
  { value: '6months', label: '6 Oy', days: 180 },
  { value: '1year', label: '1 Yil', days: 365 },
];

export default function TimePeriodSelector({ selectedPeriod, onPeriodChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPeriodData = TIME_PERIODS.find(p => p.value === selectedPeriod) || TIME_PERIODS[1];

  const handlePeriodSelect = (period) => {
    onPeriodChange(period.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
      >
        <Calendar size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {selectedPeriodData.label}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period.value}
                  onClick={() => handlePeriodSelect(period)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                    selectedPeriod === period.value 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { TIME_PERIODS };
