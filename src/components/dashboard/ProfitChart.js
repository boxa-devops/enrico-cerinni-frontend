import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/format';
import TimePeriodSelector from './TimePeriodSelector';

export default function ProfitChart({ data = [], selectedPeriod = '1month', loading = false, onPeriodChange }) {
  // Default sample data if no data provided
  const defaultData = [
    { month: 'Yan', revenue: 850000, cost: 320000, profit: 530000, margin: 62.4 },
    { month: 'Fev', revenue: 920000, cost: 350000, profit: 570000, margin: 62.0 },
    { month: 'Mar', revenue: 780000, cost: 290000, profit: 490000, margin: 62.8 },
    { month: 'Apr', revenue: 1150000, cost: 420000, profit: 730000, margin: 63.5 },
    { month: 'May', revenue: 1050000, cost: 380000, profit: 670000, margin: 63.8 },
    { month: 'Iyun', revenue: 1200000, cost: 450000, profit: 750000, margin: 62.5 },
    { month: 'Iyul', revenue: 1100000, cost: 410000, profit: 690000, margin: 62.7 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{`${label}`}</p>
          <p className="text-sm text-green-600">
            {`Daromad: ${formatCurrency(data?.revenue || 0)}`}
          </p>
          <p className="text-sm text-red-600">
            {`Xarajat: ${formatCurrency(data?.cost || 0)}`}
          </p>
          <p className="text-sm text-blue-600">
            {`Foyda: ${formatCurrency(data?.profit || 0)}`}
          </p>
          <p className="text-sm text-gray-600">
            {`Margin: ${data?.margin?.toFixed(1) || 0}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Foyda tahlili</h2>
        <div className="flex items-center gap-4">
          {onPeriodChange && (
            <TimePeriodSelector 
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
            />
          )}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Daromad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Xarajat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Foyda</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative h-80">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600 font-medium">Ma'lumotlar yuklanmoqda...</span>
            </div>
          </div>
        )}
        
        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="#10b981" 
                name="Daromad"
                radius={[2, 2, 0, 0]}
                animationDuration={800}
              />
              <Bar 
                dataKey="cost" 
                fill="#ef4444" 
                name="Xarajat"
                radius={[2, 2, 0, 0]}
                animationDuration={800}
              />
              <Bar 
                dataKey="profit" 
                fill="#3b82f6" 
                name="Foyda"
                radius={[2, 2, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Profit Margin Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {chartData.length > 0 ? `${(chartData.reduce((acc, item) => acc + (item.margin || 0), 0) / chartData.length).toFixed(1)}%` : '0%'}
            </p>
            <p className="text-sm text-gray-600">O'rtacha margin</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(chartData.reduce((acc, item) => acc + (item.profit || 0), 0))}
            </p>
            <p className="text-sm text-gray-600">Jami foyda</p>
          </div>
        </div>
      </div>
    </div>
  );
}
