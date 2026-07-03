const body = `| Ondo State region | cereals | root crops | non–root vegetables |
| north Ondo | 30 | 17 | 59 |
| central Ondo | 37 | 20 | 45 |
| south Ondo | 36 | 19 | 53 |`;

function parseTable(body,fallbackTitle){
  const lines=body.split(/\r?\n/).map(l=>l.trim()).filter(l=>l&&!l.startsWith('__'));
  let title=fallbackTitle; const rows=[];
  for(const l of lines){
    if(l.includes('|')){
      const cells=l.split('|').map(c=>c.trim());
      const cleaned=cells[0]===''&&cells[cells.length-1]===''
        ? cells.slice(1,-1)
        : cells;
      const isSeparator=cleaned.every(c=>/^[-:| ]+$/.test(c));
      if(!isSeparator) rows.push(cleaned);
    } else if(!title && l){
      title=l;
    }
  }
  const [header=[],...rest]=rows;
  return {kind:'table',title,header,rows:rest};
}

console.log(JSON.stringify(parseTable(body, ''), null, 2));
