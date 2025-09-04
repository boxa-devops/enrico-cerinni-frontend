'use client';

import { User, Calendar, DollarSign, Eye, Edit, Trash2, CreditCard, Phone } from 'lucide-react';
import Button from '../ui/Button';
import Table from './Table';
import { formatCurrency, formatDate } from '../../utils/format';

const ClientsTable = ({
  clients,
  loading,
  selectedClients,
  onSelectionChange,
  onEditClient,
  onViewClient,
  onDeleteClient,
  onPayment,
  onSelectAll,
  isAllSelected
}) => {
  const getDebtStatus = (debtAmount) => {
    if (!debtAmount || debtAmount <= 0) return 'no-debt';
    if (debtAmount <= 100000) return 'low-debt';
    if (debtAmount <= 500000) return 'medium-debt';
    return 'high-debt';
  };

  const getLastPurchaseTime = (client) => {
    return client.last_purchase_date || client.created_at || null;
  };

  const columns = [
    {
      key: 'first_name',
      label: 'Mijoz',
      render: (_, client) => (
        <div className="">
          <User size={16} />
          <span>{client.first_name} {client.last_name}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Aloqa',
      render: (_, client) => (
        <div className="">
          {client.phone && (
            <div className="">
              <Phone size={14} />
              <span>{client.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'last_purchase_date',
      label: 'Oxirgi xarid',
      render: (_, client) => {
        const lastPurchaseTime = getLastPurchaseTime(client);
        return lastPurchaseTime ? (
          <div className="">
            <Calendar size={14} />
            {formatDate(lastPurchaseTime, { month: 'numeric', day: 'numeric' })}
          </div>
        ) : (
          <span className="">-</span>
        );
      }
    },
    {
      key: 'debt_amount',
      label: 'Qarz',
      render: (debtAmount, client) => (
        <div className="">
          {formatCurrency(debtAmount || 0)}
        </div>
      )
    },
    {
      key: 'id',
      label: 'Amallar',
      render: (_, client) => (
        <div className="">
          <button
            className=""
            onClick={() => onViewClient(client)}
            title="Ko'rish"
          >
            <Eye size={14} />
          </button>
          <button
            className=""
            onClick={() => onEditClient(client)}
            title="Tahrirlash"
          >
            <Edit size={14} />
          </button>
          {(client.debt_amount > 0) && (
            <button
              className=""
              onClick={() => onPayment && onPayment(client)}
              title="To'lov qilish"
            >
              <CreditCard size={14} />
            </button>
          )}
          <button
            className=""
            onClick={() => onDeleteClient && onDeleteClient(client.id)}
            title="O'chirish"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      data={clients}
      columns={columns}
      loading={loading}
      selectable={true}
      selectedRows={selectedClients}
      onSelectionChange={onSelectionChange}
      emptyMessage="Mijozlar mavjud emas"
      className=""
    />
  );
};

export default ClientsTable; 