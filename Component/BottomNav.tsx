import React from 'react';
import { Home, UploadCloud, User, Settings, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const navItems = [
    { id: AppView.HOME, icon: <Home size={24} />, label: 'Home' },
    { id: AppView.UPLOAD, icon: <UploadCloud size={24} />, label: 'Upload' },
    { id: AppView.PROFILE, icon: <User size={24} />, label: 'Profile' },
    { id: AppView.SETTINGS, icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) for quick add - only visible on Home */}
      {currentView === AppView.HOME && (
        <button
          onClick={() => setCurrentView(AppView.UPLOAD)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-secondary text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center transform transition-transform hover:scale-105 active:scale-95 z-40"
          aria-label="Upload Item"
        >
          <Plus size={32} />
        </button>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 pb-4 z-50 flex justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-teal-50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
