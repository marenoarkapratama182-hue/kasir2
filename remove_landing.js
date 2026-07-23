const fs = require('fs');
const path = require('path');

// 1. Replace src/app/page.tsx
const pageTsxPath = path.join(__dirname, 'src', 'app', 'page.tsx');
fs.writeFileSync(pageTsxPath, `import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}
`);

// 2. Remove "Beranda" / "Kembali ke Landing Page" from all sidebars
const pagesDir = path.join(__dirname, 'src', 'app');
const pages = [
  'admin/page.tsx',
  'chatbot/page.tsx',
  'customers/page.tsx',
  'pos/page.tsx',
  'products/page.tsx',
  'settings/page.tsx',
  'transactions/page.tsx'
];

for (const p of pages) {
  const filePath = path.join(pagesDir, p);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove the object from navItems
    // Regex to match the Beranda or Kembali ke Landing Page item
    content = content.replace(/\s*\{\s*label:\s*"(Beranda|Kembali ke Landing Page)",\s*icon:\s*Home,\s*href:\s*"\/"\s*\},/g, '');
    
    // In pos/page.tsx, also change the top header link
    if (p === 'pos/page.tsx') {
      content = content.replace(/href="\/"\s*className="flex items-center gap-2 px-3 py-1\.5 -ml-2 rounded-lg text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors border border-transparent hover:border-violet-100 font-medium text-sm shadow-sm" title="Kembali ke Beranda"/g, 
      'href="/admin" className="flex items-center gap-2 px-3 py-1.5 -ml-2 rounded-lg text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors border border-transparent hover:border-violet-100 font-medium text-sm shadow-sm" title="Kembali ke Dashboard"');
    }
    
    fs.writeFileSync(filePath, content);
  }
}

console.log("Successfully removed landing page and updated nav items.");
