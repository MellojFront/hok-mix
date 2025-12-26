'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { submitMixForApproval } from '@/lib/mixes';
import { Ingredient } from '@/types';
import { X, Send, Plus } from 'lucide-react';

interface SubmitMixModalProps {
  isOpen: boolean;
  onClose: () => void;
  mix: {
    title: string;
    description: string;
    ingredients: Ingredient[];
  };
}

export default function SubmitMixModal({ isOpen, onClose, mix }: SubmitMixModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setLoading(true);

    try {
      await submitMixForApproval(mix, user.id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке предложения');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-100">Предложить микс для публикации</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="mb-4 p-4 bg-slate-700 rounded-lg">
            <h3 className="font-semibold text-slate-100 mb-2">{mix.title}</h3>
            <p className="text-sm text-slate-300 mb-3">{mix.description}</p>
            <div className="text-sm text-slate-300">
              <strong>Ингредиенты:</strong>
              <div className="mt-1">
                {mix.ingredients.map((ing, idx) => (
                  <span key={idx}>
                    {ing.name} ({ing.percentage}%)
                    {idx < mix.ingredients.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Ваш микс будет отправлен на рассмотрение администратору. После одобрения он появится в разделе "Готовые Миксы" с указанием вашего имени.
          </p>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm mb-4">
              Микс успешно отправлен на рассмотрение!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

