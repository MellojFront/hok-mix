'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Валидация
    if (!email || !password) {
      setError('Заполните все поля');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setLoading(false);
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Введите имя');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Регистрация успешна! Проверьте email для подтверждения.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100">
              {mode === 'signin' ? 'Вход' : 'Регистрация'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                    placeholder="Ваше имя"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                  placeholder="Минимум 6 символов"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Загрузка...' : mode === 'signin' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              {mode === 'signin'
                ? 'Нет аккаунта? Зарегистрироваться'
                : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

