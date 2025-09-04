'use client';

import { useState, useEffect } from 'react';
import { User, Phone, MapPin, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Input from './Input';

const ClientForm = ({ client, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        first_name: client.first_name || client.name?.split(' ')[0] || '',
        last_name: client.last_name || client.name?.split(' ').slice(1).join(' ') || '',
        phone: client.phone || '',
        address: client.address || '',
        notes: client.notes || ''
      });
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Ism *"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Ism"
        />
        <Input
          label="Familiya *"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Familiya"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Telefon"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
          placeholder="+998 XX XXX XX XX"
        />
        <Input
          label="Manzil"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={loading}
          placeholder="Manzil"
        />
      </div>

      <Input
        label="Izohlar"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        disabled={loading}
        placeholder="Qo'shimcha ma'lumotlar (ixtiyoriy)"
        type="textarea"
        rows={2}
      />

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
          size="sm"
        >
          Bekor qilish
        </Button>
        <Button 
          type="submit"
          loading={loading}
          size="sm"
        >
          {client ? 'Yangilash' : 'Qo\'shish'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm; 