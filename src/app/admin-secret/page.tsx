'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, Edit2, ShoppingBag, List, Package, 
  TrendingUp, Search, PlusCircle, X, Check, Settings, 
  ShieldCheck, BarChart3, LayoutDashboard, Database,
  Eye, MonitorDot, History, ArrowUpRight, BadgeCheck
} from 'lucide-react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [heroImageSrc, setHeroImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImageSrc, setProductImageSrc] = useState<string | null>(null);
  const [productCrop, setProductCrop] = useState({ x: 0, y: 0 });
  const [productZoom, setProductZoom] = useState(1);
  const [productCroppedAreaPixels, setProductCroppedAreaPixels] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0,
  });

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }
    fetchProducts();
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error("Fetch failed", e);
    }
  };

  const handleOpenModal = (product?: Product) => {
    setProductImageSrc(null);
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({ title: '', description: '', price: 0, image: '', category: '', stock: 0 });
    }
    setIsModalOpen(true);
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onProductCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setProductCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Canvas empty')); return; }
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = formData.image || '/images/box-1.jpeg';
    if (productImageSrc && productCroppedAreaPixels) {
      try {
        const croppedBlob = await getCroppedImg(productImageSrc, productCroppedAreaPixels);
        const file = new File([croppedBlob], "product-cropped.jpg", { type: "image/jpeg" });
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          finalImageUrl = url;
        }
      } catch (err) { console.error(err); }
    }
    const payload = { ...formData, image: finalImageUrl };
    const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';
    const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { setIsModalOpen(false); fetchProducts(); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently remove this asset from the catalog?')) {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Delete this order from history?')) {
      const updatedOrders = orders.filter((o) => o.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const handleHeroUpdate = async () => {
    if (!heroImageSrc || !croppedAreaPixels) return;
    setIsUploadingHero(true);
    try {
      const croppedBlob = await getCroppedImg(heroImageSrc, croppedAreaPixels);
      const file = new File([croppedBlob], "hero-cropped.jpg", { type: "image/jpeg" });
      const uploadData = new FormData();
      uploadData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        localStorage.setItem('heroImage', url);
        alert('Store backdrop synchronized successfully.');
        setHeroImageSrc(null);
      }
    } catch (e) { console.error(e); }
    setIsUploadingHero(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Islamabad123@') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Security Breach: Authorization Failed.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] flex items-center justify-center p-6 selection:bg-indigo-500/10">
        <div className="w-full max-w-lg bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
           <div className="mx-auto w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 shadow-inner group transition-all">
              <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-500 group-hover:scale-110 transition-transform duration-700" strokeWidth={1.5} />
           </div>
           <div className="space-y-4">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Store <span className="text-indigo-600 italic font-serif lowercase tracking-normal">Dashboard</span></h1>
              <p className="text-gray-400 dark:text-gray-600 text-[10px] font-black tracking-[0.4em] uppercase">Manage your boutique archive</p>
           </div>
           <form onSubmit={handleLogin} className="space-y-6">
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entry Key" 
                className="w-full px-10 py-6 rounded-3xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:border-indigo-500 transition-all outline-none text-center font-black tracking-[0.4em] text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-800"
              />
              <button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-6 rounded-[2rem] font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-500 shadow-2xl shadow-indigo-500/30 active:scale-95">
                ACCESS DASHBOARD
              </button>
           </form>
        </div>
      </div>
    );
  }

  const totalSales = orders.reduce((total, order) => total + order.total, 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#020202] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/20">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 lg:space-y-16">
        
        {/* Gallery-Style Header */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-12 border-b border-gray-100 dark:border-white/5 pb-16">
          <div className="flex items-center gap-8">
             <div className="relative w-20 h-20 rounded-[2rem] overflow-hidden ring-4 ring-white dark:ring-white/5 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700">
                <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
             </div>
             <div className="space-y-2">
                <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase leading-none text-gray-900 dark:text-white whitespace-pre">
                   AL-JAMAAL <span className="text-indigo-600 italic font-serif lowercase tracking-normal">Dashboard</span>
                </h1>
                <div className="flex items-center gap-4">
                   <MonitorDot className="w-4 h-4 text-green-500 animate-pulse" />
                   <p className="text-[10px] font-black text-gray-500 dark:text-gray-600 tracking-[0.4em] uppercase">Management Center | Boutique v2.0</p>
                </div>
             </div>
          </div>
          
          <nav className="flex items-center gap-2 p-2 bg-white dark:bg-white/5 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/10">
            {[
              { id: 'products', label: 'INVENTORY', icon: <Database className="w-4 h-4" /> },
              { id: 'orders', label: 'ANALYTICS', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'settings', label: 'GLOBAL', icon: <LayoutDashboard className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-black text-[10px] tracking-[0.25em] transition-all duration-700 ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'text-gray-400 hover:text-indigo-600'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Minimal Stats Bar */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "TOTAL SALES", value: `Rs. ${totalSales.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-indigo-500" />, sub: "CUMULATIVE REVENUE" },
            { label: "ORDERS", value: orders.length, icon: <ShoppingBag className="w-5 h-5 text-indigo-500" />, sub: "TOTAL ORDERS PROCESSED" },
            { label: "PRODUCTS", value: products.length, icon: <Package className="w-5 h-5 text-indigo-500" />, sub: "ACTIVE COLLECTION COUNT" },
            { label: "SYSTEM STATUS", value: "OPTIMAL", icon: <BadgeCheck className="w-5 h-5 text-indigo-500" />, sub: "ENCRYPTED & SYNCED" },
          ].map((stat, i) => (
            <article key={i} className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 p-12 rounded-[3.5rem] shadow-lg hover:shadow-2xl transition-all duration-1000 group">
              <div className="flex justify-between items-start mb-10">
                 <div className="p-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-[1.5rem] text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">{stat.icon}</div>
                 <div className="text-right">
                    <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">{stat.label}</p>
                 </div>
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">{stat.value}</h2>
              <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">{stat.sub}</p>
            </article>
          ))}
        </section>

        {activeTab === 'products' && (
          <main className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-white dark:bg-[#0a0a0a] p-12 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl backdrop-blur-3xl">
                <div className="relative w-full lg:w-[600px] group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input placeholder="SEARCH PRODUCTS..." className="w-full pl-20 pr-10 py-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none text-[11px] font-black tracking-[0.3em] text-gray-900 dark:text-white transition-all" />
                </div>
                <button
                   onClick={() => handleOpenModal()}
                   className="w-full lg:w-auto bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-6 px-16 py-6 rounded-[2rem] text-[11px] font-black tracking-[0.4em] transition-all duration-700 shadow-2xl active:scale-95"
                >
                  ADD NEW PRODUCT <PlusCircle className="w-5 h-5" />
                </button>
             </div>

             <div className="grid grid-cols-1 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-[#0a0a0a] hover:bg-gray-50 dark:hover:bg-white/[0.03] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-12 transition-all duration-700 group">
                    <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 shadow-inner">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
                    </div>
                    <div className="flex-grow flex flex-col items-center md:flex-row md:items-center justify-between gap-12 w-full text-center md:text-left">
                       <div className="space-y-3">
                          <span className="text-[10px] font-black text-indigo-500 tracking-[0.5em] uppercase px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">{product.category}</span>
                          <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{product.title}</h3>
                       </div>
                       <div className="flex flex-wrap items-center justify-center gap-16">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">PRODUCT PRICE</p>
                             <p className="font-black text-2xl text-gray-900 dark:text-white font-serif italic">Rs. {product.price.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">STOCK LEVEL</p>
                             <div className="flex items-center gap-3">
                                <div className="h-1.5 w-16 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                   <div className={`h-full bg-indigo-600 rounded-full`} style={{ width: `${Math.min(product.stock * 5, 100)}%` }} />
                                </div>
                                <span className="font-black text-xl text-indigo-600">{product.stock}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <button onClick={() => handleOpenModal(product)} className="p-5 bg-white dark:bg-white/5 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-[1.5rem] transition-all border border-gray-100 dark:border-white/5 shadow-sm"><Edit2 className="w-5 h-5" /></button>
                             <button onClick={() => handleDelete(product.id)} className="p-5 bg-white dark:bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white rounded-[1.5rem] transition-all border border-gray-100 dark:border-white/5 shadow-sm"><Trash2 className="w-5 h-5" /></button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </main>
        )}

        {/* Analytic Orders View */}
        {activeTab === 'orders' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-1000">
             {orders.length === 0 ? (
               <div className="py-48 text-center bg-white dark:bg-[#0a0a0a] rounded-[5rem] border border-gray-100 dark:border-white/5 space-y-8">
                  <MonitorDot className="w-20 h-20 text-indigo-100 dark:text-white/5 mx-auto" strokeWidth={1} />
                  <p className="text-[12px] font-black text-gray-500 tracking-[0.5em] uppercase leading-none">Awaiting New Orders</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-12">
                 {orders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order: any) => (
                   <div key={order.id} className="bg-white dark:bg-[#0a0a0a] p-16 rounded-[5rem] shadow-2xl border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-700">
                      <div className="flex flex-col lg:flex-row items-start justify-between mb-16 pb-12 border-b border-gray-50 dark:border-white/5 gap-10">
                         <div className="space-y-6">
                            <span className="px-6 py-2 rounded-full bg-indigo-500/10 text-[9px] font-black text-indigo-500 tracking-[0.4em] uppercase">{new Date(order.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase">ORDER #{order.id.slice(-6)}</h3>
                         </div>
                         <div className="flex flex-wrap items-center gap-12">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mb-3">TOTAL AMOUNT</p>
                              <p className="text-6xl font-black text-gray-900 dark:text-white font-serif italic leading-none">Rs. {order.total.toLocaleString()}</p>
                           </div>
                           <button onClick={() => handleDeleteOrder(order.id)} className="p-8 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-white hover:bg-red-600 rounded-[2.5rem] border border-gray-100 dark:border-white/5 transition-all shadow-xl">
                              <Trash2 className="w-6 h-6" />
                           </button>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
                         {order.items.map((item: any) => (
                           <div key={item.id} className="space-y-6 p-6 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors">
                              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl grayscale group hover:grayscale-0 transition-all duration-[2s]">
                                 <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-center">
                                 <p className="text-[11px] font-black text-gray-900 dark:text-white line-clamp-1 uppercase tracking-wider">{item.title}</p>
                                 <p className="text-[10px] font-black text-indigo-500 mt-2">QTY: {item.quantity}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Visionary Settings */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-top-10 duration-1000 pb-40">
             <div className="bg-white dark:bg-[#0a0a0a] p-20 rounded-[6rem] border border-gray-100 dark:border-white/5 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-20 border-b border-gray-50 dark:border-white/5 pb-16">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(79,70,229,0.3)]"><Settings className="w-10 h-10 text-white" /></div>
                   <div className="text-center lg:text-left">
                      <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase mb-2">Store Settings</h3>
                      <p className="text-[12px] font-black text-gray-400 tracking-[0.5em] uppercase">Calibrating Environmental Graphics</p>
                   </div>
                </div>
                
                <div className="max-w-5xl space-y-16">
                   <div className="bg-gray-50 dark:bg-white/[0.02] p-16 rounded-[4.5rem] border border-gray-100 dark:border-white/5 space-y-12">
                      <div className="space-y-4">
                         <div className="flex items-center gap-4 text-indigo-500"><span className="w-12 h-[1px] bg-indigo-500" /> <span className="text-[10px] font-black tracking-[0.5em] uppercase">GRAPHIC INTERFACE</span></div>
                         <h4 className="text-3xl font-black text-gray-900 dark:text-white">Store Entrance Banner</h4>
                         <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">Synchronize the high-resolution cinematic backdrop for the main gallery entrance. Native resolution: 21:9 Ultra-Wide.</p>
                      </div>

                      {!heroImageSrc ? (
                         <label className="flex flex-col items-center justify-center p-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[4rem] bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all cursor-pointer group">
                            <input type="file" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.addEventListener('load', () => setHeroImageSrc(reader.result?.toString() || null));
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                            }} className="hidden" />
                            <MonitorDot className="w-16 h-16 text-gray-200 dark:text-gray-800 group-hover:text-indigo-600 transition-colors mb-8" />
                            <p className="text-[11px] font-black text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white tracking-[0.5em] uppercase">UPLOAD NEW STORE BANNER</p>
                         </label>
                      ) : (
                         <div className="space-y-12">
                            <div className="relative w-full h-[500px] rounded-[5rem] overflow-hidden border border-gray-200 dark:border-white/10 ring-8 ring-white dark:ring-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                               <Cropper image={heroImageSrc} crop={crop} zoom={zoom} aspect={21 / 9} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                            </div>
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-6">
                               <div className="flex-grow w-full space-y-6">
                                  <div className="flex justify-between items-center px-4"><span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">MAGNIFICATION LOCK</span> <span className="text-lg font-black font-serif italic">{zoom.toFixed(1)}x</span></div>
                                  <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600" />
                               </div>
                               <div className="flex gap-6 w-full lg:w-auto">
                                  <button onClick={() => setHeroImageSrc(null)} className="px-12 py-6 rounded-[2.5rem] font-black text-[11px] tracking-[0.3em] uppercase text-gray-400 hover:text-red-500 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all shadow-xl">CANCEL</button>
                                  <button onClick={handleHeroUpdate} className="flex-grow lg:flex-grow-0 bg-indigo-600 text-white px-20 py-6 rounded-[2.5rem] text-[11px] font-black tracking-[0.4em] uppercase shadow-[0_25px_50px_rgba(79,70,229,0.3)] active:scale-95 transition-all">COMMIT CHANGE</button>
                               </div>
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Artistic Asset Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-white/40 dark:bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-5xl rounded-[6rem] border border-gray-200 dark:border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row overflow-hidden max-h-[90vh] relative animate-in zoom-in-95 duration-700">
               <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-6 bg-gray-50 dark:bg-white/5 hover:bg-red-500 text-gray-400 hover:text-white rounded-full transition-all active:scale-90 z-[130] shadow-2xl">
                 <X className="w-6 h-6" />
               </button>
               
               {/* Visual Side */}
               <div className="w-full lg:w-5/12 bg-gray-50 dark:bg-white/[0.02] p-20 flex flex-col justify-center gap-12 border-r border-gray-50 dark:border-white/5 overflow-y-auto overflow-x-hidden">
                   <div className="space-y-4">
                      <Eye className="w-12 h-12 text-indigo-100 dark:text-white/5" strokeWidth={1} />
                      <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">PRODUCT <br /> IMAGE</h3>
                      <p className="text-[11px] font-black text-gray-400 tracking-[0.5em] uppercase leading-none">Store Item Preview</p>
                   </div>

                   <div className="space-y-12">
                      {!productImageSrc ? (
                         <label className="relative flex flex-col items-center justify-center h-96 rounded-[4rem] bg-white dark:bg-transparent border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl group overflow-hidden">
                            <input type="file" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.addEventListener('load', () => setProductImageSrc(reader.result?.toString() || null));
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                            }} className="hidden" />
                            <LayoutDashboard className="w-16 h-16 text-gray-200 dark:text-gray-800 group-hover:text-indigo-600 transition-all" />
                            {formData.image && <img src={formData.image} className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />}
                         </label>
                      ) : (
                         <div className="space-y-10">
                            <div className="relative h-[450px] rounded-[4rem] overflow-hidden border border-gray-200 dark:border-white/10 ring-8 ring-white dark:ring-white/5 shadow-inner bg-black">
                               <Cropper image={productImageSrc} crop={productCrop} zoom={productZoom} aspect={4 / 5} onCropChange={setProductCrop} onCropComplete={onProductCropComplete} onZoomChange={setProductZoom} />
                            </div>
                            <div className="flex items-center gap-6">
                               <input type="range" value={productZoom} min={1} max={3} step={0.1} onChange={(e) => setProductZoom(parseFloat(e.target.value))} className="flex-grow h-1 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600" />
                               <button type="button" onClick={() => setProductImageSrc(null)} className="text-[12px] font-black text-red-500 tracking-[0.2em] uppercase">RESET</button>
                            </div>
                         </div>
                      )}
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">High-quality product images required. Portrait aspect (4:5) recommended.</p>
                   </div>
               </div>

               {/* Dossier Side */}
               <div className="w-full lg:w-7/12 p-24 overflow-y-auto space-y-16">
                  <div className="space-y-16">
                     <div className="space-y-3">
                        <span className="text-[10px] font-black text-indigo-500 tracking-[0.6em] uppercase">PRODUCT DETAILS</span>
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">{editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h2>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="space-y-10">
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">PRODUCT TITLE</label>
                              <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-10 py-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none text-2xl font-black text-gray-900 dark:text-white transition-all shadow-lg" />
                           </div>
                           <div className="grid grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">CLASSIFICATION</label>
                                 <input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-10 py-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-bold text-gray-900 dark:text-white shadow-lg" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">PRICE (PKR)</label>
                                 <input required type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-10 py-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-black text-gray-900 dark:text-white text-2xl shadow-lg" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">PRODUCT DESCRIPTION</label>
                              <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} className="w-full px-10 py-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-medium text-lg leading-relaxed text-gray-500 transition-all resize-none shadow-lg" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">STOCK QUANTITY</label>
                              <input required type="number" value={formData.stock || ''} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full px-10 py-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-black text-gray-900 dark:text-white text-2xl shadow-lg" />
                           </div>
                        </div>
                        <div className="pt-10">
                           <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-8 rounded-[2.5rem] text-[12px] font-black tracking-[0.5em] uppercase shadow-[0_25px_50px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-6">
                              {editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'} <Check className="w-6 h-6" strokeWidth={3} />
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
