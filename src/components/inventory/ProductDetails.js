'use client';

import { Package, Tag, Palette, Calendar, DollarSign, Hash, Layers } from 'lucide-react';

export default function ProductDetails({ product }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const totalStock = hasVariants 
    ? product.variants.reduce((sum, v) => sum + v.stock_quantity, 0)
    : product.stock_quantity;
  const priceRange = hasVariants && product.variants.length > 0
    ? {
        min: Math.min(...product.variants.map(v => v.price)),
        max: Math.max(...product.variants.map(v => v.price))
      }
    : null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Package size={14} className="text-gray-400" />
            <div>
              <span className="text-xs text-gray-500 block">Kategoriya</span>
              <span className="text-sm font-medium text-gray-900">{product.category_name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Tag size={14} className="text-gray-400" />
            <div>
              <span className="text-xs text-gray-500 block">SKU</span>
              <span className="text-sm font-medium text-gray-900">{product.sku || 'Mavjud emas'}</span>
            </div>
          </div>
          
          {!hasVariants && (
            <div className="flex items-center gap-3">
              <Palette size={14} className="text-gray-400" />
              <div>
                <span className="text-xs text-gray-500 block">Rang</span>
                <span className="text-sm font-medium text-gray-900">{product.color}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Calendar size={14} className="text-gray-400" />
            <div>
              <span className="text-xs text-gray-500 block">Fasl</span>
              <span className="text-sm font-medium text-gray-900">{product.season}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DollarSign size={14} className="text-gray-400" />
            <div>
              <span className="text-xs text-gray-500 block">Narx</span>
              <span className="text-sm font-medium text-green-600">
                {hasVariants && priceRange 
                  ? `${priceRange.min} - ${priceRange.max} UZS`
                  : `${product.price} UZS`
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Hash size={14} className="text-gray-400" />
            <div>
              <span className="text-xs text-gray-500 block">Zapas</span>
              <span className="text-sm font-medium text-gray-900">{totalStock} dona</span>
            </div>
          </div>

          {hasVariants && (
            <div className="flex items-center gap-3">
              <Layers size={14} className="text-gray-400" />
              <div>
                <span className="text-xs text-gray-500 block">Variantlar</span>
                <span className="text-sm font-medium text-gray-900">{product.variants.length} ta</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {product.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Tavsif</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {hasVariants && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Variantlar</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {product.variants.map(variant => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.color_hex || '#ccc' }}
                    />
                    <span className="text-sm font-medium text-gray-900">{variant.color_name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{variant.size_name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{variant.sku}</span>
                    <span className="font-medium text-green-600">{variant.price} UZS</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">
                      {variant.stock_quantity} dona
                    </span>
                    {variant.stock_quantity <= variant.min_stock_level && (
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">Kam zapas</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">ID</span>
            <span className="text-gray-900 font-mono">{product.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Yaratilgan</span>
            <span className="text-gray-900">
              {new Date(product.created_at).toLocaleDateString('uz-UZ')}
            </span>
          </div>
          {product.updated_at && (
            <div className="flex justify-between">
              <span className="text-gray-500">Yangilangan</span>
              <span className="text-gray-900">
                {new Date(product.updated_at).toLocaleDateString('uz-UZ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 