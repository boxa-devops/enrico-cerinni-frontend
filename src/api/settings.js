import api from './client';
import { validateApiResponse } from '../utils/api';
import { createCrudApi } from './helpers';

export const settingsAPI = {
  // Categories
  ...(() => {
    const crud = createCrudApi('/settings/categories');
    return {
      getCategories: () => crud.list(),
      createCategory: (data) => crud.create(data),
      updateCategory: (id, data) => crud.update(id, data),
      deleteCategory: (id) => crud.remove(id),
    };
  })(),

  // Brands
  ...(() => {
    const crud = createCrudApi('/brands');
    return {
      getBrands: () => crud.list(),
      createBrand: (data) => crud.create(data),
      updateBrand: (id, data) => crud.update(id, data),
      deleteBrand: (id) => crud.remove(id),
    };
  })(),

  // Colors
  ...(() => {
    const crud = createCrudApi('/colors');
    return {
      getColors: () => crud.list(),
      createColor: (data) => crud.create(data),
      updateColor: (id, data) => crud.update(id, data),
      deleteColor: (id) => crud.remove(id),
    };
  })(),

  // Sizes
  ...(() => {
    const crud = createCrudApi('/sizes');
    return {
      getSizes: () => crud.list(),
      createSize: (data) => crud.create(data),
      updateSize: (id, data) => crud.update(id, data),
      deleteSize: (id) => crud.remove(id),
    };
  })(),

  // Seasons
  ...(() => {
    const crud = createCrudApi('/seasons');
    return {
      getSeasons: () => crud.list(),
      createSeason: (data) => crud.create(data),
      updateSeason: (id, data) => crud.update(id, data),
      deleteSeason: (id) => crud.remove(id),
    };
  })(),

  // Attributes
  getAttributes: async () => {
    try {
      const response = await api.get('/settings/attributes');
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Get attributes API error:', error);
      throw error;
    }
  },

  createAttribute: async (attributeData) => {
    try {
      const response = await api.post('/settings/attributes', attributeData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Create attribute API error:', error);
      throw error;
    }
  },

  updateAttribute: async (attributeId, attributeData) => {
    try {
      const response = await api.put(`/settings/attributes/${attributeId}`, attributeData);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Update attribute API error:', error);
      throw error;
    }
  },

  deleteAttribute: async (attributeId) => {
    try {
      const response = await api.delete(`/settings/attributes/${attributeId}`);
      return validateApiResponse(response.data);
    } catch (error) {
      console.error('Delete attribute API error:', error);
      throw error;
    }
  },
}; 