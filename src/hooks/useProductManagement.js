'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsAPI, settingsAPI } from '../api';

export const useProductManagement = (itemsPerPage = 10) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add',
    product: null,
    loading: false,
    deleting: false
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts();
      if (response.success && response.data) {
        setProducts(response.data.items || []);
        setTotalItems(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await settingsAPI.getCategories();
      if (response.success && response.data) {
        const allCategories = [{ id: 'all', name: 'Barcha kategoriyalar' }, ...response.data];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([
        { id: 'all', name: 'Barcha kategoriyalar' },
        { id: 't-shirts', name: 'T-Shirts' },
        { id: 'shirts', name: 'Shirts' },
        { id: 'pants', name: 'Pants' },
        { id: 'dresses', name: 'Dresses' },
        { id: 'jackets', name: 'Jackets' },
        { id: 'shoes', name: 'Shoes' },
        { id: 'accessories', name: 'Accessories' },
        { id: 'underwear', name: 'Underwear' }
      ]);
    }
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = products || [];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (selectedColor !== 'all') {
      filtered = filtered.filter(product => product.color === selectedColor);
    }

    if (selectedSeason !== 'all') {
      filtered = filtered.filter(product => product.season === selectedSeason);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedColor, selectedSeason]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  useEffect(() => {
    if (Array.isArray(products)) {
      filterProducts();
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchTerm, selectedCategory, selectedColor, selectedSeason, filterProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedColor, selectedSeason]);

  const openModal = useCallback((mode, product = null) => {
    setModalState({
      isOpen: true,
      mode,
      product,
      loading: false,
      deleting: false
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
      product: null
    }));
  }, []);

  const handleAddProduct = useCallback(async (productData) => {
    setModalState(prev => ({ ...prev, loading: true }));
    try {
      const response = await productsAPI.createProduct(productData);
      setProducts(prev => [...prev, response.data]);
      closeModal();
      loadProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setModalState(prev => ({ ...prev, loading: false }));
    }
  }, [closeModal, loadProducts]);

  const handleEditProduct = useCallback(async (productData) => {
    setModalState(prev => ({ ...prev, loading: true }));
    try {
      const response = await productsAPI.updateProduct(modalState.product.id, productData);
      setProducts(prev => prev.map(p => p.id === modalState.product.id ? response.data : p));
      closeModal();
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setModalState(prev => ({ ...prev, loading: false }));
    }
  }, [modalState.product, closeModal, loadProducts]);

  const handleDeleteProduct = useCallback(async (productId) => {
    setModalState(prev => ({ ...prev, deleting: true }));
    try {
      await productsAPI.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      closeModal();
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Mahsulotni o\'chirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setModalState(prev => ({ ...prev, deleting: false }));
    }
  }, [closeModal, loadProducts]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const getPaginatedData = useCallback(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  return {
    // State
    products: getPaginatedData(),
    allProducts: filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedColor,
    setSelectedColor,
    selectedSeason,
    setSelectedSeason,
    currentPage,
    totalPages,
    totalItems: filteredProducts.length,
    pageSize,
    categories,
    modalState,
    
    // Actions
    openModal,
    closeModal,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handlePageChange,
    handlePageSizeChange,
    
    // Computed
    hasFilters: searchTerm || selectedCategory !== 'all' || selectedColor !== 'all' || selectedSeason !== 'all'
  };
}; 