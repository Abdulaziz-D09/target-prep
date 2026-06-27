const fs = require('fs');
const content = fs.readFileSync('src/components/HighlightableText.tsx', 'utf-8');

const newContent = content.replace(
    /<Underline className="w-\[18px\] h-\[18px\] text-\[#111827\] stroke-\[2\]" \/>/g,
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                                    <line x1="4" x2="20" y1="18" y2="18" />
                                    <line x1="4" x2="20" y1="22" y2="22" strokeDasharray="4 4" />
                                </svg>`
);

fs.writeFileSync('src/components/HighlightableText.tsx', newContent);
