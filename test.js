const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));
const q = data.find(q => q.id === '403fb4e4');

let raw = q.passage;

  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let cleaned = raw.replace(tableRegex, (match, inner) => {
      const rows = [];
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      while ((trMatch = rowRegex.exec(inner)) !== null) {
          const trInner = trMatch[1];
          const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
          const cells = [];
          let cellMatch;
          while ((cellMatch = cellRegex.exec(trInner)) !== null) {
              cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\n/g, ' '));
          }
          if (cells.length > 0) rows.push(cells);
      }
      if (rows.length === 0) return match;
      let md = '\n__TABLE__\n';
      for (let i = 0; i < rows.length; i++) {
          md += '| ' + rows[i].join(' | ') + ' |\n';
      }
      md += '__ENDTABLE__\n';
      return md;
  });

console.log("CLEANED:", cleaned);
