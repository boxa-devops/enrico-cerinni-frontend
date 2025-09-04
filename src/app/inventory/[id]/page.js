'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Package, Tag, Palette, Calendar, DollarSign, Hash, AlertCircle } from 'lucide-react';
import Layout from '../../../components/layout/Layout';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/modals/Modal';
import ProductForm from '../../../components/forms/ProductForm';
import ProductVariants from '../../../components/inventory/ProductVariants';
import VariantCreationModal from '../../../components/modals/VariantCreationModal';
import { useProductDetail } from '../../../hooks';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { 
    product, 
    brands, 
    seasons,
    categories,
    variants,
    variantsLoading,
    loading, 
    error, 
    updateProduct, 
    deleteProduct,
    updateVariant,
    deleteVariant,
    loadVariants
  } = useProductDetail(params.id);

  const handleEditProduct = async (productData) => {
    const result = await updateProduct(productData);
    if (result.success) {
      setShowEditModal(false);
    } else {
      alert(result.error || 'Mahsulot yangilanmadi');
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm('Bu mahsulotni o\'chirishni xohlaysizmi?')) return;

    setIsDeleting(true);
    const result = await deleteProduct();
    setIsDeleting(false);
    
    if (result.success) {
      router.push('/inventory');
    } else {
      alert(result.error || 'Mahsulot o\'chirilmadi');
    }
  };

  const handleVariantCreated = () => {
    // Reload variants after creation
    loadVariants(params.id);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3">Mahsulot ma'lumotlari yuklanmoqda...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
          <AlertCircle size={48} className="text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Mahsulot topilmadi</h2>
          <p className="text-gray-600 text-center">{error || 'Siz qidirayotgan mahsulot mavjud emas yoki o\'chirilgan'}</p>
          <Button onClick={() => router.push('/inventory')}>
            <ArrowLeft size={16} />
            Inventar sahifasiga qaytish
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <Button 
            variant="secondary" 
            onClick={() => router.push('/inventory')}
            className=""
          >
            <ArrowLeft size={16} />
            Orqaga
          </Button>

          <div className="flex items-center justify-between flex-col">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
              {product.brand && <span className="text-gray-600 text-sm">{product.brand}</span>}
            </div>
            
            <div className="text-right">
              <div className={`text-sm mt-1 ${(() => {
                if (variants && variants.length > 0) {
                  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
                  return totalStock <= 10 ? "text-red-600" : 'text-gray-600';
                }
                return product.stock_quantity <= 10 ? "text-red-600" : 'text-gray-600';
              })()}`}>
                Zapas: {(() => {
                  if (variants && variants.length > 0) {
                    const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
                    return `${totalStock} (${variants.length} variant)`;
                  }
                  return `${product.stock_quantity} dona`;
                })()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowEditModal(true)}
              size="sm"
            >
              <Edit size={16} />
              Tahrirlash
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteProduct}
              size="sm"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
              {isDeleting ? 'O\'chirilmoqda...' : 'O\'chirish'}
            </Button>
          </div>
        </div>

        {/* Compact Details Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Package size={12} className="text-gray-400" />
              <div>
                <span className="text-xs text-gray-500 block">Kategoriya</span>
                <span className="text-sm font-medium text-gray-900">{product.category_name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag size={12} className="text-gray-400" />
              <div>
                <span className="text-xs text-gray-500 block">SKU</span>
                <span className="text-sm font-medium text-gray-900">{product.sku || 'Mavjud emas'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-gray-400" />
              <div>
                <span className="text-xs text-gray-500 block">Fasl</span>
                <span className="text-sm font-medium text-gray-900">{product.season_name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign size={12} className="text-gray-400" />
              <div>
                <span className="text-xs text-gray-500 block">Narx</span>
                <span className="text-sm font-medium text-green-600">
                  {(() => {
                    if (variants && variants.length > 0) {
                      const minPrice = Math.min(...variants.map(v => v.price));
                      const maxPrice = Math.max(...variants.map(v => v.price));
                      const formattedMin = minPrice.toLocaleString();
                      const formattedMax = maxPrice.toLocaleString();
                      return minPrice === maxPrice 
                        ? `${formattedMin} UZS` 
                        : `${formattedMin}-${formattedMax} UZS`;
                    }
                    return `${product.price?.toLocaleString() || 0} UZS`;
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Variants Section */}
        <ProductVariants
          variants={variants}
          loading={variantsLoading}
          onUpdateVariant={updateVariant}
          onDeleteVariant={deleteVariant}
          onAddVariant={() => setShowVariantModal(true)}
        />

        {/* Description if available */}
        {product.description && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Tavsif</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Metadata */}
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

        {/* Edit Product Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Mahsulotni tahrirlash"
        >
          <ProductForm
            product={product}
            brands={brands || []}
            seasons={seasons || []}
            categories={categories || []}
            onSubmit={handleEditProduct}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>

        {/* Variant Creation Modal */}
        <VariantCreationModal
          isOpen={showVariantModal}
          onClose={() => setShowVariantModal(false)}
          product={product}
          onVariantCreated={handleVariantCreated}
        />
      </div>
    </Layout>
  );
} 