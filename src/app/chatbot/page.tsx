"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, FileText, Package, Users, Settings, Bot,
  ChevronDown, LogOut, LayoutDashboard, Send, Loader2,
  TrendingUp, ShoppingBag, DollarSign, Star, RotateCcw, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Kasir", icon: ShoppingCart, href: "/pos" },
  { label: "Transaksi", icon: FileText, href: "/transactions" },
  { label: "Produk", icon: Package, href: "/products" },
  { label: "Pelanggan", icon: Users, href: "/customers" },
  { label: "Chatbot AI", icon: Bot, href: "/chatbot", active: true, badge: "New" },
  { label: "Pengaturan", icon: Settings, href: "/settings" },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  message: string;
  created_at?: string;
};

const SESSION_ID = "session-" + Math.random().toString(36).substr(2, 9);

const QUICK_QUESTIONS = [
  "Berapa total penjualan hari ini?",
  "Produk apa yang paling laku?",
  "Berapa jumlah pelanggan terdaftar?",
  "Tampilkan transaksi terbaru",
  "Berapa rata-rata nilai transaksi?",
];

async function generateBotReply(userMsg: string, supabase: any): Promise<string> {
  const msg = userMsg.toLowerCase();

  // --- Query: Total penjualan / omzet ---
  if (msg.includes("penjualan") || msg.includes("omzet") || msg.includes("total") || msg.includes("revenue")) {
    const { data } = await supabase.from("sales").select("total_amount");
    if (data && data.length > 0) {
      const total = data.reduce((s: number, d: any) => s + (d.total_amount || 0), 0);
      const today = data.length;
      return `📊 **Ringkasan Penjualan**\n\nTotal omzet keseluruhan: **Rp ${total.toLocaleString("id-ID")}**\nJumlah transaksi: **${today} transaksi**\nRata-rata per transaksi: **Rp ${Math.round(total / today).toLocaleString("id-ID")}**\n\nApakah Anda ingin melihat detail lebih lanjut?`;
    }
    return "Belum ada data penjualan yang tersimpan di database.";
  }

  // --- Query: Produk terlaris ---
  if (msg.includes("produk") && (msg.includes("laku") || msg.includes("terlaris") || msg.includes("populer") || msg.includes("best"))) {
    const { data } = await supabase
      .from("sale_items")
      .select("product_id, qty, products(name)")
      .order("qty", { ascending: false })
      .limit(5);
    if (data && data.length > 0) {
      const grouped: Record<string, { name: string; qty: number }> = {};
      data.forEach((d: any) => {
        const name = d.products?.name || "Produk";
        grouped[name] = { name, qty: (grouped[name]?.qty || 0) + d.qty };
      });
      const sorted = Object.values(grouped).sort((a, b) => b.qty - a.qty).slice(0, 5);
      const list = sorted.map((p, i) => `${i + 1}. **${p.name}** — ${p.qty} unit terjual`).join("\n");
      return `🏆 **Produk Terlaris**\n\n${list}\n\nIngin tahu detail stok atau harga produk tertentu?`;
    }
    const { data: prods } = await supabase.from("products").select("name, price, stock").limit(5);
    if (prods && prods.length > 0) {
      const list = prods.map((p: any, i: number) => `${i + 1}. **${p.name}** — Rp ${p.price?.toLocaleString("id-ID")} (Stok: ${p.stock})`).join("\n");
      return `📦 **Daftar Produk**\n\n${list}\n\nKetik nama produk untuk info lebih detail!`;
    }
    return "Belum ada data produk di database.";
  }

  // --- Query: Semua produk ---
  if (msg.includes("produk") || msg.includes("barang") || msg.includes("item")) {
    const { data } = await supabase.from("products").select("name, price, stock, category").limit(8);
    if (data && data.length > 0) {
      const list = data.map((p: any, i: number) => `${i + 1}. **${p.name}** (${p.category}) — Rp ${p.price?.toLocaleString("id-ID")} | Stok: ${p.stock}`).join("\n");
      return `📦 **Daftar Produk (${data.length} item)**\n\n${list}\n\nIngin cari produk tertentu? Ketik nama produknya!`;
    }
    return "Belum ada produk yang terdaftar di database.";
  }

  // --- Query: Pelanggan ---
  if (msg.includes("pelanggan") || msg.includes("customer") || msg.includes("member")) {
    const { data } = await supabase.from("customers").select("id, name").limit(5);
    const { count } = await supabase.from("customers").select("*", { count: "exact", head: true });
    if (count !== null) {
      const list = data?.map((c: any, i: number) => `${i + 1}. ${c.name}`).join("\n") || "";
      return `👥 **Data Pelanggan**\n\nTotal pelanggan terdaftar: **${count} pelanggan**\n\nBeberapa pelanggan terbaru:\n${list}\n\nIngin cari pelanggan tertentu?`;
    }
    return "Belum ada data pelanggan di database.";
  }

  // --- Query: Transaksi terbaru ---
  if (msg.includes("transaksi") || msg.includes("invoice") || msg.includes("struk") || msg.includes("terbaru")) {
    const { data } = await supabase
      .from("sales")
      .select("invoice_no, total_amount, payment_method, created_at, customers(name)")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data && data.length > 0) {
      const list = data.map((t: any, i: number) => {
        const time = new Date(t.created_at).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
        return `${i + 1}. **${t.invoice_no}** — Rp ${t.total_amount?.toLocaleString("id-ID")} | ${t.payment_method} | ${time}`;
      }).join("\n");
      return `🧾 **5 Transaksi Terbaru**\n\n${list}\n\nKetik nomor invoice untuk detail transaksi!`;
    }
    return "Belum ada transaksi yang tercatat.";
  }

  // --- Query: Stok / inventori ---
  if (msg.includes("stok") || msg.includes("stock") || msg.includes("inventori") || msg.includes("habis")) {
    const { data } = await supabase.from("products").select("name, stock").order("stock", { ascending: true }).limit(5);
    if (data && data.length > 0) {
      const lowStock = data.filter((p: any) => p.stock < 10);
      if (lowStock.length > 0) {
        const list = lowStock.map((p: any) => `⚠️ **${p.name}** — hanya tersisa ${p.stock} unit`).join("\n");
        return `📉 **Peringatan Stok Rendah**\n\n${list}\n\nSebaiknya segera lakukan pemesanan ulang untuk produk-produk di atas!`;
      }
      return "✅ Semua stok produk masih aman. Tidak ada produk yang hampir habis.";
    }
    return "Tidak ada data stok produk.";
  }

  // --- Query: Metode pembayaran ---
  if (msg.includes("metode") || msg.includes("pembayaran") || msg.includes("qris") || msg.includes("tunai") || msg.includes("transfer")) {
    const { data } = await supabase.from("sales").select("payment_method");
    if (data && data.length > 0) {
      const counts: Record<string, number> = {};
      data.forEach((d: any) => { counts[d.payment_method] = (counts[d.payment_method] || 0) + 1; });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const list = sorted.map(([m, c]) => `• **${m}**: ${c} transaksi (${Math.round(c / data.length * 100)}%)`).join("\n");
      return `💳 **Metode Pembayaran Terpopuler**\n\n${list}\n\nTotal ${data.length} transaksi tercatat.`;
    }
    return "Belum ada data transaksi pembayaran.";
  }

  // --- Greeting ---
  if (msg.includes("halo") || msg.includes("hai") || msg.includes("hello") || msg.includes("hi") || msg === "hi" || msg === "halo") {
    return `👋 **Halo! Saya AI Assistant Kasir Pintar!**\n\nSaya bisa membantu Anda dengan:\n\n📊 Informasi **penjualan & omzet**\n🏆 Produk **terlaris**\n👥 Data **pelanggan**\n🧾 **Transaksi terbaru**\n📉 Peringatan **stok rendah**\n💳 Analisis **metode pembayaran**\n\nAda yang bisa saya bantu?`;
  }

  // --- Bantuan / Help ---
  if (msg.includes("bantuan") || msg.includes("help") || msg.includes("bisa apa") || msg.includes("fitur")) {
    return `🤖 **Saya bisa menjawab pertanyaan seperti:**\n\n• "Berapa total penjualan hari ini?"\n• "Produk apa yang paling laku?"\n• "Berapa jumlah pelanggan?"\n• "Tampilkan transaksi terbaru"\n• "Stok produk mana yang hampir habis?"\n• "Metode pembayaran apa yang paling banyak digunakan?"\n\nSilakan tanyakan apa saja tentang bisnis Anda! 💡`;
  }

  // --- Default ---
  return `💬 Maaf, saya belum memahami pertanyaan tersebut.\n\nCoba tanyakan hal-hal seperti:\n• Total penjualan atau omzet\n• Produk terlaris\n• Data pelanggan\n• Transaksi terbaru\n• Stok produk\n\nAtau ketik **"bantuan"** untuk melihat semua yang bisa saya lakukan.`;
}

