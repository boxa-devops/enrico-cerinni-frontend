import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';
import Input from './forms/Input';

const SizeModal = ({ isOpen, onClose, onSave, size, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && size) {
        setFormData({
          name: size.name || '',
          description: size.description || ''
        });
      } else {
        setFormData({
          name: '',
          description: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, size]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'O\'lcham nomi majburiy';
    }

    if (formData.name.trim().length < 1) {
      newErrors.name = 'O\'lcham nomi kamida 1 belgi bo\'lishi kerak';
    }

    if (formData.name.trim().length > 20) {
      newErrors.name = 'O\'lcham nomi 20 belgidan oshmasligi kerak';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Tavsif 500 belgidan oshmasligi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving size:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {mode === 'add' ? 'Yangi o\'lcham' : 'O\'lchamni tahrirlash'}
          </h2>
          <button 
            className="p-1 hover:bg-gray-100 rounded-md transition-colors" 
            onClick={onClose}
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              O'lcham nomi *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="S, M, L, XL yoki 42, 43, 44"
              error={errors.name}
              required
              className="text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="O'lcham haqida qisqacha ma'lumot"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-blue-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400/30 resize-none"
              rows={2}
            />
            {errors.description && (
              <span className="text-xs text-red-600 mt-0.5 block">{errors.description}</span>
            )}
          </div>

          <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="text-xs font-semibold text-gray-800 mb-2">Misol o'lchamlar:</h4>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="font-medium text-gray-700">Kiyim:</span>
                <span className="text-gray-600 ml-1">XS, S, M, L, XL, XXL</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Poyafzal:</span>
                <span className="text-gray-600 ml-1">36, 37, 38, 39, 40, 41, 42</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Boshqa:</span>
                <span className="text-gray-600 ml-1">One Size, Free Size</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1 text-sm py-2"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              loading={loading}
              className="flex-1 text-sm py-2"
            >
              {mode === 'add' ? 'Qo\'shish' : 'Saqlash'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeModal; 