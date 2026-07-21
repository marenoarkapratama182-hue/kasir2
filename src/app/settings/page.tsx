"use client";

import { Sidebar } from "@/components/sidebar";
import { Store, Receipt, Users, Bell, Shield, Wallet } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";

export default function SettingsPage() {
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 p-8 overflow-y-auto relative">
        <ChatWidget />
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pengaturan</h1>
          <p className="text-slate-500 text-sm mt-1">Konfigurasi toko dan preferensi sistem</p>
        </header>

        <div className="flex gap-8">
          {/* Settings Nav */}
          <div className="w-64 flex flex-col gap-2">
            {[
              { icon: Store, label: "Profil Toko", active: true },
              { icon: Receipt, label: "Pajak & Struk", active: false },
              { icon: Wallet, label: "Metode Pembayaran", active: false },
              { icon: Users, label: "Tim & Hak Akses", active: false },
              { icon: Shield, label: "Keamanan", active: false },
            ].map((item, i) => (
              <button key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-white shadow-sm border border-slate-200 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Settings Form */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Profil Toko</h2>
            
            <form className="flex flex-col gap-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Toko</label>
                <input 
                  type="text" 
                  defaultValue="Kasir Sushi" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Toko</label>
                <input 
                  type="text" 
                  disabled
                  value="Aktif" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed" 
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mata Uang Default</label>
                  <select 
                    defaultValue="IDR"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Zona Waktu</label>
                  <select 
                    defaultValue="Asia/Jakarta"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button type="button" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
