"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search, Plus, Filter, Package, Loader2 } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";
import { createClient } from "@/utils/supabase/client";

const PRODUCT_IMAGES: Record<string, string> = {
  'Salmon Nigiri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Salmon_Nigiri.jpg/320px-Salmon_Nigiri.jpg',
  'Tuna Sashimi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sashimi_Maguro.jpg/320px-Sashimi_Maguro.jpg',
  'Spicy Tuna Roll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spicy_tuna_roll.jpg/320px-Spicy_tuna_roll.jpg',
  'California Roll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/California_roll_1.jpg/320px-California_roll_1.jpg',
  'Miso Soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Miso_soup_by_fotoosvanrobin_in_Aki_Restaurant%2C_Amsterdam.jpg/320px-Miso_soup_by_fotoosvanrobin_in_Aki_Restaurant%2C_Amsterdam.jpg',
  'Edamame': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Edamame_by_G_Saito.jpg/320px-Edamame_by_G_Saito.jpg',
  'Ocha Dingin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Iced_green_tea.jpg/320px-Iced_green_tea.jpg',
  'Matcha Ice Cream': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Matcha_ice_cream.jpg/320px-Matcha_ice_cream.jpg',
};

const CATEGORY_IMAGES: Record<string, string> = {
  'Sushi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/320px-Sushi_platter.jpg',
  'Sashimi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sashimi_3.jpg/320px-Sashimi_3.jpg',
  'Appetizer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Appetizer_plate.jpg/320px-Appetizer_plate.jpg',
  'Minuman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Iced_tea.jpg/320px-Iced_tea.jpg',
  'Dessert': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Japanese_dessert.jpg/320px-Japanese_dessert.jpg',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select(`*`);
          
        if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 p-8 overflow-y-auto relative">
        <ChatWidget />
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Produk</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola katalog menu dan inventori</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama produk..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 text-sm hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <p className="text-sm font-medium">Memuat data...</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga Jual</th>
                    <th className="px-6 py-4">Stok (Tersedia)</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
                          <img 
                            src={PRODUCT_IMAGES[p.name] || CATEGORY_IMAGES[p.category] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Bento_in_a_Japanese_restaurant.jpg/320px-Bento_in_a_Japanese_restaurant.jpg'} 
                            alt={p.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-700">{p.name}</div>
                          <div className="text-xs text-slate-400">ID: {p.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{p.category}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">Rp {p.price?.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-emerald-600 font-medium">{p.stock} Unit</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Edit</button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                     <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Tidak ada data produk ditemukan.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
