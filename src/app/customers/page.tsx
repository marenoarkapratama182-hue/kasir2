"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search, Plus, User, Loader2 } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";
import { createClient } from "@/utils/supabase/client";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('name');
          
        if (data) {
          setCustomers(data);
        }
      } catch (err) {
        console.error("Error loading customers:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 p-8 overflow-y-auto relative">
        <ChatWidget />
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pelanggan</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola data pelanggan dan loyalitas</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            Tambah Pelanggan
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
                placeholder="Cari nama, nomor HP..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
               <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                 <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                 <p className="text-sm font-medium">Memuat data pelanggan...</p>
               </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Nama Pelanggan</th>
                    <th className="px-6 py-4">Kontak</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4">Poin</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {c.name.charAt(0)}
                        </div>
                        <div className="font-bold text-slate-700">{c.name}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{c.phone || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.member_level === 'Gold' || c.member_level === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {c.member_level || "Umum"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{c.point || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Detail</button>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                     <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Tidak ada data pelanggan.</td>
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
