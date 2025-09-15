import { Search, Plus, Hash } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Input from '../forms/Input';
import VariantSelectionModal from './VariantSelectionModal';
import clsx from 'clsx';

export default function ProductSearch({
  searchTerm,
  setSearchTerm,
  searchResults,
  searchLoading,
  isSearchFocused,
  setIsSearchFocused,
  addToCart,
  onBarcodeScan
}) {
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scannedVariantSku, setScannedVariantSku] = useState(null);
  const [isProcessingBarcode, setIsProcessingBarcode] = useState(false);
  const inputRef = useRef(null);
  // Auto-focus management for cashier convenience
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !showVariantModal) {
        inputRef.current.focus();
      }
    };

    // Focus on mount
    focusInput();

    // Smart focus management - only refocus if user isn't interacting with other inputs
    const handleGlobalClick = (e) => {
      // Don't refocus if user clicked on an input, textarea, button, or any interactive element
      if (e.target && (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'SELECT' ||
        e.target.isContentEditable ||
        e.target.closest('input') ||
        e.target.closest('textarea') ||
        e.target.closest('button') ||
        e.target.closest('select') ||
        e.target.closest('[contenteditable]') ||
        // Don't refocus if clicking inside payment or cart sections
        e.target.closest('[data-no-autofocus]')
      )) {
        return;
      }

      // Only refocus if the current active element is not an input
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'BUTTON' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable
      )) {
        return;
      }

      setTimeout(focusInput, 100);
    };

    // Focus when variant modal closes
    if (!showVariantModal) {
      setTimeout(focusInput, 100);
    }

    // Handle keyboard input for barcode scanning
    const handleGlobalKeyDown = (e) => {
      // Only auto-focus on alphanumeric keys, not on special keys
      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
        return;
      }

      // Don't interfere if user is already typing in an input
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable
      )) {
        return;
      }

      // Focus the search input for barcode scanning
      if (inputRef.current && !showVariantModal) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [showVariantModal]);

  const handleAddToCart = (product, scannedSku = null) => {
    // Safety check - don't proceed if product is null/undefined
    if (!product) {
      console.warn('handleAddToCart called with null/undefined product');
      return;
    }

    if (product && product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
      setScannedVariantSku(scannedSku);
      setShowVariantModal(true);
    } else {
      addToCart(product);
      // Clear search and refocus after adding to cart
      setSearchTerm('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleVariantSelect = (variantProduct) => {
    addToCart(variantProduct);
    setShowVariantModal(false);
    // Clear search and refocus after adding variant
    setSearchTerm('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Handle barcode scanning directly in the search input
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Check if input looks like a barcode (typically longer than 8 chars and alphanumeric)
    const isBarcodePattern = /^[A-Za-z0-9]{8,}$/.test(value.trim());
    
    if (isBarcodePattern && value.length >= 8) {
      setIsProcessingBarcode(true);
      try {
        const scannedProduct = await onBarcodeScan(value.trim());
        if (scannedProduct) {
          // Pass the scanned SKU so modal can pre-select the correct variant
          handleAddToCart(scannedProduct, value.trim());
        } else {
          // If onBarcodeScan returns null/undefined, treat as not found
          console.log('Barcode scan returned null/undefined for:', value.trim());
          setSearchTerm('');
        }
      } catch (error) {
        console.error('Barcode scan error:', error);
        // Clear the input on barcode scan failure
        setSearchTerm('');
        // Make sure no modal is shown for failed scans
        setSelectedProduct(null);
        setScannedVariantSku(null);
        setShowVariantModal(false);
        // Show error message to user (you can customize this)
        console.log('Barcode not found:', value.trim());
      } finally {
        setIsProcessingBarcode(false);
        // Ensure input stays focused
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      
      // Try barcode scan first if it looks like a barcode
      const isBarcodePattern = /^[A-Za-z0-9]{8,}$/.test(searchTerm.trim());
      
      if (isBarcodePattern) {
        setIsProcessingBarcode(true);
        try {
          const scannedProduct = await onBarcodeScan(searchTerm.trim());
          if (scannedProduct) {
            handleAddToCart(scannedProduct, searchTerm.trim());
          } else {
            // If onBarcodeScan returns null/undefined, treat as not found
            console.log('Barcode scan returned null/undefined for:', searchTerm.trim());
          }
          setSearchTerm('');
        } catch (error) {
          console.error('Barcode scan error:', error);
          // Clear everything on barcode scan failure
          setSearchTerm('');
          setSelectedProduct(null);
          setScannedVariantSku(null);
          setShowVariantModal(false);
        } finally {
          setIsProcessingBarcode(false);
        }
      } else if (searchResults.length > 0) {
        // If not a barcode but we have search results, add first result
        handleAddToCart(searchResults[0]);
      }
    }
  };

  const renderProductInfo = (product) => {
    if (product && product.variants && product.variants.length > 0) {
      const variantCount = product.variants.length;
      const availableVariants = product.variants.filter(v => v.stock_quantity > 0).length;
      return (
        <div>
          <h4 className="m-0 text-xs font-medium text-gray-900 truncate">{product.name}</h4>
          <p className="text-xs text-gray-500 mb-0.5">
            {variantCount}v • {availableVariants} mavjud
          </p>
          <p className="text-xs font-medium text-green-600">
            {Math.min(...product.variants.map(v => v.price))} - {Math.max(...product.variants.map(v => v.price))} UZS
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <h4 className="m-0 text-xs font-medium text-gray-900 truncate">{product.name}</h4>
          <p className="m-0 text-xs text-gray-600">{product.price} UZS • Zapas: {product.stock_quantity}</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
      <div className="relative mb-2">
        <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 z-[1]" />
        <Input
          ref={inputRef}
          placeholder="Mahsulot qidirish yoki SKU kod kiriting..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="pl-8 pr-12 py-2 text-sm bg-white/70 border-gray-200 focus:border-blue-400 focus:bg-white transition-all duration-200"
          disabled={isProcessingBarcode}
        />
        {isProcessingBarcode && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-blue-600">Qidirilmoqda...</span>
          </div>
        )}
      </div>

      {searchLoading && (
        <div className="flex flex-col gap-1.5 max-h-[150px] overflow-y-auto">
          <div className="flex items-center justify-center p-3 text-gray-500 text-sm bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="m-0 text-xs">Qidirilmoqda...</p>
            </div>
          </div>
        </div>
      )}

      {!searchLoading && searchResults.length > 0 && (
        <div className="flex flex-col gap-1.5 max-h-[150px] overflow-y-auto">
          {!searchTerm.trim() && (
            <div className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded border border-blue-200 mb-1">
              <p className="m-0 text-xs uppercase tracking-wider text-blue-700 font-medium">So'nggi mahsulotlar</p>
            </div>
          )}
          {searchResults.map(product => (
            <div
              key={product.id}
              className="flex items-center justify-between p-2 bg-gradient-to-r from-white to-gray-50 rounded border border-gray-200 cursor-pointer hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:-translate-y-[1px] hover:shadow-sm transition-all duration-200 group"
              onClick={() => handleAddToCart(product)}
            >
              <div className="flex-1 min-w-0">
                {renderProductInfo(product)}
              </div>
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200 ml-2">
                <Plus size={14} className="text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!searchLoading && searchTerm.trim() && searchResults.length === 0 && (
        <div className="flex flex-col gap-1.5 max-h-[150px] overflow-y-auto">
          <div className="text-center py-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🔍</span>
            </div>
            <p className="m-0 text-gray-500 text-xs">Mahsulot topilmadi</p>
            <p className="m-0 text-xs text-gray-400 mt-0.5">Boshqa kalit so'z bilan urinib ko'ring</p>
          </div>
        </div>
      )}

      <VariantSelectionModal
        isOpen={showVariantModal}
        onClose={() => {
          setShowVariantModal(false);
          setScannedVariantSku(null);
          // Clear search input if no variant was selected
          setSearchTerm('');
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 100);
        }}
        product={selectedProduct}
        scannedVariantSku={scannedVariantSku}
        onVariantSelect={handleVariantSelect}
      />
    </div>
  );
} 