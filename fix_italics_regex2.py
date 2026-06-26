with open('src/components/LatexRenderer.tsx', 'r') as f:
    text = f.read()

# Make sure we're actually extracting italicized text. 
# The issue might be that tokenRegex splits on <i>...</i> but then we are just replacing it with raw HTML.
# Actually the regex /(<u>.*?<\/u>|\*\*.*?\*\*|<i>.*?<\/i>)/g will leave the <i> and </i> tags in the token!

import re

# In LateX renderer we have:
# const isItalic = token.startsWith('<i>') && token.endsWith('</i>');
# const innerText = isUnderline ? token.slice(3, -4) : (isBold ? token.slice(2, -2) : (isItalic ? token.slice(3, -4) : token));

# That part seems correct. Wait, when we split by tokenRegex we might be getting <i> tags inside the split parts if the regex matches them exactly, which it does.
