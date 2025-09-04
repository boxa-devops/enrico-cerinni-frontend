'use client';

import { useState, useEffect } from 'react';
import { X, Package, Phone, Mail, MapPin } from 'lucide-react';
import { financeAPI } from '../../api/finance';
import Modal from './Modal';
import toast from 'react-hot-toast';

const SupplierModal = ({ isOpen, onClose, supplier = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact_person: supplier.contact || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
      });
    } else {
      setFormData({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Yetkazib beruvchi nomi kiritilishi shart';
    }

    if (!formData.contact_person.trim()) {
      newErrors.contact_person = 'Aloqa shaxsi kiritilishi shart';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqami kiritilishi shart';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'To\'g\'ri email manzilini kiriting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Format data for API
      const apiData = {
        name: formData.name,
        contact_person: formData.contact_person,
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address || null,
      };

      if (supplier) {
        await financeAPI.updateSupplier(supplier.id, apiData);
        toast.success('Yetkazib beruvchi muvaffaqiyatli yangilandi');
      } else {
        await financeAPI.createSupplier(apiData);
        toast.success('Yetkazib beruvchi muvaffaqiyatli qo\'shildi');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast.error('Yetkazib beruvchini saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? 'Yetkazib beruvchini tahrirlash' : 'Yangi yetkazib beruvchi qo\'shish'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              <Package size={14} className="text-orange-500" />
              Yetkazib beruvchi *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nomi"
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.name && <span className="text-red-600 text-xs mt-0.5 block">{errors.name}</span>}
          </div>

          <div>
            <label htmlFor="contact_person" className="block text-xs font-medium text-gray-700 mb-1">
              Aloqa shaxsi *
            </label>
            <input
              type="text"
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
              placeholder="Aloqa shaxsi"
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 transition-colors ${
                errors.contact_person ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.contact_person && <span className="text-red-600 text-xs mt-0.5 block">{errors.contact_person}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              <Phone size={14} className="text-green-500" />
              Telefon *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+998 XX XXX XX XX"
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 transition-colors ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.phone && <span className="text-red-600 text-xs mt-0.5 block">{errors.phone}</span>}
          </div>

          <div>
            <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              <Mail size={14} className="text-blue-500" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@email.com"
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 transition-colors ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.email && <span className="text-red-600 text-xs mt-0.5 block">{errors.email}</span>}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
            <MapPin size={14} className="text-purple-500" />
            Manzil
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Manzil"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium text-white bg-orange-500 border border-transparent rounded hover:bg-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Saqlanmoqda...' : (supplier ? 'Yangilash' : 'Qo\'shish')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SupplierModal; 