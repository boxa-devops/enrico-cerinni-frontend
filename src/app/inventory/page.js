'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Edit, Trash2, Eye, Palette, Ruler } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import Table from '../../components/tables/Table';
import Button from '../../components/ui/Button';
import { LoadingSpinner, Card } from '../../components/ui';
import Input from '../../components/forms/Input';
import Modal from '../../components/modals/Modal';
import ProductForm from '../../components/forms/ProductForm';
import ProductVariantForm from '../../components/forms/ProductVariantForm';
import { productsAPI, brandsAPI, colorsAPI, seasonsAPI, sizesAPI, productVariantsAPI, settingsAPI } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

// Simple cache for filter options
const filterCache = {
  brands: null,
  categories: null,
  seasons: null,
  colors: null,
  sizes: null,
  timestamp: null,
  isExpired: function() {
    // Cache expires after 5 minutes
    return !this.timestamp || Date.now() - this.timestamp > 5 * 60 * 1000;
  }
};

// Custom hook for inventory data management
const useInventoryData = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products first (critical data)
  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setError(null);
      
      const productsRes = await productsAPI.getProducts();
      
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data.items || []);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Mahsulotlarni yuklashda xatolik yuz berdi');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // Load filter options (non-critical data)
  const loadFilterOptions = useCallback(async () => {
    try {
      setFiltersLoading(true);
      
      // Check if we have cached data that's not expired
      if (!filterCache.isExpired() && filterCache.brands) {
        setBrands(filterCache.brands);
        setCategories(filterCache.categories);
        setSeasons(filterCache.seasons);
        setColors(filterCache.colors);
        setSizes(filterCache.sizes);
        setFiltersLoading(false);
        return;
      }
      
      // Load filter options in parallel
      const [brandsRes, categoriesRes, seasonsRes, colorsRes, sizesRes] = await Promise.all([
        brandsAPI.getBrands(),
        settingsAPI.getCategories(),
        seasonsAPI.getSeasons(),
        colorsAPI.getColors(),
        sizesAPI.getSizes()
      ]);

      // Update state and cache
      if (brandsRes.success && brandsRes.data) {
        setBrands(brandsRes.data);
        filterCache.brands = brandsRes.data;
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
        filterCache.categories = categoriesRes.data;
      }
      if (seasonsRes.success && seasonsRes.data) {
        setSeasons(seasonsRes.data);
        filterCache.seasons = seasonsRes.data;
      }
      if (colorsRes.success && colorsRes.data) {
        setColors(colorsRes.data);
        filterCache.colors = colorsRes.data;
      }
      if (sizesRes.success && sizesRes.data) {
        setSizes(sizesRes.data);
        filterCache.sizes = sizesRes.data;
      }
      
      // Update cache timestamp
      filterCache.timestamp = Date.now();
    } catch (err) {
      console.error('Error loading filter options:', err);
      // Don't set error for filter options as they're not critical
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    // Load products immediately
    await loadProducts();
    // Load filter options in background
    loadFilterOptions();
  }, [loadProducts, loadFilterOptions]);

  const refreshProducts = useCallback(async () => {
    try {
      const response = await productsAPI.getProducts();
      if (response.success && response.data) {
        setProducts(response.data.items || []);
      }
    } catch (err) {
      console.error('Error refreshing products:', err);
    }
  }, []);

  return {
    products,
    brands,
    categories,
    seasons,
    colors,
    sizes,
    productsLoading,
    filtersLoading,
    loading: productsLoading, // Keep backward compatibility
    error,
    loadAllData,
    loadProducts,
    loadFilterOptions,
    refreshProducts,
    setProducts
  };
};

// Custom hook for filtering and pagination
const useProductFilters = (products) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let filtered = products;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.brand_name && product.brand_name.toLowerCase().includes(searchLower))
      );
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand_id === parseInt(selectedBrand));
    }

    if (selectedSeason !== 'all') {
      filtered = filtered.filter(product => product.season_id === parseInt(selectedSeason));
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === parseInt(selectedCategory));
    }

    return filtered;
  }, [products, searchTerm, selectedBrand, selectedSeason, selectedCategory]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);

  const totalItems = useMemo(() => filteredProducts.length, [filteredProducts]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedBrand('all');
    setSelectedSeason('all');
    setSelectedCategory('all');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    selectedSeason,
    setSelectedSeason,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    pageSize,
    filteredProducts,
    paginatedData,
    totalItems,
    resetFilters,
    handlePageChange,
    handlePageSizeChange
  };
};

