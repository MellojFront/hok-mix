'use client';

import { useState } from 'react';
import { Ingredient } from '@/types';
import { Calculator, X } from 'lucide-react';

interface MixCalculatorProps {
  ingredients: Ingredient[];
  onClose?: () => void;
}

export default function MixCalculator({ ingredients, onClose }: MixCalculatorProps) {
  const [totalAmount, setTotalAmount] = useState<number>(100);
  const [availableAmounts, setAvailableAmounts] = useState<Record<number, number>>({});

  // Расчет граммов для каждого ингредиента
  const calculateGrams = (percentage: number, total: number) => {
    return (percentage / 100) * total;
  };

  // Расчет максимального возможного микса на основе имеющихся объемов
  const calculateMaxMix = () => {
    if (ingredients.length === 0) return 0;
    
    const maxAmounts = ingredients.map((ing, index) => {
      const available = availableAmounts[index] || 0;
      if (available === 0 || ing.percentage === 0) return Infinity;
      // Сколько грамм микса можно сделать из имеющегося объема этого ингредиента
      return (available / ing.percentage) * 100;
    });

    const validAmounts = maxAmounts.filter(v => v !== Infinity && v > 0);
    return validAmounts.length > 0 ? Math.min(...validAmounts) : 0;
  };

  const maxMix = calculateMaxMix();
  const calculatedGrams = ingredients.map((ing, index) => ({
    ...ing,
    grams: calculateGrams(ing.percentage, totalAmount),
    available: availableAmounts[index] || 0,
    needed: calculateGrams(ing.percentage, totalAmount),
    isEnough: availableAmounts[index] ? calculateGrams(ing.percentage, totalAmount) <= availableAmounts[index] : true,
  }));

  const handleAvailableChange = (index: number, value: number) => {
    setAvailableAmounts({ ...availableAmounts, [index]: value });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-slate-100">Калькулятор микса</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Общий объем микса (граммы)
        </label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          min="0"
          step="0.1"
        />
      </div>

      {maxMix > 0 && (
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Максимальный объем:</strong> {maxMix.toFixed(1)} г (на основе имеющихся объемов)
          </p>
          <button
            onClick={() => setTotalAmount(Math.floor(maxMix))}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Установить максимальный объем
          </button>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-700">
          <div>Ингредиент</div>
          <div className="text-center">%</div>
          <div className="text-center">Граммы</div>
          <div className="text-center">Имеется (г)</div>
          <div className="text-center">Статус</div>
        </div>

        {calculatedGrams.map((ing, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-2 items-center p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <div className="text-sm font-medium text-slate-200">{ing.name}</div>
            <div className="text-center text-sm text-slate-300">{ing.percentage}%</div>
            <div className="text-center text-sm font-semibold text-slate-100">
              {ing.grams.toFixed(1)} г
            </div>
            <div>
              <input
                type="number"
                placeholder="0"
                value={availableAmounts[index] || ''}
                onChange={(e) => handleAvailableChange(index, parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 text-slate-100 rounded text-sm text-center focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="0"
                step="0.1"
              />
            </div>
            <div className="text-center">
              {ing.available > 0 ? (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    ing.isEnough
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                  title={ing.isEnough ? `Достаточно (есть ${ing.available}г, нужно ${ing.needed.toFixed(1)}г)` : `Недостаточно (есть ${ing.available}г, нужно ${ing.needed.toFixed(1)}г)`}
                >
                  {ing.isEnough ? '✓ Достаточно' : `Недостаточно`}
                </span>
              ) : (
                <span className="text-xs text-slate-500">—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Итого:</span>
          <span className="font-bold text-slate-100">{totalAmount.toFixed(1)} г</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-slate-400">Сумма %:</span>
          <span
            className={`font-semibold ${
              Math.abs(
                ingredients.reduce((sum, ing) => sum + ing.percentage, 0) - 100
              ) < 0.01
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {ingredients.reduce((sum, ing) => sum + ing.percentage, 0).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

