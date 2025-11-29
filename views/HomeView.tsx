import React from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { Loader2, RefreshCw } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { items, isLoading, refreshItems } = useApp();

  return (
    <main className="pt-20 pb-24 px-4 min-h-screen">
      {/* Welcome / Filter Section */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Discover</h2>
          <p className="text-sm text-gray-500">Free stuff nearby</p>
        </div>
        <button 
          onClick={() => refreshItems()}
          disabled={isLoading}
          className="text-primary hover:bg-teal-50 p-2 rounded-full transition-colors"
        >
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {isLoading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 size={48} className="animate-spin mb-4 text-primary" />
          <p>Finding freebies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p>No freebies found nearby.</p>
          <p className="text-sm">Try refreshing or upload something!</p>
        </div>
      )}
    </main>
  );
};
