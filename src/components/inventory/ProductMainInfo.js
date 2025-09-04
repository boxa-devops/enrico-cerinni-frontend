'use client';


export default function ProductMainInfo({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          {product.brand && <p className="text-gray-600 text-sm mt-1">{product.brand}</p>}
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-green-600">{product.price} UZS</span>
          <div className="text-sm text-gray-600 mt-1">
            Zapas: {product.stock_quantity} dona
          </div>
        </div>
      </div>
    </div>
  );
} 