function formatMessage(text: string) {
  return text.split("\n").map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className={`leading-relaxed ${line === "" ? "mt-1" : ""}`} dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      message: "👋 **Halo! Saya AI Assistant Kasir Pintar!**\n\nSaya terhubung langsung ke database bisnis Anda dan siap membantu menjawab pertanyaan seputar penjualan, produk, pelanggan, dan transaksi.\n\nAda yang bisa saya bantu hari ini? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(SESSION_ID);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history from Supabase
  useEffect(() => {
    async function loadHistory() {
      const supabase = createClient();
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (data && data.length > 0) {
        setMessages(prev => [prev[0], ...data]);
      }
    }
    loadHistory();
  }, []);

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = { id: Date.now().toString(), role: "user", message: userText };
    setMessages(prev => [...prev, userMsg]);

    try {
      const supabase = createClient();

      // Save user message to Supabase
      await supabase.from("chat_messages").insert({
        session_id: sessionId, role: "user", message: userText,
      });

      // Generate reply from DB data
      const reply = await generateBotReply(userText, supabase);
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", message: reply };
      setMessages(prev => [...prev, botMsg]);

      // Save bot reply to Supabase
      await supabase.from("chat_messages").insert({
        session_id: sessionId, role: "assistant", message: reply,
      });
    } catch (err) {
      setMessages(prev => [...prev, {
        id: "err", role: "assistant",
        message: "❌ Maaf, terjadi kesalahan saat menghubungi database. Silakan coba lagi."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome", role: "assistant",
      message: "👋 **Halo! Saya AI Assistant Kasir Pintar!**\n\nSaya terhubung langsung ke database bisnis Anda dan siap membantu menjawab pertanyaan seputar penjualan, produk, pelanggan, dan transaksi.\n\nAda yang bisa saya bantu hari ini? 😊",
    }]);
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden text-slate-800" style={{ background: "#f4f5f9" }}>

      {/* ─── SIDEBAR ─── */}
      <aside className="w-[155px] flex-shrink-0 flex flex-col h-full"
        style={{ background: "linear-gradient(180deg, #1a1150 0%, #231860 40%, #2d1f7e 100%)" }}>
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[13px] leading-none">Kasir Pintar</p>
            <p className="text-purple-300 text-[9px] mt-0.5 leading-tight">Smart POS with AI</p>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl mb-0.5 transition-all ${item.active ? "bg-violet-600 text-white shadow-lg" : "text-purple-200 hover:bg-white/10 hover:text-white"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-xs">{item.label}</span>
              {item.badge && <span className="ml-auto bg-emerald-400 text-[9px] text-white font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-3">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2.5 border border-white/10 transition-colors">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">JD</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">John Doe</p>
              <p className="text-purple-300 text-[9px]">Kasir Utama</p>
            </div>
            <LogOut className="w-3 h-3 text-purple-300" />
          </button>
          <p className="text-purple-400 text-[9px] text-center mt-2">© 2024 Kasir Pintar · v2.1.0</p>
        </div>
      </aside>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex h-full overflow-hidden">

        {/* Chat */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800">AI Assistant</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  <span className="text-xs text-slate-500">Terhubung ke database Supabase</span>
                </div>
              </div>
            </div>
            <button onClick={clearChat} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors font-medium">
              <RotateCcw className="w-3.5 h-3.5" /> Hapus Percakapan
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-sm"
                }`}>
                  <div className="space-y-0.5">
                    {formatMessage(msg.message)}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-slate-600 text-[11px] font-bold">JD</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="whitespace-nowrap text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 transition-all flex-shrink-0 shadow-sm">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 pb-5 pt-2 flex-shrink-0">
            <div className="flex gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
              <input
                type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Tanyakan sesuatu tentang bisnis Anda... (Enter untuk kirim)"
                className="flex-1 text-sm focus:outline-none placeholder:text-slate-400 bg-transparent"
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-8 h-8 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">Semua percakapan tersimpan otomatis di Supabase</p>
          </div>
        </div>

        {/* Right: Capability Panel */}
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 overflow-y-auto">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 mb-1">Kemampuan AI</h2>
            <p className="text-xs text-slate-500">Terhubung langsung ke database bisnis Anda</p>
          </div>

          <div className="p-4 space-y-3">
            {[
              { icon: "📊", title: "Analisis Penjualan", desc: "Total omzet, tren harian, dan performa penjualan", color: "bg-violet-50 border-violet-100" },
              { icon: "🏆", title: "Produk Terlaris", desc: "Ranking produk berdasarkan jumlah penjualan", color: "bg-amber-50 border-amber-100" },
              { icon: "👥", title: "Data Pelanggan", desc: "Informasi dan riwayat transaksi pelanggan", color: "bg-blue-50 border-blue-100" },
              { icon: "🧾", title: "Riwayat Transaksi", desc: "Transaksi terbaru dan detail pembayaran", color: "bg-emerald-50 border-emerald-100" },
              { icon: "📉", title: "Peringatan Stok", desc: "Produk yang stoknya hampir habis", color: "bg-red-50 border-red-100" },
              { icon: "💳", title: "Metode Pembayaran", desc: "Analisis metode pembayaran terpopuler", color: "bg-pink-50 border-pink-100" },
            ].map((c, i) => (
              <div key={i} className={`${c.color} border rounded-xl p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{c.icon}</span>
                  <p className="text-xs font-bold text-slate-700">{c.title}</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-4 text-white">
              <Bot className="w-6 h-6 mb-2 opacity-80" />
              <p className="text-xs font-bold mb-1">Database Tersambung</p>
              <p className="text-[10px] opacity-75 leading-relaxed">AI membaca data real-time dari Supabase untuk memberikan jawaban akurat tentang bisnis Anda.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
