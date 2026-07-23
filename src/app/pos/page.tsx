"use client";

import { useState, useEffect } from "react";
import {
  Search, Plus, Minus, CreditCard, Receipt, QrCode, Banknote,
  CheckCircle2, Loader2, User, Bell, ChevronDown, LayoutDashboard,
  ShoppingCart, FileText, Package, Warehouse, Users, BarChart2,
  Bot, Settings, LogOut, Scan, X, Tag, Printer, Bookmark,
  Coffee, Fish, Soup, IceCream, Leaf, ShoppingBag, Sandwich, Wallet, Home
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categoryEmoji: Record<string, string> = {
  "Makanan": "🍛", "Minuman": "☕", "Snack": "🍿", "Kebutuhan": "🧴",
  "Roti": "🍞", "Sushi": "🍣", "Sashimi": "🍣", "Appetizer": "🥗",
  "Dessert": "🍨", "default": "📦"
};

const getEmoji = (category: string) => categoryEmoji[category] || categoryEmoji["default"];

const navItems = [
  { label: "Beranda", icon: Home, href: "/" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Kasir", icon: ShoppingCart, href: "/pos", active: true },
  { label: "Transaksi", icon: FileText, href: "/transactions" },
  { label: "Produk", icon: Package, href: "/products" },
  { label: "Pelanggan", icon: Users, href: "/customers" },
  { label: "Chatbot AI", icon: Bot, href: "/chatbot", badge: "New" },
  { label: "Pengaturan", icon: Settings, href: "/settings" },
];

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ product: any; qty: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [prefs, setPrefs] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from("profiles").select("preferences").eq("id", user.id).single();
          if (profile?.preferences) {
            setPrefs(profile.preferences);
            const activeMethods = [
              { id: "Tunai", prefKey: "payment_cash" },
              { id: "QRIS", prefKey: "payment_qris" },
              { id: "Transfer", prefKey: "payment_transfer" },
              { id: "Debit", prefKey: "payment_debit" },
              { id: "E-Wallet", prefKey: "payment_ewallet" }
            ].filter(m => profile.preferences[m.prefKey]);
            if (activeMethods.length > 0) {
              setPaymentMethod(activeMethods[0].id);
            }
          }
        }
        
        const { data: prodData } = await supabase.from("products").select("*");
        if (prodData) setProducts(prodData);

        const { data: custData } = await supabase.from("customers").select("id, name");
        if (custData) setCustomers(custData);

        const { data: txData } = await supabase
          .from("sales")
          .select("invoice_no, total_amount, created_at, customers(name)")
          .order("created_at", { ascending: false })
          .limit(4);
        if (txData) setRecentTx(txData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = Math.floor(subtotal * 0.05);
  const taxRate = prefs?.tax_enabled !== false ? parseFloat(prefs?.tax_rate || "10") / 100 : 0;
  const tax = Math.floor((subtotal - discount) * taxRate);
  const total = subtotal - discount + tax;
  const cashNum = parseInt(cashReceived.replace(/\D/g, "")) || 0;
  const change = cashNum - total;

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) =>
    (activeCategory === "Semua" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePayment = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const supabase = createClient();
      const inv = `TRX-${String(Math.floor(Math.random() * 900000) + 100000)}`;
      setInvoiceNumber(inv);
      const { data: sale, error: se } = await supabase
        .from("sales")
        .insert({ invoice_no: inv, total_amount: total, payment_method: paymentMethod, date: new Date().toISOString().split("T")[0], customer_id: selectedCustomer ? parseInt(selectedCustomer) : null })
        .select().single();
      if (se) throw se;
      const { error: ie } = await supabase.from("sale_items").insert(
        cart.map((i) => ({ sale_id: sale.id, product_id: i.product.id, qty: i.qty, price: i.product.price, total: i.product.price * i.qty }))
      );
      if (ie) throw ie;
      setIsPaymentSuccess(true);
    } catch (e) {
      alert("Gagal memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewOrder = () => {
    setCart([]); setIsPaymentSuccess(false); setCashReceived(""); setSelectedCustomer("");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f5f9] font-sans overflow-hidden text-slate-800">

      {/* ═══ LEFT SIDEBAR ═══ */}
      <aside className="w-[155px] flex-shrink-0 flex flex-col h-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1a1150 0%, #231860 40%, #2d1f7e 100%)" }}>
        
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[13px] leading-none">Kasir Pintar</p>
            <p className="text-purple-300 text-[9px] mt-0.5 leading-tight">Smart POS with AI</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl mb-0.5 transition-all text-sm ${
                item.active
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                  : "text-purple-200 hover:bg-white/10 hover:text-white"
              }`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-xs">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-emerald-400 text-[9px] text-white font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>



        {/* User info */}
        <div className="px-3 pb-3">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2.5 transition-colors border border-white/10">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">JD</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">John Doe</p>
              <p className="text-purple-300 text-[9px]">Kasir Utama</p>
            </div>
            <LogOut className="w-3 h-3 text-purple-300 flex-shrink-0" />
          </button>
          <p className="text-purple-400 text-[9px] text-center mt-2">© 2024 Kasir Pintar · v2.1.0</p>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800">Kasir</h1>
            <p className="text-slate-400 text-xs">Proses penjualan dengan cepat dan mudah</p>
          </div>



          {/* Search */}
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, produk, atau pelanggan..."
              className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 bg-slate-200 px-1 py-0.5 rounded">F2</span>
          </div>

          {/* Bell */}
          <button className="relative w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">3</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">JD</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">John Doe</p>
              <p className="text-[10px] text-slate-400">Kasir Utama</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">

          {/* ── CENTER: Products ── */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Search bar in product area */}
            <div className="px-4 pt-3 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk atau scan barcode..."
                  className="flex-1 text-sm focus:outline-none text-slate-600 placeholder:text-slate-300 bg-transparent"
                />
                <Scan className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-violet-50 hover:text-violet-600"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-3">
              {loading ? (
                <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                  <span className="text-sm">Memuat produk...</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {filteredProducts.map((product) => (
                    <div key={product.id}
                      className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 cursor-pointer transition-all group hover:-translate-y-0.5"
                      onClick={() => addToCart(product)}>
                      {/* Product image area */}
                      <div className="w-full h-24 rounded-xl mb-2 flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100/50 group-hover:from-violet-100 transition-colors overflow-hidden">
                        <span className="text-4xl select-none">{getEmoji(product.category)}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-slate-700 leading-tight line-clamp-2 mb-1 min-h-[2rem]">{product.name}</h3>
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <span className="text-xs font-bold text-slate-800">Rp {product.price?.toLocaleString("id-ID")}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-violet-600 flex items-center justify-center transition-colors flex-shrink-0">
                          <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Add quick product button */}
                  <div className="bg-white rounded-2xl p-3 border border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-violet-50 hover:border-violet-300 transition-all min-h-[140px]">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-400 text-center font-medium">Tambah Produk Cepat</p>
                  </div>
                </div>
              )}
            </div>


          </main>

          {/* ── RIGHT: Cart Panel ── */}
          <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 overflow-hidden">

            {/* Customer */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-500 hover:bg-slate-100 transition-colors">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium">Pelanggan</span>
                </button>
                <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-500 focus:outline-none focus:border-violet-500 truncate appearance-none cursor-pointer">
                  <option value="">Pelanggan Umum</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Cart Header */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Keranjang</h2>
              {cart.length > 0 && (
                <button onClick={handleNewOrder} className="text-[10px] text-red-500 font-semibold hover:text-red-700 transition-colors">
                  Bersihkan
                </button>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300">
                  <ShoppingCart className="w-10 h-10" />
                  <p className="text-xs">Keranjang kosong</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 text-base">
                        {getEmoji(item.product.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-slate-700 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-violet-600 font-medium">Rp {item.product.price?.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => updateQty(item.product.id, -1)}
                          className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                          <Minus className="w-2.5 h-2.5 text-slate-500" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-700">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, 1)}
                          className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                          <Plus className="w-2.5 h-2.5 text-slate-500" />
                        </button>
                        <button onClick={() => removeFromCart(item.product.id)}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors ml-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary + Payment */}
            <div className="flex-shrink-0 border-t border-slate-100 px-4 pt-3 pb-2">
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-700">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Diskon</span>
                  <span className="font-medium text-slate-700">Rp {discount.toLocaleString("id-ID")}</span>
                </div>
                {prefs?.tax_enabled !== false && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Pajak ({prefs?.tax_rate || "10"}%)</span>
                    <span className="font-medium text-slate-700">Rp {tax.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="h-px bg-slate-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">Total</span>
                  <span className="text-lg font-black text-violet-600">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Pay button */}
              <button onClick={handlePayment} disabled={cart.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 mb-3">
                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : <><span>Bayar</span><span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-bold">F9</span></>}
              </button>

              {/* Payment Methods */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Metode Pembayaran</p>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {[
                    { id: "Tunai", icon: Banknote, label: "Tunai", prefKey: "payment_cash" },
                    { id: "QRIS", icon: QrCode, label: "QRIS", prefKey: "payment_qris" },
                    { id: "Transfer", icon: CreditCard, label: "Transfer", prefKey: "payment_transfer" },
                    { id: "Debit", icon: CreditCard, label: "Debit/Kredit", prefKey: "payment_debit" },
                    { id: "E-Wallet", icon: Wallet, label: "E-Wallet", prefKey: "payment_ewallet" },
                  ].filter(m => !prefs || prefs[m.prefKey]).map((m) => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-[9px] font-semibold transition-all ${
                        paymentMethod === m.id
                          ? "border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-400"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}>
                      <m.icon className="w-3.5 h-3.5" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash input (only for Tunai) */}
              {paymentMethod === "Tunai" && (
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium mb-1">Uang Diterima</p>
                    <input
                      type="text" value={cashReceived}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setCashReceived(raw ? `Rp ${parseInt(raw).toLocaleString("id-ID")}` : "");
                      }}
                      placeholder="Rp 0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all font-medium"
                    />
                  </div>
                  {cashNum > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Kembalian</span>
                      <span className={`text-sm font-bold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        Rp {Math.abs(change).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom action bar */}
            <div className="border-t border-slate-100 px-3 py-2 flex items-center gap-1 bg-slate-50">
              {[["Tunda","F6"], ["Simpan","F7"], ["Cetak Struk","F8"], ["Lainnya","···"]].map(([l, k]) => (
                <button key={l} className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg hover:bg-white transition-colors text-slate-500 hover:text-violet-600">
                  <span className="text-[9px] text-slate-400 bg-slate-200 px-1 py-0.5 rounded font-mono">{k}</span>
                  <span className="text-[9px] font-medium">{l}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ SUCCESS MODAL ═══ */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Pembayaran Berhasil!</h2>
            <p className="text-slate-500 text-sm mb-5">Transaksi via <strong>{paymentMethod}</strong> telah dicatat.</p>
            <div className="w-full bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100">
              <div className="flex justify-between text-sm mb-2 text-slate-500">
                <span>Nomor Struk</span>
                <span className="font-bold text-slate-700">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total</span>
                <span className="text-lg font-black text-violet-600">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 text-sm">
                <Printer className="w-4 h-4" /> Cetak Struk
              </button>
              <button onClick={handleNewOrder} className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors text-sm">
                Pesanan Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
