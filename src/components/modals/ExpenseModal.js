'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import { financeAPI } from '../../api/finance';
import Modal from './Modal';
import toast from 'react-hot-toast';

const ExpenseModal = ({ isOpen, onClose, expense = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    notes: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'supplier_costs',
    'daily_expenses', 
    'salary',
    'rent',
    'utilities',
    'marketing',
    'maintenance',
    'other'
  ];

  const categoryLabels = {
    supplier_costs: 'T yetkazib beruvchi xarajatlari',
    daily_expenses: 'Kunlik xarajatlar',
    salary: 'Ish haqi',
    rent: 'Ijara',
    utilities: 'Kommunal xizmatlar',
    marketing: 'Marketing',
    maintenance: 'Ta\'mirlash',
    other: 'Boshqa'
  };

  const paymentMethods = [
    { value: 'cash', label: 'Naqd pul' },
    { value: 'card', label: 'Plastik karta' },
    { value: 'transfer', label: 'O\'tkazma' },
    { value: 'check', label: 'Chek' }
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.title || '',
        notes: expense.description || '',
        amount: expense.amount || '',
        category: expense.category || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: expense.paymentMethod || 'cash',
      });
    } else {
      setFormData({
        description: '',
        notes: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
      });
    }
    setErrors({});
  }, [expense, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Xarajat nomi kiritilishi shart';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'To\'g\'ri summa kiriting';
    }

    if (!formData.category) {
      newErrors.category = 'Kategoriya tanlang';
    }

    if (!formData.date) {
      newErrors.date = 'Sana tanlang';
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
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes || null,
      };

      if (expense) {
        await financeAPI.updateExpense(expense.id, apiData);
        toast.success('Xarajat muvaffaqiyatli yangilandi');
      } else {
        await financeAPI.createExpense(apiData);
        toast.success('Xarajat muvaffaqiyatli qo\'shildi');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Xarajatni saqlashda xatolik yuz berdi');
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
      title={expense ? 'Xarajatni tahrirlash' : 'Yangi xarajat qo\'shish'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div>
            <label htmlFor="description" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              <FileText size={14} className="text-red-500" />
              Xarajat nomi *
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Xarajat nomini kiriting"
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500 transition-colors ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.description && <span className="text-red-600 text-xs mt-0.5 block">{errors.description}</span>}
          </div>

          <div>
            <label htmlFor="notes" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              <FileText size={14} className="text-gray-500" />
              Izoh
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Qo'shimcha ma'lumot"
              rows={2}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="amount" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              <DollarSign size={14} className="text-green-500" />
              Summa *
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500 transition-colors ${
                errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.amount && <span className="text-red-600 text-xs mt-0.5 block">{errors.amount}</span>}
          </div>

          <div>
            <label htmlFor="date" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              <Calendar size={14} className="text-blue-500" />
              Sana *
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500 transition-colors ${
                errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.date && <span className="text-red-600 text-xs mt-0.5 block">{errors.date}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
              Kategoriya *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-2.5 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500 transition-colors ${
                errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Kategoriya tanlang</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
            {errors.category && <span className="text-red-600 text-xs mt-0.5 block">{errors.category}</span>}
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-xs font-medium text-gray-700 mb-1">
              To'lov usuli
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500 transition-colors"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
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
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 border border-transparent rounded hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Saqlanmoqda...' : (expense ? 'Yangilash' : 'Qo\'shish')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal; 