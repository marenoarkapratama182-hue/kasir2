"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatWidget } from "@/components/chat-widget";
import { createClient } from "@/utils/supabase/client";
import { 
  TrendingUp, 
  Users, 
  Package, 
  Receipt, 
  Activity,
  ArrowUpRight,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();
        
        // 1. Fetch Sales (Transactions & Revenue)
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('id, invoice_no, total_amount, created_at, customers(name)')
          .order('created_at', { ascending: false });
          
        let totalRevenue = 0;
        let totalTransactions = 0;
        let recent = [];
        
        if (salesData) {
          totalTransactions = salesData.length;
          totalRevenue = salesData.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
          recent = salesData.slice(0, 5).map((sale: any) => ({
            id: sale.invoice_no,
            amount: sale.total_amount,
            customer: sale.customers?.name || "Umum",
            time: new Date(sale.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }));
        }

        // 2. Fetch Customers Count
        const { count: customersCount } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });

        // 3. Fetch Products Count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalRevenue,
          totalTransactions,
          totalCustomers: customersCount || 0,
          totalProducts: productsCount || 0
        });
        
        setRecentTransactions(recent);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 p-8 overflow-y-auto relative">
        <ChatWidget />
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Ringkasan performa bisnis dan aktivitas toko</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <Activity className="w-4 h-4 text-emerald-500" />
            Sistem Aktif
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Pendapatan" 
            value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`} 
            icon={DollarSign} 
            color="text-emerald-600" 
            bgColor="bg-emerald-100"
            loading={loading}
          />
          <StatCard 
            title="Total Transaksi" 
            value={stats.totalTransactions.toString()} 
            icon={Receipt} 
            color="text-indigo-600" 
            bgColor="bg-indigo-100"
            loading={loading}
          />
          <StatCard 
            title="Total Pelanggan" 
            value={stats.totalCustomers.toString()} 
            icon={Users} 
            color="text-blue-600" 
            bgColor="bg-blue-100"
            loading={loading}
          />
          <StatCard 
            title="Total Produk" 
            value={stats.totalProducts.toString()} 
            icon={Package} 
            color="text-amber-600" 
            bgColor="bg-amber-100"
            loading={loading}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Transaksi Terbaru</h2>
              <Link href="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Lihat Semua <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
              ) : recentTransactions.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Nomor Struk</th>
                      <th className="px-6 py-4">Pelanggan</th>
                      <th className="px-6 py-4">Waktu</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-700">{tx.id}</td>
                        <td className="px-6 py-4 text-slate-600">{tx.customer}</td>
                        <td className="px-6 py-4 text-slate-500">{tx.time}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800">
                          Rp {tx.amount?.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">Belum ada transaksi.</div>
              )}
            </div>
          </div>
          
          <div className="col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-md p-6 text-white flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-32 h-32" />
            </div>
            <h2 className="text-lg font-bold mb-2 relative z-10">Kinerja Hari Ini</h2>
            <p className="text-indigo-100 text-sm mb-6 relative z-10">Ringkasan singkat performa toko Anda hari ini.</p>
            
            <div className="mt-auto relative z-10 space-y-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider mb-1">Rata-rata Penjualan</p>
                <p className="text-2xl font-bold">
                  {loading || stats.totalTransactions === 0 
                    ? "Rp 0" 
                    : `Rp ${Math.round(stats.totalRevenue / stats.totalTransactions).toLocaleString('id-ID')}`}
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor, loading }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
      <div className={`w-12 h-12 ${bgColor} ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">
          {loading ? "..." : value}
        </h3>
      </div>
    </div>
  );
}
