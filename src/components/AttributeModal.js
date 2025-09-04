'use client';

import { useState, useEffect } from 'react';
import Modal from './modals/Modal';
import Input from './forms/Input';
import Button from './ui/Button';

const AttributeModal = ({ isOpen, onClose, onSave, attribute = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    description: '',
    required: false,
    options: []
  });
  const [errors, setErrors] = useState({});
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (attribute && mode === 'edit') {
      setFormData({
        name: attribute.name || '',
        type: attribute.type || 'text',
        description: attribute.description || '',
        required: attribute.required || false,
        options: attribute.options || []
      });
    } else {
      setFormData({
        name: '',
        type: 'text',
        description: '',
        required: false,
        options: []
      });
    }
    setErrors({});
    setNewOption('');
  }, [attribute, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Xususiyat nomi talab qilinadi';
    }
    
    if (formData.type === 'select' && formData.options.length === 0) {
      newErrors.options = 'Tanlash turi uchun kamida bitta variant talab qilinadi';
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

  const addOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={mode === 'add' ? 'Yangi xususiyat qo\'shish' : 'Xususiyatni tahrirlash'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="">
        <Input
          label="Xususiyat nomi"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Xususiyat nomini kiriting"
          required
        />
        
        <div className="">
          <label className="">Turi</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className=""
          >
            <option value="text">Matn</option>
            <option value="number">Raqam</option>
            <option value="select">Tanlash (Ro'yxat)</option>
            <option value="checkbox">Belgilash</option>
            <option value="date">Sana</option>
          </select>
        </div>
        
        <Input
          label="Tavsif"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Xususiyat tavsifini kiriting (ixtiyoriy)"
          type="textarea"
        />
        
        <div className="">
          <label className="">
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => handleChange('required', e.target.checked)}
              className=""
            />
            Majburiy maydon
          </label>
        </div>

        {formData.type === 'select' && (
          <div className="">
            <label className="">Variantlar</label>
            {errors.options && <span className="">{errors.options}</span>}
            
            <div className="">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Variant qo'shing va Enter bosing"
                className=""
              />
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={addOption}
              >
                Qo'shish
              </Button>
            </div>
            
            {formData.options.length > 0 && (
              <div className="">
                {formData.options.map((option, index) => (
                  <div key={index} className="">
                    <span>{option}</span>
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className=""
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Bekor qilish
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            {mode === 'add' ? 'Xususiyat qo\'shish' : 'Xususiyatni yangilash'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AttributeModal; 