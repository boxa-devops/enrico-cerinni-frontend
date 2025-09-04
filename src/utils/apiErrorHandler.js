/**
 * API Error Handler Utility
 * 
 * Centralized error handling for API responses with consistent error messages
 * and proper error classification.
 * 
 * @module apiErrorHandler
 */

import { ERROR_MESSAGES } from './constants';
import logger from './logger';

/**
 * Error types for classification
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown',
};

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, status = null, data = null) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      status: this.status,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Classify error based on status code and response
 */
const classifyError = (status, response) => {
  if (status >= 500) return ERROR_TYPES.SERVER;
  if (status === 404) return ERROR_TYPES.NOT_FOUND;
  if (status === 401) return ERROR_TYPES.AUTHENTICATION;
  if (status === 403) return ERROR_TYPES.AUTHORIZATION;
  if (status >= 400 && status < 500) return ERROR_TYPES.VALIDATION;
  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get user-friendly error message based on error type and status
 */
const getUserFriendlyMessage = (type, status, serverMessage) => {
  // Use server message if it's user-friendly
  if (serverMessage && typeof serverMessage === 'string' && serverMessage.length < 100) {
    return serverMessage;
  }

  switch (type) {
    case ERROR_TYPES.NETWORK:
      return ERROR_MESSAGES.NETWORK_ERROR;
    case ERROR_TYPES.AUTHENTICATION:
      return ERROR_MESSAGES.AUTHENTICATION_FAILED;
    case ERROR_TYPES.AUTHORIZATION:
      return 'Bu amalni bajarish uchun ruxsatingiz yo\'q';
    case ERROR_TYPES.VALIDATION:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case ERROR_TYPES.NOT_FOUND:
      return 'So\'ralgan ma\'lumot topilmadi';
    case ERROR_TYPES.SERVER:
      return 'Server xatosi. Iltimos, keyinroq qayta urinib ko\'ring';
    default:
      return 'Kutilmagan xatolik yuz berdi';
  }
};

/**
 * Handle Axios error responses
 */
export const handleAxiosError = (error) => {
  // Network error (no response received)
  if (!error.response) {
    logger.error('Network error:', error.message);
    return new APIError(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_TYPES.NETWORK,
      null,
      { originalError: error.message }
    );
  }

  const { status, data } = error.response;
  const errorType = classifyError(status, data);
  const serverMessage = data?.message || data?.error || data?.detail;
  const userMessage = getUserFriendlyMessage(errorType, status, serverMessage);

  logger.error(`API Error ${status}:`, {
    url: error.config?.url,
    method: error.config?.method,
    status,
    message: serverMessage,
    data: data,
  });

  return new APIError(userMessage, errorType, status, data);
};

/**
 * Handle fetch API errors
 */
export const handleFetchError = async (response) => {
  const status = response.status;
  let data = null;
  
  try {
    data = await response.json();
  } catch (e) {
    // Response might not be JSON
    data = { message: response.statusText };
  }

  const errorType = classifyError(status, data);
  const serverMessage = data?.message || data?.error || data?.detail;
  const userMessage = getUserFriendlyMessage(errorType, status, serverMessage);

  logger.error(`Fetch Error ${status}:`, {
    url: response.url,
    status,
    message: serverMessage,
    data: data,
  });

  return new APIError(userMessage, errorType, status, data);
};

/**
 * Generic error handler for any error
 */
export const handleGenericError = (error, context = '') => {
  if (error instanceof APIError) {
    return error;
  }

  if (error?.response) {
    // Axios error
    return handleAxiosError(error);
  }

  // Generic JavaScript error
  logger.error(`Generic error${context ? ` in ${context}` : ''}:`, error);
  
  return new APIError(
    error.message || 'Kutilmagan xatolik yuz berdi',
    ERROR_TYPES.UNKNOWN,
    null,
    { originalError: error.toString(), context }
  );
};

/**
 * Error boundary for async operations
 */
export const withErrorHandling = (asyncFn, context = '') => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      throw handleGenericError(error, context);
    }
  };
};

/**
 * Retry mechanism for failed API calls
 */
export const withRetry = (asyncFn, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFn(...args);
      } catch (error) {
        lastError = error;
        
        // Don't retry client errors (4xx) except authentication
        if (error instanceof APIError && 
            error.status >= 400 && 
            error.status < 500 && 
            error.type !== ERROR_TYPES.AUTHENTICATION) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        
        logger.warn(`Retrying API call (attempt ${attempt + 1}/${maxRetries})`);
      }
    }
    
    throw lastError;
  };
};

/**
 * Validation error formatter
 */
export const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors;
  }

  if (Array.isArray(errors)) {
    return errors.join(', ');
  }

  if (typeof errors === 'object' && errors !== null) {
    return Object.entries(errors)
      .map(([field, messages]) => {
        const messageList = Array.isArray(messages) ? messages : [messages];
        return `${field}: ${messageList.join(', ')}`;
      })
      .join('; ');
  }

  return 'Validation error occurred';
};

export default {
  APIError,
  ERROR_TYPES,
  handleAxiosError,
  handleFetchError,
  handleGenericError,
  withErrorHandling,
  withRetry,
  formatValidationErrors,
};
