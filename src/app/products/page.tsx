"use client";

import { useState, useEffect } from "react";
import {
  Search, Plus, Filter, Package, Loader2, X, LayoutDashboard,
  ShoppingCart, FileText, Users, Bot, Settings, Bell, ChevronDown,
  Crown, Edit2, Trash2, MoreVertical
, Home
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { label: "Beranda", icon: Home, href: "/" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Kasir", icon: ShoppingCart, href: "/pos" },
  { label: "Transaksi", icon: FileText, href: "/transactions" },
  { label: "Produk", icon: Package, href: "/products", active: true },
  { label: "Pelanggan", icon: Users, href: "/customers" },
  { label: "Chatbot AI", icon: Bot, href: "/chatbot" },
  { label: "Pengaturan", icon: Settings, href: "/settings" },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Makanan");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select(`*`)
          .order('name', { ascending: true });
          
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice || !newStock) return;
    
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name: newName, 
          category: newCategory, 
          price: parseInt(newPrice),
          stock: parseInt(newStock)
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setProducts(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        setIsModalOpen(false);
        setNewName("");
        setNewCategory("Makanan");
        setNewPrice("");
        setNewStock("");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Gagal menambahkan produk.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (product: any) => {
    setEditId(product.id);
    setEditName(product.name);
    setEditCategory(product.category || "Makanan");
    setEditPrice(product.price?.toString() || "0");
    setEditStock(product.stock?.toString() || "0");
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPrice || !editStock || !editId) return;
    
    setIsUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .update({ 
          name: editName, 
          category: editCategory, 
          price: parseInt(editPrice),
          stock: parseInt(editStock)
        })
        .eq('id', editId);
        
      if (error) throw error;
      
      setProducts(prev => prev.map(p => 
        p.id === editId 
          ? { ...p, name: editName, category: editCategory, price: parseInt(editPrice), stock: parseInt(editStock) }
          : p
      ));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Gagal memperbarui produk.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden text-slate-800" style={{ background: "#fcfcfd" }}>
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col h-full z-20"
        style={{ background: "linear-gradient(180deg, #1a1150 0%, #231860 40%, #2d1f7e 100%)" }}>
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="font-black text-xl text-violet-700 tracking-tighter">K</span>
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-tight">Kasir Pintar</p>
            <p className="text-purple-300 text-[10px] mt-0.5 leading-none">Sistem Kasir Modern</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                item.active 
                  ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-900/50" 
                  : "text-purple-200 hover:bg-white/10 hover:text-white"
              }`}>
              <item.icon className="w-5 h-5 flex-shrink-0 opacity-90" />
              <span className="font-medium text-[13px] tracking-wide">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <div className="bg-[#241762] rounded-2xl p-4 border border-white/5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-400/20 blur-xl rounded-full"></div>
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <p className="text-white text-xs font-bold">Kasir Pintar Premium</p>
            </div>
            <p className="text-purple-200 text-[10px] mb-3">Aktif hingga 30 Nov 2025</p>
            <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-semibold py-2 px-3 rounded-xl transition-colors">
              Kelola Langganan
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-purple-300" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex-1">
             <h1 className="text-xl font-bold text-slate-800">Manajemen Produk</h1>
             <p className="text-[13px] text-slate-500">Kelola katalog menu, harga, dan stok inventori</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari nama produk atau kategori..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-400" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="bg-white border border-slate-200 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">⌘</span>
                <span className="bg-white border border-slate-200 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">K</span>
              </div>
            </div>
            
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-4 h-4 bg-violet-600 rounded-full border-2 border-white text-white text-[8px] font-bold flex items-center justify-center">3</span>
            </button>
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogout}>
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-slate-700">Andi Pratama</p>
                <p className="text-[11px] text-slate-500">Owner</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Andi+Pratama&background=6d28d9&color=fff" alt="User" className="w-9 h-9 rounded-full shadow-sm" />
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col p-8 overflow-hidden">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                <Filter className="w-4 h-4" /> Semua Kategori
              </button>
              <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                Urutkan: Nama (A-Z) <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm shadow-violet-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Produk
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Produk</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Harga Jual</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                          <p className="text-sm">Memuat data produk...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600">Tidak ada produk ditemukan</p>
                        <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 border border-violet-100">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-800">{p.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {p.id?.toString().substring(0,8)}...</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                            {p.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm text-slate-800">
                          Rp {p.price?.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium text-slate-700">{p.stock} Unit</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {p.stock > 0 ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Tersedia</span>
                          ) : (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">Habis</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(p)}
                              className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Placeholder */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <span className="text-[12px] text-slate-500 font-medium">Menampilkan {filteredProducts.length} produk</span>
            </div>
          </div>
        </div>

        {/* Modal Tambah Produk */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Tambah Produk Baru</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Nama Produk *</label>
                    <input 
                      type="text" 
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                      placeholder="Contoh: Kopi Americano"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Kategori</label>
                    <div className="relative">
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                      >
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Snack">Snack</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Harga Jual (Rp) *</label>
                      <input 
                        type="number" 
                        required min="0"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Stok Awal *</label>
                      <input 
                        type="number" 
                        required min="0"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors disabled:opacity-70 shadow-sm flex items-center justify-center min-w-[120px]"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Produk'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Produk */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Edit Produk</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Nama Produk *</label>
                    <input 
                      type="text" 
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Kategori</label>
                    <div className="relative">
                      <select 
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                      >
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Snack">Snack</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Harga Jual (Rp) *</label>
                      <input 
                        type="number" 
                        required min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Stok Tersedia *</label>
                      <input 
                        type="number" 
                        required min="0"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors disabled:opacity-70 shadow-sm flex items-center justify-center min-w-[120px]"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
