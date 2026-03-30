'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight, Mail, Package, ChevronRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-12 animate-in fade-in slide-in-from-bottom-12">
      {/* Success Animation Container */}
      <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-20" />
        <div className="absolute inset-0 bg-indigo-600/10 rounded-full border-4 border-indigo-600 scale-110" />
        <CheckCircle2 className="w-16 h-16 text-indigo-600 transition-transform hover:scale-110 duration-500" />
      </div>

      <div className="space-y-4">
        <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">ORDER <span className="text-indigo-600">SUCCESS!</span></h1>
        <p className="text-xl text-muted font-medium max-w-xl mx-auto leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully and is being processed.
        </p>
      </div>

      <div className="glass p-10 rounded-[40px] border border-border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-left space-y-3">
          <span className="text-xs font-black tracking-widest text-muted uppercase">OFFICIAL ORDER ID</span>
          <h2 className="text-2xl font-black text-indigo-600 tracking-tighter bg-indigo-50 dark:bg-indigo-900/40 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            {orderId || 'ORD-XYZ123'}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4 p-5 bg-secondary/50 rounded-3xl border border-border group hover:bg-white transition-all">
            <Mail className="w-8 h-8 text-indigo-500" />
            <div className="text-left">
              <h4 className="font-bold text-sm">EMAIL SENT</h4>
              <p className="text-[10px] text-muted font-black tracking-widest uppercase mt-1">CHECK INBOX</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-secondary/50 rounded-3xl border border-border group hover:bg-white transition-all">
            <Package className="w-8 h-8 text-indigo-500" />
            <div className="text-left">
              <h4 className="font-bold text-sm">PROCESSING</h4>
              <p className="text-[10px] text-muted font-black tracking-widest uppercase mt-1">24 HOURS</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 border-t">
        <a 
          href="https://ig.me/m/calligraphy_art_244"
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary flex items-center gap-3 px-12 py-6 text-xl shadow-indigo-600/30 group animate-bounce-slow"
        >
          COMPLETE VIA INSTAGRAM <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </a>
        <Link 
          href="/" 
          className="btn-secondary flex items-center gap-2 px-10 py-5 text-lg border-2"
        >
          CONTINUE SHOPPING <ShoppingBag className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-3xl font-black tracking-tighter">LOADING RECEIPT...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
