'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, Palette, Ruler, Calendar, Tag, Settings } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import { Card, Button } from '../../components/ui';
import Table from '../../components/tables/Table';
import CategoryModal from '../../components/CategoryModal';
import BrandModal from '../../components/BrandModal';
import ColorModal from '../../components/ColorModal';
import SizeModal from '../../components/SizeModal';
import SeasonModal from '../../components/SeasonModal';
import Modal from '../../components/modals/Modal';
import { settingsAPI } from '../../api';
import { cn } from '../../utils/cn';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState(new Set());
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'categories', name: 'Kategoriyalar', icon: Tag },
    { id: 'brands', name: 'Brendlar', icon: Package },
    { id: 'colors', name: 'Ranglar', icon: Palette },
    { id: 'sizes', name: 'O\'lchamlar', icon: Ruler },
    { id: 'seasons', name: 'Mavsumlar', icon: Calendar },
  ];

  // Load data for a specific tab
  const loadTabData = async (tabId) => {
    if (loadedTabs.has(tabId)) {
      return; // Data already loaded
    }

    setLoading(true);
    try {
      let response;
      switch (tabId) {
        case 'categories':
          response = await settingsAPI.getCategories();
          setCategories(response.data || []);
          break;
        case 'brands':
          response = await settingsAPI.getBrands();
          setBrands(response.data || []);
          break;
        case 'colors':
          response = await settingsAPI.getColors();
          setColors(response.data || []);
          break;
        case 'sizes':
          response = await settingsAPI.getSizes();
          setSizes(response.data || []);
          break;
        case 'seasons':
          response = await settingsAPI.getSeasons();
          setSeasons(response.data || []);
          break;
      }
      setLoadedTabs(prev => new Set([...prev, tabId]));
    } catch (error) {
      console.error(`Error loading ${tabId} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial tab data when component mounts
  useEffect(() => {
    loadTabData(activeTab);
  }, []);

  // Load data when tab changes
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'categories': return categories;
      case 'brands': return brands;
      case 'colors': return colors;
      case 'sizes': return sizes;
      case 'seasons': return seasons;
      default: return [];
    }
  };

  const getFilteredData = () => {
    const data = getCurrentData();
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleAdd = async (itemData) => {
    try {
      let response;
      switch (activeTab) {
        case 'categories':
          response = await settingsAPI.createCategory(itemData);
          setCategories(prev => [...prev, response.data]);
          break;
        case 'brands':
          response = await settingsAPI.createBrand(itemData);
          setBrands(prev => [...prev, response.data]);
          break;
        case 'colors':
          response = await settingsAPI.createColor(itemData);
          setColors(prev => [...prev, response.data]);
          break;
        case 'sizes':
          response = await settingsAPI.createSize(itemData);
          setSizes(prev => [...prev, response.data]);
          break;
        case 'seasons':
          response = await settingsAPI.createSeason(itemData);
          setSeasons(prev => [...prev, response.data]);
          break;
      }
      setShowAddModal(false);
    } catch (error) {
      console.error(`Error creating ${activeTab}:`, error);
      alert(`${tabs.find(tab => tab.id === activeTab).name} yaratishda xatolik yuz berdi.`);
    }
  };

  const handleEdit = async (itemData) => {
    try {
      let response;
      switch (activeTab) {
        case 'categories':
          response = await settingsAPI.updateCategory(selectedItem.id, itemData);
          setCategories(prev => prev.map(item => item.id === selectedItem.id ? response.data : item));
          break;
        case 'brands':
          response = await settingsAPI.updateBrand(selectedItem.id, itemData);
          setBrands(prev => prev.map(item => item.id === selectedItem.id ? response.data : item));
          break;
        case 'colors':
          response = await settingsAPI.updateColor(selectedItem.id, itemData);
          setColors(prev => prev.map(item => item.id === selectedItem.id ? response.data : item));
          break;
        case 'sizes':
          response = await settingsAPI.updateSize(selectedItem.id, itemData);
          setSizes(prev => prev.map(item => item.id === selectedItem.id ? response.data : item));
          break;
        case 'seasons':
          response = await settingsAPI.updateSeason(selectedItem.id, itemData);
          setSeasons(prev => prev.map(item => item.id === selectedItem.id ? response.data : item));
          break;
      }
      setShowEditModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
      alert(`${tabs.find(tab => tab.id === activeTab).name} yangilashda xatolik yuz berdi.`);
    }
  };

  const handleDelete = async () => {
    try {
      switch (activeTab) {
        case 'categories':
          await settingsAPI.deleteCategory(selectedItem.id);
          setCategories(prev => prev.filter(item => item.id !== selectedItem.id));
          break;
        case 'brands':
          await settingsAPI.deleteBrand(selectedItem.id);
          setBrands(prev => prev.filter(item => item.id !== selectedItem.id));
          break;
        case 'colors':
          await settingsAPI.deleteColor(selectedItem.id);
          setColors(prev => prev.filter(item => item.id !== selectedItem.id));
          break;
        case 'sizes':
          await settingsAPI.deleteSize(selectedItem.id);
          setSizes(prev => prev.filter(item => item.id !== selectedItem.id));
          break;
        case 'seasons':
          await settingsAPI.deleteSeason(selectedItem.id);
          setSeasons(prev => prev.filter(item => item.id !== selectedItem.id));
          break;
      }
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      alert(`${tabs.find(tab => tab.id === activeTab).name} o'chirishda xatolik yuz berdi.`);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const getColumns = () => {
    const baseColumns = [
      { key: 'name', label: 'Nomi' },
      {
        key: 'actions',
        label: 'Amallar',
        render: (_, item) => (
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-105"
              onClick={() => openEditModal(item)}
              title="Tahrirlash"
            >
              <Edit size={14} />
            </button>
            <button
              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200 hover:scale-105"
              onClick={() => openDeleteModal(item)}
              title="O'chirish"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )
      }
    ];

    if (activeTab === 'categories') {
      return [
        { key: 'name', label: 'Nomi' },
        { key: 'description', label: 'Tavsif' },
        { key: 'products_count', label: 'Mahsulotlar' },
        baseColumns[1]
      ];
    }

    if (activeTab === 'colors') {
      return [
        { key: 'name', label: 'Nomi' },
        { 
          key: 'hex_code', 
          label: 'Rang',
          render: (value) => (
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border border-gray-200 shadow-sm" 
                style={{ backgroundColor: value }}
              />
              <span className="text-sm font-mono text-gray-600">{value}</span>
            </div>
          )
        },
        baseColumns[1]
      ];
    }

    return baseColumns;
  };

  const renderModal = () => {
    const modalProps = {
      isOpen: showAddModal || showEditModal,
      onClose: () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
      },
      onSave: showAddModal ? handleAdd : handleEdit,
      mode: showAddModal ? 'add' : 'edit',
    };

    // Add the item prop for edit mode
    if (showEditModal && selectedItem) {
      switch (activeTab) {
        case 'categories':
          modalProps.category = selectedItem;
          break;
        case 'brands':
          modalProps.brand = selectedItem;
          break;
        case 'colors':
          modalProps.color = selectedItem;
          break;
        case 'sizes':
          modalProps.size = selectedItem;
          break;
        case 'seasons':
          modalProps.season = selectedItem;
          break;
      }
    }

    switch (activeTab) {
      case 'categories':
        return <CategoryModal {...modalProps} />;
      case 'brands':
        return <BrandModal {...modalProps} />;
      case 'colors':
        return <ColorModal {...modalProps} />;
      case 'sizes':
        return <SizeModal {...modalProps} />;
      case 'seasons':
        return <SeasonModal {...modalProps} />;
      default:
        return null;
    }
  };

  // Settings header component similar to checkout
  const SettingsHeader = () => (
    <Card className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Settings className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 m-0">
              Sozlamalar
            </h1>
            <p className="text-sm text-gray-600 m-0 hidden sm:block">
              Tizim sozlamalarini va ma'lumotlarni boshqaring
            </p>
          </div>
        </div>
        
        {/* Current Tab Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Faol bo'lim:</span>
            <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              {tabs.find(tab => tab.id === activeTab).name}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 m-0">Jami elementlar:</p>
            <p className="text-lg font-bold text-green-600 m-0">
              {getCurrentData().length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <PageLayout 
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen"
      >
        <div className="space-y-4">
          {/* Header */}
          <SettingsHeader />

          {/* Tabs */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Add Section */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder={`${tabs.find(tab => tab.id === activeTab).name}ni qidirish...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white/70 border border-gray-200 rounded-lg focus:border-blue-400 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
                className="whitespace-nowrap"
              >
                <Plus size={16} />
                {tabs.find(tab => tab.id === activeTab).name} qo'shish
              </Button>
            </div>

            {/* Table Section */}
            <div className="bg-white/50 rounded-lg border border-gray-200/50">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Ma'lumotlar yuklanmoqda...</span>
                  </div>
                </div>
              ) : (
                <Table
                  columns={getColumns()}
                  data={getFilteredData()}
                  emptyMessage={`${tabs.find(tab => tab.id === activeTab).name} topilmadi`}
                />
              )}
            </div>
          </Card>

          {/* Modals */}
          {renderModal()}

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedItem(null);
            }}
            title={`${tabs.find(tab => tab.id === activeTab).name}ni o'chirish`}
            size="small"
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                "{selectedItem?.name}" {tabs.find(tab => tab.id === activeTab).name.toLowerCase()}ni o'chirishni xohlaysizmi?
              </p>
              <p className="text-sm text-red-600">
                Bu amalni qaytarib bo'lmaydi.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  O'chirish
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </PageLayout>
    </Layout>
  );
};

export default SettingsPage; 