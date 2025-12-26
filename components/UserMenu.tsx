'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Shield } from 'lucide-react';
import AuthModal from './AuthModal';

export default function UserMenu() {
  const { user, signOut, isAdmin } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  if (!user) {
    return (
      <>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Войти</span>
        </button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline truncate max-w-[100px]">
          {user.user_metadata?.name || user.email?.split('@')[0]}
        </span>
        {isAdmin && <Shield className="w-4 h-4 text-yellow-400" />}
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-[60]">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-slate-300 border-b border-slate-700">
                {user.email}
              </div>
              {isAdmin && (
                <div className="px-3 py-2 text-xs text-yellow-400 flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Администратор
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

