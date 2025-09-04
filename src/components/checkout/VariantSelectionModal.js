'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import Modal from '../modals/Modal';
import Button from '../ui/Button';

export default function VariantSelectionModal({
  isOpen,
  onClose,
  product,
  onVariantSelect,
  scannedVariantSku = null,
  loading = false
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Auto-select the scanned variant when modal opens
  useEffect(() => {
    if (isOpen && scannedVariantSku && product?.variants) {
      const scannedVariant = product.variants.find(variant => 
        variant.sku && variant.sku.toLowerCase() === scannedVariantSku.toLowerCase()
      );
      if (scannedVariant) {
        setSelectedVariant(scannedVariant);
      }
    } else if (!isOpen) {
      // Reset selection when modal closes
      setSelectedVariant(null);
    }
  }, [isOpen, scannedVariantSku, product]);

  // Debug logging
  if (isOpen) {
    console.log('VariantSelectionModal opened with product:', product);
    console.log('Scanned variant SKU:', scannedVariantSku);
  }

  // Don't render if product is null or doesn't have variants
  if (!product || !product.variants || product.variants.length === 0) {
    if (isOpen) {
      console.warn('VariantSelectionModal: No product or variants found but modal is open');
    }
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Variant tanlash"
        size="lg"
      >
        <div className="text-center py-8">
          <p className="text-gray-500">Mahsulot ma'lumotlari topilmadi.</p>
        </div>
      </Modal>
    );
  }

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleConfirm = () => {
    if (selectedVariant) {
      const variantProduct = {
        ...product,
        id: selectedVariant.id,
        price: selectedVariant.price,
        stock_quantity: selectedVariant.stock_quantity,
        sku: selectedVariant.sku,
        color_name: selectedVariant.color_name,
        size_name: selectedVariant.size_name,
        variant_id: selectedVariant.id
      };
      onVariantSelect(variantProduct);
      onClose();
    }
  };

  const getAvailableVariants = () => {
    if (!product || !product.variants) {
      return [];
    }
    return product.variants.filter(variant => variant.stock_quantity > 0);
  };

  const getColorVariants = () => {
    const variants = getAvailableVariants();
    const colorGroups = {};
    
    variants.forEach(variant => {
      const colorName = variant.color_name || 'Noma\'lum';
      if (!colorGroups[colorName]) {
        colorGroups[colorName] = [];
      }
      colorGroups[colorName].push(variant);
    });
    
    return colorGroups;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${product?.name} - Variant tanlash`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Product Info */}
        <div className="text-center bg-gray-50 rounded-lg p-2 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product?.name}</h3>
          <p className="text-sm text-gray-600">
            {product?.brand_name} • {product?.season_name}
          </p>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          {Object.entries(getColorVariants()).map(([colorName, variants]) => (
            <div key={colorName} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">{colorName}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variants.map(variant => (
                  <button
                    key={variant.id}
                    className={`relative p-2 border-2 rounded-lg text-left transition-all duration-200 ${
                      selectedVariant?.id === variant.id 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    } ${variant.stock_quantity <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => handleVariantSelect(variant)}
                    disabled={variant.stock_quantity <= 0 || loading}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-gray-900">{variant.size_name}</span>
                      <span className="text-sm font-bold text-green-600">{variant.price} UZS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {variant.stock_quantity} dona
                      </span>
                      {selectedVariant?.id === variant.id && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            fullWidth
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedVariant || loading}
            loading={loading}
            fullWidth
          >
            Tanlash
          </Button>
        </div>
      </div>
    </Modal>
  );
} 