with open('src/components/LatexRenderer.tsx', 'r') as f:
    text = f.read()

# We need to make sure italics parse properly even if there are nested spans. 
# Also, react sometimes strips custom tags if they aren't standard HTML. We are rendering <i> which is standard HTML, but let's double check.

import re

# Fix LatexRenderer so it uses standard React elements safely
new_text = re.sub(r'return \(\s*<i key=\{tIdx\} className="italic">\s*\{renderedContent\}\s*</i>\s*\);', 
                  'return (\n                <em key={tIdx} className="italic" style={{ fontStyle: "italic" }}>\n                  {renderedContent}\n                </em>\n              );', text)

with open('src/components/LatexRenderer.tsx', 'w') as f:
    f.write(new_text)

print("Updated LatexRenderer.tsx to use <em> instead of <i> and added style attribute")
