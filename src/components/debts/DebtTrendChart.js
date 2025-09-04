'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export default function DebtTrendChart({ data, paymentData, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-center h-32">
          <div className="flex flex-col items-center gap-3">
            <BarChart3 size={32} className="animate-pulse text-blue-500" />
            <p className="text-gray-600">Grafik yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-center h-32">
          <div className="flex flex-col items-center gap-3">
            <BarChart3 size={48} className="text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Ma'lumot topilmadi</h3>
            <p className="text-gray-600 text-center">Qarzdorlik va to'lov tendentsiyasi ma'lumotlari mavjud emas yoki yuklanmoqda</p>
            <p className="text-sm text-gray-500 text-center">Agar muammo davom etsa, sahifani yangilang yoki administratorga murojaat qiling</p>
          </div>
        </div>
      </div>
    );
  }

  // Combine debt and payment data
  const combinedData = data.map((debtItem) => {
    const paymentItem = paymentData?.find(p => p.date === debtItem.date) || {};
    return {
      ...debtItem,
      total_payments: paymentItem.total_payments || 0,
      payment_count: paymentItem.payment_count || 0
    };
  });

  // Calculate debt trend
  const firstDebtValue = data[0]?.total_debt || 0;
  const lastDebtValue = data[data.length - 1]?.total_debt || 0;
  const debtTrendPercentage = firstDebtValue > 0 ? ((lastDebtValue - firstDebtValue) / firstDebtValue * 100).toFixed(1) : 0;
  const isPositiveDebtTrend = debtTrendPercentage > 0;

  // Calculate payment trend
  const firstPaymentValue = combinedData[0]?.total_payments || 0;
  const lastPaymentValue = combinedData[combinedData.length - 1]?.total_payments || 0;
  const totalPayments = combinedData.reduce((sum, item) => sum + (item.total_payments || 0), 0);
  const avgDailyPayments = totalPayments / combinedData.length;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {new Date(label).toLocaleDateString('uz-UZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-red-600">
              <span className="font-medium">Jami qarz:</span> {formatCurrency(data.total_debt || 0)}
            </p>
            <p className="text-sm text-green-600">
              <span className="font-medium">Kunlik to'lovlar:</span> {formatCurrency(data.total_payments || 0)}
            </p>
            {data.client_count && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Qarzdor mijozlar:</span> {data.client_count} ta
              </p>
            )}
            {data.payment_count && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">To'lov tranzaksiyalari:</span> {data.payment_count} ta
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <BarChart3 className="text-white" size={16} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 m-0">Qarzdorlik Tendentsiyasi</h3>
            <p className="text-sm text-gray-600 m-0">So'nggi 30 kun</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            {isPositiveDebtTrend ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span className={`font-semibold ${isPositiveDebtTrend ? 'text-red-600' : 'text-green-600'}`}>
              {isPositiveDebtTrend ? '+' : ''}{debtTrendPercentage}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">
              {formatCurrency(totalPayments)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="paymentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#6b7280"
              fontSize={11}
            />
            <YAxis 
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value;
              }}
              stroke="#6b7280"
              fontSize={11}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total_debt"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }}
              name="Jami qarz"
            />
            <Line
              type="monotone"
              dataKey="total_payments"
              stroke="#059669"
              strokeWidth={2}
              dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
              name="Kunlik to'lovlar"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
