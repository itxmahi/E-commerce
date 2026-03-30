'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState('/images/box-1.jpeg');

  useEffect(() => {
    const savedHeroImage = localStorage.getItem('heroImage');
    if (savedHeroImage) {
      setHeroImage(savedHeroImage);
    }
  }, []);

  return (
    <section className="relative h-[550px] md:h-[700px] rounded-[3rem] md:rounded-[4rem] overflow-hidden group shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
      {/* Premium Multi-Layer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 hidden md:block" />
      
      <img 
        src={heroImage} 
        alt="Premium Calligraphy Art" 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
      />
      
      <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-10 md:px-20 space-y-8">
        <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
          <span className="inline-block px-5 py-2 rounded-full text-[9px] font-black tracking-[0.3em] uppercase text-indigo-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            INSPIRING BEAUTY
          </span>
          
          <h1 className="text-5xl md:text-[5.5rem] font-black text-white leading-[1.1] tracking-[-0.03em] max-w-4xl drop-shadow-2xl">
            Elevate Your <span className="italic font-serif font-light text-indigo-200">Spirit</span> <br /> 
            Through Art.
          </h1>
        </div>

        <p className="text-sm md:text-lg text-white/70 max-w-xl leading-relaxed font-medium tracking-wide drop-shadow-md pb-4 animate-in fade-in slide-in-from-left-10 duration-1000">
          Art is a journey of the soul. Transform your sanctuary with sacred 
          calligraphy that inspires peace, focus, and timeless beauty.
        </p>

        <div className="flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-3 px-10 py-5 rounded-2xl text-[11px] font-black tracking-[0.2em] transition-all duration-300 shadow-[0_20px_40px_-12px_rgba(79,70,229,0.4)] active:scale-95 uppercase">
            EXPLORE COLLECTION <ShoppingBag className="w-4 h-4" />
          </button>
          
          <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-white/10">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase truncate max-w-[150px]">
              TRUSTED BY <br /> <span className="text-white">10,000+ CLIENTS</span>
            </p>
          </div>
        </div>
      </div>

      {/* Luxury Border Visual */}
      <div className="absolute inset-0 border-[1px] border-white/5 rounded-[3rem] md:rounded-[4rem] z-30 pointer-events-none" />
    </section>
  );
}
