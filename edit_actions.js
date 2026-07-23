const fs = require('fs');
let code = fs.readFileSync('src/app/transactions/page.tsx', 'utf-8');

// 1. Update the select query to fetch 'status' and use it
code = code.replace(
  '.select("id, invoice_no, total_amount, payment_method, created_at, customers(name, phone)")',
  '.select("id, invoice_no, total_amount, payment_method, created_at, status, customers(name, phone)")'
);

code = code.replace(
  '            total: item.total_amount,\n            status: "Berhasil",',
  '            total: item.total_amount,\n            status: item.status || "Berhasil",'
);

// 2. Add handlers
const handlers = `
  const handleRefund = async () => {
    if (!selectedTxData || selectedTxData.status === "Refund") return;
    if (!confirm("Apakah Anda yakin ingin memproses refund untuk transaksi ini?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("sales")
        .update({ status: "Refund" })
        .eq("id", selectedTxData.dbId);

      if (!error) {
        alert("Transaksi berhasil di-refund!");
        setTransactions(prev => prev.map(t => t.id === selectedTxData.id ? { ...t, status: "Refund" } : t));
        setSelectedTxData({ ...selectedTxData, status: "Refund" });
      } else {
        alert("Gagal melakukan refund.");
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReprint = () => {
    if (!selectedTxData) return;
    alert("Mencetak struk untuk transaksi: " + selectedTxData.id);
    window.print();
  };
`;

code = code.replace(
  '  const toggleCheck = (id: string) =>',
  handlers + '\n  const toggleCheck = (id: string) =>'
);

// 3. Update buttons
const buttonsOld = `                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors">
                      <Printer className="w-3.5 h-3.5" /> Cetak Ulang Struk
                    </button>
                    <button className="flex items-center justify-center gap-1.5 bg-red-50 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl text-xs hover:bg-red-100 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Refund
                    </button>
                  </div>`;

const buttonsNew = `                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleReprint} className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors">
                      <Printer className="w-3.5 h-3.5" /> Cetak Ulang Struk
                    </button>
                    <button onClick={handleRefund} disabled={selectedTxData.status === "Refund"} className="flex items-center justify-center gap-1.5 bg-red-50 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl text-xs hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <RotateCcw className="w-3.5 h-3.5" /> {selectedTxData.status === "Refund" ? "Direfund" : "Refund"}
                    </button>
                  </div>`;

code = code.replace(buttonsOld, buttonsNew);

fs.writeFileSync('src/app/transactions/page.tsx', code);
console.log("Successfully updated transactions actions.");
