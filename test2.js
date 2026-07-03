const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));
const q = data.find(q => q.id === '403fb4e4');

// Copied exactly from PassageRenderer
function cleanOCR(text) {
  if (!text) return text;
  let out = text
    .replace(/ﬁ/g, 'fi').replace(/ﬀ/g, 'ff').replace(/ﬃ/g, 'ffi')
    .replace(/ﬄ/g, 'ffl').replace(/ﬂ/g, 'fl').replace(/ﬅ/g, 'st')
    .replace(/\xa0/g, ' ');
  out = out.replace(/(^|\n)¢\s*/g, '$1• ');
  out = out.replace(/(^|\n)e\s+(?=[A-Z])/g, '$1• ');
  out = out.replace(/(^|\n)[*•·]\s*/g, '$1• ');
  out = out.replace(/(\w)' s\b/g, "$1's");
  out = out.replace(/(\w)' t\b/g, "$1't");
  out = out.replace(/ {2,}/g, ' ');
  out = out.replace(/\s*__TABLE__\s*/g, '\n__TABLE__\n');
  out = out.replace(/\s*__ENDTABLE__\s*/g, '\n__ENDTABLE__\n');
  return out;
}

let cleaned = cleanOCR(q.passage);

  // Convert any raw HTML <table> tags into Markdown-style tables before parsing
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

console.log("CLEANED PASS 1:", cleaned.includes('__TABLE__'));

  cleaned = cleaned.replace(
    /(\n|^)([ \t]*\|[^\n]+\n[ \t]*\|[-:| ]+\|\n(?:[ \t]*\|[^\n]*\n?)*)/gm,
    function(match, newline, table) {
      if (match.includes('__TABLE__')) return match;
      return `${newline}\n__TABLE__\n${table.trim()}\n__ENDTABLE__\n`;
    }
  );

console.log("CLEANED FINAL:", cleaned);
