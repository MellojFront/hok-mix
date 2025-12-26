'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Mix } from '@/types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { publishMix, updateMix, deleteMix as deleteMixFromDB } from '@/lib/mixes';
import MixCard from './MixCard';
import SubmitMixModal from './SubmitMixModal';

const ITEMS_PER_PAGE = 6;

export default function ReadyMixes() {
  const { readyMixes, addMix, refreshReadyMixes, loading } = useApp();
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submitMix, setSubmitMix] = useState<Mix | null>(null);

  useEffect(() => {
    refreshReadyMixes();
  }, []);

  const handleLoadToEditor = async (mix: Mix) => {
    if (!user) {
      alert('Войдите, чтобы добавить микс в "Мои миксы"');
      return;
    }

    try {
      await addMix({
        title: mix.title,
        description: mix.description,
        ingredients: mix.ingredients,
      });
      alert('Микс добавлен в "Мои миксы"!');
    } catch (err: any) {
      alert(err.message || 'Ошибка при добавлении микса');
    }
  };

  const handleSubmitForApproval = (mix: Mix) => {
    if (!user) {
      alert('Войдите, чтобы предложить микс для публикации');
      return;
    }
    setSubmitMix(mix);
  };

  const handleEdit = async (mix: Mix) => {
    // TODO: Открыть модальное окно редактирования
    alert('Редактирование микса (будет реализовано)');
  };

  const handleDelete = async (mix: Mix) => {
    if (!user) return;
    
    if (!confirm(`Удалить микс "${mix.title}"?`)) return;

    try {
      await deleteMixFromDB(mix.id, user.id, isAdmin);
      await refreshReadyMixes();
      alert('Микс удален');
    } catch (err: any) {
      alert(err.message || 'Ошибка при удалении');
    }
  };

  const handlePublish = async (mix: Mix) => {
    if (!isAdmin) return;

    if (!confirm(`Опубликовать микс "${mix.title}" как официальный?`)) return;

    try {
      await publishMix(mix.id);
      await refreshReadyMixes();
      alert('Микс опубликован!');
    } catch (err: any) {
      alert(err.message || 'Ошибка при публикации');
    }
  };

  const filteredMixes = useMemo(() => {
    if (!searchQuery.trim()) return readyMixes;
    
    const query = searchQuery.toLowerCase();
    return readyMixes.filter(
      (mix) =>
        mix.title.toLowerCase().includes(query) ||
        mix.description.toLowerCase().includes(query) ||
        mix.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
    );
  }, [readyMixes, searchQuery]);

  const totalPages = Math.ceil(filteredMixes.length / ITEMS_PER_PAGE);
  const paginatedMixes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMixes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMixes, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Готовые Миксы (Вдохновение)</h2>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по названию, описанию или ингредиентам..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Загрузка...</div>
      ) : filteredMixes.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">Ничего не найдено</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {paginatedMixes.map((mix) => (
              <div key={mix.id}>
                <MixCard
                  id={mix.id}
                  title={mix.title}
                  description={mix.description}
                  ingredients={mix.ingredients}
                  author_name={mix.author_name}
                  is_official={mix.is_official}
                  is_public={mix.is_public}
                  created_by={mix.created_by}
                  currentUserId={user?.id || null}
                  isAdmin={isAdmin}
                  onEdit={() => handleEdit(mix)}
                  onDelete={() => handleDelete(mix)}
                  onPublish={() => handlePublish(mix)}
                  onLoadToEditor={() => handleLoadToEditor(mix)}
                  onSubmitForApproval={() => handleSubmitForApproval(mix)}
                />
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                            : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-slate-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-all flex items-center gap-1"
              >
                Вперед
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {submitMix && (
        <SubmitMixModal
          isOpen={!!submitMix}
          onClose={() => setSubmitMix(null)}
          mix={submitMix}
        />
      )}
    </div>
  );
}

