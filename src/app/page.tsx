import { getProducts } from '@/lib/data';
import { ProductCard, HeroSection, CustomOrder } from '@/components';
import { Search, Filter, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const allProducts = await getProducts();
  const query = searchParams.q?.toLowerCase() || '';
  const categoryFilter = searchParams.category || '';

  const filteredProducts = allProducts.filter((product) => {
    const matchesQuery = product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesQuery && matchesCategory;
  });

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Filters and Search */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
              !categoryFilter 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
              : 'bg-transparent text-muted hover:border-indigo-600 hover:text-indigo-600'
            }`}
          >
            All Products
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`?category=${cat}`}
              className={`px-6 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
                categoryFilter === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                : 'bg-transparent text-muted hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        <form action="/" className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 transition-all text-sm outline-none"
          />
        </form>
      </section>

      {/* Product Grid */}
      <section id="products">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6">
            <h3 className="text-3xl font-black text-muted tracking-tighter">NO PRODUCTS FOUND</h3>
            <p className="text-muted">Try adjusting your search or filters to find what you're looking for.</p>
            <a href="/" className="btn-secondary inline-block">CLEAR ALL FILTERS</a>
          </div>
        )}
      </section>
      {/* Custom Order Section */}
      <CustomOrder />
    </div>
  );
}
