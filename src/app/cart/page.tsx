'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-8 animate-in fade-in slide-in-from-bottom-6">
        <div className="mx-auto w-32 h-32 bg-secondary rounded-full flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900/30">
          <ShoppingBag className="w-16 h-16 text-indigo-600" />
        </div>
        <h1 className="text-5xl font-black text-foreground tracking-tighter">OUR CART IS EMPTY</h1>
        <p className="text-muted text-lg max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added anything to your cart yet. Let's start shopping!
        </p>
        <Link href="/" className="btn-primary inline-flex mt-4 items-center gap-2 px-12 py-5 text-lg shadow-indigo-600/30">
          EXPLORE COLLECTION <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-6xl font-black text-foreground mb-12 tracking-tighter">SHOPPING <span className="text-indigo-600">CART</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-10 p-8 glass rounded-3xl border border-border shadow-lg group hover:bg-white dark:hover:bg-card-bg hover:shadow-xl transition-all duration-300">
              <div 
                className="relative w-40 h-40 rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer"
                onClick={() => setSelectedImage(item.image)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="flex-grow flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black text-foreground leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-black text-indigo-600">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t mt-4 border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1 bg-secondary/80 p-1.5 rounded-2xl border">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-3 bg-white text-foreground rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-black/5 active:scale-90"
                    >
                      <Minus className="w-5 h-5 text-indigo-600" />
                    </button>
                    <span className="w-16 text-center font-black text-xl text-indigo-600">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 active:scale-90 border-2 border-transparent hover:border-red-100"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 h-fit sticky top-32 p-10 glass rounded-3xl border border-border flex flex-col space-y-8 shadow-2xl overflow-hidden">
          <h2 className="text-3xl font-black text-foreground tracking-tighter pb-4 border-b">SUMMARY</h2>
          
          <div className="space-y-4 text-lg font-medium">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="text-foreground">Rs. {getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span className="text-green-600 font-bold tracking-widest text-sm uppercase">FREE</span>
            </div>
          </div>

          <div className="pt-8 border-t flex justify-between items-center group">
            <span className="text-2xl font-black text-foreground tracking-tighter">TOTAL</span>
            <span className="text-4xl font-black text-indigo-600 group-hover:scale-105 transition-transform duration-500">Rs. {getCartTotal().toLocaleString()}</span>
          </div>

          <Link
            href="/checkout"
            className="btn-primary w-full py-6 text-lg tracking-widest font-black shadow-indigo-600/40 flex items-center justify-center gap-3"
          >
            SECURE CHECKOUT <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-center text-xs text-muted font-bold tracking-widest pt-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 100% SECURE TRANSACTIONS
          </p>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in transition-all" onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-xl backdrop-blur-md border border-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh] rounded-[40px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <Image src={selectedImage} alt="Full scale product view" fill className="object-contain" priority />
          </div>
        </div>
      )}
    </div>
  );
}
