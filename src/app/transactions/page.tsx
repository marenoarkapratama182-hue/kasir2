"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, Plus, ShoppingCart, FileText, Package, Warehouse,
  Users, BarChart2, Settings, Bot, ChevronDown, ChevronRight, LogOut,
  LayoutDashboard, Download, Calendar, Bell, X, Check, Clock,
  CreditCard, QrCode, Banknote, Wallet, MoreVertical, Printer,
  RotateCcw, Tag, ChevronLeft, ArrowUpRight, Activity, Home
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { label: "Beranda", icon: Home, href: "/" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Kasir", icon: ShoppingCart, href: "/pos" },
  { label: "Transaksi", icon: FileText, href: "/transactions", active: true },
  { label: "Produk", icon: Package, href: "/products" },
  { label: "Pelanggan", icon: Users, href: "/customers" },
  { label: "Chatbot AI", icon: Bot, href: "/chatbot", badge: "New" },
  { label: "Pengaturan", icon: Settings, href: "/settings" },
];

const mockTransactions = [
  { id: "TRX-000125", waktu: "09 Mei 2024\n10:45", pelanggan: "Andi Wijaya", kasir: "John Doe", outlet: "Toko Utama", metode: "QRIS", total: 125000, status: "Berhasil" },
  { id: "TRX-000124", waktu: "09 Mei 2024\n10:45", pelanggan: "Siti Nurhaliza", kasir: "John Doe", outlet: "Toko Utama", metode: "Tunai", total: 78000, status: "Berhasil" },
  { id: "TRX-000123", waktu: "09 Mei 2024\n09:58", pelanggan: "Budi Santoso", kasir: "John Doe", outlet: "Toko Utama", metode: "Debit/Kredit", total: 250000, status: "Berhasil" },
  { id: "TRX-000122", waktu: "09 Mei 2024\n09:30", pelanggan: "Dewi Lestari", kasir: "Sarah A.", outlet: "Cabang Melati", metode: "E-Wallet", total: 65500, status: "Berhasil" },
  { id: "TRX-000121", waktu: "09 Mei 2024\n09:05", pelanggan: "Rizky Pratama", kasir: "Sarah A.", outlet: "Cabang Melati", metode: "QRIS", total: 112000, status: "Pending" },
  { id: "TRX-000120", waktu: "09 Mei 2024\n08:45", pelanggan: "—", kasir: "Budi K.", outlet: "Cabang Anggrek", metode: "Tunai", total: 45000, status: "Berhasil" },
  { id: "TRX-000119", waktu: "09 Mei 2024\n08:20", pelanggan: "Maya Sari", kasir: "Budi K.", outlet: "Cabang Anggrek", metode: "Debit/Kredit", total: 320000, status: "Berhasil" },
  { id: "TRX-000118", waktu: "09 Mei 2024\n08:05", pelanggan: "Ahmad Fauzi", kasir: "John Doe", outlet: "Toko Utama", metode: "E-Wallet", total: 60000, status: "Refund" },
  { id: "TRX-000117", waktu: "09 Mei 2024\n07:55", pelanggan: "Lina Marlina", kasir: "Sarah A.", outlet: "Cabang Melati", metode: "QRIS", total: 95000, status: "Berhasil" },
  { id: "TRX-000116", waktu: "09 Mei 2024\n07:40", pelanggan: "—", kasir: "Budi K.", outlet: "Cabang Anggrek", metode: "Tunai", total: 28000, status: "Dibatalkan" },
];

const mockDetail = {
  id: "TRX-000125",
  waktu: "09 Mei 2024 • 10:45 WIB",
  pelanggan: "Andi Wijaya",
  hp: "0812-3456-7890",
  kasir: "John Doe",
  outlet: "Toko Utama",
  metode: "QRIS",
  invoice: "INV/05/2024/000125",
  timeline: [
    { label: "Transaksi dibuat", time: "09 Mei 2024 • 10:45 WIB" },
    { label: "Pembayaran diterima", time: "09 Mei 2024 • 10:46 WIB" },
    { label: "Transaksi berhasil", time: "09 Mei 2024 • 10:46 WIB" },
  ],
  items: [
    { name: "Kopi Kapal Api Special", qty: 1, price: 16000 },
    { name: "Indomie Goreng", qty: 2, price: 3000 },
    { name: "Aqua 600ml", qty: 2, price: 3000 },
  ],
  subtotal: 28000,
  diskon: 2000,
  pajak: 2600,
  total: 28600,
};

