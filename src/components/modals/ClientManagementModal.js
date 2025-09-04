'use client';

import { Phone, Mail, User, Trash2, MapPin } from 'lucide-react';
import Modal from './Modal';
import ClientForm from '../forms/ClientForm';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/format';

const ClientManagementModal = ({ 
  isOpen, 
  onClose, 
  mode = 'add', // 'add', 'edit', 'details', 'delete'
  client = null,
  onSubmit,
  onDelete,
  loading = false,
  deleting = false
}) => {
  const getModalTitle = () => {
    switch (mode) {
      case 'add':
        return 'Yangi mijoz qo\'shish';
      case 'edit':
        return 'Mijozni tahrirlash';
      case 'details':
        return 'Mijoz ma\'lumotlari';
      case 'delete':
        return 'Mijozni o\'chirish';
      default:
        return 'Mijoz';
    }
  };

  const getLastPurchaseTime = (client) => {
    if (!client) return null;
    return client.last_purchase_date || client.created_at || null;
  };

  const renderContent = () => {
    switch (mode) {
      case 'add':
      case 'edit':
        return (
          <ClientForm
            client={client}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        );

      case 'details':
        if (!client) {
          return <div className="text-center py-4 text-gray-600">Mijoz ma'lumotlari topilmadi</div>;
        }
        return (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {client.first_name || ''} {client.last_name || ''}
              </h3>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                {client.phone && (
                  <div>
                    <Phone size={14} className="inline mr-1" />
                    <a 
                      href={`tel:${client.phone}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.address && <div><MapPin size={14} className="inline mr-1" />{client.address}</div>}
                {client.email && (
                  <div>
                    <Mail size={14} className="inline mr-1" />
                    <a 
                      href={`mailto:${client.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {client.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className={`p-3 rounded border ${
                (client.debt_amount || 0) > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="text-gray-600">Joriy qarz:</div>
                <div className={`font-semibold ${
                  (client.debt_amount || 0) > 0 ? 'text-red-700' : 'text-green-700'
                }`}>
                  {formatCurrency(client.debt_amount || 0)}
                </div>
              </div>
              
              {getLastPurchaseTime(client) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-gray-600">Oxirgi xarid:</div>
                  <div className="font-semibold text-blue-700 text-xs">
                    {formatDate(getLastPurchaseTime(client))}
                  </div>
                </div>
              )}
            </div>

            {client.notes && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="text-gray-600 text-sm mb-1">Izohlar:</div>
                <div className="text-sm text-gray-900">{client.notes}</div>
              </div>
            )}
          </div>
        );

      case 'delete':
        if (!client) {
          return <div className="text-center py-4 text-gray-600">Mijoz ma'lumotlari topilmadi</div>;
        }
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="text-red-600" size={20} />
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">"{client.first_name || ''} {client.last_name || ''}"</span> mijozini o'chirmoqchimisiz?
              </p>
              <p className="text-sm text-red-600 mt-2">Bu amalni qaytarib bo'lmaydi!</p>
            </div>
            
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={deleting}
                size="sm"
              >
                Bekor qilish
              </Button>
              <Button 
                variant="danger" 
                onClick={() => onDelete(client.id)}
                loading={deleting}
                size="sm"
              >
                O'chirish
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size={mode === 'details' ? 'md' : 'sm'}
    >
      {renderContent()}
    </Modal>
  );
};

export default ClientManagementModal; 