import api from './client';
import { validateApiResponse } from '../utils/api';
import logger from '../utils/logger';

/**
 * Wrap an axios call promise and normalize the response using validateApiResponse
 */
export const request = async (axiosPromise) => {
  try {
    const response = await axiosPromise;
    return validateApiResponse(response.data);
  } catch (error) {
    logger.error('API request failed', error);
    throw error;
  }
};

/**
 * Factory to quickly build CRUD-style API clients following our conventions
 */
export const createCrudApi = (basePath) => {
  const normalizedBase = basePath.replace(/\/$/, '');

  return {
    list: (params = {}) => request(api.get(`${normalizedBase}`, { params })),
    get: (id) => request(api.get(`${normalizedBase}/${id}`)),
    create: (data) => request(api.post(`${normalizedBase}/`, data)),
    update: (id, data) => request(api.put(`${normalizedBase}/${id}`, data)),
    remove: (id) => request(api.delete(`${normalizedBase}/${id}`)),
  };
};

export default {
  request,
  createCrudApi,
};

