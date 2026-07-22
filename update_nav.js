const fs = require('fs');
const files = [
  "src/app/admin/page.tsx",
  "src/app/chatbot/page.tsx",
  "src/app/customers/page.tsx",
  "src/app/products/page.tsx",
  "src/app/settings/page.tsx"
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('label: "Beranda"')) {
    if (!content.includes('Home')) {
      content = content.replace(/} from "lucide-react";/, ', Home\n} from "lucide-react";');
    }
    content = content.replace(/const navItems = \[/, 'const navItems = [\n  { label: "Beranda", icon: Home, href: "/" },');
    fs.writeFileSync(f, content);
  }
});
console.log("Done");
