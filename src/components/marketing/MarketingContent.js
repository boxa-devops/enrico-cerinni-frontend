'use client';

import { useState } from 'react';
import { BarChart3, History, Smartphone, Bot } from 'lucide-react';
import { Card } from '../ui/Card';
import MarketingStats from './MarketingStats';
import SMSBroadcast from './SMSBroadcast';
import TelegramBroadcast from './TelegramBroadcast';
import BroadcastHistory from './BroadcastHistory';

const MarketingContent = (props) => {
  const [activeTab, setActiveTab] = useState('sms');

  const tabs = [
    { id: 'sms', name: 'SMS Yuborish', icon: Smartphone },
    { id: 'telegram', name: 'Telegram Yuborish', icon: Bot },
    { id: 'stats', name: 'Statistikalar', icon: BarChart3 },
    { id: 'history', name: 'Tarix', icon: History },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sms':
        return <SMSBroadcast {...props} />;
      case 'telegram':
        return <TelegramBroadcast {...props} />;
      case 'stats':
        return <MarketingStats {...props} />;
      case 'history':
        return <BroadcastHistory {...props} />;
      default:
        return <SMSBroadcast {...props} />;
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {renderTabContent()}
      </div>
    </Card>
  );
};

export default MarketingContent; 