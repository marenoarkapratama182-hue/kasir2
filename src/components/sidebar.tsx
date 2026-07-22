"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Package, Users, Settings, LogOut, Receipt, PieChart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Error logging out", err);
    }
  };
  
  return (
    <aside className="w-24 bg-white border-r border-slate-200 flex flex-col items-center py-6 shadow-sm z-10 flex-shrink-0 h-screen">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-8 shadow-lg shadow-indigo-200">
        KP
      </div>
      
      <nav className="flex flex-col gap-6 flex-1 w-full items-center">
        <NavItem href="/admin" icon={PieChart} label="Admin" active={pathname?.startsWith("/admin")} />
        <NavItem href="/" icon={LayoutGrid} label="POS" active={pathname === "/"} />
        <NavItem href="/products" icon={Package} label="Produk" active={pathname?.startsWith("/products")} />
        <NavItem href="/transactions" icon={Receipt} label="Transaksi" active={pathname?.startsWith("/transactions")} />
        <NavItem href="/customers" icon={Users} label="Pelanggan" active={pathname?.startsWith("/customers")} />
        <NavItem href="/settings" icon={Settings} label="Pengaturan" active={pathname?.startsWith("/settings")} />
      </nav>
      
      <div className="mt-auto">
        <button 
          onClick={handleLogout}
          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-slate-400 hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Keluar</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label, active = false }: any) {
  return (
    <Link href={href} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
      active 
        ? "bg-indigo-50 text-indigo-600 shadow-sm" 
        : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
    }`}>
      <Icon className={`w-6 h-6 ${active ? "text-indigo-600" : ""}`} />
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </Link>
  );
}
