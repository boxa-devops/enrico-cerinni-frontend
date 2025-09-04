'use client';

import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

export default function ProductHeader({ 
  onBack, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      <Button 
        variant="secondary" 
        onClick={onBack}
        size="sm"
      >
        <ArrowLeft size={14} />
        Orqaga
      </Button>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={onEdit}
          size="sm"
        >
          <Edit size={14} />
          Tahrirlash
        </Button>
        <Button 
          variant="danger" 
          onClick={onDelete}
          size="sm"
        >
          <Trash2 size={14} />
          O'chirish
        </Button>
      </div>
    </div>
  );
} 