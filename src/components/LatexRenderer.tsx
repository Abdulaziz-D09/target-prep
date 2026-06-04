'use client';
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  text: string;
  className?: string;
}

export function LatexRenderer({ text, className = '' }: LatexRendererProps) {
  if (!text) return null;

  // Simple parser to split text into math and non-math segments based on $...$ and $$...$$
  const segments: React.ReactNode[] = [];
  
  // Regex to match block math $$...$$ and inline math $...$
  const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
  const parts = text.split(regex);

  parts.forEach((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      // Block math
      segments.push(
        <BlockMath key={index} math={part.slice(2, -2)} />
      );
    } else if (part.startsWith('$') && part.endsWith('$')) {
      // Inline math
      segments.push(
        <InlineMath key={index} math={part.slice(1, -1)} />
      );
    } else {
      // Regular text
      if (part) {
        // Parse markdown tables
        // A table block is a sequence of lines that start with | and end with |
        const tableRegex = /(?:^|\n)((?:\|[^\n]+\|(?:\n|$))+)/g;
        
        let lastIndex = 0;
        let match;
        while ((match = tableRegex.exec(part)) !== null) {
          const before = part.substring(lastIndex, match.index);
          if (before) segments.push(<span key={`${index}-t-${lastIndex}`} className="whitespace-pre-wrap">{before}</span>);
          
          // Parse table
          const rawTable = match[1];
          const lines = rawTable.trim().split('\n');
          // lines[0] is header, lines[1] is separator (e.g. |---|---|), lines[2+] are rows
          const rows = lines.filter(line => !line.match(/^\|[-\s|]+\|$/)).map(line => {
             // Split by | and trim, removing first and last empty elements if they exist due to leading/trailing |
             const cells = line.split('|').map(c => c.trim());
             if (cells[0] === '') cells.shift();
             if (cells[cells.length - 1] === '') cells.pop();
             return cells;
          });
          
          if (rows.length > 0) {
             segments.push(
               <div key={`${index}-tbl-${match.index}`} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                 <table className="w-full text-left border-collapse text-sm">
                   <thead>
                     <tr className="bg-slate-50 border-b border-slate-200">
                       {rows[0].map((h, i) => <th key={i} className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200 last:border-r-0"><LatexRenderer text={h} /></th>)}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {rows.slice(1).map((row, rIdx) => (
                       <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                         {row.map((cell, cIdx) => <td key={cIdx} className="px-4 py-3 text-slate-600 border-r border-slate-100 last:border-r-0"><LatexRenderer text={cell} /></td>)}
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             );
          }
          
          lastIndex = match.index + match[0].length;
        }
        
        const after = part.substring(lastIndex);
        if (after) {
          // parse bold text
          const boldParts = after.split(/(\*\*.*?\*\*)/g);
          const boldSegments = boldParts.map((bp, bpIdx) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={bpIdx} className="font-black text-slate-900 block mt-5 mb-2 text-lg uppercase tracking-wider">{bp.slice(2, -2)}</strong>;
            }
            return <span key={bpIdx}>{bp}</span>;
          });
          
          segments.push(<span key={`${index}-end`} className="whitespace-pre-wrap">{boldSegments}</span>);
        }
      }
    }
  });

  return (
    <span className={className}>
      {segments}
    </span>
  );
}
