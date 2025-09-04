/**
 * Clients Report Component
 * 
 * Client analytics including customer behavior, loyalty metrics,
 * and customer lifetime value analysis.
 */

'use client';

import { Users, UserCheck, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, Button } from '../ui';

const ClientsReport = ({ data = {}, dateRange, onDateRangeChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami mijozlar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">456</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faol mijozlar</p>
              <p className="text-2xl font-bold text-green-600 mt-1">234</p>
            </div>
            <UserCheck className="text-green-600" size={24} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">O'rtacha xarid</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">125K UZS</p>
            </div>
            <TrendingUp className="text-orange-600" size={24} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mijozlar hisoboti (tez orada)
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">Mijozlar tahlili grafigi</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientsReport;
