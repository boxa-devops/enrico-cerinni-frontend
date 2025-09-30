import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../api';
import { SEARCH_CONFIG } from '../utils/constants';

export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchProducts = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await productsAPI.getProducts({ 
        search: term, 
        limit: SEARCH_CONFIG.MAX_LIMIT // Use MAX_LIMIT for search to show more results
      });
      
      if (response.success && response.data) {
        const availableProducts = (response.data.items || []);
        setSearchResults(availableProducts);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const getRecentProducts = useCallback(async () => {
    setSearchLoading(true);
    try {
      const response = await productsAPI.getProducts({ 
        limit: SEARCH_CONFIG.MAX_LIMIT, // Use MAX_LIMIT to show more recent products
        sort_by: 'created_at',
        sort_order: 'desc'
      });

      if (response.success && response.data) {
        const availableProducts = (response.data.items || []);
        setSearchResults(availableProducts);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error loading recent products:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Load recent products on component mount
  useEffect(() => {
    getRecentProducts();
  }, [getRecentProducts]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProducts(searchTerm);
      } else {
        getRecentProducts();
      }
    }, SEARCH_CONFIG.DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchProducts, getRecentProducts]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
  }, []);

  return {
    searchTerm,
    searchResults,
    searchLoading,
    isSearchFocused,
    setSearchTerm,
    setIsSearchFocused,
    clearSearch,
    searchProducts,
    getRecentProducts,
  };
}; 