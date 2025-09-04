/**
 * Reports Page
 * 
 * Comprehensive reporting dashboard with different report types and analytics.
 * Features sidebar navigation for different report categories.
 * 
 * @page
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Calendar,
  Download,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import { Card, Button, LoadingSpinner } from '../../components/ui';
import { cn } from '../../utils/cn';
import {
  SalesReport,
  FinanceReport,
  InventoryReport,
  ClientsReport,
  PerformanceReport,
  CustomReport
} from '../../components/reports';

// Report types configuration
const REPORT_TYPES = [
  {
    id: 'sales',
    title: 'Sotuv hisobotlari',
    description: 'Sotuv statistikalari va tendensiyalar',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'finance',
    title: 'Moliyaviy hisobotlar',
    description: 'Daromad, xarajat va foyda tahlili',
    icon: DollarSign,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'inventory',
    title: 'Inventar hisobotlari',
    description: 'Mahsulot zaxirasi va harakati',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'clients',
    title: 'Mijoz hisobotlari',
    description: 'Mijozlar va ularning faoliyati',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'performance',
    title: 'Ishlash ko\'rsatkichlari',
    description: 'Umumiy biznes ko\'rsatkichlari',
    icon: Activity,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  },
  {
    id: 'custom',
    title: 'Maxsus hisobotlar',
    description: 'Moslashtirilgan hisobotlar',
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
];

// Sidebar component
const ReportsSidebar = ({ selectedReport, onReportSelect }) => {
  return (
    <Card className="h-fit sticky top-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={20} />
          Hisobot turlari
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Kerakli hisobot turini tanlang
        </p>
      </div>
      
      <div className="p-2">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          
          return (
            <button
              key={report.id}
              onClick={() => onReportSelect(report.id)}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-all duration-200 mb-1',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                isSelected 
                  ? `${report.bgColor} ${report.borderColor} border shadow-sm` 
                  : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isSelected ? report.bgColor : 'bg-gray-100'
                )}>
                  <Icon 
                    size={16} 
                    className={isSelected ? report.color : 'text-gray-600'} 
                  />
                </div>
                <div className="flex-1">
                  <div className={cn(
                    'text-sm font-medium',
                    isSelected ? report.color : 'text-gray-900'
                  )}>
                    {report.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {report.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

// Report header component
const ReportHeader = ({ reportType }) => {
  const report = REPORT_TYPES.find(r => r.id === reportType);
  if (!report) return null;
  
  const Icon = report.icon;
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center shadow-md',
            'bg-gradient-to-r from-blue-500 to-blue-600'
          )}>
            <Icon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 m-0">
              {report.title}
            </h1>
            <p className="text-sm text-gray-600 m-0">
              {report.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Calendar size={16} />
            Davr tanlash
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Yuklab olish
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Report content component that renders specific report based on type
const ReportContent = ({ reportType }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });

  // Load report data when type changes
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use test API for now - you can switch to authenticated API later
        const { reportsAPI } = await import('../../api');
        
        const filters = {
          start_date: dateRange.start,
          end_date: dateRange.end
        };

        let response;
        switch (reportType) {
          case 'sales':
            response = await reportsAPI.testApi.getSalesReport(filters);
            break;
          case 'finance':
            response = await reportsAPI.testApi.getFinanceReport(filters);
            break;
          case 'inventory':
            response = await reportsAPI.testApi.getInventoryReport();
            break;
          case 'clients':
            response = await reportsAPI.testApi.getClientsReport(filters);
            break;
          case 'performance':
            response = await reportsAPI.testApi.getPerformanceReport(filters);
            break;
          default:
            response = await reportsAPI.testApi.getSalesReport(filters);
        }

        if (response.success) {
          setReportData(response.data);
        } else {
          setError(response.message || 'Failed to load report');
        }
      } catch (err) {
        setError(err.message || 'Failed to load report');
        console.error('Report loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [reportType, dateRange]);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const commonProps = {
    data: reportData,
    dateRange,
    onDateRangeChange: handleDateRangeChange,
    loading,
    error
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Hisobot yuklanmoqda..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <Activity size={48} className="mx-auto mb-2" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Hisobotni yuklashda xatolik
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Qayta urinish
          </Button>
        </div>
      </Card>
    );
  }

  switch (reportType) {
    case 'sales':
      return <SalesReport {...commonProps} />;
    case 'finance':
      return <FinanceReport {...commonProps} />;
    case 'inventory':
      return <InventoryReport {...commonProps} />;
    case 'clients':
      return <ClientsReport {...commonProps} />;
    case 'performance':
      return <PerformanceReport {...commonProps} />;
    case 'custom':
      return <CustomReport {...commonProps} />;
    default:
      return <SalesReport {...commonProps} />;
  }
};

// Main reports content component
const ReportsContent = () => {
  const [selectedReport, setSelectedReport] = useState('sales');

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <ReportHeader reportType={selectedReport} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 min-h-[600px]">
        {/* Left Sidebar */}
        <ReportsSidebar
          selectedReport={selectedReport}
          onReportSelect={setSelectedReport}
        />

        {/* Right Content */}
        <div className="min-w-0">
          <ReportContent reportType={selectedReport} />
        </div>
      </div>
    </div>
  );
};

// Loading component
const ReportsLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner 
      message="Hisobotlar yuklanmoqda..." 
      size="lg" 
    />
  </div>
);

/**
 * Main Reports Page Component
 */
export default function ReportsPage() {
  return (
    <Layout>
      <PageLayout 
        title="Hisobotlar"
        subtitle="Biznes tahlili va hisobotlar bilan tanishing"
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen"
      >
        <Suspense fallback={<ReportsLoading />}>
          <ReportsContent />
        </Suspense>
      </PageLayout>
    </Layout>
  );
}
