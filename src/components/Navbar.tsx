'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Search, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { cart, wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sync theme with system/localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true') {
      setIsAdmin(true);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-black/80 backdrop-blur-2xl py-3 shadow-[0_8px_40px_rgba(0,0,0,0.08)]' 
        : 'bg-transparent py-6 md:py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Luxury Logo */}
        <Link href="/" className="flex items-center gap-3 md:gap-4 group">
          <div className="relative w-10 h-10 md:w-13 md:h-13 rounded-full overflow-hidden ring-1 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all duration-700 shadow-2xl">
            <Image 
              src="/logo.jpeg" 
              alt="AL-JAMAAL Art Logo" 
              fill 
              priority
              className="object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
          </div>
          <div className="flex flex-col mt-0.5 text-left">
            <span className="text-sm md:text-xl font-black tracking-[0.2em] md:tracking-[0.3em] text-foreground leading-none uppercase">AL-JAMAAL</span>
            <span className="text-[6px] md:text-[8px] tracking-[0.4em] md:tracking-[0.55em] text-indigo-600 font-extrabold uppercase mt-1 leading-none">ART COLLECTION</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-12">
          <Link href="/" className="text-[10px] font-black tracking-[0.3em] uppercase text-muted hover:text-indigo-600 transition-all duration-300 relative group/link">
            HOME
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-indigo-600 group-hover/link:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/wishlist" className="text-[10px] font-black tracking-[0.3em] uppercase text-muted hover:text-indigo-600 transition-all duration-300 relative group/link">
            WISHLIST
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-indigo-600 group-hover/link:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/#custom-order" className="text-[10px] font-black tracking-[0.3em] uppercase text-muted hover:text-indigo-600 transition-all duration-300 relative group/link">
            CUSTOM
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-indigo-600 group-hover/link:w-full transition-all duration-300"></span>
          </Link>
          {isAdmin && (
            <Link href="/admin-secret" className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-600 hover:text-indigo-700 transition-all duration-300 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              DASHBOARD
            </Link>
          )}
        </div>

        {/* Minimal Icons */}
        <div className="flex items-center gap-1.5 md:gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-muted hover:text-indigo-600 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" strokeWidth={2} /> : <Sun className="w-4.5 h-4.5" strokeWidth={2} />}
          </button>

          <Link 
            href="/#products"
            className="relative p-2.5 text-muted hover:text-indigo-600 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full hidden sm:block"
          >
            <Search className="w-4.5 h-4.5" strokeWidth={2} />
          </Link>
          
          <Link href="/wishlist" className="relative p-2.5 text-muted hover:text-indigo-600 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full">
            <Heart className={`w-4.5 h-4.5 transition-all ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} strokeWidth={2} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-2.5 text-muted hover:text-indigo-600 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full">
            <ShoppingCart className="w-4.5 h-4.5" strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <button 
            className="md:hidden p-2.5 text-foreground hover:bg-secondary rounded-full transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Luxury Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-[110] transition-all duration-700 md:hidden",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
         {/* Backdrop */}
         <div 
           className="absolute inset-0 bg-black/40 backdrop-blur-md"
           onClick={() => setIsMenuOpen(false)}
         />
         
         {/* Drawer Content */}
         <div className={cn(
           "absolute top-0 right-0 h-screen w-[85%] max-w-sm bg-white dark:bg-[#0a0a0a] shadow-[-20px_0_80px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-checkout flex flex-col p-10 py-16",
           isMenuOpen ? "translate-x-0" : "translate-x-full"
         )}>
           <button 
             onClick={() => setIsMenuOpen(false)}
             className="absolute top-8 right-8 p-3 hover:bg-secondary rounded-full transition-all active:scale-90"
           >
             <X className="w-6 h-6" strokeWidth={1} />
           </button>

           <div className="flex items-center gap-4 mb-20">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-indigo-500/40">
                <Image src="/logo.jpeg" alt="Logo" width={48} height={48} className="object-cover" />
              </div>
              <div>
                <p className="text-xl font-black tracking-widest text-foreground uppercase">AL-JAMAAL</p>
                <p className="text-[8px] font-bold text-indigo-600 tracking-[0.4em] uppercase">Art Collection</p>
              </div>
           </div>

           <div className="flex flex-col space-y-10 group/menu">
              {[
                { label: 'HOME', href: '/' },
                { label: 'WISHLIST', href: '/wishlist', count: wishlist.length },
                { label: 'CART', href: '/cart', count: cartCount },
                { label: 'ISLAMIC ART', href: '/#products' },
                { label: 'CUSTOM ORDER', href: '/#custom-order' }
              ].map((item) => (
                <Link 
                  key={item.label}
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center justify-between text-3xl font-black tracking-tighter text-foreground hover:text-indigo-600 transition-all duration-300 hover:translate-x-2"
                >
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-sm font-black bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center -translate-y-2">{item.count}</span>
                  )}
                </Link>
              ))}
              
              {isAdmin && (
                <Link 
                  href="/admin-secret" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-2xl font-black tracking-tighter text-indigo-600 border-t border-indigo-500/10 pt-10"
                >
                  STORE DASHBOARD
                </Link>
              )}
           </div>

           <div className="mt-auto pt-10 border-t border-border space-y-4">
              <p className="text-[10px] font-black text-muted tracking-widest uppercase">Location</p>
              <p className="text-sm font-bold text-foreground">Islamabad, Pakistan</p>
              <div className="flex gap-4 pt-4">
                 {/* Placeholder for social luxury icons */}
                 <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black">FB</div>
                 <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black">IG</div>
                 <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black">WA</div>
              </div>
           </div>
         </div>
      </div>
    </nav>
  );
}
