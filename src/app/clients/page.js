/**
 * Clients Page
 * 
 * Client management interface for viewing, adding, editing, and messaging clients.
 * Includes search, bulk operations, and detailed client information.
 * 
 * @page
 */

'use client';

import { Search, Plus, Trash2, User, Edit, Eye, MessageSquare, Send, Phone, MapPin, Users, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import { Button, Card } from '../../components/ui';
import Input from '../../components/forms/Input';
import Table from '../../components/tables/Table';
import ClientManagementModal from '../../components/modals/ClientManagementModal';
import ClientMessagingModal from '../../components/modals/ClientMessagingModal';
import { useClientManagement } from '../../hooks/useClientManagement';
import { cn } from '../../utils/cn';

// Clients header component
const ClientsHeader = ({ totalItems, selectedClientsCount, hasSelectedClients, onAddClient, onBulkMessage, onBulkDelete }) => (
  <Card className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <Users className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">
            Mijozlar boshqaruvi
          </h1>
          <p className="text-sm text-gray-600 m-0 hidden sm:block">
            {totalItems} ta mijoz ro'yxati
          </p>
        </div>
      </div>
      
      {/* Actions Section */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasSelectedClients && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Tanlangan:</span>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {selectedClientsCount}
            </span>
          </div>
        )}
        
        {hasSelectedClients && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkMessage}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <MessageSquare size={14} className="mr-1" />
              Xabar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 size={14} className="mr-1" />
              O'chirish
            </Button>
          </div>
        )}
        
        <Button
          onClick={onAddClient}
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          <Plus size={16} className="mr-1" />
          Qo'shish
        </Button>
      </div>
    </div>
  </Card>
);

