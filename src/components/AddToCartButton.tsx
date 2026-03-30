'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`btn-primary flex flex-1 items-center justify-center gap-3 py-5 px-12 text-md font-black shadow-indigo-600/40 transition-all duration-300 ${
        isAdding ? 'bg-green-600 shadow-green-600/40 pointer-events-none' : ''
      }`}
    >
      {isAdding ? (
        <>
          PRODUCT ADDED! <ShoppingCart className="w-5 h-5 animate-bounce" />
        </>
      ) : (
        <>
          ADD TO CART <ShoppingCart className="w-5 h-5" />
        </>
      )}
    </button>
  );
}
