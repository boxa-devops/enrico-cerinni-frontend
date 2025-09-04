/**
 * Sales Report Component
 * 
 * Detailed sales analytics with charts, metrics, and data tables.
 * Includes sales trends, top products, and performance metrics.
 */

'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Users,
  Calendar,
  Download,
  FileText,
  DollarSign
} from 'lucide-react';
import { Card, Button } from '../ui';
import { cn } from '../../utils/cn';

const SalesReport = ({ data = {}, dateRange, onDateRangeChange }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data - replace with real API data
  const salesMetrics = {
    totalRevenue: 15420000,
    totalSales: 1234,
    avgOrderValue: 125000,
    conversionRate: 3.2,
    topProducts: [
      { name: 'Ko\'ylak', sales: 45, revenue: 2250000 },
      { name: 'Shim', sales: 38, revenue: 1900000 },
      { name: 'Krossovka', sales: 32, revenue: 1600000 },
      { name: 'Sumka', sales: 28, revenue: 1400000 },
      { name: 'Shapka', sales: 22, revenue: 1100000 }
    ],
    salesTrend: [
      { date: '2024-01-01', sales: 12, revenue: 600000 },
      { date: '2024-01-02', sales: 18, revenue: 900000 },
      { date: '2024-01-03', sales: 15, revenue: 750000 },
      { date: '2024-01-04', sales: 22, revenue: 1100000 },
      { date: '2024-01-05', sales: 28, revenue: 1400000 },
      { date: '2024-01-06', sales: 25, revenue: 1250000 },
      { date: '2024-01-07', sales: 32, revenue: 1600000 }
    ]
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {changeType === 'increase' ? (
              <TrendingUp className="text-green-600" size={16} />
            ) : (
              <TrendingDown className="text-red-600" size={16} />
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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Umumiy daromad"
          value={`${salesMetrics.totalRevenue.toLocaleString()} UZS`}
          change="+12.5%"
          changeType="increase"
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <MetricCard
          title="Sotuvlar soni"
          value={salesMetrics.totalSales.toLocaleString()}
          change="+8.3%"
          changeType="increase"
          icon={ShoppingCart}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <MetricCard
          title="O'rtacha buyurtma"
          value={`${salesMetrics.avgOrderValue.toLocaleString()} UZS`}
          change="+5.2%"
          changeType="increase"
          icon={Package}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Konversiya"
          value={`${salesMetrics.conversionRate}%`}
          change="-1.2%"
          changeType="decrease"
          icon={Users}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sotuv tendensiyasi
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Oxirgi 7 kunlik sotuv ko'rsatkichlari
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="revenue">Daromad</option>
                <option value="sales">Sotuvlar</option>
              </select>
              <Button variant="outline" size="sm">
                <Download size={16} />
              </Button>
            </div>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">Sotuv tendensiyasi grafigi</p>
              <p className="text-xs text-gray-400 mt-1">Chart.js yoki Recharts bilan amalga oshiriladi</p>
            </div>
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Eng ko'p sotilgan mahsulotlar
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Tanlangan davrdagi eng mashhur mahsulotlar
              </p>
            </div>
            <Button variant="outline" size="sm">
              <FileText size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            {salesMetrics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} ta sotildi</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {product.revenue.toLocaleString()} UZS
                  </p>
                  <p className="text-sm text-gray-600">daromad</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Sales Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Batafsil sotuv ma'lumotlari
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Barcha sotuvlarning to'liq ro'yxati
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
                  Sotuv ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahsulotlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To'lov usuli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    #S{1000 + i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2024-01-{10 + i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Mijoz {i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.floor(Math.random() * 5) + 1} ta mahsulot
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(Math.random() * 500000 + 50000).toLocaleString()} UZS
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.random() > 0.5 ? 'Naqd' : 'Karta'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Bajarildi
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Ko'rsatilmoqda:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>dan 1-10 gacha, jami 156 ta</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Oldingi
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Keyingi
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalesReport;
