'use client';

import { useState, useEffect } from 'react';
import Modal from './modals/Modal';
import Input from './forms/Input';
import Button from './ui/Button';

const CategoryModal = ({ isOpen, onClose, onSave, category = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
    setErrors({});
  }, [category, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Kategoriya nomi talab qilinadi';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={mode === 'add' ? 'Yangi kategoriya' : 'Kategoriyani tahrirlash'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Kategoriya nomi"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Kategoriya nomini kiriting"
          required
          className="text-sm"
        />
        
        <Input
          label="Tavsif"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Kategoriya tavsifini kiriting (ixtiyoriy)"
          type="textarea"
          className="text-sm"
          rows={2}
        />

        <div className="flex gap-2 pt-3">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            className="flex-1 text-sm py-2"
          >
            Bekor qilish
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            className="flex-1 text-sm py-2"
          >
            {mode === 'add' ? 'Qo\'shish' : 'Yangilash'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal; 