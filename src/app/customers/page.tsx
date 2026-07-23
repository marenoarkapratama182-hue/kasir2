"use client";

import { useState, useEffect } from "react";
import {
  Search, Plus, Filter, Users, UserPlus, UserCheck, Star, 
  MoreHorizontal, Phone, Mail, RotateCcw, ChevronDown, 
  LayoutDashboard, ShoppingCart, FileText, Package, Bot, 
  Settings, Bell, Crown, Mail as MailIcon, X, Home, Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { label: "Beranda", icon: Home, href: "/" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Kasir", icon: ShoppingCart, href: "/pos" },
  { label: "Transaksi", icon: FileText, href: "/transactions" },
  { label: "Produk", icon: Package, href: "/products" },
  { label: "Pelanggan", icon: Users, href: "/customers", active: true },
  { label: "Chatbot AI", icon: Bot, href: "/chatbot" },
  { label: "Pengaturan", icon: Settings, href: "/settings" },
];

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [filterTier, setFilterTier] = useState("Semua Tier");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('name');
          
        if (data) {
          // Enhance with dummy data for UI completion if real data is simple
          const enhanced = data.map((c, i) => {
            const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Member'];
            const tier = i === 0 ? 'Platinum' : i === 1 ? 'Gold' : i < 4 ? 'Silver' : i < 6 ? 'Bronze' : 'Member';
            
            return {
              ...c,
              id_display: `CUST-${(i + 1).toString().padStart(4, '0')}`,
              email: `${c.name.split(' ')[0].toLowerCase()}@email.com`,
              tier: tier,
              total_transactions: Math.floor(Math.random() * 20000000),
              status: i === 7 ? 'Nonaktif' : 'Aktif',
            }
          });
          setCustomers(enhanced);
        }
      } catch (err) {
        console.error("Error loading customers:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadCustomers();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSaveCustomer = async () => {
    if (!newName) return;
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('customers')
        .insert([{ name: newName, phone: newPhone }])
        .select();
        
      if (!error && data) {
        setNewName("");
        setNewPhone("");
        setIsModalOpen(false);
        window.location.reload();
      } else {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (!error) {
        setCustomers(prev => prev.filter(c => c.id !== id));
      } else {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone && c.phone.includes(searchQuery));
    const matchStatus = filterStatus === "Semua Status" || c.status === filterStatus;
    const matchTier = filterTier === "Semua Tier" || c.tier === filterTier;
    return matchSearch && matchStatus && matchTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Gold': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Silver': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Bronze': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
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


      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex-1">
             <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari menu, transaksi, laporan..." 
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-400" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="bg-white border border-slate-200 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">⌘</span>
                <span className="bg-white border border-slate-200 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">K</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pb-12">
            
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pelanggan</h1>
              <p className="text-slate-500 text-[13px] mt-1">Kelola data pelanggan dan loyalitas</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 mb-0.5">Total Pelanggan</p>
                    <p className="text-2xl font-bold text-slate-800">1.248</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="text-emerald-500">↑</span> 8,2% dari bulan lalu
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 mb-0.5">Pelanggan Baru</p>
                    <p className="text-2xl font-bold text-slate-800">86</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="text-emerald-500">↑</span> 15,6% dari bulan lalu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 mb-0.5">Pelanggan Aktif</p>
                    <p className="text-2xl font-bold text-slate-800">742</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="text-emerald-500">↑</span> 6,1% dari bulan lalu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 mb-0.5">Total Poin Loyalitas</p>
                    <p className="text-2xl font-bold text-slate-800">286.420</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="text-emerald-500">↑</span> 9,7% dari bulan lalu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              {/* Main Content (Table) */}
              <div className="flex-1 flex flex-col">
                
                {/* Filters */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari nama, email, atau no. telepon..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-violet-500 shadow-sm"
                    />
                  </div>

                  <div className="relative">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm"
                    >
                      <option value="Semua Status">Semua Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select 
                      value={filterTier}
                      onChange={(e) => setFilterTier(e.target.value)}
                      className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm"
                    >
                      <option value="Semua Tier">Semua Tier</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Bronze">Bronze</option>
                      <option value="Member">Member</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <button 
                    onClick={() => { setSearchQuery(""); setFilterStatus("Semua Status"); setFilterTier("Semua Tier"); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[13px] rounded-xl hover:bg-slate-50 transition-colors shadow-sm ml-auto font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
                  </button>

                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-[13px] rounded-xl font-medium shadow-sm hover:bg-violet-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Tambah Pelanggan
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">ID Pelanggan</th>
                          <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                          <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                          <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tier</th>
                          <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Transaksi</th>
                          <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Poin</th>
                          <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.map((c, i) => (
                          <tr key={i} className={`hover:bg-slate-50/50 transition-colors ${i === 0 ? 'bg-violet-50/30' : ''}`}>
                            <td className="px-5 py-4 text-[13px] font-semibold text-slate-700">{c.id_display}</td>
                            <td className="px-5 py-4 text-[13px] font-bold text-slate-800">{c.name}</td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[12px] font-medium text-slate-700">{c.phone || "0812-3456-7890"}</span>
                                <span className="text-[11px] text-slate-400">{c.email}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getTierColor(c.tier)}`}>
                                {c.tier}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-[13px] font-semibold text-slate-700">Rp {(c.total_transactions || 0).toLocaleString('id-ID')}</td>
                            <td className="px-5 py-4 text-[13px] font-semibold text-slate-700">{(c.point || 0).toLocaleString('id-ID')}</td>
                            <td className="px-5 py-4">
                              <span className={`text-[12px] font-bold ${c.status === 'Aktif' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button 
                                onClick={() => handleDeleteCustomer(c.id)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Pelanggan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination footer */}
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[12px] text-slate-500 font-medium">Menampilkan 1 - 8 dari 1.248 pelanggan</p>
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 bg-white shadow-sm hover:bg-slate-50">
                        {'<'}
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-bold text-[13px] flex items-center justify-center">1</button>
                      <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium text-[13px] flex items-center justify-center hover:bg-slate-50">2</button>
                      <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium text-[13px] flex items-center justify-center hover:bg-slate-50">3</button>
                      <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">...</span>
                      <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium text-[13px] flex items-center justify-center hover:bg-slate-50">156</button>
                      <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 bg-white shadow-sm hover:bg-slate-50">
                        {'>'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Tambah Pelanggan Baru</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">No. Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveCustomer}
                disabled={!newName || isSaving}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? "Menyimpan..." : "Simpan Pelanggan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
