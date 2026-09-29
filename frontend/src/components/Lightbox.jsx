import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function Lightbox({ image, images = [], onClose, onNext, onPrev }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image container */}
      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
        <img
          src={image.src || image.url || image}
          alt={image.title || 'Festival Moment'}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%232C3E50"/><circle cx="400" cy="270" r="70" fill="%23FFFFFF" opacity="0.1"/><text x="400" y="295" font-size="60" text-anchor="middle" font-family="sans-serif">✨</text><text x="400" y="400" font-size="24" font-weight="bold" fill="%23ECF0F1" text-anchor="middle" font-family="sans-serif">${encodeURIComponent(image.title || 'Festival Moment')}</text></svg>`;
          }}
          className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
        />
        {(image.title || image.caption) && (
          <div className="mt-4 text-center">
            <h4 className="text-lg font-bold text-white">{image.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{image.caption || image.category}</p>
          </div>
        )}
      </div>
    </div>
  );
}
