const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'index.html',
  'vite.config.ts',
  'src/components/Layout.tsx',
  'src/pages/LandingPage.tsx',
  'src/pages/RoleSelection.tsx',
  'src/pages/LoginPage.tsx',
  'src/services/geminiService.ts',
  'README.md'
];

filesToUpdate.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace in order of specificity
  content = content.replace(/FreshCheck AI/g, 'OpenTable');
  content = content.replace(/FreshLink AI/g, 'OpenTable');
  content = content.replace(/FreshLink/g, 'OpenTable');

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + f);
});

console.log('Renaming complete');
