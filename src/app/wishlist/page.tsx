'use client';

import { useCart } from '@/context/CartContext';
import { getProducts } from '@/lib/data';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setIsLoaded(true);
      });
  }, []);

  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h3 className="text-3xl font-black text-muted tracking-tighter uppercase">LOADING YOUR COLLECTION...</h3>
      </div>
    );
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-10 animate-in fade-in slide-in-from-bottom-8">
        <div className="mx-auto w-32 h-32 bg-secondary rounded-full flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900/30">
          <Heart className="w-16 h-16 text-indigo-600 animate-pulse" />
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase">YOUR <span className="text-red-500">WISHLIST</span> IS EMPTY</h1>
          <p className="text-muted text-lg max-w-sm mx-auto leading-relaxed">
            Save your favorite premium items here to keep an eye on them for later.
          </p>
        </div>
        <Link href="/" className="btn-primary inline-flex mt-4 items-center gap-3 px-10 py-5 text-lg shadow-red-500/20 bg-red-500 hover:bg-black group">
          EXPLORE COLLECTION <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-in fade-in slide-in-from-top-6">
      <div className="space-y-2 border-b pb-12">
        <h1 className="text-7xl font-black text-foreground tracking-tighter uppercase mb-2">MY <span className="text-red-500">WISHLIST</span></h1>
        <p className="text-muted font-bold tracking-[0.2em] text-xs uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {wishlistedProducts.length} PREMIUM ITEMS SAVED
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
