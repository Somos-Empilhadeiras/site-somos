'use client';
import { Plus, Trash2 } from 'lucide-react';

interface DynamicListInputProps {
  label: string;
  items: string[];
  onChange: (newItems: string[]) => void;
  placeholder?: string;
}

export default function DynamicListInput({ label, items, onChange, placeholder }: DynamicListInputProps) {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => onChange([...items, '']);
  
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
        <button type="button" onClick={addItem} className="text-xs flex items-center gap-1 text-green-700 hover:text-green-900 font-bold bg-green-50 px-2 py-1 rounded">
          <Plus size={14} /> Adicionar
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 group">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={placeholder || `Item ${index + 1}`}
              className="flex-1 border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="button" onClick={() => removeItem(index)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded">Nenhum item adicionado.</p>}
      </div>
    </div>
  );
}