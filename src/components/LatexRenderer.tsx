'use client';
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ZoomableImage } from './ZoomableImage';

interface LatexRendererProps {
  text: string;
  className?: string;
  removeBlankLines?: boolean;
}

export function LatexRenderer({ text, className = '', removeBlankLines = false }: LatexRendererProps) {
  if (!text) return null;

  let preprocessed = text
    .replace(/(^|[\s(\[{])\*([a-zA-Z]+[a-zA-Z0-9\s]*)\*(?=[.,!?:;)\]}\s]|$)/g, '$1<i>$2</i>')
    .replace(/__IMAGE__[^\n]*\n?!\[[^\]]*\]\([^)]*\)\n?__ENDIMAGE__/g, '')
    .replace(/(!\[[^\]]*\]\([^)]+\))\n+/g, '$1') // Remove newlines immediately after images
    .replace(/(?:\\_){4,}/g, '_______') // Fix LlamaParse escaped blanks
    .replace(/^#{1,6}\s+/gm, '') // Remove markdown heading artifacts like ###
    .replace(/(?:^\s*\$?)?([^$\n]+?)\s*\\\[\?\](?:[$\s]*)([^$\n]+?)(?:[$\s]*)$/gm, '$$$1 32$$\n$$$2$$')
    .replace(/\\\[\?\]/g, '\\\\');

  if (removeBlankLines) {
    preprocessed = preprocessed.replace(/\n(?:[\s\r]*\n)+/g, '\n');
  }
  
  preprocessed = preprocessed.trim();

  // Convert HTML tables to Markdown tables
  const htmlTableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  preprocessed = preprocessed.replace(htmlTableRegex, (match, inner) => {
      const rows: string[][] = [];
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      while ((trMatch = rowRegex.exec(inner)) !== null) {
          const trInner = trMatch[1];
          const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
          const cells: string[] = [];
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

  // Convert $$ to $ if it is placed inline with text on the same line
  preprocessed = preprocessed.split('\n').map(line => {
    if (/^\s*\$\$.*?\$\$\s*$/.test(line)) {
      return line;
    }
    return line.replace(/\$\$(.*?)\$\$/g, '$$$1$');
  }).join('\n');


  // Auto-wrap markdown tables if not already wrapped.
  // A markdown table starts with a | row, followed by a |---| separator row.
  preprocessed = preprocessed.replace(
    /(\n|^)([ \t]*\|[^\n]+\n[ \t]*\|[-:| ]+\|\n(?:[ \t]*\|[^\n]*\n?)*)/gm,
    function(match, newline, table) {
      // Don't double-wrap
      if (match.includes('__TABLE__')) return match;
      return `${newline}\n__TABLE__\n${table.trim()}\n__ENDTABLE__\n`;
    }
  );

  const segments: React.ReactNode[] = [];
  
  // FIRST, extract tables to protect them from math splitting!
  const tableRegex = /(__TABLE__[\s\S]*?__ENDTABLE__|(?:(?:^|\n)(?:\|[^\n]+\|(?:\n|$))+))/g;
  const tableParts = preprocessed.split(tableRegex);

  tableParts.forEach((tPart, tIndex) => {
    if (!tPart) return;

    if (tPart.startsWith('__TABLE__') || (tPart.trim().startsWith('|') && tPart.trim().endsWith('|') && tPart.includes('\n'))) {
      const rawTable = tPart.replace(/__TABLE__/g, '').replace(/__ENDTABLE__/g, '').trim();
      const lines = rawTable.split('\n').filter(line => line.trim().length > 0);
      const rows = lines.filter(line => !line.match(/^[-:|\s]+$/)).map(line => {
         const cells = line.split('|').map(c => c.trim());
         // Only remove first/last cell if it was an empty cell caused by an outer pipe
         if (cells.length > 1 && cells[0] === '' && line.trim().startsWith('|')) cells.shift();
         if (cells.length > 1 && cells[cells.length - 1] === '' && line.trim().endsWith('|')) cells.pop();
         return cells;
      });
      
      if (rows.length > 0) {
         const isSmallTable = rows[0].some(h => h.includes('Pieces of mail'));
         return segments.push(
             <div key={`tbl-${tIndex}`} style={{display: 'flex', justifyContent: 'center', margin: '12px 0', overflowX: 'auto', width: '100%'}}>
               <table style={{ borderCollapse: 'collapse', width: 'auto', margin: '0 auto', border: '2px solid black', color: 'black', fontSize: '15px' }}>
                 <thead>
                   <tr>
                     {rows[0].map((h, i) => (
                       <th key={i} style={{ border: '1px solid black', padding: '6px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                         <LatexRenderer text={h.replace(/^\*\*|\*\*$/g, '')} />
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                   {rows.slice(1).map((row, rIdx) => (
                     <tr key={rIdx}>
                       {row.map((cell, cIdx) => {
                         const isBoldCell = cell.startsWith('**') && cell.endsWith('**');
                         const cellText = (isBoldCell ? cell.slice(2, -2) : cell).replace(/<i>([\s\S]*?)<\/i>/g, '$1');
                         return (
                           <td key={cIdx} style={{ border: '1px solid black', padding: '6px 10px', textAlign: 'center', fontWeight: cIdx === 0 ? 'bold' : 'normal', fontStyle: 'normal' }}>
                             <LatexRenderer text={cellText} />
                           </td>
                         );
                       })}
                     </tr>
                   ))}
                 </tbody>
               </table>
           </div>
         );
      }
      return;
    }

    // Regex to match block math $$...$$ and inline math $...$
    // The inline math regex avoids matching currency symbols by checking for whitespace around $
    const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/g;
    const parts = tPart.replace(/^\n+|\n+$/g, '').split(regex);

    parts.forEach((part, index) => {
      let currentPart = part;
      if (index % 2 === 0) {
        if (index < parts.length - 1 && parts[index + 1].startsWith('$$')) {
          currentPart = currentPart.replace(/\s+$/, '');
        }
        if (index > 0 && parts[index - 1].startsWith('$$')) {
          currentPart = currentPart.replace(/^\s+/, '');
        }
      }

      if (currentPart.startsWith('$$') && currentPart.endsWith('$$')) {
        segments.push(
          <div key={`${tIndex}-${index}`} className="flex justify-center my-1">
            <InlineMath math={`\\displaystyle ${currentPart.slice(2, -2)}`} />
          </div>
        );
      } else if (currentPart.startsWith('$') && currentPart.endsWith('$')) {
        const mathContent = currentPart.slice(1, -1).replace(/\\frac/g, '\\dfrac');
        segments.push(
          <span key={`${tIndex}-${index}`} className="inline-block px-[1px]">
            <InlineMath math={mathContent} />
          </span>
        );
      } else {
        if (currentPart) {
          const tokenRegex = /(<u>[\s\S]*?<\/u>|\*\*[\s\S]*?\*\*|<i>[\s\S]*?<\/i>|<sup>[\s\S]*?<\/sup>|<sub>[\s\S]*?<\/sub>|!\[[^\]]*\]\([^)]+\))/g;
          const tokens = currentPart.split(tokenRegex);
          const formattedSegments = tokens.map((token, tIdx) => {
            const isUnderline = token.startsWith('<u>') && token.endsWith('</u>');
            const isBold = token.startsWith('**') && token.endsWith('**');
            const isItalic = token.startsWith('<i>') && token.endsWith('</i>');
            const isSup = token.startsWith('<sup>') && token.endsWith('</sup>');
            const isSub = token.startsWith('<sub>') && token.endsWith('</sub>');
            const isImage = token.startsWith('![') && token.includes('](') && token.endsWith(')');
            
            if (isImage) {
              const altMatch = token.match(/!\[([^\]]*)\]/);
              const srcMatch = token.match(/\]\(([^)]+)\)/);
              const alt = altMatch ? altMatch[1] : '';
              const src = srcMatch ? srcMatch[1] : '';
              return (
                <div key={tIdx} className="mt-4 mb-4 flex justify-center">
                  <ZoomableImage src={src} alt={alt} className="max-w-full h-auto" />
                </div>
              );
            }
            
            const innerText = isUnderline ? token.slice(3, -4) : (isBold ? token.slice(2, -2) : (isItalic ? token.slice(3, -4) : (isSup ? token.slice(5, -6) : (isSub ? token.slice(5, -6) : token))));
            
            const blankParts = innerText.split(/(_{5,})/g);
            const renderedContent = blankParts.map((bPart, bIdx) => {
              if (/^_{5,}$/.test(bPart)) {
                return (
                  <span
                    key={bIdx}
                    className="inline-block border-b-2 border-slate-800 text-transparent select-all select-text min-w-[80px] mx-1 align-bottom"
                    aria-label="blank"
                  >
                    {bPart}
                  </span>
                );
              }
              return bPart.split('\n').map((line, lIdx, arr) => (
                <React.Fragment key={`${bIdx}-${lIdx}`}>
                    {line}
                    {lIdx < arr.length - 1 && <br />}
                </React.Fragment>
              ));
            });

            if (isBold) {
              return (
                <strong key={tIdx} className="font-bold">
                  {renderedContent}
                </strong>
              );
            }
            if (isUnderline) {
              return (
                <u key={tIdx} className="underline underline-offset-4 decoration-[1.5px]">
                  {renderedContent}
                </u>
              );
            }
            if (isItalic) {
              return (
                <em key={tIdx} className="italic" style={{ fontStyle: "italic" }}>
                  {renderedContent}
                </em>
              );
            }
            if (isSup) {
              return (
                <sup key={tIdx}>
                  {renderedContent}
                </sup>
              );
            }
            if (isSub) {
              return (
                <sub key={tIdx}>
                  {renderedContent}
                </sub>
              );
            }
            return <span key={tIdx}>{renderedContent}</span>;
          });
          
          segments.push(<span key={`${tIndex}-${index}-end`} className="whitespace-normal">{formattedSegments}</span>);
        }
      }
    });
  });

  return (
    <span className={className}>
      {segments}
    </span>
  );
}
