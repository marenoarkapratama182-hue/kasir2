"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search, Filter, Receipt, FileText, Download, Calendar, Loader2 } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";
import { createClient } from "@/utils/supabase/client";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalSales: 0, count: 0, avg: 0 });

  useEffect(() => {
    async function loadTransactions() {
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('sales')
          .select(`
            id,
            invoice_no,
            total_amount,
            payment_method,
            created_at,
            customer_id,
            customers ( name )
          `)
          .order('created_at', { ascending: false });
          
        if (data) {
          const mapped = data.map(item => {
            const date = new Date(item.created_at);
            const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return {
              id: item.invoice_no,
              time: timeString,
              cust: item.customers?.name || "Umum",
              status: "Berhasil",
              color: "bg-emerald-100 text-emerald-700",
              total: item.total_amount
            };
          });
          setTransactions(mapped);
          
          // Calculate simple stats
          const totalSales = mapped.reduce((acc, curr) => acc + (curr.total || 0), 0);
          const count = mapped.length;
          setStats({
            totalSales,
            count,
            avg: count > 0 ? Math.round(totalSales / count) : 0
          });
        }
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.cust.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 p-8 overflow-y-auto relative">
        <ChatWidget />
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Transaksi</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola dan pantau semua transaksi penjualan</p>
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Ekspor Data
          </button>
        </header>

        {/* Statistik Singkat */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Total Penjualan Hari Ini</p>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {loading ? "..." : `Rp ${stats.totalSales.toLocaleString('id-ID')}`}
            </h3>
            <p className="text-xs text-indigo-600 font-medium">Berdasarkan data database</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Jumlah Transaksi</p>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {loading ? "..." : stats.count}
            </h3>
            <p className="text-xs text-indigo-600 font-medium">
              {loading ? "..." : `Rata-rata Rp ${stats.avg.toLocaleString('id-ID')} per pesanan`}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Refund / Retur</p>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">0</h3>
            <p className="text-xs text-indigo-600 font-medium">Senilai Rp 0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor struk, pelanggan..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 text-sm hover:bg-slate-50">
              <Calendar className="w-4 h-4" /> Hari Ini
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 text-sm hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Semua Status
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
               <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                 <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                 <p className="text-sm font-medium">Memuat riwayat transaksi...</p>
               </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Nomor Struk</th>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Pelanggan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-700">{t.id}</div>
                          <div className="text-xs text-slate-400">Kasir: KS</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{t.time}</td>
                      <td className="px-6 py-4 text-slate-600">{t.cust}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.color}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">Rp {t.total.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center justify-end gap-1 ml-auto">
                          <FileText className="w-3 h-3" /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                     <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada data transaksi.</td>
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
