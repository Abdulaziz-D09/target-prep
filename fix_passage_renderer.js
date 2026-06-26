const fs = require('fs');
const file = 'src/components/PassageRenderer.tsx';

let content = fs.readFileSync(file, 'utf8');

// The line currently reads:
// const paragraphs = preprocessed.split(/\n\s*\n/);
// We want to map over paragraphs and remove internal single newlines so it doesn't trigger poetry formatting for standard text.
// Wait, actually, let's just do it directly.

const target = "const paragraphs = preprocessed.split(/\\n\\s*\\n/);";
const replacement = `const paragraphs = preprocessed.split(/\\n\\s*\\n/).map(p => {
        // If the paragraph is obviously a poem (very short lines consistently), keep it.
        // Otherwise, collapse single newlines into spaces to fix OCR hard-wrapping.
        const lines = p.split('\\n');
        if (lines.length > 1 && lines.every(l => l.trim().length < 60)) {
            return p;
        }
        return p.replace(/\\n/g, ' ');
    });`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Fixed passage renderer paragraph processing.');
} else {
    console.log('Target not found in PassageRenderer.tsx');
}
