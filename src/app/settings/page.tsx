"use client";

import { useState, useEffect } from "react";
import {
  Search, LayoutDashboard, ShoppingCart, FileText, Package, Users,
  BarChart2, Bot, Settings, Bell, ChevronDown, Store, Receipt, 
  Wallet, Shield, Upload, Info, RotateCcw, Save, Crown, MoreHorizontal, Loader2
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
  { label: "Produk", icon: Package, href: "/products" },
  { label: "Pelanggan", icon: Users, href: "/customers" },
  { label: "Chatbot AI", icon: Bot, href: "/chatbot" },
  { label: "Pengaturan", icon: Settings, href: "/settings", active: true },
];

function Toggle({ defaultChecked = false, onChange }: { defaultChecked?: boolean, onChange?: (c: boolean) => void }) {
  const [checked, setChecked] = useState(defaultChecked);
  
  // Sync state if defaultChecked changes (e.g. from api load)
  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <button
      onClick={() => {
        const newVal = !checked;
        setChecked(newVal);
        if(onChange) onChange(newVal);
      }}
      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
        checked ? "bg-violet-600" : "bg-slate-200"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
          checked ? "left-[22px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  
  // Profile State
  const [userId, setUserId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          setEmail(user.email || "");
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profile) {
            setBusinessName(profile.business_name || "");
            setPhone(profile.phone || "");
            setAddress(profile.address || "");
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSaveSettings = async () => {
    if (!userId) return;
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: businessName,
          phone: phone,
          address: address
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
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
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari menu, transaksi, laporan..." 
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
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="p-8 max-w-[1400px] mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pengaturan</h1>
              <p className="text-slate-500 text-sm mt-1">Kelola preferensi sistem dan bisnis Anda</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
              </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              
              {/* Card 1: Profil Bisnis */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Store className="w-4 h-4 text-violet-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Profil Bisnis</h2>
                </div>
                
                <div className="grid grid-cols-[110px_1fr] gap-y-4 items-center">
                  <label className="text-[13px] text-slate-600 font-medium">Nama Bisnis</label>
                  <input 
                    type="text" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Toko Sejahtera" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-violet-500" 
                  />
                  
                  <label className="text-[13px] text-slate-600 font-medium">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-500 bg-slate-50 cursor-not-allowed" 
                  />
                  
                  <label className="text-[13px] text-slate-600 font-medium">Nomor Telepon</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-violet-500" 
                  />
                  
                  <label className="text-[13px] text-slate-600 font-medium self-start mt-2">Alamat</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                    rows={3} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-violet-500 resize-none" 
                  />
                  
                  <label className="text-[13px] text-slate-600 font-medium self-start mt-4">Logo Usaha</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-14 h-14 bg-violet-700 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-black text-xl">
                        {businessName ? businessName.charAt(0).toUpperCase() : 'TS'}
                      </span>
                    </div>
                    <div>
                      <button className="px-4 py-1.5 border border-slate-200 text-violet-600 text-[13px] font-semibold rounded-lg hover:bg-violet-50 transition-colors">
                        Ubah Logo
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2">PNG, JPG maks. 2MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Outlet & Operasional */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Store className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Outlet & Operasional</h2>
                </div>
                
                <div className="grid grid-cols-[130px_1fr] gap-y-4 items-center">
                  <label className="text-[13px] text-slate-600 font-medium">Outlet Aktif</label>
                  <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 appearance-none bg-white focus:outline-none focus:border-violet-500">
                      <option>{businessName || 'Toko'} - Pusat</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <label className="text-[13px] text-slate-600 font-medium">Zona Waktu</label>
                  <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 appearance-none bg-white focus:outline-none focus:border-violet-500">
                      <option>(GMT+07:00) Jakarta</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <label className="text-[13px] text-slate-600 font-medium">Mata Uang</label>
                  <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 appearance-none bg-white focus:outline-none focus:border-violet-500">
                      <option>IDR - Rupiah</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <label className="text-[13px] text-slate-600 font-medium">Bahasa</label>
                  <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 appearance-none bg-white focus:outline-none focus:border-violet-500">
                      <option>Bahasa Indonesia</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <label className="text-[13px] text-slate-600 font-medium">Jam Operasional</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input type="text" defaultValue="08:00" className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-violet-500 text-center" />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">🕒</span>
                    </div>
                    <span className="text-slate-400">-</span>
                    <div className="relative flex-1">
                      <input type="text" defaultValue="21:00" className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-violet-500 text-center" />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">🕒</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Pajak & Invoice */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Pajak & Invoice</h2>
                </div>
                
                <div className="grid grid-cols-[1fr_auto] gap-y-5 items-center">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[13px] text-slate-600 font-medium">PPN</label>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <Toggle defaultChecked={true} />

                  <label className="text-[13px] text-slate-600 font-medium">Tarif PPN (%)</label>
                  <input type="text" defaultValue="11" className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 text-right focus:outline-none focus:border-violet-500" />

                  <label className="text-[13px] text-slate-600 font-medium">Format Nomor Invoice</label>
                  <input type="text" defaultValue="INV-{YYYYMMDD}-{0001}" className="w-[180px] px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-violet-500" />

                  <label className="text-[13px] text-slate-600 font-medium">Pembulatan</label>
                  <div className="relative w-[180px]">
                    <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 appearance-none bg-white focus:outline-none focus:border-violet-500">
                      <option>Pembulatan Normal</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <label className="text-[13px] text-slate-600 font-medium">Tampilkan QR Invoice</label>
                  <Toggle defaultChecked={true} />
                </div>
              </div>

              {/* Card 4: Metode Pembayaran */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Metode Pembayaran</h2>
                </div>
                
                {[
                  { icon: "💵", label: "Tunai", checked: true },
                  { icon: "📱", label: "QRIS", checked: true },
                  { icon: "🏦", label: "Transfer", checked: true },
                  { icon: "💳", label: "Debit/Kredit", checked: true },
                  { icon: "👛", label: "E-Wallet", checked: true },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-slate-100">
                    <div className="flex items-center gap-3 text-[13px] text-slate-700 font-medium">
                      <span className="opacity-80">{m.icon}</span> {m.label}
                    </div>
                    <Toggle defaultChecked={m.checked} />
                  </div>
                ))}
              </div>

              {/* Card 5: Pengguna & Hak Akses */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 lg:col-span-2 xl:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Pengguna & Hak Akses</h2>
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-[11px] font-semibold text-slate-500 w-1/2">Peran</th>
                      <th className="pb-3 text-[11px] font-semibold text-slate-500 w-1/4">Jumlah Pengguna</th>
                      <th className="pb-3 text-[11px] font-semibold text-slate-500 w-1/4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "Owner", tag: "Sistem", count: 1 },
                      { role: "Manager", count: 2 },
                      { role: "Kasir", count: 5 },
                      { role: "Gudang", count: 2 },
                    ].map((r, i) => (
                      <tr key={i} className="border-b last:border-0 border-slate-50">
                        <td className="py-3 text-[13px] text-slate-700 font-medium flex items-center gap-2">
                          {r.role} 
                          {r.tag && <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-md">{r.tag}</span>}
                        </td>
                        <td className="py-3 text-[13px] text-slate-600">{r.count}</td>
                        <td className="py-3 text-center">
                          <button className="px-3 py-1 bg-white border border-violet-200 text-violet-600 text-[11px] font-semibold rounded-md hover:bg-violet-50 transition-colors">
                            Kelola
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="text-violet-600 text-[12px] font-bold text-left hover:underline mt-1">
                  + Tambah Peran
                </button>
              </div>

              {/* Card 6: Notifikasi */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-red-500" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Notifikasi</h2>
                </div>
                
                {[
                  { title: "Stok Menipis", desc: "Dapatkan notifikasi saat stok hampir habis", checked: true },
                  { title: "Retur", desc: "Dapatkan notifikasi retur dari pelanggan", checked: true },
                  { title: "Shift Kasir", desc: "Notifikasi pergantian shift kasir", checked: true },
                  { title: "Laporan Harian", desc: "Kirim ringkasan laporan setiap hari", checked: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between border-b last:border-0 border-slate-50 pb-4 last:pb-0">
                    <div>
                      <p className="text-[13px] text-slate-700 font-semibold">{n.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                    <Toggle defaultChecked={n.checked} />
                  </div>
                ))}
              </div>

              {/* Card 7: AI Chatbot */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5 lg:col-span-2 xl:col-span-2 2xl:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-violet-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">AI Chatbot</h2>
                </div>
                
                <div className="grid grid-cols-[130px_1fr] gap-y-4 items-center max-w-lg">
                  <label className="text-[13px] text-slate-600 font-medium">Nama Asisten</label>
                  <input type="text" defaultValue="Kasir Pintar Bot" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-violet-500" />

                  <label className="text-[13px] text-slate-600 font-medium">Gaya Bahasa</label>
                  <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 appearance-none bg-white focus:outline-none focus:border-violet-500">
                      <option>Ramah & Profesional</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="text-[13px] text-slate-600 font-medium">Konfirmasi Aksi Penting</label>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex justify-end pr-2"><Toggle defaultChecked={true} /></div>

                  <label className="text-[13px] text-slate-600 font-medium">Batas Akses</label>
                  <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 appearance-none bg-white focus:outline-none focus:border-violet-500">
                      <option>Hanya data ringkasan</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Card 8: Keamanan */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5 lg:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Keamanan</h2>
                </div>
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><Shield className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-[13px] text-slate-700 font-semibold">Ubah Password</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Terakhir diubah 25 Apr 2025</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-white border border-slate-200 text-violet-600 text-[12px] font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                    Ubah Password
                  </button>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><Shield className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-[13px] text-slate-700 font-semibold">Verifikasi 2 Langkah</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Lindungi akun Anda dengan 2FA</p>
                    </div>
                  </div>
                  <Toggle defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><LayoutDashboard className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-[13px] text-slate-700 font-semibold">Sesi Aktif</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Kelola perangkat yang sedang login</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-white border border-slate-200 text-violet-600 text-[12px] font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                    Lihat Sesi
                  </button>
                </div>
              </div>

            </div>
            )}
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          {saveSuccess && (
            <span className="text-emerald-600 font-medium text-[13px] mr-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span> 
              Tersimpan!
            </span>
          )}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-[13px] rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-[13px] rounded-xl shadow-sm transition-colors shadow-violet-200 disabled:opacity-70 min-w-[170px] justify-center"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
          </button>
        </div>

      </div>
    </div>
  );
}
