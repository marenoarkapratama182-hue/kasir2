const fs = require('fs');
let code = fs.readFileSync('src/app/pos/page.tsx', 'utf-8');

// 1. Add prefs and loading profile
code = code.replace(
  '  const [cashReceived, setCashReceived] = useState("");\n  const router = useRouter();\n\n  useEffect(() => {\n    async function loadData() {\n      try {\n        const supabase = createClient();\n        const { data: prodData } = await supabase.from("products").select("*");',
  `  const [cashReceived, setCashReceived] = useState("");
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
        
        const { data: prodData } = await supabase.from("products").select("*");`
);

// 2. Tax Calculation
code = code.replace(
  '  const discount = Math.floor(subtotal * 0.05);\n  const tax = Math.floor((subtotal - discount) * 0.10);\n  const total = subtotal - discount + tax;',
  `  const discount = Math.floor(subtotal * 0.05);
  const taxRate = prefs?.tax_enabled !== false ? parseFloat(prefs?.tax_rate || "10") / 100 : 0;
  const tax = Math.floor((subtotal - discount) * taxRate);
  const total = subtotal - discount + tax;`
);

// 3. Tax text in UI
code = code.replace(
  '                <div className="flex justify-between text-xs text-slate-500">\n                  <span>Pajak (10%)</span>\n                  <span className="font-medium text-slate-700">Rp {tax.toLocaleString("id-ID")}</span>\n                </div>',
  `                {prefs?.tax_enabled !== false && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Pajak ({prefs?.tax_rate || "10"}%)</span>
                    <span className="font-medium text-slate-700">Rp {tax.toLocaleString("id-ID")}</span>
                  </div>
                )}`
);

// 4. Payment Methods array
code = code.replace(
  '              <div>\n                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Metode Pembayaran</p>\n                <div className="grid grid-cols-4 gap-1.5 mb-3">\n                  {[\n                    { id: "Tunai", icon: Banknote, label: "Tunai" },\n                    { id: "QRIS", icon: QrCode, label: "QRIS" },\n                    { id: "Debit", icon: CreditCard, label: "Debit/Kredit" },\n                    { id: "E-Wallet", icon: Wallet, label: "E-Wallet" },\n                  ].map((m) => (\n                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}',
  `              <div>
                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Metode Pembayaran</p>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {[
                    { id: "Tunai", icon: Banknote, label: "Tunai", prefKey: "payment_cash" },
                    { id: "QRIS", icon: QrCode, label: "QRIS", prefKey: "payment_qris" },
                    { id: "Transfer", icon: CreditCard, label: "Transfer", prefKey: "payment_transfer" },
                    { id: "Debit", icon: CreditCard, label: "Debit/Kredit", prefKey: "payment_debit" },
                    { id: "E-Wallet", icon: Wallet, label: "E-Wallet", prefKey: "payment_ewallet" },
                  ].filter(m => !prefs || prefs[m.prefKey]).map((m) => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}`
);

fs.writeFileSync('src/app/pos/page.tsx', code);
console.log("Successfully updated pos page.");
