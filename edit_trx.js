const fs = require('fs');
let code = fs.readFileSync('src/app/transactions/page.tsx', 'utf-8');

// 1. Add States
code = code.replace(
  '  const [search, setSearch] = useState("");',
  '  const [search, setSearch] = useState("");\n  const [filterDate, setFilterDate] = useState("");\n  const [filterMethod, setFilterMethod] = useState("Semua Metode");\n  const [filterStatus, setFilterStatus] = useState("Semua Status");\n  const [filterKasir, setFilterKasir] = useState("Semua Kasir");'
);

// 2. Fix filter logic
code = code.replace(
  `  const filtered = transactions.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.pelanggan.toLowerCase().includes(search.toLowerCase()) ||
    t.kasir.toLowerCase().includes(search.toLowerCase())
  );`,
  `  const filtered = transactions.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
                        t.pelanggan.toLowerCase().includes(search.toLowerCase()) ||
                        t.kasir.toLowerCase().includes(search.toLowerCase());
    const matchMethod = filterMethod === "Semua Metode" || t.metode === filterMethod;
    const matchStatus = filterStatus === "Semua Status" || t.status === filterStatus;
    const matchKasir = filterKasir === "Semua Kasir" || t.kasir === filterKasir;
    const matchDate = !filterDate || (t.rawWaktu && t.rawWaktu.startsWith(filterDate));
    return matchSearch && matchMethod && matchStatus && matchKasir && matchDate;
  });`
);

// 3. Update the filter bar UI
const oldFilterBarUI = `            {/* Filter Bar */}
            <div className="px-5 pb-3 flex items-center gap-2 flex-shrink-0">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cari ID / Pelanggan / Kasir..." className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-violet-500 shadow-sm" />
              </div>
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 shadow-sm">09/05/2024 - 09/05/2024 <Calendar className="w-3 h-3" /></button>
              {["Semua Metode", "Semua Status", "Semua Kasir"].map(f => (
                <button key={f} className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 shadow-sm whitespace-nowrap">{f}<ChevronDown className="w-3 h-3 ml-1" /></button>
              ))}
              <div className="flex-1" />
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
                <Download className="w-3.5 h-3.5 text-violet-600" /> Ekspor
              </button>
              <Link href="/pos" className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-colors whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" /> Transaksi Baru
              </Link>
            </div>`;

const newFilterBarUI = `            {/* Filter Bar */}
            <div className="px-5 pb-3 flex items-center gap-2 flex-shrink-0">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari ID / Pelanggan / Kasir..." className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-violet-500 shadow-sm" />
              </div>
              
              <input 
                type="date" 
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none focus:border-violet-500 shadow-sm"
              />

              <div className="relative">
                <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-600 focus:outline-none focus:border-violet-500 shadow-sm">
                  <option value="Semua Metode">Semua Metode</option>
                  <option value="Tunai">Tunai</option>
                  <option value="QRIS">QRIS</option>
                  <option value="Debit/Kredit">Debit/Kredit</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Transfer">Transfer</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-600 focus:outline-none focus:border-violet-500 shadow-sm">
                  <option value="Semua Status">Semua Status</option>
                  <option value="Berhasil">Berhasil</option>
                  <option value="Pending">Pending</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                  <option value="Refund">Refund</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select value={filterKasir} onChange={e => setFilterKasir(e.target.value)} className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-600 focus:outline-none focus:border-violet-500 shadow-sm">
                  <option value="Semua Kasir">Semua Kasir</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Sarah A.">Sarah A.</option>
                  <option value="Budi K.">Budi K.</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {(filterDate || filterMethod !== "Semua Metode" || filterStatus !== "Semua Status" || filterKasir !== "Semua Kasir" || search) && (
                <button 
                  onClick={() => {
                    setSearch(""); setFilterDate(""); setFilterMethod("Semua Metode"); setFilterStatus("Semua Status"); setFilterKasir("Semua Kasir");
                  }}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}

              <div className="flex-1" />
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
                <Download className="w-3.5 h-3.5 text-violet-600" /> Ekspor
              </button>
              <Link href="/pos" className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-colors whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" /> Transaksi Baru
              </Link>
            </div>`;

code = code.replace(oldFilterBarUI, newFilterBarUI);

fs.writeFileSync('src/app/transactions/page.tsx', code);
console.log("Successfully updated transactions page filters.");
