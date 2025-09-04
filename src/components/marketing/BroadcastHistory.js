'use client';

import { useState } from 'react';
import { History, Smartphone, Bot, Search, Filter, Calendar, Users } from 'lucide-react';
import { Card, LoadingSpinner, Button } from '../ui';

const BroadcastHistory = ({ broadcastHistory, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner message="Tarix yuklanmoqda..." size="lg" />
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return "bg-green-100 text-green-800 border-green-200";
      case 'failed':
        return "bg-red-100 text-red-800 border-red-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Muvaffaqiyatli';
      case 'failed':
        return 'Xatolik';
      case 'pending':
        return 'Kutilmoqda';
      default:
        return 'Noma\'lum';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'sms' ? <Smartphone size={16} /> : <Bot size={16} />;
  };

  const getTypeText = (type) => {
    return type === 'sms' ? 'SMS' : 'Telegram';
  };

  const getTypeColor = (type) => {
    return type === 'sms' 
      ? 'bg-green-50 text-green-700 border-green-200' 
      : 'bg-purple-50 text-purple-700 border-purple-200';
  };

  // Filter broadcasts
  const filteredBroadcasts = broadcastHistory.filter(broadcast => {
    const matchesSearch = broadcast.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || broadcast.type === filterType;
    const matchesStatus = filterStatus === 'all' || broadcast.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Xabar matnida qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Turi:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Hammasi</option>
                <option value="sms">SMS</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Holat:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Hammasi</option>
                <option value="success">Muvaffaqiyatli</option>
                <option value="failed">Xatolik</option>
                <option value="pending">Kutilmoqda</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Broadcast List */}
      <Card className="p-4">
        {filteredBroadcasts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Broadcast tarixi mavjud emas</h3>
            <p className="text-gray-600">Hali hech qanday xabar yuborilmagan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBroadcasts.map((broadcast, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(broadcast.type)}`}>
                    {getTypeIcon(broadcast.type)}
                    <span>{getTypeText(broadcast.type)}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(broadcast.status)}`}>
                    {getStatusText(broadcast.status)}
                  </div>
                </div>

                {/* Message */}
                <div className="mb-3">
                  <div className="text-gray-900 font-medium mb-2">
                    {broadcast.message}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{broadcast.recipients_count} ta qabul qiluvchi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(broadcast.created_at)}</span>
                    </div>
                    {broadcast.sent_at && (
                      <div className="text-green-600">
                        <span>Yuborildi: {formatTime(broadcast.sent_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {broadcast.error_message && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <span className="font-medium">Xatolik: </span>{broadcast.error_message}
                  </div>
                )}

                {/* Delivery Stats */}
                {broadcast.delivery_stats && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Muvaffaqiyatli: {broadcast.delivery_stats.successful}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Xatolik: {broadcast.delivery_stats.failed}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Summary */}
      {filteredBroadcasts.length > 0 && (
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="text-gray-600">
                <span className="font-medium">Jami:</span> {filteredBroadcasts.length} ta
              </div>
              <div className="text-green-600">
                <span className="font-medium">Muvaffaqiyatli:</span> {filteredBroadcasts.filter(b => b.status === 'success').length} ta
              </div>
              <div className="text-red-600">
                <span className="font-medium">Xatolik:</span> {filteredBroadcasts.filter(b => b.status === 'failed').length} ta
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BroadcastHistory;