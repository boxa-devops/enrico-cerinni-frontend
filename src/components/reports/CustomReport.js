/**
 * Custom Report Component
 * 
 * Customizable report builder allowing users to create
 * personalized reports with selected metrics and time ranges.
 */

'use client';

import { FileText, Settings, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, Button } from '../ui';

const CustomReport = ({ data = {}, dateRange, onDateRangeChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saqlangan hisobotlar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <FileText className="text-gray-600" size={24} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shablon hisobotlar</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">8</p>
            </div>
            <Settings className="text-blue-600" size={24} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avtomatik hisobotlar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Maxsus hisobot yaratish (tez orada)
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">Hisobot yaratish interfeysi</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomReport;
