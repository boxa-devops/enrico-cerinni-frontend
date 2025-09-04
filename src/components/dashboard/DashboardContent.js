import DashboardStats from './DashboardStats';
import RecentTransactions from './RecentTransactions';
import MonthlyOverview from './MonthlyOverview';
import CashflowChart from './CashflowChart';
import ProfitChart from './ProfitChart';
import SalesPerformanceChart from './SalesPerformanceChart';
import ExpenseBreakdownChart from './ExpenseBreakdownChart';

export default function DashboardContent({ stats, recentTransactions, chartData = {}, selectedPeriod, chartLoading, onPeriodChange }) {
  return (
    <div className="space-y-6">
      {/* Enhanced Statistics */}
      <DashboardStats stats={stats} />
      
      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CashflowChart 
          data={chartData.cashflow} 
          selectedPeriod={selectedPeriod}
          loading={chartLoading}
          onPeriodChange={onPeriodChange}
        />
        <ProfitChart 
          data={chartData.profit}
          selectedPeriod={selectedPeriod}
          loading={chartLoading}
          onPeriodChange={onPeriodChange}
        />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SalesPerformanceChart 
          data={chartData.salesPerformance}
          selectedPeriod={selectedPeriod}
          loading={chartLoading}
          onPeriodChange={onPeriodChange}
        />
        <ExpenseBreakdownChart 
          data={chartData.expenseBreakdown}
          selectedPeriod={selectedPeriod}
          loading={chartLoading}
          onPeriodChange={onPeriodChange}
        />
      </div>
      
      {/* Secondary Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <RecentTransactions transactions={recentTransactions} />
        <MonthlyOverview stats={stats} />
      </div>
    </div>
  );
} 