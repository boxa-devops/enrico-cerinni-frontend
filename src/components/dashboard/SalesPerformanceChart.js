import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/format';
import TimePeriodSelector from './TimePeriodSelector';

export default function SalesPerformanceChart({ data = [], selectedPeriod = '1month', loading = false, onPeriodChange }) {
  // Default sample data if no data provided
  const defaultData = [
    { month: 'Yan', sales: 850000, orders: 45, avgOrder: 18889, growth: 12 },
    { month: 'Fev', sales: 920000, orders: 52, avgOrder: 17692, growth: 8 },
    { month: 'Mar', sales: 780000, orders: 38, avgOrder: 20526, growth: -15 },
    { month: 'Apr', sales: 1150000, orders: 58, avgOrder: 19828, growth: 47 },
    { month: 'May', sales: 1050000, orders: 55, avgOrder: 19091, growth: -9 },
    { month: 'Iyun', sales: 1200000, orders: 62, avgOrder: 19355, growth: 14 },
    { month: 'Iyul', sales: 1100000, orders: 56, avgOrder: 19643, growth: -8 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{`${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Sotuvlar: ${formatCurrency(data?.sales || 0)}`}
          </p>
          <p className="text-sm text-green-600">
            {`Buyurtmalar: ${data?.orders || 0} ta`}
          </p>
          <p className="text-sm text-purple-600">
            {`O'rtacha: ${formatCurrency(data?.avgOrder || 0)}`}
          </p>
          <p className="text-sm text-orange-600">
            {`O'sish: ${data?.growth > 0 ? '+' : ''}${data?.growth || 0}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Sotuv ko'rsatkichlari</h2>
        <div className="flex items-center gap-4">
          {onPeriodChange && (
            <TimePeriodSelector 
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
            />
          )}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Sotuvlar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Buyurtmalar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">O'sish %</span>
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
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="left"
                dataKey="sales" 
                fill="#3b82f6" 
                name="Sotuvlar"
                radius={[2, 2, 0, 0]}
                animationDuration={800}
              />
              <Bar 
                yAxisId="right"
                dataKey="orders" 
                fill="#10b981" 
                name="Buyurtmalar"
                radius={[2, 2, 0, 0]}
                animationDuration={800}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="growth" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                name="O'sish %"
                animationDuration={800}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Performance Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(chartData.reduce((acc, item) => acc + (item.sales || 0), 0))}
            </p>
            <p className="text-sm text-gray-600">Jami sotuvlar</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {chartData.reduce((acc, item) => acc + (item.orders || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Jami buyurtmalar</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(chartData.length > 0 ? chartData.reduce((acc, item) => acc + (item.avgOrder || 0), 0) / chartData.length : 0)}
            </p>
            <p className="text-sm text-gray-600">O'rtacha buyurtma</p>
          </div>
        </div>
      </div>
    </div>
  );
}
