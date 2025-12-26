'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Mix } from '@/types';
import { Plus, Edit, Trash2, X, Save, Calculator } from 'lucide-react';
import MixCalculator from './MixCalculator';

export default function MyMixes() {
  const { myMixes, addMix, updateMix, deleteMix, loading } = useApp();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMix, setEditingMix] = useState<Mix | null>(null);
  const [calculatorMix, setCalculatorMix] = useState<Mix | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', percentage: 0 }],
  });
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingMix(null);
    setFormData({
      title: '',
      description: '',
      ingredients: [{ name: '', percentage: 0 }],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mix: Mix) => {
    setEditingMix(mix);
    setFormData({
      title: mix.title,
      description: mix.description,
      ingredients: mix.ingredients,
    });
    setIsModalOpen(true);
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', percentage: 0 }],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleIngredientChange = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const updated = [...formData.ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ingredients: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация
    if (!formData.title.trim()) {
      setError('Введите название микса');
      return;
    }

    if (!formData.description.trim()) {
      setError('Введите описание микса');
      return;
    }

    if (formData.ingredients.length === 0) {
      setError('Добавьте хотя бы один ингредиент');
      return;
    }

    if (formData.ingredients.some(ing => !ing.name.trim())) {
      setError('Заполните названия всех ингредиентов');
      return;
    }

    const totalPercentage = formData.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError(`Сумма процентов должна быть 100%. Сейчас: ${totalPercentage.toFixed(1)}%`);
      return;
    }

    try {
      if (editingMix) {
        await updateMix(editingMix.id, formData);
      } else {
        await addMix(formData);
      }
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        ingredients: [{ name: '', percentage: 0 }],
      });
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении микса');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4">Мои Миксы</h2>
        {user ? (
          <button
            onClick={openAddModal}
            className="px-3 py-1.5 text-sm text-slate-300 hover:text-slate-100 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить микс
          </button>
        ) : (
          <p className="text-sm text-slate-400">Войдите, чтобы создавать миксы</p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Загрузка...</div>
      ) : !user ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-base sm:text-lg mb-2">Войдите, чтобы видеть свои миксы</p>
        </div>
      ) : myMixes.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-base sm:text-lg mb-2">У вас пока нет сохраненных миксов</p>
          <p className="text-xs sm:text-sm">Нажмите "Добавить микс" чтобы создать первый</p>
        </div>
      ) : (
        <>
          {/* Десктопная таблица */}
          <div className="hidden md:block bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Ингредиенты
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {myMixes.map((mix) => (
                  <tr key={mix.id} className="hover:bg-slate-700 transition-colors">
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-100">{mix.title}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="text-sm text-slate-300 max-w-md truncate">{mix.description}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="text-sm text-slate-300">
                        {mix.ingredients.map((ing, idx) => (
                          <span key={idx}>
                            {ing.name} ({ing.percentage}%)
                            {idx < mix.ingredients.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 lg:gap-3">
                        <button
                          onClick={() => setCalculatorMix(mix)}
                          className="text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors text-xs"
                          title="Калькулятор"
                        >
                          <Calculator className="w-4 h-4" />
                          <span className="hidden lg:inline">Расчет</span>
                        </button>
                        <button
                          onClick={() => openEditModal(mix)}
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors text-xs"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden lg:inline">Редактировать</span>
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Удалить этот микс?')) {
                              try {
                                await deleteMix(mix.id);
                              } catch (err: any) {
                                alert(err.message || 'Ошибка при удалении');
                              }
                            }
                          }}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden lg:inline">Удалить</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="md:hidden space-y-4">
            {myMixes.map((mix) => (
              <div
                key={mix.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-100 flex-1">{mix.title}</h3>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => setCalculatorMix(mix)}
                      className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Калькулятор"
                    >
                      <Calculator className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(mix)}
                      className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-lg transition-colors"
                      title="Редактировать"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Удалить этот микс?')) {
                          try {
                            await deleteMix(mix.id);
                          } catch (err: any) {
                            alert(err.message || 'Ошибка при удалении');
                          }
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3">{mix.description}</p>
                <div className="text-sm text-slate-300 mb-3">
                  <strong className="text-slate-200">Ингредиенты:</strong>
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
            ))}
          </div>
        </>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-100">
                  {editingMix ? 'Редактировать микс' : 'Добавить новый микс'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Название *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Описание *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setError(null);
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-200">
                      Ингредиенты
                    </label>
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить ингредиент
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.ingredients.map((ing, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Название *"
                          value={ing.name}
                          onChange={(e) => {
                            handleIngredientChange(index, 'name', e.target.value);
                            setError(null);
                          }}
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                          required
                        />
                        <input
                          type="number"
                          placeholder="% *"
                          value={ing.percentage || ''}
                          onChange={(e) => {
                            handleIngredientChange(index, 'percentage', parseFloat(e.target.value) || 0);
                            setError(null);
                          }}
                          className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                          min="0"
                          max="100"
                          step="0.1"
                          required
                        />
                        {formData.ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
                            className="px-3 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2 text-sm text-slate-400">
                    Сумма: {formData.ingredients.reduce((sum, ing) => sum + ing.percentage, 0).toFixed(1)}%
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98] font-medium"
                  >
                    <Save className="w-4 h-4" />
                    {editingMix ? 'Сохранить' : 'Добавить'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Калькулятор */}
      {calculatorMix && (
        <div className="mt-6">
          <MixCalculator
            ingredients={calculatorMix.ingredients}
            onClose={() => setCalculatorMix(null)}
          />
        </div>
      )}
    </div>
  );
}

