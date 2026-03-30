import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components";
import Image from "next/image";
import { Camera, Mail, Phone, Video, MapPin } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AL-JAMAAL ART | Premium Calligraphy",
  description: "Experience premium shopping with our curated collection of islamic art and calligraphy items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`} suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-24 pb-12">
            {children}
          </main>
          <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 border-none">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
              {/* Brand Section */}
              <div className="md:col-span-5 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                    <Image src="/logo.jpeg" alt="AL-JAMAAL Art Logo" fill className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-[0.2em] uppercase">AL-JAMAAL <span className="text-indigo-500">ART</span></h3>
                    <div className="h-0.5 w-12 bg-indigo-600 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-medium">
                  The ultimate destination for premium Islamic calligraphy and canvas art. We blend centuries-old spirituality with modern luxury design.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://www.instagram.com/calligraphy_art_244/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 group">
                    <Camera className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </a>
                  <a href="https://www.tiktok.com/@calligraphy_art_244" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 group">
                    <Video className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </a>
                </div>
              </div>

              {/* Navigation Section */}
              <div className="md:col-span-3 space-y-8">
                <h4 className="text-xs font-black tracking-[0.3em] uppercase text-indigo-500">QUICK LINKS</h4>
                <ul className="text-sm space-y-4 text-gray-400 font-bold tracking-wider">
                  <li><a href="/" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></div> HOME</a></li>
                  <li><a href="/wishlist" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></div> WISHLIST</a></li>
                  <li><a href="/cart" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></div> SHOPPING CART</a></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="md:col-span-4 space-y-8">
                <h4 className="text-xs font-black tracking-[0.3em] uppercase text-indigo-500">BOUTIQUE OFFICE</h4>
                <ul className="text-sm space-y-5 text-gray-400 font-medium">
                  <li className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 mt-1"><MapPin className="w-4 h-4 text-indigo-500" /></div>
                    <span className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">Islamabad, Pakistan</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Main Headquarters</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 mt-1"><Phone className="w-4 h-4 text-indigo-500" /></div>
                    <span className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">+92 300 1234567</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">WhatsApp Available</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 mt-1"><Mail className="w-4 h-4 text-indigo-500" /></div>
                    <span className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">info@aljamaalart.com</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Support Email</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
                © {new Date().getFullYear()} AL-JAMAAL ART COLLECTION. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
