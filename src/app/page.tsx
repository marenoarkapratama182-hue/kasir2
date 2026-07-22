import Link from "next/link";
import { ArrowRight, Store, BarChart3, Users, Zap, Shield, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">KasirPintar</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">
              Masuk
            </Link>
            <Link href="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
              Coba Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 -z-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Sistem POS Generasi Baru
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight mb-6">
              Kelola Bisnis Anda <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Lebih Cerdas & Cepat
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Tinggalkan cara lama. Gunakan sistem kasir modern yang dirancang untuk mempercepat transaksi, memantau stok, dan menganalisis keuntungan secara *real-time*.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/login" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group">
                Mulai Berjualan
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white p-2 rounded-3xl shadow-2xl border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=800" 
                alt="Kasir App Dashboard" 
                className="rounded-2xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Penjualan Hari Ini</p>
                  <p className="text-xl font-bold text-slate-800">Rp 12.450.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Fitur Lengkap untuk Skala Bisnis Anda</h2>
            <p className="text-slate-600 text-lg">Semua yang Anda butuhkan untuk menjalankan bisnis dengan lancar ada di satu tempat.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap} 
              title="Transaksi Secepat Kilat" 
              desc="Proses pesanan pelanggan dalam hitungan detik dengan antarmuka yang sangat responsif." 
              color="text-amber-500" 
              bgColor="bg-amber-50"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Laporan Real-time" 
              desc="Pantau pendapatan, produk terlaris, dan performa bisnis Anda kapan saja dan dari mana saja." 
              color="text-indigo-500" 
              bgColor="bg-indigo-50"
            />
            <FeatureCard 
              icon={Users} 
              title="Manajemen Pelanggan" 
              desc="Simpan data pelanggan setia Anda dan tingkatkan retensi dengan sistem membership." 
              color="text-emerald-500" 
              bgColor="bg-emerald-50"
            />
            <FeatureCard 
              icon={Store} 
              title="Manajemen Inventaris" 
              desc="Kontrol stok produk Anda dengan akurat untuk mencegah kehabisan barang." 
              color="text-blue-500" 
              bgColor="bg-blue-50"
            />
            <FeatureCard 
              icon={Shield} 
              title="Keamanan Data Terjamin" 
              desc="Data operasional dan finansial Anda tersimpan aman di Cloud dengan enkripsi penuh." 
              color="text-purple-500" 
              bgColor="bg-purple-50"
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Akses dari Perangkat Apapun" 
              desc="Berjalan mulus di PC, tablet, maupun *smartphone* tanpa perlu instalasi aplikasi." 
              color="text-rose-500" 
              bgColor="bg-rose-50"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-3xl p-10 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 relative z-10">Siap Mengembangkan Bisnis Anda?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Bergabunglah dengan pengusaha modern lainnya dan rasakan kemudahan mengelola toko dalam genggaman Anda.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-xl relative z-10">
            Masuk ke Sistem Kasir
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Store className="w-5 h-5 text-indigo-600" />
            KasirPintar
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} KasirPintar. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color, bgColor }: any) {
  return (
    <div className="p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:border-slate-200 transition-all group">
      <div className={`w-14 h-14 rounded-2xl ${bgColor} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
