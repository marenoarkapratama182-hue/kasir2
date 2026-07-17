"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Halo! Saya Kasir Pintar AI. Coba tanya: 'Apa saja menu sushi?', 'Cek stok', atau 'Berapa total penjualan hari ini?'" }
  ]);
  const [input, setInput] = useState("");
  const supabase = createClient();

  const processQuery = async (query: string) => {
    const q = query.toLowerCase();
    
    try {
      // 1. Menu & Harga
      if (q.includes("menu") || q.includes("produk") || q.includes("harga") || q.includes("sushi")) {
        const { data, error } = await supabase.from("products").select("name, price").order("price", { ascending: false }).limit(5);
        if (error || !data || data.length === 0) return "Maaf, saya tidak bisa menemukan daftar menu saat ini.";
        
        let response = "Ini dia beberapa menu andalan kita:\n";
        data.forEach(item => {
          response += `🍣 ${item.name} - Rp ${item.price.toLocaleString('id-ID')}\n`;
        });
        return response;
      }
      
      // 2. Stok
      if (q.includes("stok") || q.includes("habis") || q.includes("sisa")) {
        const { data, error } = await supabase.from("products").select("name, stock").order("stock", { ascending: true }).limit(5);
        if (error || !data || data.length === 0) return "Maaf, saya tidak bisa mengecek stok saat ini.";
        
        let response = "Status stok saat ini (paling sedikit):\n";
        data.forEach(item => {
          response += `📦 ${item.name}: sisa ${item.stock} porsi\n`;
        });
        return response;
      }

      // 3. Penjualan
      if (q.includes("penjualan") || q.includes("transaksi") || q.includes("laku") || q.includes("pendapatan")) {
        const { data, error } = await supabase.from("sales").select("total_amount");
        if (error || !data) return "Maaf, data penjualan sedang tidak dapat diakses.";
        
        const total = data.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
        return `Total pendapatan restoran saat ini adalah 💰 Rp ${total.toLocaleString('id-ID')} dari ${data.length} transaksi!`;
      }

      // 4. Pelanggan
      if (q.includes("pelanggan") || q.includes("member") || q.includes("siapa")) {
        const { data, error } = await supabase.from("customers").select("name, member_level").limit(5);
        if (error || !data || data.length === 0) return "Belum ada data pelanggan.";
        
        let response = "Daftar beberapa pelanggan setia kita:\n";
        data.forEach(c => {
          response += `👤 ${c.name} (Level: ${c.member_level})\n`;
        });
        return response;
      }

      // Default Response
      return "Maaf, saya belum mengerti maksud Anda. Coba tanya seputar 'menu', 'stok', 'pelanggan', atau 'penjualan'.";
      
    } catch (err) {
      return "Terjadi kesalahan saat menghubungi database.";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);
    
    // Process the query
    const aiResponse = await processQuery(userMessage);
    
    // Simulate thinking delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: "550px", maxHeight: "85vh" }}>
        
        <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asisten AI Kasir</h3>
              <p className="text-[10px] text-indigo-100">Online • Terhubung ke Database</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
          <div className="flex justify-center mb-2">
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Hari ini</span>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-indigo-600 border border-slate-100'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center shadow-sm bg-white text-indigo-600 border border-slate-100">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya stok, menu, atau penjualan..." 
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" style={{ marginLeft: "2px" }} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
