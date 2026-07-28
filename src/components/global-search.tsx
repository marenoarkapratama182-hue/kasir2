"use client";

import { useState, useEffect, useRef } from "react";
import { Search, LayoutDashboard, ShoppingCart, FileText, Package, Users, Bot, Settings, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const searchData = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, category: "Menu" },
  { label: "Kasir (POS)", href: "/pos", icon: ShoppingCart, category: "Menu" },
  { label: "Daftar Transaksi", href: "/transactions", icon: FileText, category: "Transaksi" },
  { label: "Laporan Penjualan", href: "/transactions", icon: FileText, category: "Laporan" },
  { label: "Manajemen Produk", href: "/products", icon: Package, category: "Menu" },
  { label: "Daftar Pelanggan", href: "/customers", icon: Users, category: "Menu" },
  { label: "Chatbot AI Insights", href: "/chatbot", icon: Bot, category: "Menu" },
  { label: "Pengaturan Sistem", href: "/settings", icon: Settings, category: "Pengaturan" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [open]);
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredData = searchData.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <div 
        className="relative w-80 cursor-text group"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-violet-500 transition-colors" />
        <div className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-400 group-hover:bg-white group-hover:border-violet-300 transition-all flex items-center">
          Cari menu, transaksi, laporan...
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="bg-white border border-slate-200 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">⌘</span>
          <span className="bg-white border border-slate-200 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">K</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="flex items-center px-4 py-3 border-b border-slate-100">
                  <Search className="w-5 h-5 text-violet-500 mr-3" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ketik untuk mencari..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 text-[15px] placeholder:text-slate-400 h-10"
                  />
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">ESC</span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {filteredData.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {filteredData.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelect(item.href)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-violet-50 group transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-violet-600 border border-slate-100 group-hover:border-violet-100 transition-colors">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-slate-700 group-hover:text-violet-700">{item.label}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{item.category}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <p className="text-[14px] font-medium text-slate-800">Tidak ada hasil ditemukan.</p>
                      <p className="text-[12px] text-slate-500 mt-1">Coba gunakan kata kunci lain.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
