const fs = require('fs');

const file = 'src/components/HighlightableText.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix HighlightableText color to match PassageRenderer
// It seems the wrapper or text inside is having color injected or inherited poorly.
// Let's force text-[#111827] on it if it's missing, or check how LatexRenderer wraps it.

content = content.replace(
    /className=\{\`relative whitespace-pre-wrap font-bluebook text-\[17px\] leading-\[1\.9\] \$\{className\}\`\}/g,
    "className={`relative whitespace-pre-wrap font-bluebook text-[17px] leading-[1.9] text-[#111827] ${className || ''}`}"
);

fs.writeFileSync(file, content);
