const fs = require('fs');
const content = fs.readFileSync('src/components/HighlightableText.tsx', 'utf-8');

let newContent = content.replace(
    /const preSelectionRange = range\.cloneRange\(\);\n\s*preSelectionRange\.selectNodeContents\(containerRef\.current\);\n\s*preSelectionRange\.setEnd\(range\.startContainer, range\.startOffset\);\n\s*const startOffset = preSelectionRange\.toString\(\)\.length;/s,
    `let startOffset = 0;
            const offsetWalker = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT);
            let nNode;
            while ((nNode = offsetWalker.nextNode())) {
                if (nNode === range.startContainer) {
                    startOffset += range.startOffset;
                    break;
                }
                startOffset += nNode.textContent?.length || 0;
            }`
);

newContent = newContent.replace(/rounded-\[4px\]/g, 'rounded-[14px]');

fs.writeFileSync('src/components/HighlightableText.tsx', newContent);
