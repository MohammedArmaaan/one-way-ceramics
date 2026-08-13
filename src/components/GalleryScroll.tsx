import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY } from '@/data';

export default function GallerySection() {
  const [showAll, setShowAll] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Determine how many images to show based on state
  const displayedGallery = showAll ? GALLERY : GALLERY.slice(0, 5);

  // Bento-Box varying grid pattern
  const getGridClasses = (index: number) => {
    const pattern = [
      'col-span-2 row-span-2 md:col-span-2 md:row-span-2', // Large Main Feature
      'col-span-2 md:col-span-1 md:row-span-1',            // Small standard
      'col-span-2 md:col-span-1 md:row-span-2',            // Tall portrait
      'col-span-1 md:col-span-1 md:row-span-1',            // Small standard
      'col-span-1 md:col-span-2 md:row-span-1',            // Wide landscape
      'col-span-2 md:col-span-1 md:row-span-1',            // Small
      'col-span-2 md:col-span-1 md:row-span-2',            // Tall
      'col-span-2 md:col-span-2 md:row-span-2',            // Large
    ];
    return pattern[index % pattern.length];
  };

  // --- Modal Navigation Logic ---
  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);
  
  const nextImage = () => {
    setSelectedIndex((prev) => 
      prev === null ? null : (prev + 1) % displayedGallery.length
    );
  };
  
  const prevImage = () => {
    setSelectedIndex((prev) => 
      prev === null ? null : (prev === 0 ? displayedGallery.length - 1 : prev - 1)
    );
  };

  // Lock body scroll & add keyboard navigation when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedIndex, displayedGallery.length]);

  return (
    <section id="gallery" className="bg-ivory py-24 md:py-32 border-t border-ink-line/50">
      <div className="container-px mx-auto max-w-[1400px]">
        
        {/* --- Header Section --- */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow text-cobalt mb-4"
          >
            Studio & Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-ink leading-tight"
          >
            View Our <span className="text-sage-deep">Gallery.</span>
          </motion.h2>
        </div>

        {/* --- Masonry / Bento Grid Layout --- */}
        <motion.div 
          layout 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 auto-rows-[160px] md:auto-rows-[240px] grid-flow-dense"
        >
          <AnimatePresence>
            {displayedGallery.map((g, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                key={g.label}
                onClick={() => openModal(i)}
                className={`group relative overflow-hidden rounded-xl md:rounded-2xl bg-ink/5 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 ${getGridClasses(i)}`}
              >
                <img
                  src={g.src}
                  alt={g.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[0.25,1,0.5,1] group-hover:scale-105"
                />
                
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Expand Icon */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <Maximize2 size={18} strokeWidth={2} />
                </div>

                {/* Label */}
                <div className="absolute bottom-0 left-0 p-5 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="font-serif italic text-lg md:text-2xl text-ivory leading-tight">{g.label}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- View All / View Less Button --- */}
        {GALLERY.length > 5 && (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3.5 rounded-full bg-white border border-ink-line text-ink font-semibold text-sm tracking-wide hover:bg-ink hover:text-ivory hover:border-ink transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {showAll ? 'View Less' : 'View All Images'}
            </button>
          </motion.div>
        )}
      </div>

      {/* --- FULLSCREEN IMAGE MODAL --- */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-xl p-4 sm:p-6 md:p-12"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white z-50 p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-md"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={24} className="sm:w-7 sm:h-7" />
            </button>

            {/* Previous Button */}
            <button 
              className="absolute left-2 sm:left-8 text-white/50 hover:text-white z-50 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-md"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} className="sm:w-8 sm:h-8" />
            </button>

            {/* Next Button */}
            <button 
              className="absolute right-2 sm:right-8 text-white/50 hover:text-white z-50 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-md"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              aria-label="Next image"
            >
              <ChevronRight size={28} className="sm:w-8 sm:h-8" />
            </button>

            {/* Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl h-[70vh] sm:h-[85vh] flex flex-col items-center justify-center outline-none"
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking the image itself
            >
              <img
                src={displayedGallery[selectedIndex].src}
                alt={displayedGallery[selectedIndex].label}
                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm"
              />
              <div className="absolute -bottom-10 sm:-bottom-12 text-center text-white/80 font-serif italic text-lg sm:text-2xl tracking-wide">
                {displayedGallery[selectedIndex].label}
              </div>
              <div className="absolute top-4 left-4 text-white/40 font-mono text-xs sm:text-sm">
                {selectedIndex + 1} / {displayedGallery.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}