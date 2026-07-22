"use client";

import { useState, useEffect } from "react";
import {
  Search, Plus, Filter, Users, UserPlus, UserCheck, Star, 
  MoreHorizontal, Phone, Mail, RotateCcw, ChevronDown, 
  LayoutDashboard, ShoppingCart, FileText, Package, Bot, 
  Settings, Bell, Crown, Mail as MailIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navItems = [
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

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.phone && c.phone.includes(searchQuery))
  );

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
                    <select className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm">
                      <option>Status</option>
                      <option>Semua Status</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm">
                      <option>Membership</option>
                      <option>Semua Tier</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[13px] rounded-xl hover:bg-slate-50 transition-colors shadow-sm ml-auto font-medium">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
                  </button>

                  <button 
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
                              <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
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

              {/* Right Sidebar - Detail Pelanggan */}
              <div className="w-[320px] flex-shrink-0 flex flex-col gap-6">
                
                {/* Profile Detail Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                  <div className="w-full flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-[14px]">Detail Pelanggan</h3>
                    <button className="text-slate-400 hover:bg-slate-50 p-1 rounded-md">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" 
                    alt="Budi Santoso" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 mb-3"
                  />
                  
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[18px] font-bold text-slate-800">Budi Santoso</h2>
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">Platinum</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-5">Pelanggan sejak 12 Jan 2023</p>

                  <div className="w-full flex flex-col gap-2.5 mb-6">
                    <div className="flex items-center gap-3 text-[12px] text-slate-600 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      0812-3456-7890
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-slate-600 font-medium">
                      <MailIcon className="w-3.5 h-3.5 text-slate-400" />
                      budi.santoso@email.com
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-3 mb-6 pt-5 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                        <ShoppingCart className="w-3.5 h-3.5" /> Total Belanja
                      </div>
                      <span className="font-bold text-[13px] text-slate-800">Rp 18.450.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                        <Star className="w-3.5 h-3.5 text-amber-500" /> Poin Loyalitas
                      </div>
                      <span className="font-bold text-[13px] text-slate-800">24.150 poin</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                        <FileText className="w-3.5 h-3.5" /> Transaksi Terakhir
                      </div>
                      <span className="font-bold text-[12px] text-slate-800">17 Jul 2026, 10:30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                        <LayoutDashboard className="w-3.5 h-3.5" /> Status
                      </div>
                      <span className="font-bold text-[12px] text-emerald-600">Aktif</span>
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    <button className="w-full py-2.5 bg-violet-600 text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors shadow-sm">
                      <Search className="w-4 h-4" /> Lihat Detail
                    </button>
                    <button className="w-full py-2.5 bg-white border border-violet-200 text-violet-600 font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 hover:bg-violet-50 transition-colors">
                      <Mail className="w-4 h-4" /> Kirim Promo
                    </button>
                  </div>
                </div>

                {/* Insight Loyalitas Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-slate-800 text-[14px]">Insight Loyalitas</h3>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 cursor-pointer">
                      30 Hari Terakhir <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-500 mb-0.5">Transaksi</p>
                      <p className="text-xl font-bold text-slate-800">12</p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 9% dari periode lalu</p>
                    </div>
                    <div className="w-px bg-slate-100"></div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-500 mb-0.5">Poin Diperoleh</p>
                      <p className="text-xl font-bold text-slate-800">1.250</p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 14% dari periode lalu</p>
                    </div>
                  </div>

                  {/* Dummy Line Chart */}
                  <div className="w-full h-24 relative flex items-end justify-between px-2 pb-2">
                    {/* Simplified SVG Chart visual */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path d="M0,40 L0,20 Q10,10 20,25 T40,15 T60,25 T80,10 T100,15 L100,40 Z" fill="url(#grad)" opacity="0.5"/>
                      <path d="M0,20 Q10,10 20,25 T40,15 T60,25 T80,10 T100,15" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full z-10 -ml-1 mb-[50%] border-2 border-white"></div>
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full z-10 mb-[20%] border-2 border-white"></div>
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full z-10 mb-[40%] border-2 border-white"></div>
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full z-10 mb-[65%] border-2 border-white"></div>
                  </div>
                  
                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium px-1 mt-1">
                    <span>20 Jun</span>
                    <span>27 Jun</span>
                    <span>4 Jul</span>
                    <span>11 Jul</span>
                    <span>18 Jul</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
