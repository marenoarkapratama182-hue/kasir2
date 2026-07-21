"use client";

import { Sidebar } from "@/components/sidebar";
import { Store, Receipt, Users, Bell, Shield, Wallet } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profil Toko");
  const [taxRate, setTaxRate] = useState(11);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedTax = localStorage.getItem("kasir_tax_rate");
    if (savedTax) {
      setTaxRate(Number(savedTax));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("kasir_tax_rate", taxRate.toString());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
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
              { icon: Store, label: "Profil Toko" },
              { icon: Receipt, label: "Pajak & Struk" },
              { icon: Wallet, label: "Metode Pembayaran" },
              { icon: Users, label: "Tim & Hak Akses" },
              { icon: Shield, label: "Keamanan" },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.label ? 'bg-white shadow-sm border border-slate-200 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Settings Form */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">{activeTab}</h2>
            
            {activeTab === "Profil Toko" && (
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
                
                <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-4">
                  {isSaved && <span className="text-emerald-600 text-sm font-medium">Pengaturan disimpan!</span>}
                  <button type="button" onClick={() => { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); }} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {activeTab === "Pajak & Struk" && (
              <div className="flex flex-col gap-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pajak Pertambahan Nilai (PPN) %</label>
                  <input 
                    type="number" 
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" 
                  />
                  <p className="text-xs text-slate-500 mt-2">Pajak ini akan dihitung secara otomatis pada setiap transaksi di menu Kasir.</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-4">
                  {isSaved && <span className="text-emerald-600 text-sm font-medium">Pajak diperbarui!</span>}
                  <button onClick={handleSave} type="button" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
                    Simpan Pengaturan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
