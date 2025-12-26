'use client';

import React, { useState } from 'react';
import { Ingredient } from '@/types';
import { Calculator, Edit, Trash2, Send, Download, User } from 'lucide-react';
import MixCalculator from './MixCalculator';

interface MixCardProps {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  author_name?: string | null;
  is_official?: boolean;
  is_public?: boolean;
  created_by?: string | null;
  currentUserId?: string | null;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onPublish?: () => void; // Сделать is_official=true
  onSubmitForApproval?: () => void; // Предложить в официальные
  onLoadToEditor?: () => void; // Загрузить в редактор
}

export default function MixCard({
  id,
  title,
  description,
  ingredients,
  author_name,
  is_official = false,
  is_public = false,
  created_by,
  currentUserId,
  isAdmin = false,
  onEdit,
  onDelete,
  onPublish,
  onSubmitForApproval,
  onLoadToEditor,
}: MixCardProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  // Проверяем, является ли текущий пользователь автором микса
  const isMyMix = currentUserId && created_by && currentUserId === created_by;
  const isAuthorized = !!currentUserId;

  // Определяем, какие кнопки показывать
  const getActionButtons = () => {
    const buttons: React.ReactElement[] = [];

    // Кнопка "Расчет" показывается всегда
    buttons.push(
      <button
        key="calculator"
        onClick={() => setShowCalculator(!showCalculator)}
        className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/50 hover:shadow-xl hover:shadow-green-900/60 active:scale-[0.98]"
      >
        <Calculator className="w-4 h-4" />
        Расчет
      </button>
    );

    // ЛОГИКА ДЛЯ НЕАВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
    if (!isAuthorized) {
      // Только кнопка "Загрузить" для официальных миксов
      if (is_official && onLoadToEditor) {
        buttons.push(
          <button
            key="load"
            onClick={onLoadToEditor}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Загрузить
          </button>
        );
      }
      return buttons;
    }

    // ЛОГИКА ДЛЯ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
    if (isMyMix && !is_official) {
      // МОЙ ЛИЧНЫЙ МИКС - показываем кнопки управления
      if (onEdit) {
        buttons.push(
          <button
            key="edit"
            onClick={onEdit}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50 hover:shadow-xl hover:shadow-indigo-900/60 active:scale-[0.98]"
          >
            <Edit className="w-4 h-4" />
            Редактировать
          </button>
        );
      }

      if (onDelete) {
        buttons.push(
          <button
            key="delete"
            onClick={onDelete}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        );
      }

      // Кнопка "Предложить к публикации" только для личных миксов
      if (onSubmitForApproval) {
        buttons.push(
          <button
            key="submit"
            onClick={onSubmitForApproval}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-900/60 active:scale-[0.98] text-sm"
          >
            <Send className="w-4 h-4" />
            Предложить
          </button>
        );
      }
    } else if (is_official || is_public) {
      // ОФИЦИАЛЬНЫЙ ИЛИ ПУБЛИЧНЫЙ МИКС - только просмотр и загрузка
      if (onLoadToEditor) {
        buttons.push(
          <button
            key="load"
            onClick={onLoadToEditor}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Загрузить
          </button>
        );
      }
    }

    // ЛОГИКА ДЛЯ АДМИНА
    if (isAdmin) {
      // Админ может редактировать и удалять любые миксы
      // Но не показываем эти кнопки если они уже добавлены выше (для личных миксов)
      const hasEditButton = buttons.some((btn) => btn.key === 'edit');
      const hasDeleteButton = buttons.some((btn) => btn.key === 'delete');

      if (!hasEditButton && onEdit) {
        buttons.push(
          <button
            key="edit"
            onClick={onEdit}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50 hover:shadow-xl hover:shadow-indigo-900/60 active:scale-[0.98]"
          >
            <Edit className="w-4 h-4" />
            Редактировать
          </button>
        );
      }

      if (!hasDeleteButton && onDelete) {
        buttons.push(
          <button
            key="delete"
            onClick={onDelete}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        );
      }

      // Кнопка "Опубликовать" только для неофициальных миксов
      if (onPublish && !is_official) {
        buttons.push(
          <button
            key="publish"
            onClick={onPublish}
            className="flex-1 py-2.5 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/50 hover:shadow-xl hover:shadow-yellow-900/60 active:scale-[0.98] text-sm"
          >
            <Send className="w-4 h-4" />
            Опубликовать
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <>
      <div className="border border-slate-700 rounded-xl p-6 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-red-900/20 transition-all duration-200 group">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-red-400 transition-colors">
                {title}
              </h3>
              {is_official && (
                <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 text-xs font-semibold rounded">
                  Официальный
                </span>
              )}
              {is_public && !is_official && (
                <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded">
                  Публичный
                </span>
              )}
              {/* Бейдж "Мой микс" для личных миксов */}
              {isMyMix && !is_official && (
                <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-xs font-semibold rounded flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Мой микс
                </span>
              )}
            </div>
            {author_name && (
              <p className="text-xs text-slate-400">Автор: {author_name}</p>
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
          {getActionButtons()}
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
