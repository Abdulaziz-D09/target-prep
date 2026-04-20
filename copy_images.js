const fs = require('fs');
const path = require('path');
const os = require('os');

const srcDir = path.join(os.homedir(), '.gemini', 'antigravity', 'brain', '3c6d4ecd-90e5-404c-bba7-a44e50038369');
const destDir = path.join(__dirname, 'public', 'portal');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.includes('concept_art') && file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`Copied ${file}`);
  }
});
