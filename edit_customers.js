const fs = require('fs');
let code = fs.readFileSync('src/app/customers/page.tsx', 'utf-8');

// 1. Add states
code = code.replace(
  '  const [searchQuery, setSearchQuery] = useState("");',
  '  const [searchQuery, setSearchQuery] = useState("");\n  const [filterStatus, setFilterStatus] = useState("Semua Status");\n  const [filterTier, setFilterTier] = useState("Semua Tier");'
);

// 2. Update filteredCustomers
code = code.replace(
  `  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.phone && c.phone.includes(searchQuery))
  );`,
  `  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone && c.phone.includes(searchQuery));
    const matchStatus = filterStatus === "Semua Status" || c.status === filterStatus;
    const matchTier = filterTier === "Semua Tier" || c.tier === filterTier;
    return matchSearch && matchStatus && matchTier;
  });`
);

// 3. Update UI select elements and reset
code = code.replace(
  `                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm">
                      <option>Status</option>
                      <option>Semua Status</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm">
                      <option>Membership</option>
                      <option>Semua Tier</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[13px] rounded-xl hover:bg-slate-50 transition-colors shadow-sm ml-auto font-medium">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
                  </button>`,
  `                  <div className="relative">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm"
                    >
                      <option value="Semua Status">Semua Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select 
                      value={filterTier}
                      onChange={(e) => setFilterTier(e.target.value)}
                      className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] appearance-none focus:outline-none focus:border-violet-500 shadow-sm"
                    >
                      <option value="Semua Tier">Semua Tier</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Bronze">Bronze</option>
                      <option value="Member">Member</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <button 
                    onClick={() => { setSearchQuery(""); setFilterStatus("Semua Status"); setFilterTier("Semua Tier"); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[13px] rounded-xl hover:bg-slate-50 transition-colors shadow-sm ml-auto font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
                  </button>`
);

fs.writeFileSync('src/app/customers/page.tsx', code);
console.log("Successfully updated customers page.");
