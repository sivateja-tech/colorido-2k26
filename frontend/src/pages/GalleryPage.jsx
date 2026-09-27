import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, ZoomIn } from 'lucide-react';
import Lightbox from '../components/Lightbox';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'T20 Cricket Under Floodlights',
      category: 'SPORTS',
      src: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=1200&q=80',
      caption: 'Championship final match at R V R & J C Main Cricket Stadium'
    },
    {
      id: 2,
      title: 'Natya Tarang Mega Dance Battle',
      category: 'CULTURAL',
      src: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&q=80',
      caption: 'Over 5,000 students cheering at Open Air Amphitheatre'
    },
    {
      id: 3,
      title: '24-Hour Hackathon Coding Sprint',
      category: 'TECHNICAL',
      src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
      caption: 'Student teams building AI and cloud prototypes overnight in HPC labs'
    },
    {
      id: 4,
      title: 'Football Champions Cup Thriller',
      category: 'SPORTS',
      src: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
      caption: 'Knockout matches at South Football Stadium'
    },
    {
      id: 5,
      title: 'Battle of the Bands Mainstage',
      category: 'CULTURAL',
      src: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&q=80',
      caption: 'Collegiate rock band finalists at Central Open Ground'
    },
    {
      id: 6,
      title: 'Robotics & Hardware Expo',
      category: 'TECHNICAL',
      src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
      caption: 'Autonomous rovers and IoT hardware prototypes on exhibition'
    },
    {
      id: 7,
      title: 'Runway Couture Fashion Show',
      category: 'CULTURAL',
      src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
      caption: 'Ethnic and futuristic high fashion runway showcase'
    },
    {
      id: 8,
      title: '100m Dash Track & Field Sprint',
      category: 'SPORTS',
      src: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
      caption: 'Olympic synthetic track finals at Central Track Complex'
    },
    {
      id: 9,
      title: 'Algorithmic Duel Leaderboard',
      category: 'TECHNICAL',
      src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80',
      caption: 'Competitive programming sprint in CSE Advanced Computing Lab'
    }
  ];

  const filteredItems = galleryItems.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/15 text-brand-purple dark:text-brand-accent">
          <Camera className="w-3.5 h-3.5" />
          <span>Visual Memories</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
          Festival Gallery
        </h1>
        <p className="text-xs sm:text-sm text-dark-text-secondary max-w-2xl leading-relaxed">
          High-definition highlights from iconic sporting victories, cultural mainstage spectacles, and technical hackathons. Click any photo to view in fullscreen lightbox.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-sm">
        {['ALL', 'SPORTS', 'CULTURAL', 'TECHNICAL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-brand-purple text-white shadow-sm'
                : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            {cat === 'ALL' ? 'All Photos' : cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveImageIndex(idx)}
            className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md hover:shadow-xl transition-all"
          >
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

            {/* Badges and Caption */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                {item.category}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
              <h3 className="font-bold text-base leading-tight drop-shadow-md">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1 drop-shadow-sm">
                {item.caption}
              </p>
            </div>

            <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && (
        <Lightbox
          image={filteredItems[activeImageIndex]}
          onClose={() => setActiveImageIndex(null)}
          onNext={() => setActiveImageIndex((prev) => (prev + 1) % filteredItems.length)}
          onPrev={() => setActiveImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
        />
      )}
    </div>
  );
}
