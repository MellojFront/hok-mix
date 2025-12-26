'use client';

import { Pencil, Zap, FileText } from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  activeItem: string;
  onItemChange: (id: string) => void;
}

export default function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  const navItems: NavItem[] = [
    { 
      id: 'creator', 
      label: 'Мои Миксы / Создатель', 
      icon: <Pencil className="w-5 h-5" /> 
    },
    { 
      id: 'ready', 
      label: 'Готовые Миксы', 
      icon: <Zap className="w-5 h-5" /> 
    },
    { 
      id: 'knowledge', 
      label: 'База Знаний (Вкусы)', 
      icon: <FileText className="w-5 h-5" /> 
    },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-8 tracking-tight">Hookah Mix</h2>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 group ${
                activeItem === item.id
                  ? 'bg-red-600 text-white font-semibold shadow-lg shadow-red-900/50'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
              }`}
            >
              <span className={`transition-transform ${activeItem === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

