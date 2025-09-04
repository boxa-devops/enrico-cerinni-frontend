'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Palette, Hash } from 'lucide-react';
import Modal from './Modal';
import Button from '../ui/Button';
import { colorsAPI, sizesAPI, productVariantsAPI } from '../../api';

export default function VariantCreationModal({
  isOpen,
  onClose,
  product,
  onVariantCreated
}) {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [basePrice, setBasePrice] = useState('');
  const [baseStockQuantity, setBaseStockQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadColors();
      loadSizes();
      if (product) {
        setBasePrice(product.price || '');
        setBaseStockQuantity(product.stock_quantity || '');
      }
    }
  }, [isOpen, product]);

  const loadColors = async () => {
    try {
      const response = await colorsAPI.getColors();
      if (response.success && response.data) {
        setColors(response.data);
      }
    } catch (error) {
      console.error('Error loading colors:', error);
    }
  };

  const loadSizes = async () => {
    try {
      const response = await sizesAPI.getSizes();
      if (response.success && response.data) {
        setSizes(response.data);
      }
    } catch (error) {
      console.error('Error loading sizes:', error);
    }
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => 
      prev.find(c => c.id === color.id)
        ? prev.filter(c => c.id !== color.id)
        : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.find(s => s.id === size.id)
        ? prev.filter(s => s.id !== size.id)
        : [...prev, size]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      alert('Rang va o\'lcham tanlang');
      return;
    }

    if (!basePrice || basePrice <= 0) {
      alert('To\'g\'ri narx kiriting');
      return;
    }

    if (!baseStockQuantity || baseStockQuantity < 0) {
      alert('To\'g\'ri zapas miqdori kiriting');
      return;
    }

    setLoading(true);
    try {
      const variants = {
        product_id: product.id,
        variants: []
      };
      selectedColors.forEach(color => {
        selectedSizes.forEach(size => {
          variants.variants.push({
            product_id: product.id,
            color_id: color.id,
            size_id: size.id,
            price: parseFloat(basePrice),
            stock_quantity: parseInt(baseStockQuantity),
            sku: `${product?.sku || 'PROD'}-${color.name}-${size.name}`.toUpperCase()
          });
        });
      });



      const response = await productVariantsAPI.createProductVariantsBulk(variants);
      if (response.success) {
        onVariantCreated();
        onClose();
        // Reset form
        setSelectedColors([]);
        setSelectedSizes([]);
      } else {
        alert('Variantlar yaratilmadi');
      }
    } catch (error) {
      console.error('Error creating variants:', error);
      alert('Variantlar yaratilmadi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Yangi variantlar qo'shish"
      size="lg"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900">{product?.name}</h4>
          <p className="text-sm text-gray-600">{product?.brand} • {product?.season}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="flex items-center gap-2 font-medium text-gray-900">
                <Palette size={14} />
                Ranglar
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {colors.map(color => (
                  <button
                    key={color.id}
                    type="button"
                    className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                      selectedColors.find(c => c.id === color.id) 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleColorToggle(color)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex || '#ccc' }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="flex items-center gap-2 font-medium text-gray-900">
                <Hash size={14} />
                O'lchamlar
              </h5>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    type="button"
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSizes.find(s => s.id === size.id) 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Asosiy sozlamalar</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Narx (UZS)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="Narxni kiriting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Zapas miqdori</label>
                <input
                  type="number"
                  value={baseStockQuantity}
                  onChange={(e) => setBaseStockQuantity(e.target.value)}
                  placeholder="Zapas miqdorini kiriting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {selectedColors.length > 0 && selectedSizes.length > 0 && (
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900">Yaratiladigan variantlar ({selectedColors.length * selectedSizes.length})</h5>
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedColors.map(color => 
                    selectedSizes.map(size => (
                      <div key={`${color.id}-${size.id}`} className="flex items-center gap-2 bg-white p-2 rounded border">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex || '#ccc' }}
                        />
                        <span className="text-sm">{color.name} - {size.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={selectedColors.length === 0 || selectedSizes.length === 0 || loading}
              loading={loading}
            >
              <Plus size={14} />
              Variantlarni yaratish
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 