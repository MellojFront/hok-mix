'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Mix } from '@/types';
import { Shield, Check, X, Eye, BarChart3 } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';

interface Submission {
  id: string;
  title: string;
  description: string;
  ingredients: any;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_email?: string;
}

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'submissions' | 'analytics'>('submissions');

  useEffect(() => {
    if (isAdmin) {
      loadSubmissions();
    }
  }, [isAdmin]);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('mix_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Получаем информацию о пользователях через публичную функцию или просто используем ID
      // В будущем можно добавить таблицу profiles для хранения имен пользователей
      const submissionsWithUsers = (data || []).map((sub) => {
        return {
          ...sub,
          user_email: `Пользователь ${sub.submitted_by.substring(0, 8)}...`, // Показываем часть ID
        };
      });

      setSubmissions(submissionsWithUsers);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveSubmission = async (submission: Submission) => {
    try {
      // Создаем официальный микс
      const { data: mixData, error: mixError } = await supabase
        .from('mixes')
        .insert({
          title: submission.title,
          description: submission.description,
          ingredients: submission.ingredients,
          is_official: true,
          author_name: submission.user_email || 'Пользователь',
        })
        .select()
        .single();

      if (mixError) throw mixError;

      // Обновляем статус предложения и связываем с миксом
      const { error: updateError } = await supabase
        .from('mix_submissions')
        .update({ 
          status: 'approved',
          mix_id: mixData.id,
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      alert('Микс одобрен и добавлен в официальные!');
      loadSubmissions();
    } catch (error: any) {
      console.error('Error approving submission:', error);
      alert(error.message || 'Ошибка при одобрении микса');
    }
  };

  const rejectSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mix_submissions')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      loadSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Ошибка при отклонении микса');
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Shield className="w-12 h-12 mx-auto mb-4 text-slate-600" />
        <p className="text-lg">У вас нет доступа к админ панели</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Загрузка...</div>;
  }

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Админ Панель</h2>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'submissions'
              ? 'border-red-600 text-red-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Предложения
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-red-600 text-red-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Аналитика
        </button>
      </div>

      {/* Контент табов */}
      {activeTab === 'analytics' ? (
        <AdminAnalytics />
      ) : (
        <>
      {pendingSubmissions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg mb-2">Нет предложений на рассмотрение</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
                    {submission.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-2">
                    От: {submission.user_email}
                  </p>
                  <p className="text-sm text-slate-300">{submission.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <strong className="text-slate-200 text-sm">Ингредиенты:</strong>
                <div className="mt-2 space-y-1">
                  {submission.ingredients.map((ing: any, idx: number) => (
                    <div key={idx} className="text-sm text-slate-300">
                      {ing.name} - {ing.percentage}%
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approveSubmission(submission)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/50"
                >
                  <Check className="w-4 h-4" />
                  Одобрить
                </button>
                <button
                  onClick={() => rejectSubmission(submission.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/50"
                >
                  <X className="w-4 h-4" />
                  Отклонить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}

