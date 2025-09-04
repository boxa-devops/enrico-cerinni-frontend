'use client';

import { useState } from 'react';
import { Package, Tag, Calendar, DollarSign, Trash2 } from 'lucide-react';
import Modal from './Modal';
import ProductForm from '../forms/ProductForm';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/format';

const ProductManagementModal = ({ 
  isOpen, 
  onClose, 
  mode = 'add', // 'add', 'edit', 'details', 'delete'
  product = null,
  brands = [],
  categories = [],
  seasons = [],
  onSubmit,
  onDelete,
  loading = false,
  deleting = false
}) => {
  const getModalTitle = () => {
    switch (mode) {
      case 'add':
        return 'Yangi mahsulot qo\'shish';
      case 'edit':
        return 'Mahsulotni tahrirlash';
      case 'details':
        return 'Mahsulot ma\'lumotlari';
      case 'delete':
        return 'Mahsulotni o\'chirish';
      default:
        return 'Mahsulot';
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Noma\'lum';
  };

  const renderContent = () => {
    switch (mode) {
      case 'add':
      case 'edit':
        return (
          <ProductForm
            product={product}
            brands={brands}
            seasons={seasons}
            categories={categories}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        );

      case 'details':
        return (
          <div className="">
            <div className="">
              <h3>{product.name}</h3>
              <div className="">
                <div className="">
                  <Package size={16} />
                  <span>Brend: {product.brand}</span>
                </div>
                <div className="">
                  <Tag size={16} />
                  <span>Kategoriya: {getCategoryName(product.category_id)}</span>
                </div>
                <div className="">
                  <Calendar size={16} />
                  <span>Fasl: {product.season}</span>
                </div>
              </div>
            </div>

            <div className="">
              {product.variants && product.variants.length > 0 ? (
                <>
                  <div className="">
                    <span>Variantlar:</span>
                    <span className="">{product.variants.length} ta</span>
                  </div>
                  <div className="">
                    <span>Umumiy zapas:</span>
                    <span className="">
                      {product.variants.reduce((sum, v) => sum + v.stock_quantity, 0)} dona
                    </span>
                  </div>
                  <div className="">
                    <span>Narx oralig'i:</span>
                    <span className="">
                      {Math.min(...product.variants.map(v => v.price))} - {Math.max(...product.variants.map(v => v.price))} UZS
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="">
                    <span>Narx:</span>
                    <span className="">{formatCurrency(product.price || 0)}</span>
                  </div>
                  <div className="">
                    <span>Zapas:</span>
                    <span className="">{product.stock_quantity || 0} dona</span>
                  </div>
                </>
              )}
              {product.sku && (
                <div className="">
                  <span>SKU:</span>
                  <span>{product.sku}</span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="">
                <h4>Tavsif</h4>
                <p>{product.description}</p>
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="">
                <h4>Variantlar</h4>
                <div className="">
                  {product.variants.map(variant => (
                    <div key={variant.id} className="">
                      <div className="">
                        <span className="">{variant.color_name}</span>
                        <span className="">{variant.size_name}</span>
                        <span className="">{variant.sku}</span>
                      </div>
                      <div className="">
                        <span className="">{variant.price} UZS</span>
                        <span className="">{variant.stock_quantity} dona</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'delete':
        return (
          <div className="">
            <p>
              Siz haqiqatan ham "{product.name}" mahsulotini o'chirmoqchimisiz?
            </p>
            <p className="">
              Bu amalni qaytarib bo'lmaydi!
            </p>
            <div className="">
              <Button 
                variant="secondary" 
                onClick={onClose}
                disabled={deleting}
              >
                Bekor qilish
              </Button>
              <Button 
                variant="danger" 
                onClick={() => onDelete(product.id)}
                loading={deleting}
                icon={Trash2}
              >
                O'chirish
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size={mode === 'details' ? 'large' : 'large'}
    >
      {renderContent()}
    </Modal>
  );
};

export default ProductManagementModal; 