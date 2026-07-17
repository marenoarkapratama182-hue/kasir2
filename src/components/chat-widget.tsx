"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Halo! Saya Kasir Pintar AI. Ada yang bisa saya bantu hari ini? Misalnya mencari produk, melihat stok, atau meringkas penjualan harian." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Tambah pesan user
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    
    // Simulasi respons AI
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "Maaf, saat ini saya masih dalam versi mockup UI. Segera saya akan dihubungkan ke database untuk melayani perintah Anda secara nyata!" }]);
    }, 1000);
  };

  return (
    <>
      {/* Tombol Buka Chat */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 hover:shadow-indigo-300 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Jendela Chat */}
      <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: "550px", maxHeight: "85vh" }}>
        
        {/* Header Chat */}
        <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asisten AI Kasir</h3>
              <p className="text-[10px] text-indigo-100">Online • Siap membantu</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daftar Pesan */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
          <div className="flex justify-center mb-2">
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Hari ini</span>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-indigo-600 border border-slate-100'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Area Input Chat */}
        <div className="p-3 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik perintah atau pertanyaan..." 
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1.5 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" style={{ marginLeft: "2px" }} />
            </button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[9px] text-slate-400">AI dapat berhalusinasi. Selalu tinjau perintah kritis.</span>
          </div>
        </div>
      </div>
    </>
  );
}
