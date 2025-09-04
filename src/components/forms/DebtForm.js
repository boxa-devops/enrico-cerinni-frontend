'use client';

import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import Button from '../ui/Button';
import Input from './Input';

const DebtForm = ({ currentDebt, onUpdate, loading = false }) => {
  const [newDebt, setNewDebt] = useState(currentDebt);

  useEffect(() => {
    setNewDebt(currentDebt);
  }, [currentDebt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(Number(newDebt));
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <Input
        label="Yangi qarz miqdori"
        type="number"
        step="0.01"
        min="0"
        value={newDebt}
        onChange={(e) => setNewDebt(e.target.value)}
        required
        disabled={loading}
      />
      <Button 
        type="submit"
        loading={loading}
      >
        <DollarSign size={16} />
        Qarzni yangilash
      </Button>
    </form>
  );
};

export default DebtForm; 