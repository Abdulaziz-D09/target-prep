const html = `Nucleobase Concentrations from Murchison Meteorite and Soil Samples in Parts per Billion

<table> <thead> <tr> <th>Nucleobase</th> <th>Murchison meteorite sample 1</th> <th>Murchison meteorite sample 2</th> <th>Murchison soil sample</th> </tr> </thead> <tbody> <tr> <td>Isoguanine</td> <td>0.5</td> <td>0.04</td> <td>not detected</td> </tr> <tr> <td>Purine</td> <td>0.2</td> <td>0.02</td> <td>not detected</td> </tr> <tr> <td>Xanthine</td> <td>39</td> <td>3</td> <td>1</td> </tr> <tr> <td>Adenine</td> <td>15</td> <td>1</td> <td>40</td> </tr> <tr> <td>Hypoxanthine</td> <td>24</td> <td>1</td> <td>2</td> </tr> </tbody> </table>

Employing high-performance liquid chromatography—a process that uses pressurized water to separate material into its component molecules—astrochemist Yashiro Oba and colleagues analyzed two samples of the Murchison meteorite that landed in Australia as well as soil from the landing zone of the meteorite to determine the concentrations of various organic molecules. By comparing the relative concentrations of types of molecules known as nucleobases in the Murchison meteorite with those in the soil, the team concluded that there is evidence that the nucleobases in the Murchison meteorite formed in space and are not the result of contamination on Earth.`;

  // Convert any raw HTML <table> tags into Markdown-style tables before parsing
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let cleaned = html.replace(tableRegex, (match, inner) => {
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

  const tableRe=/__TABLE__[\r\n]+([\s\S]*?)__ENDTABLE__/g;
  let matches = 0;
  while((m=tableRe.exec(cleaned))!==null){
    matches++;
  }
  
  console.log("Matches:", matches);
  console.log(cleaned.includes("<table>"));
