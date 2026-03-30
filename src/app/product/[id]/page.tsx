import { getProductById, getProducts } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components';

export const dynamic = 'force-dynamic';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-24 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Product Image Section */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-border shadow-2xl bg-secondary/20">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700 pointer-events-none"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
             <span className="glass px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase text-foreground border border-white/20">
              {product.category}
            </span>
            {product.stock < 10 && (
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-red-400">
                ONLY {product.stock} LEFT
              </span>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-center space-y-10 group">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-foreground leading-none tracking-tighter">
              {product.title}
            </h1>
            <p className="text-3xl font-black text-indigo-600 tracking-tighter">
              Rs. {product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-lg text-muted leading-relaxed max-w-xl font-medium">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <AddToCartButton product={product} />
            <button className="btn-secondary flex items-center justify-center gap-2 py-4 px-10 border-2">
              WISHLIST <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t pt-10">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-all duration-300">
              <Truck className="w-8 h-8 text-indigo-600" />
              <div>
                <h4 className="font-bold text-sm">Fast Delivery</h4>
                <p className="text-xs text-muted leading-relaxed">2-3 business days delivery worldwide.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-all duration-300">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              <div>
                <h4 className="font-bold text-sm">Secure Payment</h4>
                <p className="text-xs text-muted leading-relaxed">Protected by state-of-the-art encryption.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-all duration-300">
              <RefreshCcw className="w-8 h-8 text-indigo-600" />
              <div>
                <h4 className="font-bold text-sm">Easy Returns</h4>
                <p className="text-xs text-muted leading-relaxed">30-day hassle-free return policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional: Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.title} | AESTHETIQ Store`,
    description: product.description,
  };
}
