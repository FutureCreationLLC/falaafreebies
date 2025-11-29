import React from 'react';
import { User, Settings, MapPin, Heart } from 'lucide-react';

export const ProfileView: React.FC = () => {
  return (
    <main className="pt-20 pb-24 px-6 min-h-screen">
       <div className="flex flex-col items-center mb-8">
         <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
            <User size={48} className="text-teal-600" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900">Guest User</h2>
         <p className="text-gray-500 flex items-center gap-1 mt-1">
           <MapPin size={14} /> San Francisco, CA
         </p>
       </div>

       <div className="space-y-4">
         <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-lg text-pink-500">
                <Heart size={20} />
              </div>
              <span className="font-medium text-gray-700">Favorites</span>
            </div>
            <span className="text-gray-400">12</span>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-500">
                <Settings size={20} />
              </div>
              <span className="font-medium text-gray-700">Settings</span>
            </div>
         </div>
       </div>

       <div className="mt-8 p-6 bg-teal-50 rounded-2xl border border-teal-100 text-center">
         <h3 className="text-teal-900 font-bold mb-2">Premium Member</h3>
         <p className="text-teal-600 text-sm mb-4">Get unlimited uploads and priority support.</p>
         <button className="bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md">Upgrade Now</button>
       </div>
    </main>
  );
};