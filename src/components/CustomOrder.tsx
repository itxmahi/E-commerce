'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Paintbrush, Sparkles, PencilLine, PenTool, Check, ShoppingBag, Search } from 'lucide-react';

const CUSTOM_CATEGORIES = [
  {
    id: 'classic-calligraphy',
    title: 'Classic Calligraphy',
    description: 'Traditional script hand-painted on premium aging-resistant paper.',
    price: 15000,
    icon: <PencilLine className="w-6 h-6" />,
    image: '/images/box-1.jpeg'
  },
  {
    id: 'modern-minimalist',
    title: 'Modern Minimalist',
    description: 'Sleek, contemporary strokes on large-scale stretched canvas.',
    price: 12000,
    icon: <PenTool className="w-6 h-6" />,
    image: '/images/box-2.jpeg'
  },
  {
    id: 'gold-leaf-edition',
    title: 'Gold Leaf Edition',
    description: 'Premium artwork featuring 24k gold leaf accents for divine glow.',
    price: 25000,
    icon: <Sparkles className="w-6 h-6" />,
    image: '/placeholder.svg' 
  },
  {
    id: 'custom-verse',
    title: 'Custom Verse',
    description: 'Provide your favorite Quranic verse or name for a unique creation.',
    price: 18000,
    icon: <Paintbrush className="w-6 h-6" />,
    image: '/placeholder.svg'
  }
];

export default function CustomOrder() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCategory = CUSTOM_CATEGORIES.find(c => c.id === selectedId);

  const handleAddToCart = () => {
    if (!selectedCategory) return;
    
    addToCart({
      id: `custom-${selectedCategory.id}-${Date.now()}`,
      title: `Custom: ${selectedCategory.title}`,
      price: selectedCategory.price,
      image: selectedCategory.image,
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section className="py-24 space-y-16 animate-in fade-in duration-1000 scroll-mt-24" id="custom-order" suppressHydrationWarning>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-10">
        <div className="space-y-4">
          <span className="text-indigo-600 font-black text-[10px] tracking-[0.4em] uppercase bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full">
            Bespoke Services
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none">
            Tailored <span className="text-indigo-600 italic font-serif lowercase tracking-normal">Masterpieces</span>
          </h2>
          <p className="text-gray-500 max-w-xl font-medium">
            Cannot find exactly what you are looking for? Our artisans specialize in custom commissions 
            tailored to your spiritual vision and interior space.
          </p>
        </div>
        <div className="flex items-center gap-4 text-gray-400 font-black text-[10px] tracking-widest uppercase">
          <div className="w-12 h-px bg-gray-200 dark:bg-white/10" />
          Select your Style
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CUSTOM_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedId(cat.id)}
            className={`group relative cursor-pointer p-8 rounded-[3rem] border transition-all duration-700 overflow-hidden ${
              selectedId === cat.id
                ? 'bg-indigo-600 border-indigo-600 shadow-2xl scale-[1.02]'
                : 'bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 hover:border-indigo-500/30 hover:shadow-xl'
            }`}
          >
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-[3s]">
                {cat.icon}
             </div>

             <div className="space-y-8 relative z-10">
               <div className={`p-5 rounded-[1.5rem] w-fit transition-colors duration-500 ${
                 selectedId === cat.id ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'
               }`}>
                 {cat.icon}
               </div>

               <div className="space-y-3">
                 <h3 className={`text-2xl font-black tracking-tight leading-none ${
                   selectedId === cat.id ? 'text-white' : 'text-gray-900 dark:text-white'
                 }`}>
                   {cat.title}
                 </h3>
                 <p className={`text-sm font-medium leading-relaxed ${
                   selectedId === cat.id ? 'text-white/80' : 'text-gray-500'
                 }`}>
                   {cat.description}
                 </p>
               </div>

               <div className="flex items-center justify-between pt-4">
                 <p className={`text-xl font-black font-serif italic ${
                   selectedId === cat.id ? 'text-white' : 'text-indigo-600'
                 }`}>
                   From Rs. {cat.price.toLocaleString()}
                 </p>
                 {selectedId === cat.id && (
                   <div className="bg-white text-indigo-600 p-2 rounded-full shadow-lg animate-in zoom-in duration-300">
                     <Check className="w-4 h-4" strokeWidth={3} />
                   </div>
                 )}
               </div>
             </div>
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="bg-indigo-50/50 dark:bg-indigo-500/5 backdrop-blur-3xl border border-indigo-500/20 p-12 md:p-16 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 animate-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center gap-10">
             <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden ring-4 ring-white dark:ring-white/10 shadow-2xl bg-white">
                <img 
                  src={selectedCategory?.image || '/placeholder.svg'} 
                  alt={selectedCategory?.title} 
                  className="w-full h-full object-cover" 
                />
             </div>
             <div className="space-y-4">
                <h4 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none">
                   Confirm <span className="text-indigo-600 italic font-serif lowercase tracking-normal">Selection</span>
                </h4>
                <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase">
                   Your Choice: {selectedCategory?.title} | Quality Inspection Included
                </p>
             </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isSuccess}
            className={`group relative overflow-hidden flex items-center justify-center gap-6 px-16 py-8 rounded-[2.5rem] text-[11px] font-black tracking-[0.4em] uppercase transition-all duration-700 shadow-2xl active:scale-95 ${
              isSuccess 
              ? 'bg-green-500 text-white shadow-green-500/30' 
              : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white'
            }`}
          >
            {isSuccess ? (
              <>ADDED TO CART <Check className="w-5 h-5" /></>
            ) : (
              <>BEGIN CUSTOM ORDER <ShoppingBag className="w-5 h-4" /></>
            )}
          </button>
        </div>
      )}

      {!selectedId && (
        <div className="relative h-64 rounded-[4rem] overflow-hidden bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center group cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all duration-700">
           <div className="text-center space-y-4 group-hover:-translate-y-2 transition-transform duration-700">
              <Sparkles className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" strokeWidth={1} />
              <p className="text-[12px] font-black text-gray-400 tracking-[0.5em] uppercase">Select a style above to start your bespoke journey</p>
           </div>
        </div>
      )}
    </section>
  );
}
