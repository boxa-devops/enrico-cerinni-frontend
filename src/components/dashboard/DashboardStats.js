import { DollarSign, Package, Users, ShoppingCart, TrendingUp, CreditCard, AlertTriangle, Target } from 'lucide-react';
import StatCard from '../pages/StatCard';

export default function DashboardStats({ stats }) {
  // Calculate additional metrics
  const netProfit = (stats.monthlyRevenue || 0) - (stats.monthlyExpenses || 0);
  const profitMargin = stats.monthlyRevenue > 0 ? ((netProfit / stats.monthlyRevenue) * 100) : 0;
  const avgOrderValue = stats.totalOrders > 0 ? (stats.totalSales / stats.totalOrders) : 0;
  const debtPercentage = stats.totalClients > 0 ? ((stats.clientsWithDebts / stats.totalClients) * 100) : 0;

  return (
    <div className="space-y-6 mb-8">
      {/* Primary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <StatCard
          title="Jami sotuvlar"
          value={stats.totalSales}
          icon={DollarSign}
          trend="up"
          trendValue="+12%"
          format="currency"
        />
        <StatCard
          title="Sof foyda"
          value={netProfit}
          icon={TrendingUp}
          trend={netProfit >= 0 ? "up" : "down"}
          trendValue={`${profitMargin.toFixed(1)}%`}
          format="currency"
        />
        <StatCard
          title="Jami mijozlar"
          value={stats.totalClients}
          icon={Users}
          trend="up"
          trendValue="+8%"
          format="number"
        />
        <StatCard
          title="O'rtacha buyurtma"
          value={avgOrderValue}
          icon={Target}
          trend="up"
          trendValue="+5%"
          format="currency"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <StatCard
          title="Jami mahsulotlar"
          value={stats.totalProducts}
          icon={Package}
          trend="up"
          trendValue="+5%"
          format="number"
        />
        <StatCard
          title="Qarzi bor mijozlar"
          value={stats.clientsWithDebts}
          icon={AlertTriangle}
          trend={debtPercentage > 15 ? "up" : "down"}
          trendValue={`${debtPercentage.toFixed(1)}%`}
          format="number"
          className={debtPercentage > 15 ? "border-red-200 bg-red-50" : ""}
        />
        <StatCard
          title="Oylik daromad"
          value={stats.monthlyRevenue}
          icon={CreditCard}
          trend="up"
          trendValue="+15%"
          format="currency"
        />
        <StatCard
          title="Jami buyurtmalar"
          value={stats.totalOrders || 0}
          icon={ShoppingCart}
          trend="up"
          trendValue="+10%"
          format="number"
        />
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asosiy ko'rsatkichlar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {profitMargin.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Foyda margini</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalProducts > 0 ? (stats.totalSales / stats.totalProducts).toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Mahsulot boshiga sotuv</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {debtPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Qarzli mijozlar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalClients > 0 ? (stats.totalSales / stats.totalClients).toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Mijoz boshiga sotuv</div>
          </div>
        </div>
      </div>
    </div>
  );
} 