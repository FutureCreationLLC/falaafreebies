import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { FreebieItem } from '../types';

interface ItemCardProps {
  item: FreebieItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90">
          FREE
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-grow">{item.description}</p>
        
        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-auto">
          <div className="flex items-center gap-1">
            <MapPin size={10} />
            <span>{item.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} />
            <span>{item.postedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};