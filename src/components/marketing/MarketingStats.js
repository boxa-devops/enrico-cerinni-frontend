'use client';

import { BarChart3, MessageSquare, Smartphone, Bot, Users, TrendingUp, Clock } from 'lucide-react';
import { Card, LoadingSpinner } from '../ui';

const MarketingStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner message="Statistikalar yuklanmoqda..." size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistikalar mavjud emas</h3>
        <p className="text-gray-600">Marketing faoliyati boshlangandan so'ng statistikalar ko'rinadi</p>
      </div>
    );
  }

  const {
    total_broadcasts = 0,
    sms_broadcasts = 0,
    telegram_broadcasts = 0,
    total_recipients = 0,
    successful_deliveries = 0,
    failed_deliveries = 0,
    recent_broadcasts = [],
    delivery_rate = 0,
  } = stats;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDeliveryRateColor = (rate) => {
    if (rate >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (rate >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const statsCards = [
    {
      title: "Jami broadcast",
      value: total_broadcasts,
      icon: MessageSquare,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "SMS broadcast",
      value: sms_broadcasts,
      icon: Smartphone,
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      title: "Telegram broadcast",
      value: telegram_broadcasts,
      icon: Bot,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Jami qabul qiluvchilar",
      value: total_recipients,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200"
    },
    {
      title: "Yetkazib berish foizi",
      value: `${delivery_rate}%`,
      icon: TrendingUp,
      color: getDeliveryRateColor(delivery_rate)
    },
    {
      title: "Muvaffaqiyatli yuborilgan",
      value: successful_deliveries,
      icon: Clock,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Delivery Details */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetkazib berish ma'lumotlari</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-green-800">Muvaffaqiyatli</span>
            </div>
            <span className="text-lg font-bold text-green-600">{successful_deliveries}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-sm font-medium text-red-800">Muvaffaqiyatsiz</span>
            </div>
            <span className="text-lg font-bold text-red-600">{failed_deliveries}</span>
          </div>
        </div>
      </Card>

      {/* Recent Broadcasts */}
      {recent_broadcasts.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi broadcastlar</h3>
          <div className="space-y-3">
            {recent_broadcasts.map((broadcast, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {broadcast.type === 'sms' ? (
                      <Smartphone size={16} className="text-green-600" />
                    ) : (
                      <Bot size={16} className="text-purple-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {broadcast.type === 'sms' ? 'SMS' : 'Telegram'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    {broadcast.message.length > 50 
                      ? `${broadcast.message.substring(0, 50)}...` 
                      : broadcast.message
                    }
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{broadcast.recipients_count} ta qabul qiluvchi</span>
                    <span>{formatDate(broadcast.created_at)}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  broadcast.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {broadcast.status === 'success' ? 'Muvaffaqiyatli' : 'Xatolik'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MarketingStats;