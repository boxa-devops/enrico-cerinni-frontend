import { Receipt, User, Package, DollarSign, Calendar, Tag, AlertCircle } from 'lucide-react';
import Modal from '../modals/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';

export default function SaleDetailsModal({ 
  selectedSale, 
  showSaleModal, 
  onClose, 
  formatDate, 
  formatCurrency, 
  getStatusBadge 
}) {
  if (!selectedSale) return null;

  const totalAmount = Number(selectedSale.total_amount) || 0;
  const paidAmount = Number(selectedSale.paid_amount) || 0;
  const remainingDebt = totalAmount - paidAmount;
  const hasDebt = remainingDebt > 0;

  return (
    <Modal
      isOpen={showSaleModal}
      onClose={onClose}
      title="Sotuv tafsilotlari"
      size="xl"
    >
      <div className="space-y-6">
        {/* Sale Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Receipt className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 m-0">#{selectedSale.receipt_number}</h3>
                <p className="text-sm text-gray-600 m-0">{formatDate(selectedSale.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-gray-500" />
              {getStatusBadge(selectedSale.status)}
            </div>
          </div>
          
          {selectedSale.client_name && (
            <div className="mt-4 pt-4 border-t border-blue-200/50">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Mijoz ma'lumotlari</span>
              </div>
              <p className="text-gray-900 font-medium">{selectedSale.client_name}</p>
            </div>
          )}
        </Card>

        {/* Payment Status Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" />
              To'lov holati
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Jami summa:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To'langan:</span>
                <span className="font-semibold text-green-600">{formatCurrency(paidAmount)}</span>
              </div>
            </div>
            {hasDebt && (
              <>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Qoldi qarzdorlik:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(remainingDebt)}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-800">Bu sotuvda qarzdorlik mavjud</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Items and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sale Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package size={18} className="text-blue-600" />
                  Mahsulotlar
                  <span className="text-sm font-normal text-gray-500">({selectedSale.items?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSale.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.product_name}</div>
                        {(item.color_name || item.size_name) && (
                          <div className="flex gap-2 mt-1">
                            {item.color_name && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.color_name}</span>
                            )}
                            {item.size_name && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{item.size_name}</span>
                            )}
                          </div>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span className="font-medium">{item.quantity} dona</span>
                          <span>{formatCurrency(item.unit_price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{formatCurrency(item.total_price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sale Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Xulosa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Oraliq summa</span>
                    <span className="font-medium">{formatCurrency(totalAmount)}</span>
                  </div>
                  {selectedSale.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chegirma</span>
                      <span className="text-red-600 font-medium">-{formatCurrency(selectedSale.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Jami</span>
                    <span className="font-bold text-lg text-gray-900">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sale Notes */}
        {selectedSale.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Izohlar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{selectedSale.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Modal>
  );
} 