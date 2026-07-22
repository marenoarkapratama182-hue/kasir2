"use client";

import Link from "next/link";
import { ArrowRight, Store, BarChart3, Users, Zap, Shield, Smartphone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full z-50 bg-[#030712]/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 border border-white/10">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">KasirPintar</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-slate-400 font-medium hover:text-white transition-colors text-sm">
              Masuk
            </Link>
            <Link href="/login" className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-semibold hover:bg-indigo-50 hover:scale-105 transition-all text-sm flex items-center gap-1 group">
              Mulai Gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium text-xs mb-8 uppercase tracking-wider backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Platform POS Generasi Baru
          </motion.div>
          
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8 max-w-4xl"
          >
            Sistem Kasir Masa Depan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
              Dalam Genggaman Anda.
            </span>
          </motion.h1>
          
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Tinggalkan cara lama. Percepat transaksi, kelola inventaris secara real-time, dan pantau omzet dari mana saja dengan dashboard kasir yang elegan dan cepat.
          </motion.p>
          
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <Link href="/login" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-base hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-2 group border border-white/10">
              Buka Aplikasi Kasir
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          {/* Dashboard Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative w-full max-w-5xl mx-auto group perspective-1000"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="relative bg-[#0a0f1c]/80 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden transform transition-transform duration-700 hover:scale-[1.02]">
              {/* Fake Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=800" 
                alt="Dashboard Mockup" 
                className="rounded-b-[1.5rem] w-full h-auto object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              
              {/* Floating Stat */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-6 bottom-12 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4 hidden md:flex"
              >
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-medium">Transaksi Sukses</p>
                  <p className="text-xl font-bold text-white">+1,245 Hari Ini</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0f1c]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Fitur Premium, Tanpa Kompromi</h2>
            <p className="text-slate-400 text-lg">Dirancang khusus untuk memberikan pengalaman operasional yang tak tertandingi bagi bisnis Anda.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard 
              icon={Zap} 
              title="Performa Kilat" 
              desc="Pemrosesan pesanan dalam hitungan milidetik. Tidak ada lagi antrean panjang di kasir Anda." 
              color="from-amber-400 to-orange-500"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Analitik Mendalam" 
              desc="Pantau metrik penjualan, grafik pendapatan, dan tren produk secara real-time dari mana saja." 
              color="from-indigo-400 to-cyan-400"
            />
            <FeatureCard 
              icon={Users} 
              title="Membership" 
              desc="Kelola basis data pelanggan dan terapkan sistem level member (VIP, Gold, Reguler)." 
              color="from-emerald-400 to-teal-500"
            />
            <FeatureCard 
              icon={Store} 
              title="Inventaris Sinkron" 
              desc="Stok barang selalu ter-update secara otomatis setiap ada transaksi yang berhasil." 
              color="from-blue-400 to-indigo-500"
            />
            <FeatureCard 
              icon={Shield} 
              title="Keamanan Supabase" 
              desc="Data operasional dan finansial tersimpan aman di Cloud dengan standar keamanan tingkat tinggi." 
              color="from-purple-400 to-pink-500"
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Responsif Menyeluruh" 
              desc="Beroperasi dengan sempurna di tablet, iPad, monitor kasir, maupun smartphone Anda." 
              color="from-rose-400 to-orange-500"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-[#0a0f1c] rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 relative z-10 text-white">Tingkatkan Level Bisnis Anda</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Bergabunglah dengan ekosistem kasir modern. Kelola semuanya dari satu *dashboard* canggih tanpa kerumitan instalasi server.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] relative z-10">
            Mulai Gunakan Sekarang
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030712] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            KasirPintar
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} KasirPintar. Sistem Kasir Modern.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}></div>
      <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6`}>
        <Icon className="w-7 h-7 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