// Inventory header component similar to checkout
const InventoryHeader = ({ totalProducts, filteredCount, onAddProduct, loading }) => (
  <Card className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
          <Plus className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">
            Inventar boshqaruvi
          </h1>
          <p className="text-sm text-gray-600 m-0 hidden sm:block">
            Mahsulot inventaringizni boshqaring va kuzatib boring
          </p>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Jami mahsulotlar:</span>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            {totalProducts}
          </span>
        </div>
        {filteredCount !== totalProducts && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ko'rsatilgan:</span>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {filteredCount}
            </span>
          </div>
        )}
        <Button
          onClick={onAddProduct}
          disabled={loading}
          size="lg"
          className="whitespace-nowrap"
        >
          <Plus size={16} className="mr-1" />
          Mahsulot qo'shish
        </Button>
      </div>
    </div>
  </Card>
);

// Loading component similar to checkout
const InventoryLoading = ({ message = "Inventar yuklanmoqda..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner 
      message={message} 
      size="lg" 
    />
  </div>
);

// Skeleton loading for products table
const ProductsSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="animate-pulse">
      {/* Table header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-7 gap-4">
          {['Mahsulot nomi', 'Brend', 'Fasl', 'Narx', 'Zapas', 'SKU', 'Amallar'].map((header, idx) => (
            <div key={idx} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
      {/* Table rows */}
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-7 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
            <div className="h-6 bg-gray-300 rounded-full w-12"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-12"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Skeleton for filters
const FiltersSkeleton = () => (
  <Card className="p-4">
    <div className="animate-pulse">
      <div className="relative mb-4">
        <div className="h-10 bg-gray-300 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-300 rounded-lg"></div>
        ))}
      </div>
    </div>
  </Card>
);

