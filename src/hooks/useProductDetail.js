'use client';

import { useState, useEffect } from 'react';
import { productsAPI, brandsAPI, seasonsAPI, productVariantsAPI, settingsAPI } from '../api';
import logger from '../utils/logger';

export default function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      loadProduct(productId);
      loadBrands();
      loadSeasons();
      loadCategories();
      loadVariants(productId);
    }
  }, [productId]);

  const loadProduct = async (id) => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError('Mahsulot topilmadi');
      }
    } catch (error) {
      logger.error('Error loading product:', error);
      setError('Mahsulot yuklanmadi');
    } finally {
      setLoading(false);
    }
  };

  const loadVariants = async (productId) => {
    try {
      setVariantsLoading(true);
      const response = await productVariantsAPI.getProductVariants(productId);
      if (response.success && response.data) {
        setVariants(response.data);
      } else {
        setVariants([]);
      }
    } catch (error) {
      logger.error('Error loading variants:', error);
      setVariants([]);
    } finally {
      setVariantsLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await brandsAPI.getBrands();
      if (response.success && response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      logger.error('Error loading brands:', error);
    }
  };

  const loadSeasons = async () => {
    try {
      const response = await seasonsAPI.getSeasons();
      if (response.success && response.data) {
        setSeasons(response.data);
      }
    } catch (error) {
      logger.error('Error loading seasons:', error);
    }
  };


  const loadCategories = async () => {
    try {
      const response = await settingsAPI.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      logger.error('Error loading categories:', error);
    }
  };

  const updateProduct = async (productData) => {
    try {
      const response = await productsAPI.updateProduct(product.id, productData);
      if (response.success && response.data) {
        setProduct(response.data);
        return { success: true };
      }
      return { success: false, error: 'Mahsulot yangilanmadi' };
    } catch (error) {
      logger.error('Error updating product:', error);
      return { success: false, error: 'Mahsulot yangilanmadi' };
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await productsAPI.deleteProduct(product.id);
      return { success: response.success };
    } catch (error) {
      logger.error('Error deleting product:', error);
      return { success: false, error: 'Mahsulot o\'chirilmadi' };
    }
  };

  const updateVariant = async (variantId, variantData) => {
    try {
      const response = await productVariantsAPI.updateProductVariant(variantId, variantData);
      if (response.success && response.data) {
        // Update the variant in the local state
        setVariants(prevVariants => 
          prevVariants.map(variant => 
            variant.id === variantId ? response.data : variant
          )
        );
        return { success: true };
      }
      return { success: false, error: 'Variant yangilanmadi' };
    } catch (error) {
      logger.error('Error updating variant:', error);
      return { success: false, error: 'Variant yangilanmadi' };
    }
  };

  const deleteVariant = async (variantId) => {
    try {
      const response = await productVariantsAPI.deleteProductVariant(variantId);
      if (response.success) {
        // Remove the variant from local state
        setVariants(prevVariants => 
          prevVariants.filter(variant => variant.id !== variantId)
        );
        return { success: true };
      }
      return { success: false, error: 'Variant o\'chirilmadi' };
    } catch (error) {
      logger.error('Error deleting variant:', error);
      return { success: false, error: 'Variant o\'chirilmadi' };
    }
  };

  return {
    product,
    brands,
    seasons,
    categories,
    variants,
    variantsLoading,
    loading,
    error,
    updateProduct,
    deleteProduct,
    updateVariant,
    deleteVariant,
    loadVariants
  };
} 