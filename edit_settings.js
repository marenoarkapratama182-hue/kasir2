const fs = require('fs');
let code = fs.readFileSync('src/app/settings/page.tsx', 'utf-8');

const prefsState = `  const [prefs, setPrefs] = useState({
    active_outlet: 'Pusat',
    timezone: '(GMT+07:00) Jakarta',
    currency: 'IDR - Rupiah',
    language: 'Bahasa Indonesia',
    open_time: '08:00',
    close_time: '21:00',
    tax_enabled: true,
    tax_rate: '11',
    invoice_format: 'INV-{YYYYMMDD}-{0001}',
    rounding: 'Pembulatan Normal',
    qr_invoice: true,
    payment_cash: true,
    payment_qris: true,
    payment_transfer: true,
    payment_debit: true,
    payment_ewallet: true,
    notif_low_stock: true,
    notif_return: true,
    notif_shift: true,
    notif_report: true,
    ai_name: 'Kasir Pintar Bot',
    ai_style: 'Ramah & Profesional',
    ai_confirm: true,
    ai_access: 'Hanya data ringkasan'
  });`;

code = code.replace('  const [address, setAddress] = useState("");', '  const [address, setAddress] = useState("");\n' + prefsState);

code = code.replace(
  '            setAddress(profile.address || "");',
  '            setAddress(profile.address || "");\n            if (profile.preferences) {\n              setPrefs(prev => ({ ...prev, ...profile.preferences }));\n            }'
);

code = code.replace(
  '          address: address\n        })',
  '          address: address,\n          preferences: prefs\n        })'
);

const handlePrefChange = (key) => `(e) => setPrefs(prev => ({ ...prev, ${key}: e.target.value }))`;
const handleToggle = (key) => `(val) => setPrefs(prev => ({ ...prev, ${key}: val }))`;

code = code.replace('<select className=', `<select value={prefs.active_outlet} onChange={${handlePrefChange("active_outlet")}} className=`);
code = code.replace('<select className=', `<select value={prefs.timezone} onChange={${handlePrefChange("timezone")}} className=`);
code = code.replace('<select className=', `<select value={prefs.currency} onChange={${handlePrefChange("currency")}} className=`);
code = code.replace('<select className=', `<select value={prefs.language} onChange={${handlePrefChange("language")}} className=`);
code = code.replace('defaultValue="08:00"', `value={prefs.open_time} onChange={${handlePrefChange("open_time")}}`);
code = code.replace('defaultValue="21:00"', `value={prefs.close_time} onChange={${handlePrefChange("close_time")}}`);

code = code.replace('<Toggle defaultChecked={true} />', `<Toggle defaultChecked={prefs.tax_enabled} onChange={${handleToggle("tax_enabled")}} />`);
code = code.replace('defaultValue="11"', `value={prefs.tax_rate} onChange={${handlePrefChange("tax_rate")}}`);
code = code.replace('defaultValue="INV-{YYYYMMDD}-{0001}"', `value={prefs.invoice_format} onChange={${handlePrefChange("invoice_format")}}`);
code = code.replace('<select className=', `<select value={prefs.rounding} onChange={${handlePrefChange("rounding")}} className=`);
code = code.replace('<Toggle defaultChecked={true} />', `<Toggle defaultChecked={prefs.qr_invoice} onChange={${handleToggle("qr_invoice")}} />`);

code = code.replace(
  '{ icon: "💵", label: "Tunai", checked: true },',
  '{ icon: "💵", label: "Tunai", checked: prefs.payment_cash, key: "payment_cash" },'
);
code = code.replace(
  '{ icon: "📱", label: "QRIS", checked: true },',
  '{ icon: "📱", label: "QRIS", checked: prefs.payment_qris, key: "payment_qris" },'
);
code = code.replace(
  '{ icon: "🏦", label: "Transfer", checked: true },',
  '{ icon: "🏦", label: "Transfer", checked: prefs.payment_transfer, key: "payment_transfer" },'
);
code = code.replace(
  '{ icon: "💳", label: "Debit/Kredit", checked: true },',
  '{ icon: "💳", label: "Debit/Kredit", checked: prefs.payment_debit, key: "payment_debit" },'
);
code = code.replace(
  '{ icon: "👛", label: "E-Wallet", checked: true },',
  '{ icon: "👛", label: "E-Wallet", checked: prefs.payment_ewallet, key: "payment_ewallet" },'
);
code = code.replace('<Toggle defaultChecked={m.checked} />', '<Toggle defaultChecked={m.checked} onChange={(val) => setPrefs(prev => ({ ...prev, [m.key]: val }))} />');

code = code.replace(
  '{ title: "Stok Menipis", desc: "Dapatkan notifikasi saat stok hampir habis", checked: true },',
  '{ title: "Stok Menipis", desc: "Dapatkan notifikasi saat stok hampir habis", checked: prefs.notif_low_stock, key: "notif_low_stock" },'
);
code = code.replace(
  '{ title: "Retur", desc: "Dapatkan notifikasi retur dari pelanggan", checked: true },',
  '{ title: "Retur", desc: "Dapatkan notifikasi retur dari pelanggan", checked: prefs.notif_return, key: "notif_return" },'
);
code = code.replace(
  '{ title: "Shift Kasir", desc: "Notifikasi pergantian shift kasir", checked: true },',
  '{ title: "Shift Kasir", desc: "Notifikasi pergantian shift kasir", checked: prefs.notif_shift, key: "notif_shift" },'
);
code = code.replace(
  '{ title: "Laporan Harian", desc: "Kirim ringkasan laporan setiap hari", checked: true },',
  '{ title: "Laporan Harian", desc: "Kirim ringkasan laporan setiap hari", checked: prefs.notif_report, key: "notif_report" },'
);
code = code.replace('<Toggle defaultChecked={n.checked} />', '<Toggle defaultChecked={n.checked} onChange={(val) => setPrefs(prev => ({ ...prev, [n.key]: val }))} />');

code = code.replace('defaultValue="Kasir Pintar Bot"', `value={prefs.ai_name} onChange={${handlePrefChange("ai_name")}}`);
code = code.replace('<select className=', `<select value={prefs.ai_style} onChange={${handlePrefChange("ai_style")}} className=`);
code = code.replace('<Toggle defaultChecked={true} />', `<Toggle defaultChecked={prefs.ai_confirm} onChange={${handleToggle("ai_confirm")}} />`);
code = code.replace('<select className=', `<select value={prefs.ai_access} onChange={${handlePrefChange("ai_access")}} className=`);

fs.writeFileSync('src/app/settings/page.tsx', code);
console.log("Successfully updated settings page.");
