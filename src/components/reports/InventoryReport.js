/**
 * Inventory Report Component
 * 
 * Inventory analytics including stock levels, product movement,
 * low stock alerts, and inventory valuation.
 */

'use client';

import { Package, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, Button } from '../ui';

const InventoryReport = ({ data = {}, dateRange, onDateRangeChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami mahsulotlar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
            </div>
            <Package className="text-blue-600" size={24} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kam qolgan</p>
              <p className="text-2xl font-bold text-red-600 mt-1">23</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventar qiymati</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">45.2M UZS</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Inventar hisoboti (tez orada)
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">Inventar tahlili grafigi</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InventoryReport;
