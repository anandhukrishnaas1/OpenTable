const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Layout.tsx',
  'src/pages/LandingPage.tsx',
  'src/pages/TransparencyLedger.tsx',
  'src/pages/DonorDashboard.tsx',
  'src/pages/VolunteerDashboard.tsx',
  'src/pages/AdminDashboard.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace Tailwind green classes with orange/yellow where appropriate
  content = content.replace(/green-50/g, 'orange-50');
  content = content.replace(/green-100/g, 'orange-100');
  content = content.replace(/green-200/g, 'orange-200');
  content = content.replace(/green-600/g, 'orange-500'); // make buttons a bit more vibrant
  content = content.replace(/green-700/g, 'orange-600');
  content = content.replace(/green-800/g, 'orange-700');
  
  // Specific gradient string replacement
  content = content.replace(/"bg-green-600 text-white/g, '"bg-gradient-to-r from-yellow-400 to-orange-500 text-white');
  content = content.replace(/bg-green-600/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
  content = content.replace(/hover:bg-green-700/g, 'hover:from-yellow-500 hover:to-orange-600');
  content = content.replace(/hover:text-green-600/g, 'hover:text-orange-500');
  content = content.replace(/text-green-600/g, 'text-orange-500');
  content = content.replace(/text-green-700/g, 'text-orange-600');
  
  fs.writeFileSync(filePath, content);
});
console.log('Colors replaced successfully');
