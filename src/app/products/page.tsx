"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search, Plus, Filter, Package, Loader2, X } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";
import { createClient } from "@/utils/supabase/client";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Sushi");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Sushi");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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
        setProducts(prev => [...prev, data[0]]);
        setIsModalOpen(false);
        setNewName("");
        setNewCategory("Sushi");
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
    setEditCategory(product.category || "Sushi");
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
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 p-8 overflow-y-auto relative">
        <ChatWidget />
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Produk</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola katalog menu dan inventori</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
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
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
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
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                        >
                          Edit
                        </button>
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

        {/* Modal Tambah Produk */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Tambah Produk Baru</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk *</label>
                    <input 
                      type="text" 
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Masukkan nama produk"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Sushi">Sushi</option>
                      <option value="Sashimi">Sashimi</option>
                      <option value="Appetizer">Appetizer</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual (Rp) *</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stok Awal *</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Produk */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Edit Produk</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk *</label>
                    <input 
                      type="text" 
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                    <select 
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Sushi">Sushi</option>
                      <option value="Sashimi">Sashimi</option>
                      <option value="Appetizer">Appetizer</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual (Rp) *</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stok Tersedia *</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
