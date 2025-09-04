import { request } from './helpers';
import api from './client';

export const productVariantsAPI = {
  getProductVariants: (productId) => request(api.get(`/product-variants/product/${productId}`)),
  createProductVariant: (variantData) => request(api.post('/product-variants/', variantData)),
  createProductVariantsBulk: (bulkData) => request(api.post('/product-variants/bulk', bulkData)),
  updateProductVariant: (variantId, variantData) => request(api.put(`/product-variants/${variantId}`, variantData)),
  deleteProductVariant: (variantId) => request(api.delete(`/product-variants/${variantId}`)),
};