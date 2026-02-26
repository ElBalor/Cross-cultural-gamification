'use client';

import { useState, useEffect } from 'react';
import RatingModal from './RatingModal';

export default function FloatingRatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-rating-modal', handleOpenModal);
    return () => window.removeEventListener('open-rating-modal', handleOpenModal);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95 border-2 border-white/20"
        >
          <span className="text-xl">⭐</span>
          <span className="font-black text-sm uppercase tracking-wider hidden sm:inline">Rate App</span>
        </button>
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full p-1 hover:bg-gray-500 transition-colors shadow-lg"
          title="Hide button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <RatingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activityType="general"
      />
    </>
  );
}
