import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/format';
import TimePeriodSelector from './TimePeriodSelector';

export default function ExpenseBreakdownChart({ data = [], selectedPeriod = '1month', loading = false, onPeriodChange }) {
  // Default sample data if no data provided
  const defaultData = [
    { name: 'Xodimlar maoshi', value: 2500000, color: '#3b82f6' },
    { name: 'Mahsulot sotib olish', value: 3200000, color: '#10b981' },
    { name: 'Ijaraga to\'lov', value: 800000, color: '#f59e0b' },
    { name: 'Kommunal xizmatlar', value: 450000, color: '#ef4444' },
    { name: 'Marketing', value: 300000, color: '#8b5cf6' },
    { name: 'Transport', value: 200000, color: '#06b6d4' },
    { name: 'Boshqa xarajatlar', value: 550000, color: '#64748b' },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const totalExpenses = chartData.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {`${formatCurrency(data.value)} (${percentage}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Xarajatlar taqsimoti</h2>
        <div className="flex items-center gap-4">
          {onPeriodChange && (
            <TimePeriodSelector 
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
            />
          )}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
            <p className="text-sm text-gray-600">Jami xarajatlar</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="relative w-full lg:w-1/2 h-80">
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
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Legend with values */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-3">
            {chartData.map((item, index) => {
              const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.value)}
                    </p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Top Expenses Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Eng katta xarajatlar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {chartData
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map((item, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-gray-50">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-lg font-bold" style={{ color: item.color }}>
                  {formatCurrency(item.value)}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
