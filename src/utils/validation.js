export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength;
};

export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateNonNegativeNumber = (value) => {
  return validateNumber(value) && parseFloat(value) >= 0;
};

export const validateProductVariant = (variant) => {
  const errors = [];
  
  if (!variant.product_id || !Number.isInteger(variant.product_id)) {
    errors.push('product_id must be a valid integer');
  }
  
  if (!variant.color_id || !Number.isInteger(variant.color_id)) {
    errors.push('color_id must be a valid integer');
  }
  
  if (!variant.size_id || !Number.isInteger(variant.size_id)) {
    errors.push('size_id must be a valid integer');
  }
  
  if (!variant.sku || variant.sku.trim() === '') {
    errors.push('sku is required');
  } else if (variant.sku.length > 50) {
    errors.push('sku must be 50 characters or less');
  }
  
  if (!validateNonNegativeNumber(variant.price)) {
    errors.push('price must be a non-negative number');
  }
  
  if (variant.cost_price !== null && variant.cost_price !== undefined && !validateNonNegativeNumber(variant.cost_price)) {
    errors.push('cost_price must be a non-negative number');
  }
  
  if (!Number.isInteger(variant.stock_quantity) || variant.stock_quantity < 0) {
    errors.push('stock_quantity must be a non-negative integer');
  }
  
  if (!Number.isInteger(variant.min_stock_level) || variant.min_stock_level < 0) {
    errors.push('min_stock_level must be a non-negative integer');
  }
  
  return errors;
};

export const validateProductVariantBulkCreate = (bulkData) => {
  const errors = [];
  
  if (!bulkData.product_id || !Number.isInteger(bulkData.product_id)) {
    errors.push('product_id must be a valid integer');
  }
  
  if (!Array.isArray(bulkData.variants) || bulkData.variants.length === 0) {
    errors.push('variants must be a non-empty array');
  } else {
    bulkData.variants.forEach((variant, index) => {
      const variantErrors = validateProductVariant(variant);
      if (variantErrors.length > 0) {
        errors.push(`Variant ${index + 1}: ${variantErrors.join(', ')}`);
      }
    });
  }
  
  return errors;
};

export const getFieldError = (value, validations = []) => {
  for (const validation of validations) {
    const { test, message } = validation;
    if (!test(value)) {
      return message;
    }
  }
  return null;
}; 