// Stats cards component
const ClientsStats = ({ clients, totalItems }) => {
  const totalDebt = clients.reduce((sum, client) => sum + (Number(client.debt_amount) || 0), 0);
  const clientsWithDebt = clients.filter(client => (Number(client.debt_amount) || 0) > 0).length;
  const recentClients = clients.filter(client => {
    if (!client.last_purchase_date) return false;
    const daysSince = Math.floor((new Date() - new Date(client.last_purchase_date)) / (1000 * 60 * 60 * 24));
    return daysSince <= 30;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Users className="text-white" size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-600 m-0">Jami mijozlar</p>
            <p className="text-lg font-bold text-gray-900 m-0">{totalItems}</p>
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <MapPin className="text-white" size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-600 m-0">Qarzdor mijozlar</p>
            <p className="text-lg font-bold text-gray-900 m-0">{clientsWithDebt}</p>
            <p className="text-xs text-red-600 m-0">{totalDebt.toLocaleString()} UZS</p>
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <User className="text-white" size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-600 m-0">Faol mijozlar</p>
            <p className="text-lg font-bold text-gray-900 m-0">{recentClients}</p>
            <p className="text-xs text-green-600 m-0">Oxirgi 30 kun</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function ClientsPage() {
  const {
    // State
    clients,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    totalItems,
    selectedClients,
    modalState,
    messagingModalState,
    
    // Actions
    openModal,
    closeModal,
    openMessagingModal,
    closeMessagingModal,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleBulkDelete,
    handleSelectionChange,
    handlePageChange,
    
    // Computed
    hasSelectedClients,
    selectedClientsCount
  } = useClientManagement(10);

  const pageSize = 10;

  const columns = [
    { 
      key: 'name', 
      label: 'Mijoz nomi', 
      width: '25%',
      sortable: true,
      render: (_, client) => {
        const debtAmount = Number(client.debt_amount) || 0;
        const avatarColor = debtAmount > 0 ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600';
        
        return (
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 bg-gradient-to-r ${avatarColor} rounded-full flex items-center justify-center flex-shrink-0`}>
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {`${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Noma\'lum'}
              </p>
              {client.email && (
                <p className="text-xs text-gray-500 truncate">
                  {client.email}
                </p>
              )}
            </div>
          </div>
        );
      }
    },
    { 
      key: 'phone', 
      label: 'Aloqa', 
      width: '20%',
      render: (_, client) => (
        <div className="space-y-1">
          {client.phone ? (
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3 text-gray-400" />
              <a 
                href={`tel:${client.phone}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {client.phone}
              </a>
            </div>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
          {client.address && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{client.address}</span>
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'debt', 
      label: 'Qarzdorlik', 
      width: '13%',
      align: 'right',
      sortable: true,
      render: (_, client) => {
        const debt = Number(client.debt_amount) || 0;
        const getDebtStyle = () => {
          if (debt === 0) return 'bg-green-100 text-green-800 border-green-200';
          if (debt <= 100000) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          if (debt <= 500000) return 'bg-orange-100 text-orange-800 border-orange-200';
          return 'bg-red-100 text-red-800 border-red-200';
        };
        
        return (
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
            getDebtStyle()
          )}>
            {debt.toLocaleString()} UZS
          </span>
        );
      }
    },
    { 
      key: 'last_purchase', 
      label: 'Oxirgi xarid', 
      width: '15%',
      sortable: true,
      render: (_, client) => {
        if (!client.last_purchase_date) {
          return <span className="text-sm text-gray-500">-</span>;
        }
        
        const date = new Date(client.last_purchase_date);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="text-sm">
            <div className="text-gray-900">
              {date.toLocaleDateString('uz-UZ')}
            </div>
            <div className="text-xs text-gray-500">
              {diffDays === 0 ? 'Bugun' : 
               diffDays === 1 ? 'Kecha' : 
               diffDays < 30 ? `${diffDays} kun oldin` :
               `${Math.floor(diffDays / 30)} oy oldin`}
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Amallar',
      width: '12%',
      align: 'center',
      render: (_, client) => (
        <div className="flex items-center justify-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewClient(client);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Ko'rish"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClientClick(client);
            }}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Tahrirlash"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleMessagingClick(client);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Xabar yuborish"
          >
            <MessageSquare className="h-3 w-3" />
          </Button>
        </div>
      )
    }
  ];

  const handleEditClientClick = (client) => {
    openModal('edit', client);
  };

  const handleViewClient = (client) => {
    openModal('details', client);
  };

  const handleMessagingClick = (client) => {
    openMessagingModal(client);
  };

  return (
    <Layout>
      <PageLayout
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen"
      >
        {/* Header */}
        <ClientsHeader
          totalItems={totalItems}
          selectedClientsCount={selectedClientsCount}
          hasSelectedClients={hasSelectedClients}
          onAddClient={() => openModal('add')}
          onBulkMessage={() => openMessagingModal(null)}
          onBulkDelete={() => openModal('delete', { id: 'bulk', first_name: 'tanlangan', last_name: 'mijozlar' })}
        />

        {/* Stats */}
        <ClientsStats clients={clients} totalItems={totalItems} />

        {/* Search Section */}
        <Card className="mb-4 bg-white shadow-sm border-gray-200">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Mijozlarni ism, telefon yoki email bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {searchTerm && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Natija:</span>
                <span className="font-medium text-blue-600">
                  {clients.length} ta mijoz
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1"
                >
                  Tozalash
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Clients Table */}
        <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Mijozlar ro'yxati</h3>
              </div>
              {hasSelectedClients && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {selectedClientsCount} ta tanlangan
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Table
            columns={columns}
            data={clients}
            loading={loading}
            selectable={true}
            selectedRows={selectedClients}
            onSelectionChange={handleSelectionChange}
            onRowClick={handleViewClient}
            sortable={true}
            pagination={true}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            emptyMessage="Qidiruv natijalariga mos mijozlar topilmadi"
            className="border-0"
          />
        </Card>

        {/* Modals */}
        <ClientManagementModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          mode={modalState.mode}
          client={modalState.client}
          onSubmit={modalState.mode === 'edit' ? handleEditClient : handleAddClient}
          onDelete={modalState.client?.id === 'bulk' ? handleBulkDelete : handleDeleteClient}
          loading={modalState.loading}
          deleting={modalState.deleting}
        />

        <ClientMessagingModal
          isOpen={messagingModalState.isOpen}
          onClose={closeMessagingModal}
          client={messagingModalState.client}
          selectedClients={selectedClients}
          allClients={clients}
        />
      </PageLayout>
    </Layout>
  );
}  