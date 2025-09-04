'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus, Save, X, Package, Tag, Palette, Hash, DollarSign } from 'lucide-react';
import Button from '../ui/Button';

export default function ProductVariants({ 
  variants = [], 
  loading = false, 
  onUpdateVariant, 
  onDeleteVariant,
  onAddVariant 
}) {
  const [editingVariant, setEditingVariant] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (variant) => {
    setEditingVariant(variant.id);
    setEditData({
      price: variant.price,
      stock_quantity: variant.stock_quantity,
      min_stock_level: variant.min_stock_level || 0,
      is_active: variant.is_active
    });
  };

  const handleSave = async () => {
    if (editingVariant) {
      const result = await onUpdateVariant(editingVariant, editData);
      if (result.success) {
        setEditingVariant(null);
        setEditData({});
      } else {
        alert(result.error || 'Variant yangilanmadi');
      }
    }
  };

  const handleCancel = () => {
    setEditingVariant(null);
    setEditData({});
  };

  const handleDelete = async (variantId) => {
    if (!confirm('Bu variantni o\'chirishni xohlaysizmi?')) return;
    
    const result = await onDeleteVariant(variantId);
    if (!result.success) {
      alert(result.error || 'Variant o\'chirilmadi');
    }
  };

  const getColorVariants = () => {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Mahsulot variantlari</h3>
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-sm text-gray-600">Variantlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Mahsulot variantlari</h3>
          <Button size="sm" onClick={onAddVariant}>
            <Plus size={14} />
            Variant qo'shish
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package size={24} className="text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-3">Bu mahsulot uchun variantlar mavjud emas</p>
          <Button variant="secondary" size="sm" onClick={onAddVariant}>
            Birinchi variantni qo'shish
          </Button>
        </div>
      </div>
    );
  }

  const colorGroups = getColorVariants();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Mahsulot variantlari ({variants.length})</h3>
        <Button size="sm" onClick={onAddVariant}>
          <Plus size={14} />
          Variant qo'shish
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(colorGroups).map(([colorName, colorVariants]) => (
          <div key={colorName} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ 
                    backgroundColor: colorVariants[0]?.color_hex || '#ccc'
                  }}
                />
                <span className="text-sm font-medium text-gray-900">{colorName}</span>
              </div>
              <span className="text-xs text-gray-500">
                {colorVariants.length} variant
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {colorVariants.map(variant => (
                <div key={variant.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  {editingVariant === variant.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-gray-500 mb-1">O'lcham</label>
                          <span className="text-gray-900 font-medium">{variant.size_name}</span>
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">SKU</label>
                          <span className="text-gray-900 font-mono text-xs">{variant.sku}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Narx (UZS)</label>
                          <input
                            type="number"
                            value={editData.price || ''}
                            onChange={(e) => setEditData(prev => ({ 
                              ...prev, 
                              price: parseFloat(e.target.value) || 0 
                            }))}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Zapas</label>
                          <input
                            type="number"
                            value={editData.stock_quantity || ''}
                            onChange={(e) => setEditData(prev => ({ 
                              ...prev, 
                              stock_quantity: parseInt(e.target.value) || 0 
                            }))}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-1">
                        <Button size="sm" onClick={handleSave}>
                          <Save size={10} />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleCancel}>
                          <X size={10} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{variant.size_name}</span>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEdit(variant)}
                          >
                            <Edit size={10} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDelete(variant.id)}
                          >
                            <Trash2 size={10} />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Tag size={8} />
                            {variant.sku}
                          </div>
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign size={8} />
                            {variant.price?.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Hash size={8} />
                            {variant.stock_quantity} dona
                          </div>
                          {variant.stock_quantity <= 10 && (
                            <div className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs">
                              Kam!
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 