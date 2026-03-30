'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, Lock, CreditCard, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Save order strictly for admin records
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    currentOrders.push({
      id: orderId,
      items: cart,
      total: getCartTotal(),
      date: new Date().toISOString(),
    });
    localStorage.setItem('orders', JSON.stringify(currentOrders));
    
    clearCart();
    // Redirect to the professional success page for order confirmation
    router.push(`/checkout/success?id=${orderId}`);
  };

  if (cart.length === 0 && !isProcessing) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-6xl font-black text-foreground mb-12 tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
        CHECK<span className="text-indigo-600">OUT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Checkout Form */}
        <div className="space-y-12">
          <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-left-6">
            <div className="space-y-8 glass p-10 rounded-3xl border border-border">
              <h3 className="text-3xl font-black flex items-center gap-4 tracking-tighter">
                <Truck className="w-8 h-8 text-indigo-600" /> SHIPPING DETAILS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black tracking-widest text-muted uppercase">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-foreground outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black tracking-widest text-muted uppercase">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-foreground outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black tracking-widest text-muted uppercase">Shipping Address</label>
                <input required type="text" placeholder="123 Luxury Lane" className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-foreground outline-none transition-all" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                  <label className="text-sm font-black tracking-widest text-muted uppercase">City</label>
                  <input required type="text" placeholder="New York" className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-foreground outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black tracking-widest text-muted uppercase">Postcode</label>
                  <input required type="text" placeholder="10001" className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-foreground outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black tracking-widest text-muted uppercase">Phone</label>
                  <input required type="tel" placeholder="+1..." className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-foreground outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-8 glass p-10 rounded-3xl border border-border opacity-50 pointer-events-none grayscale">
              <h3 className="text-3xl font-black flex items-center gap-4 tracking-tighter">
                <CreditCard className="w-8 h-8 text-indigo-600" /> PAYMENT (MOCK)
              </h3>
              <p className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
                <Lock className="w-5 h-5" /> This is a simulation. No real payment is required.
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`btn-primary w-full py-8 text-xl font-black tracking-widest flex items-center justify-center gap-4 shadow-indigo-600/40 ${
                isProcessing ? 'animate-pulse' : ''
              }`}
            >
              {isProcessing ? 'PROCESSING ORDER...' : 'PLACE ORDER NOW'} <ArrowRight className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Order Review Sidebar */}
        <div className="space-y-10 lg:sticky lg:top-32 h-fit animate-in fade-in slide-in-from-right-6 transition-all">
          <div className="glass p-12 rounded-[40px] border border-border shadow-2xl space-y-8">
            <h3 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis border-b pb-6">ORDER REVIEW</h3>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-6 group">
                  <div className="relative w-20 h-20 bg-secondary rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-muted font-black tracking-widest mt-1">QTY: {item.quantity}</p>
                  </div>
                  <p className="font-black text-indigo-600">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t space-y-4">
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted">
                <span>SUBTOTAL</span>
                <span className="text-foreground">Rs. {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted">
                <span>ESTIMATED TAX</span>
                <span className="text-foreground">Rs. 0</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-2xl font-black tracking-tighter">TOTAL</span>
                <span className="text-4xl font-black text-indigo-600">Rs. {getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-10 border-t pt-8">
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-2xl border">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <span className="text-[10px] font-black uppercase text-muted tracking-widest">SECURE</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-2xl border">
                <Truck className="w-6 h-6 text-indigo-600" />
                <span className="text-[10px] font-black uppercase text-muted tracking-widest">FREE SHIP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
