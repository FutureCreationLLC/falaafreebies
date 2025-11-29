import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { UploadView } from './views/UploadView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { AppView } from './types';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case AppView.HOME:
      return <HomeView />;
    case AppView.UPLOAD:
      return <UploadView />;
    case AppView.PROFILE:
      return <ProfileView />;
    case AppView.SETTINGS:
      return <SettingsView />;
    default:
      return <HomeView />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-surface font-sans text-gray-900">
        <Header />
        <MainContent />
        <BottomNav />
      </div>
    </AppProvider>
  );
};

export default App;