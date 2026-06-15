'use client';
import React from 'react';

/**
 * MathText – renders math question text with:
 *  - Proper stacked fractions  (e.g.  1/8x  →  visual fraction)
 *  - Proper superscripts       (e.g.  x²  or  (1.50)ˣ)
 *  - Preserves newlines as <br/>
 *
 * The parser only treats a "/" as a fraction divider when it is surrounded by
 * clear math tokens (digits, parenthesised groups, simple variable names like
 * 4c, 7d, etc.) — NOT inside compound words like "xy-plane" or "sin(Q)".
 */

// ── helpers ─────────────────────────────────────────────────────────────────

// A "math atom" on each side of a slash: digits, ±, simple word (letters+digits)
// but NOT if the slash is inside a hyphenated compound like "xy-plane"
const NUM_RE   = /^\d+(?:\.\d+)?/;           // pure number: 5, 19.36
const PAREN_RE = /^\(([^)]+)\)/;             // (expr)
// Simple short token that's clearly mathematical:
// up to ~6 chars, only alphanumeric + √ ± − π, NOT followed by "-" (hyphen)
const ATOM_RE  = /^([√±−π]?\d*[a-zA-Z√π]?\d*)(?!-)/;

type Chunk =
  | { type: 'text'; value: string }
  | { type: 'frac'; num: string; den: string }
  | { type: 'sup';  base: string; exp: string }
  | { type: 'br' };

function parseMathChunks(text: string): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = text.split('\n');
  for (let li = 0; li < lines.length; li++) {
    if (li > 0) chunks.push({ type: 'br' });
    parseLine(lines[li], chunks);
  }
  return chunks;
}

/** Superscript unicode characters to render with <sup> */
const SUP_CHARS = /([²³⁰¹⁴⁵⁶⁷⁸⁹ˣᵃᵇⁿᵗ])/;

function parseLine(line: string, out: Chunk[]) {
  let rest = line;

  while (rest.length > 0) {

    // ── 1. Stacked fraction: (num)/(den)  ────────────────────────────
    const pm = PAREN_RE.exec(rest);
    if (pm && rest[pm[0].length] === '/') {
      const afterSlash = rest.slice(pm[0].length + 1);
      const dm = PAREN_RE.exec(afterSlash) || NUM_RE.exec(afterSlash) || ATOM_RE.exec(afterSlash);
      if (dm && dm[0].length > 0) {
        pushText(out, ''); // flush nothing, just continue
        out.push({ type: 'frac', num: pm[1], den: dm[0].replace(/^\(|\)$/g, '') });
        rest = afterSlash.slice(dm[0].length);
        continue;
      }
    }

    // ── 2. Stacked fraction: digits/atom  e.g. 47/45, 1/8x ──────────
    const nm = NUM_RE.exec(rest);
    if (nm && rest[nm[0].length] === '/') {
      const afterSlash = rest.slice(nm[0].length + 1);
      const dm = PAREN_RE.exec(afterSlash) || NUM_RE.exec(afterSlash);
      // For "digit / digit-or-short-word" only (avoid "xy-plane")
      if (dm && dm[0].length > 0 && dm[0].length <= 8) {
        out.push({ type: 'frac', num: nm[0], den: dm[0].replace(/^\(|\)$/g, '') });
        rest = afterSlash.slice(dm[0].length);
        continue;
      }
    }

    // ── 3. Superscript unicode char after a base  ─────────────────────
    const supM = SUP_CHARS.exec(rest);
    if (supM && supM.index === 0) {
      // bare superscript char with no explicit base — just render as-is
      pushChar(out, rest[0]);
      rest = rest.slice(1);
      continue;
    }

    // Scan forward to next potential fraction/sup or end
    let advance = 1;
    // Try to consume a run of plain text up to the next '/' or sup char
    for (let j = 1; j < rest.length; j++) {
      const ch = rest[j];
      if (ch === '/' || SUP_CHARS.test(ch) || ch === '(') {
        advance = j;
        break;
      }
      if (j === rest.length - 1) advance = rest.length;
    }
    // Emit the plain text run
    pushStr(out, rest.slice(0, advance));
    rest = rest.slice(advance);
  }
}

function pushChar(out: Chunk[], ch: string) {
  const last = out[out.length - 1];
  if (last?.type === 'text') last.value += ch;
  else out.push({ type: 'text', value: ch });
}

function pushStr(out: Chunk[], s: string) {
  if (!s) return;
  // Check for superscript unicode chars inside the string
  const parts = s.split(SUP_CHARS);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p) continue;
    if (SUP_CHARS.test(p)) {
      // It's a superscript char — attach to previous text as base+sup
      const last = out[out.length - 1];
      if (last?.type === 'text' && last.value.length > 0) {
        const base = last.value;
        last.value = base.slice(0, -0) || base; // keep base
        // Find the last word/token as the base
        const baseMatch = /([a-zA-Z0-9.()]+)$/.exec(base);
        if (baseMatch) {
          last.value = base.slice(0, base.length - baseMatch[0].length);
          out.push({ type: 'sup', base: baseMatch[0], exp: p });
        } else {
          out.push({ type: 'text', value: p });
        }
      } else {
        out.push({ type: 'text', value: p });
      }
    } else {
      const last = out[out.length - 1];
      if (last?.type === 'text') last.value += p;
      else out.push({ type: 'text', value: p });
    }
  }
}

function pushText(out: Chunk[], s: string) { if (s) pushStr(out, s); }

// ── Renderer ────────────────────────────────────────────────────────────────

function renderChunk(chunk: Chunk, i: number): React.ReactNode {
  if (chunk.type === 'br') return <br key={i} />;

  if (chunk.type === 'text') return <span key={i}>{chunk.value}</span>;

  if (chunk.type === 'sup') {
    return (
      <span key={i} style={{ whiteSpace: 'nowrap' }}>
        {chunk.base}
        <sup style={{
          fontSize: '0.7em',
          lineHeight: 0,
          verticalAlign: 'super',
          position: 'relative',
          top: '-0.05em',
        }}>
          {chunk.exp}
        </sup>
      </span>
    );
  }

  if (chunk.type === 'frac') {
    return (
      <span
        key={i}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          verticalAlign: 'middle',
          margin: '0 2px',
          lineHeight: 1.15,
          fontSize: '0.9em',
          position: 'relative',
          top: '0.05em',
        }}
      >
        <span style={{
          borderBottom: '1.5px solid currentColor',
          paddingBottom: '1px',
          paddingLeft: '3px',
          paddingRight: '3px',
          textAlign: 'center',
          display: 'block',
          minWidth: '1em',
        }}>
          {chunk.num}
        </span>
        <span style={{
          paddingTop: '1px',
          paddingLeft: '3px',
          paddingRight: '3px',
          textAlign: 'center',
          display: 'block',
        }}>
          {chunk.den}
        </span>
      </span>
    );
  }
  return null;
}

// ── Public component ─────────────────────────────────────────────────────────

interface MathTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MathText({ text, className, style }: MathTextProps) {
  const chunks = parseMathChunks(text);
  return (
    <span className={className} style={style}>
      {chunks.map((c, i) => renderChunk(c, i))}
    </span>
  );
}
