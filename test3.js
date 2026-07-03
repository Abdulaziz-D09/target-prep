const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));

// find the nucleobase question
const q = data.find(q => q.passage && q.passage.includes('Nucleobase Concentrations'));

let cleaned = q.passage;

  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  cleaned = cleaned.replace(tableRegex, (match, inner) => {
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

console.log(cleaned.includes('__TABLE__'));