const paymentMethods = [
  { label: "QRIS", pct: 45, amount: 3710000, color: "#7c3aed" },
  { label: "Tunai", pct: 25, amount: 2060000, color: "#10b981" },
  { label: "Debit/Kredit", pct: 20, amount: 1648000, color: "#3b82f6" },
  { label: "E-Wallet", pct: 10, amount: 827000, color: "#f59e0b" },
];

const peakHours = [
  { hour: "06:00", trx: 5 },
  { hour: "09:00", trx: 20 },
  { hour: "12:00", trx: 30 },
  { hour: "15:00", trx: 22 },
  { hour: "18:00", trx: 25 },
  { hour: "21:00", trx: 12 },
];

const recentActivity = [
  { label: "Transaksi TRX-000125 berhasil", time: "10:46 WIB" },
  { label: "Transaksi TRX-000124 berhasil", time: "10:15 WIB" },
  { label: "Transaksi TRX-000118 Refund", time: "09:20 WIB" },
  { label: "Transaksi TRX-000123 berhasil", time: "09:18 WIB" },
  { label: "Transaksi TRX-000122 berhasil", time: "09:01 WIB" },
];

function MetodeBadge({ metode }: { metode: string }) {
  if (metode === "QRIS") return <span className="flex items-center gap-1.5 text-purple-600 text-xs font-medium"><QrCode className="w-3.5 h-3.5" />QRIS</span>;
  if (metode === "Tunai") return <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium"><Banknote className="w-3.5 h-3.5" />Tunai</span>;
  if (metode === "E-Wallet") return <span className="flex items-center gap-1.5 text-amber-600 text-xs font-medium"><Wallet className="w-3.5 h-3.5" />E-Wallet</span>;
  return <span className="flex items-center gap-1.5 text-blue-600 text-xs font-medium"><CreditCard className="w-3.5 h-3.5" />Debit/Kredit</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Berhasil": "text-emerald-600",
    "Pending": "text-amber-500",
    "Dibatalkan": "text-red-500",
    "Refund": "text-blue-500",
  };
  return <span className={`text-xs font-semibold ${map[status] || "text-slate-500"}`}>{status}</span>;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<string>("");
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedTxData, setSelectedTxData] = useState<any>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("sales")
          .select("id, invoice_no, total_amount, payment_method, created_at, customers(name, phone)")
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.invoice_no,
            dbId: item.id,
            waktu: new Date(item.created_at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            rawWaktu: item.created_at,
            pelanggan: item.customers?.name || "Pelanggan Umum",
            hp: item.customers?.phone || "—",
            kasir: "John Doe",
            outlet: "Toko Utama",
            metode: item.payment_method || "Tunai",
            total: item.total_amount,
            status: "Berhasil",
          }));
          setTransactions(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRowClick = async (t: any) => {
    setSelectedRow(t.id);
    setShowDetail(true);
    setDetailLoading(true);
    
    try {
      const supabase = createClient();
      const { data: items } = await supabase
        .from("sale_items")
        .select("qty, price, total, products(name, category)")
        .eq("sale_id", t.dbId);
        
      setSelectedTxData({
        ...t,
        items: items ? items.map((i: any) => ({
          name: i.products?.name || "Produk",
          category: i.products?.category || "default",
          qty: i.qty,
          price: i.price,
          total: i.total
        })) : []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const toggleCheck = (id: string) =>
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = transactions.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.pelanggan.toLowerCase().includes(search.toLowerCase()) ||
    t.kasir.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedTransactions = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const maxTrx = Math.max(...peakHours.map(h => h.trx));

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden text-slate-800" style={{ background: "#f4f5f9" }}>
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[155px] flex-shrink-0 flex flex-col h-full"
        style={{ background: "linear-gradient(180deg, #1a1150 0%, #231860 40%, #2d1f7e 100%)" }}>
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[13px] leading-none">Kasir Pintar</p>
            <p className="text-purple-300 text-[9px] mt-0.5 leading-tight">Smart POS with AI</p>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl mb-0.5 transition-all text-sm ${item.active ? "bg-violet-600 text-white shadow-lg" : "text-purple-200 hover:bg-white/10 hover:text-white"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-xs">{item.label}</span>
              {item.badge && <span className="ml-auto bg-emerald-400 text-[9px] text-white font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="mx-3 mb-3 bg-white/10 rounded-2xl p-3 border border-white/15">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <p className="text-white text-[11px] font-semibold">Hai! Saya AI Assistant</p>
          </div>
          <p className="text-purple-200 text-[10px] leading-tight mb-2">Perlu bantuan untuk transaksi hari ini?</p>
          <button className="w-full bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors">Tanya AI</button>
        </div>
        <div className="px-3 pb-3">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2.5 border border-white/10 transition-colors">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">JD</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">John Doe</p>
              <p className="text-purple-300 text-[9px]">Kasir Utama</p>
            </div>
            <LogOut className="w-3 h-3 text-purple-300" />
          </button>
          <p className="text-purple-400 text-[9px] text-center mt-2">© 2024 Kasir Pintar · v2.1.0</p>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800">Transaksi</h1>
            <p className="text-slate-400 text-xs">Kelola dan pantau semua transaksi penjualan</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 transition-colors">
            <span>🏬</span><span className="font-medium">Semua Cabang</span><ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Cari transaksi, pelanggan, atau kasir..." className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 bg-slate-200 px-1 py-0.5 rounded">F2</span>
          </div>
          <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-100">
            <Calendar className="w-3.5 h-3.5" /><span className="font-medium">09 Mei 2024 - 09 Mei 2024</span><ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="relative w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100">
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-100">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center"><span className="text-white text-[10px] font-bold">JD</span></div>
            <div><p className="text-xs font-semibold text-slate-700">John Doe</p><p className="text-[10px] text-slate-400">Kasir Utama</p></div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Stat Cards */}
            <div className="px-5 py-4 grid grid-cols-4 gap-3 flex-shrink-0">
              {[
                { label: "Total Transaksi Hari Ini", value: "124", trend: "+18% dari kemarin", icon: "📊", bg: "bg-violet-50", iconBg: "bg-violet-500", text: "text-violet-600" },
                { label: "Omzet Hari Ini", value: "Rp 8.245.000", trend: "+24% dari kemarin", icon: "💰", bg: "bg-emerald-50", iconBg: "bg-emerald-500", text: "text-emerald-600" },
                { label: "Transaksi Berhasil", value: "112", trend: "90,3% dari total", icon: "✅", bg: "bg-blue-50", iconBg: "bg-blue-500", text: "text-blue-600" },
                { label: "Retur / Dibatalkan", value: "12", trend: "9,7% dari total", icon: "↩", bg: "bg-orange-50", iconBg: "bg-orange-500", text: "text-orange-600" },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
                  <div className={`${s.iconBg} w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0`}>{s.icon}</div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                    <p className={`text-lg font-bold ${s.text}`}>{s.value}</p>
                    <p className={`text-[10px] font-semibold ${s.text}`}>{s.trend}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="px-5 pb-3 flex items-center gap-2 flex-shrink-0">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cari ID / Pelanggan / Kasir..." className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-violet-500 shadow-sm" />
              </div>
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 shadow-sm">09/05/2024 - 09/05/2024 <Calendar className="w-3 h-3" /></button>
              {["Semua Metode", "Semua Status", "Semua Kasir"].map(f => (
                <button key={f} className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 shadow-sm whitespace-nowrap">{f}<ChevronDown className="w-3 h-3 ml-1" /></button>
              ))}
              <div className="flex-1" />
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
                <Download className="w-3.5 h-3.5 text-violet-600" /> Ekspor
              </button>
              <Link href="/pos" className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-colors whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" /> Transaksi Baru
              </Link>
            </div>

            {/* Table */}
            <div className="flex-1 px-5 pb-3 overflow-hidden flex flex-col">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white sticky top-0 z-10 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded accent-violet-600" /></th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">ID Transaksi</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">Waktu</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">Pelanggan</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">Kasir</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">Outlet</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">Metode Bayar</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">Total</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginatedTransactions.map((t, i) => (
                        <tr key={i}
                          onClick={() => handleRowClick(t)}
                          className={`cursor-pointer transition-colors ${selectedRow === t.id ? "bg-violet-50" : "hover:bg-slate-50/80"}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={checked.includes(t.id)} onChange={() => toggleCheck(t.id)} onClick={e => e.stopPropagation()} className="rounded accent-violet-600" />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-violet-600 font-semibold text-xs hover:underline cursor-pointer">{t.id}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 whitespace-pre-line leading-tight">{t.waktu}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{t.pelanggan}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{t.kasir}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{t.outlet}</td>
                          <td className="px-4 py-3"><MetodeBadge metode={t.metode} /></td>
                          <td className="px-4 py-3 text-xs font-semibold text-slate-700">Rp {t.total.toLocaleString("id-ID")}</td>
                          <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                          <td className="px-4 py-3"><MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
                  <span className="text-[11px] text-slate-500">
                    Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} transaksi
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1)
                      .map((p, i, arr) => (
                        <div key={p} className="flex items-center gap-1">
                          {i > 0 && arr[i - 1] !== p - 1 && <span className="w-7 h-7 flex items-center justify-center text-slate-400 text-xs">...</span>}
                          <button
                            onClick={() => setCurrentPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-medium flex items-center justify-center ${p === currentPage ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            {p}
                          </button>
                        </div>
                      ))}

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* ─── DETAIL PANEL ─── */}
          {showDetail && (
            <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 overflow-hidden">
              <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
                <h2 className="text-sm font-bold text-slate-800">Detail Transaksi</h2>
                <button onClick={() => setShowDetail(false)} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              {detailLoading || !selectedTxData ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mb-3"></span>
                  <span className="text-xs text-slate-400 font-medium">Memuat detail...</span>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* ID + Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">ID Transaksi</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedTxData.id}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full">{selectedTxData.status}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Waktu</p>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">{selectedTxData.waktu}</p>
                  </div>

                  {/* Customer */}
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 font-medium mb-2">Pelanggan</p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-600 font-bold text-[10px] uppercase">
                          {selectedTxData.pelanggan.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{selectedTxData.pelanggan}</p>
                        <p className="text-[10px] text-slate-400">{selectedTxData.hp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-wider">Informasi Transaksi</p>
                    <div className="space-y-2">
                      {[
                        ["Kasir", selectedTxData.kasir],
                        ["Outlet", selectedTxData.outlet],
                        ["No. Invoice", selectedTxData.id]
                      ].map(([k,v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-[11px] text-slate-500">{k}</span>
                          <span className="text-[11px] font-semibold text-slate-700">{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500">Metode Bayar</span>
                        <MetodeBadge metode={selectedTxData.metode} />
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-wider">Timeline Transaksi</p>
                    <div className="relative pl-4">
                      <div className="absolute left-1.5 top-2 bottom-2 w-px bg-violet-200"></div>
                      {[
                        { label: "Transaksi dibuat", time: selectedTxData.waktu },
                        { label: "Pembayaran diterima", time: selectedTxData.waktu },
                        { label: "Transaksi berhasil", time: selectedTxData.waktu },
                      ].map((t, i) => (
                        <div key={i} className="flex gap-3 mb-3 relative">
                          <div className="w-3 h-3 rounded-full bg-violet-600 border-2 border-white shadow absolute -left-4 top-0.5 flex-shrink-0"></div>
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700">{t.label}</p>
                            <p className="text-[9px] text-slate-400">{t.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-wider">Item ({selectedTxData.items?.length || 0})</p>
                    <div className="space-y-2">
                      {selectedTxData.items?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-sm flex-shrink-0">
                            {["☕","🍜","💧","📦","🍣"][i % 5]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-slate-700 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.qty}x Rp {item.price.toLocaleString("id-ID")}</p>
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">Rp {item.total.toLocaleString("id-ID")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {(() => {
                    const subtotal = selectedTxData.items?.reduce((s: number, i: any) => s + i.total, 0) || 0;
                    const diskon = Math.floor(subtotal * 0.05);
                    const pajak = Math.floor((subtotal - diskon) * 0.10);
                    return (
                      <div className="border-t border-slate-100 pt-3 space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Subtotal</span>
                          <span className="font-medium text-slate-700">Rp {subtotal.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Diskon</span>
                          <span className="font-medium text-red-500">- Rp {diskon.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Pajak (10%)</span>
                          <span className="font-medium text-slate-700">Rp {pajak.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                          <span className="text-sm font-bold text-slate-800">Total</span>
                          <span className="text-base font-black text-violet-600">Rp {selectedTxData.total.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  <button className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold py-2.5 rounded-xl text-xs transition-colors">
                    Lihat Detail
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors">
                      <Printer className="w-3.5 h-3.5" /> Cetak Ulang Struk
                    </button>
                    <button className="flex items-center justify-center gap-1.5 bg-red-50 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl text-xs hover:bg-red-100 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Refund
                    </button>
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
