import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <main className="pt-20 pb-24 px-6 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
        {['Notifications', 'Privacy', 'Help Center', 'About Us', 'Log Out'].map((item, idx) => (
          <button key={idx} className="w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50 transition-colors flex justify-between items-center">
            {item}
            <span className="text-gray-300">›</span>
          </button>
        ))}
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8">Version 1.0.0 (Beta)</p>
    </main>
  );
};
