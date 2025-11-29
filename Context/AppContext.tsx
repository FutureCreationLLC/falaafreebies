import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppView, FreebieItem } from '../types';
import { fetchInitialFreebies } from '../services/geminiService';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  items: FreebieItem[];
  addItem: (item: FreebieItem) => void;
  isLoading: boolean;
  refreshItems: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [items, setItems] = useState<FreebieItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshItems = async () => {
    setIsLoading(true);
    const newItems = await fetchInitialFreebies();
    setItems(newItems);
    setIsLoading(false);
  };

  const addItem = (item: FreebieItem) => {
    setItems(prev => [item, ...prev]);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  return (
    <AppContext.Provider value={{ currentView, setCurrentView, items, addItem, isLoading, refreshItems }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
