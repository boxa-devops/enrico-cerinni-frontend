/**
 * Finance Report Component
 * 
 * Comprehensive financial analytics including revenue, expenses, profit margins,
 * and cash flow analysis with interactive charts and detailed breakdowns.
 */

'use client';

import { useState } from 'react';
import { 
  DollarSign,
  TrendingUp, 
  TrendingDown,
  CreditCard,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  FileText,
  Wallet
} from 'lucide-react';
import { Card, Button } from '../ui';
import { cn } from '../../utils/cn';

const FinanceReport = ({ data = {}, dateRange, onDateRangeChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');

  // Mock financial data - replace with real API data
  const financeData = {
    totalRevenue: 25400000,
    totalExpenses: 18200000,
    netProfit: 7200000,
    profitMargin: 28.3,
    cashFlow: 5800000,
    expenses: {
      suppliers: 12000000,
      salaries: 3500000,
      rent: 1200000,
      utilities: 800000,
      marketing: 700000
    },
    monthlyData: [
      { month: 'Yan', revenue: 2100000, expenses: 1500000, profit: 600000 },
      { month: 'Fev', revenue: 2300000, expenses: 1600000, profit: 700000 },
      { month: 'Mar', revenue: 2500000, expenses: 1700000, profit: 800000 },
      { month: 'Apr', revenue: 2200000, expenses: 1550000, profit: 650000 },
      { month: 'May', revenue: 2800000, expenses: 1900000, profit: 900000 },
      { month: 'Iyun', revenue: 3100000, expenses: 2100000, profit: 1000000 }
    ],
    paymentMethods: {
      cash: 15400000,
      card: 8200000,
      debt: 1800000
    }
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color, subtitle }) => (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          <div className="flex items-center gap-1 mt-2">
            {changeType === 'increase' ? (
              <ArrowUpRight className="text-green-600" size={16} />
            ) : (
              <ArrowDownRight className="text-red-600" size={16} />
            )}
            <span className={cn(
              'text-sm font-medium',
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            )}>
              {change}
            </span>
            <span className="text-sm text-gray-500">o'tgan oyga nisbatan</span>
          </div>
        </div>
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          color
        )}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );

  const ExpenseBreakdown = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Xarajatlar taqsimoti
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Asosiy xarajat kategoriyalari
          </p>
        </div>
        <Button variant="outline" size="sm">
          <PieChart size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(financeData.expenses).map(([category, amount], index) => {
          const percentage = ((amount / financeData.totalExpenses) * 100).toFixed(1);
          const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-red-500'
          ];
          
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={cn('w-3 h-3 rounded-full', colors[index])}></div>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {category === 'suppliers' ? 'Yetkazib beruvchilar' :
                   category === 'salaries' ? 'Maoshlar' :
                   category === 'rent' ? 'Ijara' :
                   category === 'utilities' ? 'Kommunal' : 'Marketing'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {amount.toLocaleString()} UZS
                </p>
                <p className="text-xs text-gray-500">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Jami xarajat</span>
          <span className="text-lg font-bold text-gray-900">
            {financeData.totalExpenses.toLocaleString()} UZS
          </span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Umumiy daromad"
          value={`${financeData.totalRevenue.toLocaleString()} UZS`}
          change="+15.2%"
          changeType="increase"
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <MetricCard
          title="Umumiy xarajat"
          value={`${financeData.totalExpenses.toLocaleString()} UZS`}
          change="+8.7%"
          changeType="increase"
          icon={CreditCard}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
        <MetricCard
          title="Sof foyda"
          value={`${financeData.netProfit.toLocaleString()} UZS`}
          change="+22.1%"
          changeType="increase"
          icon={TrendingUp}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle={`${financeData.profitMargin}% foyda marjasi`}
        />
        <MetricCard
          title="Pul oqimi"
          value={`${financeData.cashFlow.toLocaleString()} UZS`}
          change="+18.5%"
          changeType="increase"
          icon={Wallet}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Daromad vs Xarajat
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Oylik moliyaviy ko'rsatkichlar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="week">Haftalik</option>
                <option value="month">Oylik</option>
                <option value="quarter">Choraklik</option>
              </select>
              <Button variant="outline" size="sm">
                <Download size={16} />
              </Button>
            </div>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">Moliyaviy grafik</p>
              <p className="text-xs text-gray-400 mt-1">Daromad va xarajat taqqoslash grafigi</p>
            </div>
          </div>
        </Card>

        {/* Expense Breakdown */}
        <ExpenseBreakdown />
      </div>

      {/* Payment Methods Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                To'lov usullari
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Daromad taqsimoti
              </p>
            </div>
            <PieChart className="text-gray-400" size={20} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-900">Naqd</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {financeData.paymentMethods.cash.toLocaleString()} UZS
                </p>
                <p className="text-xs text-gray-500">
                  {((financeData.paymentMethods.cash / financeData.totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-900">Karta</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {financeData.paymentMethods.card.toLocaleString()} UZS
                </p>
                <p className="text-xs text-gray-500">
                  {((financeData.paymentMethods.card / financeData.totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-gray-900">Qarz</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {financeData.paymentMethods.debt.toLocaleString()} UZS
                </p>
                <p className="text-xs text-gray-500">
                  {((financeData.paymentMethods.debt / financeData.totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Profit Margin Trend */}
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Foyda marjasi tendensiyasi
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Oylik foyda ko'rsatkichlari
              </p>
            </div>
            <Button variant="outline" size="sm">
              <FileText size={16} />
            </Button>
          </div>

          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="mx-auto text-gray-400 mb-2" size={40} />
              <p className="text-gray-500">Foyda marjasi grafigi</p>
              <p className="text-xs text-gray-400 mt-1">Oylik foyda o'sish ko'rsatkichlari</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Financial Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Moliyaviy operatsiyalar
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Barcha moliyaviy operatsiyalarning batafsil ro'yxati
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar size={16} />
              Filtr
            </Button>
            <Button variant="outline" size="sm">
              <FileText size={16} />
              Excel
            </Button>
            <Button size="sm">
              <Download size={16} />
              PDF
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tavsif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daromad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xarajat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balans
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                const isIncome = Math.random() > 0.4;
                const amount = Math.floor(Math.random() * 500000 + 50000);
                
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      2024-01-{10 + i}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isIncome ? `Sotuv #${1000 + i}` : `Xarajat #${2000 + i}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isIncome ? 'Sotuv' : 'Xarajat'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {isIncome ? `+${amount.toLocaleString()} UZS` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {!isIncome ? `-${amount.toLocaleString()} UZS` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(Math.random() * 1000000).toLocaleString()} UZS
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FinanceReport;
