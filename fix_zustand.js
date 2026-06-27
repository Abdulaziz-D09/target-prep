const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  const regex = /const\s+\{\s*([^}]+)\s*\}\s*=\s*useClassroomStore\(\);/g;
  
  let modified = false;
  content = content.replace(regex, (match, vars) => {
    modified = true;
    const parts = vars.split(',').map(p => p.trim()).filter(Boolean);
    return parts.map(p => {
        if (p.includes(':')) {
            const [key, alias] = p.split(':').map(x => x.trim());
            return `const ${alias} = useClassroomStore(state => state.${key});`;
        }
        return `const ${p} = useClassroomStore(state => state.${p});`;
    }).join('\n    ');
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
