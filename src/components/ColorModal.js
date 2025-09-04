import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';
import Input from './forms/Input';

const ColorModal = ({ isOpen, onClose, onSave, color, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hex_code: '#000000'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && color) {
        setFormData({
          name: color.name || '',
          description: color.description || '',
          hex_code: color.hex_code || '#000000'
        });
      } else {
        setFormData({
          name: '',
          description: '',
          hex_code: '#000000'
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, color]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rang nomi majburiy';
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = 'Rang nomi kamida 2 belgi bo\'lishi kerak';
    }

    if (formData.name.trim().length > 50) {
      newErrors.name = 'Rang nomi 50 belgidan oshmasligi kerak';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Tavsif 500 belgidan oshmasligi kerak';
    }

    if (!formData.hex_code) {
      newErrors.hex_code = 'Rang kodi majburiy';
    }

    if (!/^#[0-9A-F]{6}$/i.test(formData.hex_code)) {
      newErrors.hex_code = 'Noto\'g\'ri rang kodi format (masalan: #FF0000)';
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
      console.error('Error saving color:', error);
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
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {mode === 'add' ? 'Yangi rang' : 'Rangni tahrirlash'}
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
              Rang nomi *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Rang nomini kiriting"
              error={errors.name}
              required
              className="text-sm"
            />
          </div>

          <div>
            <label htmlFor="hex_code" className="block text-sm font-medium text-gray-700 mb-1">
              Rang kodi *
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.hex_code}
                onChange={(e) => handleInputChange('hex_code', e.target.value)}
                className="w-10 h-9 rounded-md border border-gray-200 cursor-pointer"
              />
              <Input
                id="hex_code"
                type="text"
                value={formData.hex_code}
                onChange={(e) => handleInputChange('hex_code', e.target.value)}
                placeholder="#FF0000"
                error={errors.hex_code}
                required
                className="flex-1 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Rang haqida qisqacha ma'lumot"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-blue-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400/30 resize-none"
              rows={2}
            />
            {errors.description && (
              <span className="text-xs text-red-600 mt-0.5 block">{errors.description}</span>
            )}
          </div>

          {formData.name && (
            <div className="p-2 bg-gray-50 rounded-md border">
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: formData.hex_code }}
                />
                <span className="text-sm font-medium text-gray-900">{formData.name}</span>
                <span className="text-xs text-gray-500 font-mono ml-auto">{formData.hex_code}</span>
              </div>
            </div>
          )}

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

export default ColorModal; 