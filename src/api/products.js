import api from './client';
import { validateApiResponse } from '../utils/api';

export const productsAPI = {
  // Get all products with filtering and pagination
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products/', { params });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get products API error:', error);
      throw error;
    }
  },

  getProductByBarcode: async (barcode) => {
    try {
      const response = await api.get(`/products/barcode/${barcode}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get product by SKU API error:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get product API error:', error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products/', productData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create product API error:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update product API error:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete product API error:', error);
      throw error;
    }
  },

  // Update product stock
  updateStock: async (productId, stockQuantity) => {
    try {
      const response = await api.patch(`/products/${productId}/stock`, {
        stock_quantity: stockQuantity
      });
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update stock API error:', error);
      throw error;
    }
  },
}; 