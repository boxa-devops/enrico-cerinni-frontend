'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import Button from '../ui/Button';
import { validateProductVariantBulkCreate } from '../../utils/validation';

const ProductVariantForm = ({ 
  product, 
  colors, 
  sizes, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [basePrice, setBasePrice] = useState('');
  const [baseCostPrice, setBaseCostPrice] = useState('');
  const [baseStockQuantity, setBaseStockQuantity] = useState('');
  const [baseMinStockLevel, setBaseMinStockLevel] = useState('');
  const [variants, setVariants] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (product) {
      setBasePrice(product.price || '');
      setBaseCostPrice(product.cost_price || '');
      setBaseStockQuantity(product.stock_quantity || '');
      setBaseMinStockLevel(product.min_stock_level || '');
    }
  }, [product]);

  const generateVariants = () => {
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

    const newVariants = [];
    selectedColors.forEach(color => {
      selectedSizes.forEach(size => {
        newVariants.push({
          product_id: product.id,
          color_id: color.id,
          size_id: size.id,
          sku: `${product?.sku || 'PROD'}-${color.name}-${size.name}`.toUpperCase(),
          price: parseFloat(basePrice),
          cost_price: baseCostPrice ? parseFloat(baseCostPrice) : null,
          stock_quantity: parseInt(baseStockQuantity),
          min_stock_level: parseInt(baseMinStockLevel) || 0
        });
      });
    });

    setVariants(newVariants);
    setValidationErrors([]);
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setVariants(updatedVariants);
    setValidationErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (variants.length === 0) {
      alert('Variantlar yaratilmagan');
      return;
    }

    // Format data according to ProductVariantBulkCreate model
    const bulkData = {
      product_id: product.id,
      variants: variants
    };

    // Validate the data before submission
    const errors = validateProductVariantBulkCreate(bulkData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      alert('Ma\'lumotlarda xatoliklar mavjud:\n' + errors.join('\n'));
      return;
    }

    onSubmit(bulkData);
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.find(c => c.id === color.id)
        ? prev.filter(c => c.id !== color.id)
        : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.find(s => s.id === size.id)
        ? prev.filter(s => s.id !== size.id)
        : [...prev, size]
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Mahsulot variantlarini yaratish</h2>
            <p className="text-sm text-gray-600">Rang va o'lchamlar tanlang, keyin variantlar yaratiladi</p>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-red-800 mb-1">Xatoliklar:</h4>
          <ul className="list-disc list-inside space-y-0.5">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-xs text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Color Selection */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-900">Ranglar</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5">
            {colors?.map(color => (
              <label key={color.id} className="flex items-center gap-1.5 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200">
                <input
                  type="checkbox"
                  checked={selectedColors.some(c => c.id === color.id)}
                  onChange={() => toggleColor(color)}
                  disabled={loading}
                  className="w-3 h-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300" 
                    style={{ backgroundColor: color.hex_code || '#ccc' }}
                  />
                  <span className="text-xs text-gray-900">{color.name}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-900">O\'lchamlar</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5">
            {sizes?.map(size => (
              <label key={size.id} className="flex items-center gap-1.5 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200">
                <input
                  type="checkbox"
                  checked={selectedSizes.some(s => s.id === size.id)}
                  onChange={() => toggleSize(size)}
                  disabled={loading}
                  className="w-3 h-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-xs text-gray-900">{size.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Base Settings */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-900">Asosiy sozlamalar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Asosiy narx *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Asosiy tannarx</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={baseCostPrice}
                onChange={(e) => setBaseCostPrice(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Asosiy zapas *</label>
              <input
                type="number"
                min="0"
                value={baseStockQuantity}
                onChange={(e) => setBaseStockQuantity(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Min. zapas</label>
              <input
                type="number"
                min="0"
                value={baseMinStockLevel}
                onChange={(e) => setBaseMinStockLevel(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Generate Variants Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={generateVariants}
            disabled={loading || selectedColors.length === 0 || selectedSizes.length === 0}
            variant="secondary"
            size="sm"
          >
            Variantlar yaratish ({selectedColors.length} × {selectedSizes.length} = {selectedColors.length * selectedSizes.length})
          </Button>
        </div>

        {/* Variants Table */}
        {variants.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900">Yaratilgan variantlar ({variants.length})</h3>
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rang</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">O\'lcham</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Narx</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tannarx</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Zapas</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Min</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((variant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-3 h-3 rounded-full border border-gray-300" 
                              style={{ backgroundColor: colors.find(c => c.id === variant.color_id)?.hex_code || '#ccc' }}
                            />
                            <span className="text-xs text-gray-900">{colors.find(c => c.id === variant.color_id)?.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">{sizes.find(s => s.id === variant.size_id)?.name}</td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            disabled={loading}
                            maxLength={50}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            disabled={loading}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.cost_price || ''}
                            onChange={(e) => updateVariant(index, 'cost_price', e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            disabled={loading}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            value={variant.stock_quantity}
                            onChange={(e) => updateVariant(index, 'stock_quantity', parseInt(e.target.value))}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            disabled={loading}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            value={variant.min_stock_level}
                            onChange={(e) => updateVariant(index, 'min_stock_level', parseInt(e.target.value))}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            disabled={loading}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="secondary" 
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Bekor qilish
          </Button>
          <Button 
            type="submit"
            size="sm"
            loading={loading}
            disabled={variants.length === 0}
          >
            Saqlash ({variants.length})
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductVariantForm; 