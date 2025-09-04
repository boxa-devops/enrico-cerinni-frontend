import { Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import { Button } from '../ui';
import Table from '../tables/Table';
import { cn } from '../../utils/cn';

export default function SalesTable({ 
  sales, 
  onViewSale, 
  onEditSale,
  onCancelSale,
  onPayDebt,
  formatDate, 
  formatCurrency, 
  getStatusBadge 
}) {
  const columns = [
    {
      key: 'receipt_number',
      label: 'Chek',
      width: 'w-12',
      render: (value) => {
        const truncated = value && value.length > 8 
          ? `${value.slice(0, 4)}...${value.slice(-4)}` 
          : value;
        return <strong className="text-blue-600 text-xs" title={`#${value}`}>#{truncated}</strong>;
      }
    },
    {
      key: 'client_name',
      label: 'Mijoz',
      render: (value) => <span className="text-gray-900">{value || 'Noma\'lum'}</span>
    },
    {
      key: 'total_amount',
      label: 'Summa',
      render: (value, sale) => (
        <div className="space-y-1">
          <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
          {sale.paid_amount > 0 && sale.paid_amount < value && (
            <div className="text-xs space-y-0.5">
              <span className="block text-green-600">To'langan: {formatCurrency(sale.paid_amount)}</span>
              <span className="block text-red-600">Qoldi: {formatCurrency(value - sale.paid_amount)}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Holat',
      width: 'w-32',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'created_at',
      label: 'Sana',
      render: (value) => <span className="text-gray-500 text-sm">{formatDate(value)}</span>
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_, sale) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onViewSale(sale.id)}
            title="Ko'rish"
          >
            <Eye size={16} />
          </Button>
          {onEditSale && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              onClick={() => onEditSale(sale)}
              title="Tahrirlash"
            >
              <Edit size={16} />
            </Button>
          )}
          {/* Show debt payment button for debt or partially paid sales */}
          {(sale.status === 'debt' || sale.status === 'partially_paid') && onPayDebt && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onPayDebt(sale)}
              title="Qarzdorlik to'lash"
            >
              <DollarSign size={16} />
            </Button>
          )}
          {sale.status === 'completed' && onCancelSale && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onCancelSale(sale.id)}
              title="Bekor qilish"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        data={sales}
        columns={columns}
        className="w-full"
      />
    </div>
  );
} 