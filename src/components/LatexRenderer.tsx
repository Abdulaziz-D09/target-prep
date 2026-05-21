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
        segments.push(<span key={index}>{part}</span>);
      }
    }
  });

  return (
    <span className={className}>
      {segments}
    </span>
  );
}
