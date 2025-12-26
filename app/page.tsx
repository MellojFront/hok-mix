'use client';

import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import MyMixes from '@/components/MyMixes';
import ReadyMixes from '@/components/ReadyMixes';
import KnowledgeBase from '@/components/KnowledgeBase';

export default function Home() {
  const [activeSection, setActiveSection] = useState('ready');

  const renderContent = () => {
    switch (activeSection) {
      case 'creator':
        return <MyMixes />;
      case 'ready':
        return <ReadyMixes />;
      case 'knowledge':
        return <KnowledgeBase />;
      default:
        return <ReadyMixes />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-900 flex">
        <Sidebar activeItem={activeSection} onItemChange={setActiveSection} />
        
        <main className="flex-1 p-8 overflow-auto bg-slate-900">
          {renderContent()}
        </main>
      </div>
    </AppProvider>
  );
}