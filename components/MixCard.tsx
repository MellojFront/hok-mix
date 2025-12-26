'use client';

import { useState } from 'react';
import { Ingredient } from '@/types';
import { Download, Calculator, Send } from 'lucide-react';
import MixCalculator from './MixCalculator';

interface MixCardProps {
  title: string;
  description: string;
  ingredients: Ingredient[];
  author_name?: string;
  onLoadToEditor?: () => void;
  onSubmitForApproval?: () => void;
}

export default function MixCard({
  title, 
  description, 
  ingredients, 
  author_name,
  onLoadToEditor,
  onSubmitForApproval 
}: MixCardProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <>
      <div className="border border-slate-700 rounded-xl p-6 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-red-900/20 transition-all duration-200 group">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-red-400 transition-colors">
              {title}
            </h3>
            {author_name && (
              <p className="text-xs text-slate-400 mt-1">Автор: {author_name}</p>
            )}
          </div>
        </div>
        
        <p className="text-slate-300 text-sm mb-5 leading-relaxed line-clamp-2">
          {description}
        </p>
        
        <div className="mb-5 space-y-2.5">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between text-sm py-1">
              <span className="text-slate-200 font-medium">{ingredient.name}</span>
              <span className="text-slate-300 font-semibold bg-slate-700 px-2.5 py-1 rounded-md">
                {ingredient.percentage}%
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/50 hover:shadow-xl hover:shadow-green-900/60 active:scale-[0.98]"
          >
            <Calculator className="w-4 h-4" />
            Расчет
          </button>
          {onLoadToEditor && (
            <button
              onClick={onLoadToEditor}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Загрузить
            </button>
          )}
          {onSubmitForApproval && (
            <button
              onClick={onSubmitForApproval}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-900/60 active:scale-[0.98] text-sm"
            >
              <Send className="w-4 h-4" />
              Предложить
            </button>
          )}
        </div>
      </div>

      {showCalculator && (
        <div className="mt-4">
          <MixCalculator
            ingredients={ingredients}
            onClose={() => setShowCalculator(false)}
          />
        </div>
      )}
    </>
  );
}

// force update