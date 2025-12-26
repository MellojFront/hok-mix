'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { KnowledgeNote } from '@/types';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

export default function KnowledgeBase() {
  const { knowledgeNotes, addNote, updateNote, deleteNote } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<KnowledgeNote | null>(null);
  const [editingNote, setEditingNote] = useState<KnowledgeNote | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const openAddModal = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      category: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (note: KnowledgeNote) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNote) {
      updateNote(editingNote.id, formData);
    } else {
      addNote(formData);
    }
    setIsModalOpen(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">База Знаний</h2>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98] font-medium text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          Добавить заметку
        </button>
      </div>

      {knowledgeNotes.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg mb-2">У вас пока нет заметок</p>
          <p className="text-sm">Нажмите "Добавить заметку" чтобы создать первую</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setViewingNote(note)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-red-900/20 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-slate-100 flex-1 group-hover:text-red-400 transition-colors">{note.title}</h3>
                <div className="flex gap-2 ml-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEditModal(note)}
                    className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {note.category && (
                <span className="inline-block px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded mb-3">
                  {note.category}
                </span>
              )}
              
              <div className="text-slate-300 text-sm mb-4 whitespace-pre-wrap line-clamp-4">
                {note.content}
              </div>
              
              <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
                {formatDate(note.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Просмотр заметки в полном размере */}
      {viewingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 backdrop-blur-sm lg:left-64">
          <div className="h-full w-full bg-slate-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-3">{viewingNote.title}</h2>
                  {viewingNote.category && (
                    <span className="inline-block px-3 py-1 text-xs sm:text-sm bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                      {viewingNote.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setViewingNote(null);
                      openEditModal(viewingNote);
                    }}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50 text-sm"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Редактировать</span>
                    <span className="sm:hidden">Изменить</span>
                  </button>
                  <button
                    onClick={() => setViewingNote(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
                <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {viewingNote.content}
                </div>
              </div>
              
              <div className="text-xs sm:text-sm text-slate-400 border-t border-slate-800 pt-4">
                Обновлено: {formatDate(viewingNote.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-100">
                  {editingNote ? 'Редактировать заметку' : 'Добавить новую заметку'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Категория (опционально)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Например: Способы забивки, Вкусы, Уход"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Содержание
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                    rows={12}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98] font-medium"
                  >
                    <Save className="w-4 h-4" />
                    {editingNote ? 'Сохранить' : 'Добавить'}
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
    </div>
  );
}

