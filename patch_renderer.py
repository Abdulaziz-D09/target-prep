import re

with open('src/components/PassageRenderer.tsx', 'r') as f:
    text = f.read()

# Replace `para.startsWith('• ') || para.includes('\n• ');`
# with `para.match(/^[•\-]\s/m);`
text = text.replace("const isBulletList = para.startsWith('• ') || para.includes('\\n• ');", 
                    "const isBulletList = para.match(/^[•\\-]\\s/m);")

# Replace `lines.findIndex(l => l.trim().startsWith('•'));`
# with `lines.findIndex(l => l.trim().match(/^[•\-]\s/));`
text = text.replace("const firstBulletIdx = lines.findIndex(l => l.trim().startsWith('•'));",
                    "const firstBulletIdx = lines.findIndex(l => l.trim().match(/^[•\\-]\\s/));")

# Replace `line.match(/^•\s*/);`
# with `line.match(/^[•\-]\s*/);`
text = text.replace("const bulletPrefixMatch = line.match(/^•\\s*/);",
                    "const bulletPrefixMatch = line.match(/^[•\\-]\\s*/);")

with open('src/components/PassageRenderer.tsx', 'w') as f:
    f.write(text)

print("Patched PassageRenderer.tsx")