export default function InventoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(null);

  const {
    products,
    brands,
    categories,
    seasons,
    colors,
    sizes,
    productsLoading,
    filtersLoading,
    loading,
    error,
    loadAllData,
    refreshProducts,
    setProducts
  } = useInventoryData();

  const {
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    selectedSeason,
    setSelectedSeason,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    pageSize,
    paginatedData,
    totalItems,
    handlePageChange,
    handlePageSizeChange
  } = useProductFilters(products);

  // Handle authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      loadAllData();
    }
  }, [authLoading, isAuthenticated, router, loadAllData]);

  // Reset to first page when filters change
  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm, selectedBrand, selectedSeason, selectedCategory, handlePageChange]);

  const handleAddProduct = useCallback(async (productData) => {
    try {
      const response = await productsAPI.createProduct(productData);
      if (response.success && response.data) {
        setNewProduct(response.data);
        setShowAddModal(false);
        setShowVariantModal(true);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Mahsulot qo\'shishda xatolik yuz berdi');
    }
  }, []);

  const handleCreateVariants = useCallback(async (variantData) => {
    try {
      const response = await productVariantsAPI.createProductVariantsBulk(variantData);
      if (response.success) {
        setShowVariantModal(false);
        setNewProduct(null);
        await refreshProducts();
      }
    } catch (error) {
      console.error('Error creating variants:', error);
      alert('Variantlarni yaratishda xatolik yuz berdi');
    }
  }, [refreshProducts]);

  const handleEditProduct = useCallback(async (productData) => {
    try {
      const response = await productsAPI.updateProduct(editingProduct.id, productData);
      if (response.success && response.data) {
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === editingProduct.id ? response.data : p)
        );
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Mahsulotni yangilashda xatolik yuz berdi');
    }
  }, [editingProduct, setProducts]);

  const handleDeleteProduct = useCallback(async (productId) => {
    if (!confirm('Bu mahsulotni o\'chirishni xohlaysizmi?')) return;

    try {
      const response = await productsAPI.deleteProduct(productId);
      if (response.success) {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Mahsulotni o\'chirishda xatolik yuz berdi');
    }
  }, [setProducts]);

  const handleViewProduct = useCallback((product) => {
    router.push(`/inventory/${product.id}`);
  }, [router]);

  // Row highlighting based on stock status
  const getRowClassName = useCallback((product) => {
    const stockStatus = getStockStatus(product);
    
    switch (stockStatus) {
      case 'out-of-stock':
        return 'bg-red-50 border-l-4 border-red-400';
      case 'low-stock':
        return 'bg-yellow-50 border-l-4 border-yellow-400';
      case 'medium-stock':
        return 'bg-orange-50 border-l-4 border-orange-400';
      default:
        return 'hover:bg-gray-50';
    }
  }, []);

  // Helper function to get stock status
  const getStockStatus = (product) => {
    let totalStock = 0;
    if (product.variants && product.variants.length > 0) {
      totalStock = product.variants.reduce((sum, v) => sum + v.stock_quantity, 0);
    } else {
      totalStock = product.stock_quantity || 0;
    }
    
    if (totalStock === 0) return 'out-of-stock';
    if (totalStock <= 5) return 'low-stock';
    if (totalStock <= 20) return 'medium-stock';
    return 'high-stock';
  };

  // Helper function to get brand colors
  const getBrandColor = (brandName) => {
    const colors = {
      'Nike': 'bg-orange-100 text-orange-800',
      'Adidas': 'bg-blue-100 text-blue-800',
      'Puma': 'bg-yellow-100 text-yellow-800',
      'Reebok': 'bg-red-100 text-red-800',
      'New Balance': 'bg-green-100 text-green-800',
    };
    return colors[brandName] || 'bg-gray-100 text-gray-800';
  };

  const columns = useMemo(() => [
    { 
      key: 'name', 
      label: 'Mahsulot nomi', 
      width: '25%',
      render: (value, product) => (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            getStockStatus(product) === 'out-of-stock' ? 'bg-red-500' :
            getStockStatus(product) === 'low-stock' ? 'bg-yellow-500' :
            getStockStatus(product) === 'medium-stock' ? 'bg-orange-500' :
            'bg-green-500'
          }`} title={
            getStockStatus(product) === 'out-of-stock' ? 'Tugagan' :
            getStockStatus(product) === 'low-stock' ? 'Kam qoldi' :
            getStockStatus(product) === 'medium-stock' ? 'O\'rtacha' :
            'Yetarli'
          }></div>
          <span className="font-medium text-gray-900 truncate">{value}</span>
        </div>
      )
    },
    { 
      key: 'brand_name', 
      label: 'Brend', 
      width: '12%',
      render: (value, product) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBrandColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'season_name', 
      label: 'Fasl', 
      width: '10%',
      render: (value, product) => {
        const seasonColors = {
          'Bahor': 'bg-green-100 text-green-800',
          'Yoz': 'bg-yellow-100 text-yellow-800',
          'Kuz': 'bg-orange-100 text-orange-800',
          'Qish': 'bg-blue-100 text-blue-800'
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${seasonColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'price', 
      label: 'Narx', 
      width: '15%', 
      render: (value, product) => {
        let priceDisplay = '';
        let priceValue = 0;
        
        if (product.variants && product.variants.length > 0) {
          const minPrice = Math.min(...product.variants.map(v => v.price));
          const maxPrice = Math.max(...product.variants.map(v => v.price));
          priceDisplay = minPrice === maxPrice ? `${minPrice}` : `${minPrice}-${maxPrice}`;
          priceValue = minPrice;
        } else {
          priceDisplay = `${value}`;
          priceValue = value;
        }

        const priceClass = priceValue > 1000000 ? 'text-purple-600 font-semibold' :
                          priceValue > 500000 ? 'text-blue-600 font-medium' :
                          priceValue > 100000 ? 'text-green-600' :
                          'text-gray-600';

        return <span className={`${priceClass} text-sm`}>{priceDisplay}</span>;
      }
    },
    { 
      key: 'stock_quantity', 
      label: 'Zapas', 
      width: '12%',
      render: (value, product) => {
        let totalStock = 0;
        let stockDisplay = '';
        
        if (product.variants && product.variants.length > 0) {
          totalStock = product.variants.reduce((sum, v) => sum + v.stock_quantity, 0);
          stockDisplay = `${totalStock} (${product.variants.length})`;
        } else {
          totalStock = value || 0;
          stockDisplay = totalStock.toString();
        }

        const stockStatus = getStockStatus(product);
        const stockClass = stockStatus === 'out-of-stock' ? 'bg-red-100 text-red-800 border-red-200' :
                          stockStatus === 'low-stock' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          stockStatus === 'medium-stock' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          'bg-green-100 text-green-800 border-green-200';

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${stockClass}`}>
            {stockDisplay}
          </span>
        );
      }
    },
    { 
      key: 'sku', 
      label: 'SKU', 
      width: '14%',
      render: (value, product) => (
        <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded truncate">
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Amallar',
      width: '12%',
      render: (_, product) => (
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-105 transform"
            onClick={() => handleViewProduct(product)}
            title="Ko'rish"
          >
            <Eye size={14} />
          </button>
          <button
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-105 transform"
            onClick={() => handleDeleteProduct(product.id)}
            title="O'chirish"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ], [handleViewProduct, handleDeleteProduct]);

  if (authLoading) {
    return (
      <Layout>
        <PageLayout>
          <InventoryLoading message="Autentifikatsiya tekshirilmoqda..." />
        </PageLayout>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageLayout>
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <p className="text-red-600 text-center">{error}</p>
            <Button onClick={loadAllData}>Qayta urinish</Button>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout 
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-green-50/30 min-h-screen"
      >
        <div className="space-y-4">
          {/* Header */}
          <InventoryHeader
            totalProducts={productsLoading ? 0 : products.length}
            filteredCount={productsLoading ? 0 : totalItems}
            onAddProduct={() => setShowAddModal(true)}
            loading={productsLoading}
          />

          {/* Search and Filters */}
          {filtersLoading ? (
            <FiltersSkeleton />
          ) : (
            <Card className="p-4">
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Mahsulotlarni qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 py-2"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${filtersLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={filtersLoading}
                >
                  <option value="all">{filtersLoading ? 'Yuklanmoqda...' : 'Barcha kategoriyalar'}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className={`px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${filtersLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={filtersLoading}
                >
                  <option value="all">{filtersLoading ? 'Yuklanmoqda...' : 'Barcha brendlar'}</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className={`px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${filtersLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={filtersLoading}
                >
                  <option value="all">{filtersLoading ? 'Yuklanmoqda...' : 'Barcha fasllar'}</option>
                  {seasons.map(season => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </select>

                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={5}>5 ta</option>
                  <option value={10}>10 ta</option>
                  <option value={20}>20 ta</option>
                  <option value={50}>50 ta</option>
                </select>
              </div>
            </Card>
          )}

          {/* Stock Status Legend */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Zapas holati bo'yicha ranglar:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Tugagan (0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Kam (≤5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">O'rtacha (≤20)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Yetarli ({'>'}20)</span>
              </div>
            </div>
          </Card>

          {/* Products Table */}
          {productsLoading ? (
            <ProductsSkeleton />
          ) : (
            <Card className="overflow-hidden">
              <Table
                columns={columns}
                data={paginatedData}
                className="rounded-lg"
                onRowClick={handleViewProduct}
                pagination={true}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                getRowClassName={getRowClassName}
                highlightRows={true}
              />
            </Card>
          )}
        </div>

        {/* Product Creation Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Yangi mahsulot qo'shish"
          size="large"
        >
          <ProductForm
            product={null}
            brands={brands || []}
            categories={categories || []}
            seasons={seasons || []}
            onSubmit={handleAddProduct}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>

        {/* Product Variant Creation Modal */}
        <Modal
          isOpen={showVariantModal}
          onClose={() => {
            setShowVariantModal(false);
            setNewProduct(null);
          }}
          title="Mahsulot variantlarini yaratish"
          size="2xl"
        >
          <ProductVariantForm
            product={newProduct}
            colors={colors}
            sizes={sizes}
            onSubmit={handleCreateVariants}
            onCancel={() => {
              setShowVariantModal(false);
              setNewProduct(null);
            }}
          />
        </Modal>

        {/* Product Edit Modal */}
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title="Mahsulotni tahrirlash"
          size="large"
        >
          <ProductForm
            product={editingProduct}
            brands={brands || []}
            categories={categories || []}
            seasons={seasons || []}
            onSubmit={handleEditProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </Modal>
      </PageLayout>
    </Layout>
  );
} 