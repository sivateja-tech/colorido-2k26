import React, { useState } from 'react';
import { Camera, Image as ImageIcon, ZoomIn, Layers } from 'lucide-react';
import Lightbox from '../components/Lightbox';

const getCategorySvgFallback = (category, title) => {
  const bg = category === 'SPORTS' ? '%2327AE60' : category === 'CULTURAL' ? '%23E67E22' : '%232980B9';
  const icon = category === 'SPORTS' ? '⚽' : category === 'CULTURAL' ? '🎭' : '⚡';
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%232C3E50"/><rect x="20" y="20" width="760" height="560" rx="24" fill="${bg}" opacity="0.3"/><circle cx="400" cy="260" r="70" fill="%23FFFFFF" opacity="0.12"/><text x="400" y="285" font-size="64" text-anchor="middle" font-family="sans-serif">${icon}</text><text x="400" y="400" font-size="26" font-weight="bold" fill="%23ECF0F1" text-anchor="middle" font-family="sans-serif">${encodeURIComponent(title || 'Colorido Moment')}</text><text x="400" y="440" font-size="16" fill="%2395A5A6" font-weight="600" letter-spacing="2" text-anchor="middle" font-family="sans-serif">COLORIDO 2K26 ARCHIVE</text></svg>`;
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'T20 Cricket Under Floodlights',
      category: 'SPORTS',
      src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80',
      caption: 'Championship final match at R V R & J C Main Cricket Stadium'
    },
    {
      id: 2,
      title: 'Natya Tarang Mega Dance Battle',
      category: 'CULTURAL',
      src: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000&auto=format&fit=crop&q=80',
      caption: 'Over 5,000 students cheering at Open Air Amphitheatre'
    },
    {
      id: 3,
      title: '24-Hour Hackathon Coding Sprint',
      category: 'TECHNICAL',
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&auto=format&fit=crop&q=80',
      caption: 'Student teams building AI and cloud prototypes overnight in HPC labs'
    },
    {
      id: 4,
      title: 'Football Champions Cup Thriller',
      category: 'SPORTS',
      src: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1000&auto=format&fit=crop&q=80',
      caption: 'Knockout matches at South Football Stadium'
    },
    {
      id: 5,
      title: 'Battle of the Bands Mainstage',
      category: 'CULTURAL',
      src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80',
      caption: 'Collegiate rock band finalists at Central Open Ground'
    },
    {
      id: 6,
      title: 'Robotics & Hardware Expo',
      category: 'TECHNICAL',
      src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80',
      caption: 'Autonomous rovers and IoT hardware prototypes on exhibition'
    },
    {
      id: 7,
      title: 'Runway Couture Fashion Show',
      category: 'CULTURAL',
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&auto=format&fit=crop&q=80',
      caption: 'Ethnic and futuristic high fashion runway showcase'
    },
    {
      id: 8,
      title: '100m Dash Track & Field Sprint',
      category: 'SPORTS',
      src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&auto=format&fit=crop&q=80',
      caption: 'Olympic synthetic track finals at Central Track Complex'
    },
    {
      id: 9,
      title: 'Algorithmic Duel Leaderboard',
      category: 'TECHNICAL',
      src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2980B9]/20 text-[#2980B9] border border-[#2980B9]/30">
          <Camera className="w-3.5 h-3.5" />
          <span>Visual Memories</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-[#ECF0F1] tracking-tight">
          Festival Gallery
        </h1>
        <p className="text-xs sm:text-sm text-[#95A5A6] max-w-2xl leading-relaxed">
          High-definition highlights from iconic sporting victories, cultural mainstage spectacles, and technical hackathons. Click any photo to view in fullscreen lightbox.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 shadow-sm">
        {['ALL', 'SPORTS', 'CULTURAL', 'TECHNICAL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-[#2980B9] text-white shadow-sm'
                : 'bg-[#1a252f] text-[#95A5A6] hover:text-[#ECF0F1]'
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
            className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer bg-[#2C3E50] border border-[#95A5A6]/20 shadow-md hover:shadow-xl transition-all"
          >
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getCategorySvgFallback(item.category, item.title);
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/90 via-[#2C3E50]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

            {/* Badges and Caption */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1a252f]/80 text-[#ECF0F1] backdrop-blur-md border border-[#95A5A6]/30">
                {item.category}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
              <h3 className="font-bold text-base leading-tight text-[#ECF0F1] drop-shadow-md">
                {item.title}
              </h3>
              <p className="text-xs text-[#95A5A6] line-clamp-1 drop-shadow-sm">
                {item.caption}
              </p>
            </div>

            <div className="absolute top-3 right-3 p-2 rounded-xl bg-[#1a252f]/80 text-[#ECF0F1] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md border border-[#95A5A6]/20">
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
