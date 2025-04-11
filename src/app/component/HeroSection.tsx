// src/app/components/HeroSection.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Layer = {
  id: number;
  src: string;
  depth: number;
  scrollFactor: number;
  mouseFactor: number;
  scale: number;
  filter: string;
};

// Make sure these files exist in the public directory
const layers: Layer[] = [
  { id: 8, src: "/8.svg", depth: 65, scrollFactor: 0.1, mouseFactor: 0, scale: 1, filter: "none" },
  { id: 7, src: "/7.png", depth: 60, scrollFactor: 0.2, mouseFactor: 0, scale: 1, filter: "none" },
  { id: 6, src: "/6.svg", depth: 30, scrollFactor: 0.3, mouseFactor: 0, scale: 1, filter: "none" },
  { id: 5, src: "/5.svg", depth: 25, scrollFactor: 0.4, mouseFactor: 0, scale: 1, filter: "none" },
  { id: 4, src: "/4.svg", depth: 20, scrollFactor: 0.5, mouseFactor: 0, scale: 1, filter: "none" },
  { id: 3, src: "/3.svg", depth: 15, scrollFactor: 0.6, mouseFactor: 0, scale: 1, filter: "none" },
  { id: 2, src: "/2.svg", depth: 10, scrollFactor: 0.7, mouseFactor: 0, scale: 1, filter: "none" },
  { id: 1, src: "/1.svg", depth: 5,  scrollFactor: 0.8, mouseFactor: 0, scale: 1, filter: "none" },
];

const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [forceHideLoader, setForceHideLoader] = useState(false);
  
  // Initialize loading state for images
  useEffect(() => {
    const initialStates = layers.reduce((acc, layer) => {
      acc[layer.id] = false;
      return acc;
    }, {} as Record<number, boolean>);
    setImagesLoaded(initialStates);
    
    // Add a fallback timeout to hide the loader after 5 seconds
    // This prevents the loading screen from getting stuck indefinitely
    const timeoutId = setTimeout(() => {
      setForceHideLoader(true);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const handleImageLoad = (id: number) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };
  
  // Handle image load errors to prevent stuck loading state
  const handleImageError = (id: number) => {
    console.warn(`Failed to load image ${id}`);
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };
  
  const allImagesLoaded = Object.values(imagesLoaded).every(Boolean);

  // Set up scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call in case page loads scrolled
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Loading Overlay - will hide after timeout even if images don't load */}
      {!allImagesLoaded && !forceHideLoader && (
        <div className="absolute inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-500 ease-in-out">
          <div className="w-16 h-16 border-8 border-light-grey border-t-primary-blue rounded-full animate-spin"></div>
        </div>
      )}

      {/* Parallax container */}
      <div className="absolute inset-0 w-full h-full">
        {layers.map((layer) => {
          const scrollOffset = scrollY * layer.scrollFactor * 0.2;
          return (
            <motion.div
              key={layer.id}
              className="absolute inset-0 w-full h-full"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: scrollOffset }}
              transition={{
                y: { type: "spring", stiffness: 100, damping: 20, mass: 0.5 },
              }}
              style={{ zIndex: 10 - layer.id }}
              // Convert inline style to Tailwind class
              // Not all styles can be converted as some are dynamic
            >
              <div className="relative w-full h-full">
                <Image
                  src={layer.src}
                  alt={`Layer ${layer.id}`}
                  fill
                  className="object-contain transition-opacity duration-500 ease-in-out"
                  onLoadingComplete={() => handleImageLoad(layer.id)}
                  onError={() => handleImageError(layer.id)}
                  priority={layer.id <= 2} // Prioritize loading the first two layers
                  unoptimized={layer.src.endsWith('.svg')}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content grid for text positioning */}
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 h-full relative z-20">
        {/* Text container positioned with Tailwind grid classes */}
        <div className="col-span-4 sm:col-span-6 md:col-span-8 self-end mb-16 mx-4 sm:mx-8 md:mx-16 lg:mx-24">
          <motion.h1
            className="text-h2 md:text-h1 font-helvetica-now text-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Radionuclide<br />Industry Ecosystem
          </motion.h1>
          <motion.p
            className="text-h5 font-helvetica-now text-grey mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            An overview of isotope types, ligands, targets, companies in the
            space, manufacturing methods, global demand, and current access.
          </motion.p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 w-full h-px bg-light-grey z-10" />
    </section>
  );
};

export default HeroSection;