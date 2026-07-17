"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, CreditCard, ChevronRight, Coffee, Fish, Soup, IceCream, Receipt, QrCode, Banknote, CheckCircle2, Loader2, User } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";
import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/utils/supabase/client";

const getIcon = (category: string) => {
  if (category === 'Minuman') return Coffee;
  if (category === 'Sushi' || category === 'Sashimi') return Fish;
  if (category === 'Appetizer') return Soup;
  return IceCream;
};

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{product: any, qty: number}[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        
        // Load Products
        const { data: prodData } = await supabase
          .from('products')
          .select('*');
          
        if (prodData) {
          const mapped = prodData.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category, 
            price: item.price,
            stock: item.stock,
            color: item.category === 'Minuman' ? "bg-amber-700/20 text-amber-700" : (item.category === 'Sushi' || item.category === 'Sashimi') ? "bg-orange-600/20 text-orange-600" : item.category === 'Appetizer' ? "bg-emerald-600/20 text-emerald-600" : "bg-pink-600/20 text-pink-600",
            icon: getIcon(item.category)
          }));
          setProducts(mapped);
        }

        // Load Customers
        const { data: custData } = await supabase
          .from('customers')
          .select('id, name');
        if (custData) setCustomers(custData);
        
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.product.id !== id || item.qty + delta > 0)); 
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const filteredProducts = products.filter(p => 
    (activeCategory === "Semua Kategori" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["Semua Kategori", ...Array.from(new Set(products.map(p => p.category)))];

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const supabase = createClient();
      const generatedInvoice = `INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      setInvoiceNumber(generatedInvoice);
      
      // 1. Insert into sales
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          invoice_no: generatedInvoice,
          total_amount: total,
          payment_method: paymentMethod,
          date: new Date().toISOString().split('T')[0],
          customer_id: selectedCustomer ? parseInt(selectedCustomer) : null
        })
        .select()
        .single();
        
      if (saleError) throw saleError;

      // 2. Insert into sale_items
      const itemsToInsert = cart.map(item => ({
        sale_id: saleData.id,
        product_id: item.product.id,
        qty: item.qty,
        price: item.product.price,
        total: item.product.price * item.qty
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      setIsPaymentSuccess(true);
    } catch (e) {
      console.error(e);
      alert("Gagal memproses pembayaran. Cek koneksi Supabase Anda.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewOrder = () => {
    setCart([]);
    setIsPaymentSuccess(false);
    setPaymentMethod("Tunai");
    setSelectedCustomer(null);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <ChatWidget />
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-100/50 to-transparent pointer-events-none"></div>
        
        {/* Header */}
        <header className="px-8 py-6 flex justify-between items-center z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Kasir Sushi</h1>
            <p className="text-slate-500 text-sm mt-1">Cabang Tokyo • Shift Pagi</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu..." 
                className="pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64 transition-all"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200">
              <span className="text-slate-700 font-semibold text-sm">KS</span>
            </div>
          </div>
        </header>

        {/* Categories */}
        <div className="px-8 pb-4 flex gap-3 overflow-x-auto no-scrollbar z-10">
          {categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                  : "bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Memuat menu dari database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group flex flex-col h-full hover:-translate-y-1"
                >
                  <div className={`w-full h-32 rounded-xl mb-4 flex items-center justify-center ${product.color} transition-transform group-hover:scale-[1.02]`}>
                    <product.icon className="w-12 h-12 opacity-80" />
                  </div>
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-bold text-slate-800 leading-tight mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-indigo-600">Rp {product.price.toLocaleString('id-ID')}</span>
                      <button className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      <aside className="w-[380px] bg-white border-l border-slate-200 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] z-20">
        <div className="px-6 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Pesanan Saat Ini
          </h2>
          <div className="mt-4 flex items-center gap-2 text-sm">
             <User className="w-4 h-4 text-slate-400" />
             <select 
               className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
               value={selectedCustomer || ""}
               onChange={(e) => setSelectedCustomer(e.target.value)}
             >
               <option value="">Pelanggan Umum</option>
               {customers.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
             </select>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p className="text-sm">Belum ada pesanan</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-all">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{item.product.name}</h4>
                  <span className="text-indigo-600 font-semibold text-sm">Rp {(item.product.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100">
                  <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 shadow-sm transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-4 text-center font-bold text-sm text-slate-700">{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 shadow-sm transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-6 bg-slate-50/80 border-t border-slate-200 rounded-tl-3xl mt-auto">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Subtotal</span>
              <span className="font-medium text-slate-700">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Pajak (11%)</span>
              <span className="font-medium text-slate-700">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="h-px w-full bg-slate-200 my-1"></div>
            <div className="flex justify-between items-end">
              <span className="font-bold text-slate-800">Total</span>
              <span className="text-2xl font-black text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button 
              onClick={() => setPaymentMethod("Tunai")}
              className={`py-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'Tunai' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Banknote className="w-4 h-4 mb-1" /> Tunai
            </button>
            <button 
              onClick={() => setPaymentMethod("Debit")}
              className={`py-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'Debit' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <CreditCard className="w-4 h-4 mb-1" /> Debit
            </button>
            <button 
              onClick={() => setPaymentMethod("QRIS")}
              className={`py-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'QRIS' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <QrCode className="w-4 h-4 mb-1" /> QRIS
            </button>
          </div>
          <button 
            onClick={handlePayment}
            disabled={cart.length === 0 || isProcessing}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
            ) : (
              <>Bayar {paymentMethod} <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </aside>

      {/* Success Modal Overlay */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white ring-4 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-slate-500 mb-6 text-sm">Transaksi via <span className="font-bold text-slate-700">{paymentMethod}</span> telah dicatat secara aman ke database Supabase.</p>
            
            <div className="w-full bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
              <div className="flex justify-between items-center text-sm mb-3 text-slate-500">
                <span>Nomor Struk</span>
                <span className="font-medium text-slate-700">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Total Bayar</span>
                <span className="font-bold text-indigo-600 text-xl">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full">
              <button onClick={() => {}} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors">
                Cetak Struk
              </button>
              <button onClick={handleNewOrder} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                Pesanan Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
