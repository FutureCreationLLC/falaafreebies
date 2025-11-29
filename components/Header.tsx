import React from 'react';
import { Menu, Settings, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';

export const Header: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center justify-between px-4">
      <button 
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        onClick={() => {}} 
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
        Falaa-Freebies
      </h1>

      <div className="flex items-center gap-2">
         <button 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => {}}
        >
          <Bell size={24} />
        </button>
        <button 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setCurrentView(AppView.SETTINGS)}
        >
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};
