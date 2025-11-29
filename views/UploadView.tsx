import React, { useState, useRef } from 'react';
import { Camera, Sparkles, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';
import { analyzeImageForListing, fileToBase64 } from '../services/geminiService';

export const UploadView: React.FC = () => {
  const { setCurrentView, addItem } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Reset fields when new image selected
      setTitle('');
      setDescription('');
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(imageFile);
      const result = await analyzeImageForListing(base64, imageFile.type);
      setTitle(result.title);
      setDescription(result.description);
    } catch (err) {
      console.error(err);
      alert('Could not analyze image. Please fill details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !previewUrl) return;

    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    addItem({
      id: Date.now().toString(),
      title,
      description,
      imageUrl: previewUrl, // In a real app, this would be the URL from the server after upload
      distance: '0.1 mi',
      postedAt: 'Just now',
      isLocal: true
    });

    setIsSubmitting(false);
    setCurrentView(AppView.HOME);
  };

  return (
    <main className="pt-20 pb-24 px-6 min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Give away an item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
              previewUrl ? 'border-transparent' : 'border-gray-300 hover:border-primary bg-gray-50'
            }`}
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl(null);
                    setImageFile(null);
                    setTitle('');
                    setDescription('');
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera size={24} />
                </div>
                <p className="text-sm font-medium text-gray-700">Tap to take photo</p>
                <p className="text-xs text-gray-400 mt-1">or select from gallery</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          {/* AI Analysis Button */}
          {imageFile && !title && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Auto-fill details with AI
                </>
              )}
            </button>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you giving away?"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the condition, size, etc."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                required
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setCurrentView(AppView.HOME)}
              className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title || !description || !imageFile || isSubmitting}
              className="flex-1 py-3.5 rounded-xl bg-primary text-white font-medium shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Post Freebie'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};
