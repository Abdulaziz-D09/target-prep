'use client';
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  text: string;
  className?: string;
  removeBlankLines?: boolean;
}

export function LatexRenderer({ text, className = '', removeBlankLines = false }: LatexRendererProps) {
  if (!text) return null;

  let preprocessed = text
    .replace(/__IMAGE__[^\n]*\n?!\[[^\]]*\]\([^)]*\)\n?__ENDIMAGE__/g, '')
    .replace(/(!\[[^\]]*\]\([^)]+\))\n+/g, '$1'); // Remove newlines immediately after images

  if (removeBlankLines) {
    preprocessed = preprocessed.replace(/\n(?:[\s\r]*\n)+/g, '\n');
  }
  
  preprocessed = preprocessed.trim();

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
           <div key={`tbl-${tIndex}`} style={{display: 'block', margin: '12px 0', overflow: 'hidden'}}>
             <table style={{fontSize: '15px', borderCollapse: 'collapse', border: '2px solid #888'}}>
               <thead>
                 <tr>
                   {rows[0].map((h, i) => (
                     <th key={i} style={{border: '1px solid #888', padding: '8px 24px', textAlign: 'center', fontWeight: 600, background: '#fff', fontStyle: 'italic'}}>
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
                         <td key={cIdx} style={{border: '1px solid #888', padding: '8px 24px', textAlign: 'center', background: '#fff', color: '#111'}}>
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
    const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
    const parts = tPart.split(regex);

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
          <div key={`${tIndex}-${index}`} className="flex justify-center my-3">
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
          const tokenRegex = /(<u>[\s\S]*?<\/u>|\*\*[\s\S]*?\*\*|<i>[\s\S]*?<\/i>|!\[[^\]]*\]\([^)]+\))/g;
          const tokens = currentPart.split(tokenRegex);
          const formattedSegments = tokens.map((token, tIdx) => {
            const isUnderline = token.startsWith('<u>') && token.endsWith('</u>');
            const isBold = token.startsWith('**') && token.endsWith('**');
            const isItalic = token.startsWith('<i>') && token.endsWith('</i>');
            const isImage = token.startsWith('![') && token.includes('](') && token.endsWith(')');
            
            if (isImage) {
              const altMatch = token.match(/!\[([^\]]*)\]/);
              const srcMatch = token.match(/\]\(([^)]+)\)/);
              const alt = altMatch ? altMatch[1] : '';
              const src = srcMatch ? srcMatch[1] : '';
              return (
                <div key={tIdx} className="mt-1 mb-[5px] flex justify-center overflow-hidden">
                  <img src={src} alt={alt} className="max-w-[75%] object-contain object-top" style={{maxHeight: '350px'}} />
                </div>
              );
            }
            
            const innerText = isUnderline ? token.slice(3, -4) : (isBold ? token.slice(2, -2) : (isItalic ? token.slice(3, -4) : token));
            
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
              return bPart;
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
