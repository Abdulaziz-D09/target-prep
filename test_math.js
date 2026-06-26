const SUP_CHARS = /([²³⁰¹⁴⁵⁶⁷⁸⁹ˣᵃᵇⁿᵗ])/;
const NUM_RE   = /^\d+(?:\.\d+)?/;
const PAREN_RE = /^\(([^)]+)\)/;
const ATOM_RE  = /^([√±−π]?\d*[a-zA-Z√π]?\d*)(?!-)/;

function parseLine(line, out) {
  let rest = line;

  while (rest.length > 0) {

    // ── 1. Stacked fraction: (num)/(den)  ────────────────────────────
    const pm = PAREN_RE.exec(rest);
    if (pm && rest[pm[0].length] === '/') {
      const afterSlash = rest.slice(pm[0].length + 1);
      const dm = PAREN_RE.exec(afterSlash) || NUM_RE.exec(afterSlash) || ATOM_RE.exec(afterSlash);
      if (dm && dm[0].length > 0) {
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

    // Scan forward to next potential fraction/sup or end
    let advance = 1;
    const nextMatch = /(?:\([^)]+\)|\d+(?:\.\d+)?)\/|[²³⁰¹⁴⁵⁶⁷⁸⁹ˣᵃᵇⁿᵗ]/.exec(rest);
    
    if (nextMatch && nextMatch.index > 0) {
      advance = nextMatch.index;
    } else if (nextMatch && nextMatch.index === 0) {
      advance = 1;
    } else {
      advance = rest.length;
    }

    out.push({ type: 'text', value: rest.slice(0, advance) });
    rest = rest.slice(advance);
  }
}

let out = [];
parseLine("3x - 1/4", out);
console.log(JSON.stringify(out, null, 2));
