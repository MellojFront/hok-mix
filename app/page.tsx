'use client';

import { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import MyMixes from '@/components/MyMixes';
import ReadyMixes from '@/components/ReadyMixes';
import KnowledgeBase from '@/components/KnowledgeBase';
import AdminPanel from '@/components/AdminPanel';
import UserMenu from '@/components/UserMenu';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('ready');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'creator':
        return <MyMixes />;
      case 'ready':
        return <ReadyMixes />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <ReadyMixes />;
    }
  };

  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-slate-900 flex">
          {/* Мобильное меню кнопка */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 hover:bg-slate-700 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* User Menu */}
          <div className="fixed top-4 right-4 z-50">
            <UserMenu />
          </div>

          {/* Overlay для мобильных */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Сайдбар */}
          <div
            className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <Sidebar
              activeItem={activeSection}
              onItemChange={(id) => {
                setActiveSection(id);
                setIsSidebarOpen(false);
              }}
            />
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-slate-900 w-full lg:w-auto pt-16 sm:pt-8">
            {renderContent()}
          </main>
        </div>
      </AppProvider>
    </AuthProvider>
  );
}