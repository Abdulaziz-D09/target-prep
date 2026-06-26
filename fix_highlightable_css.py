with open('src/components/HighlightableText.tsx', 'r') as f:
    text = f.read()

# Make sure highlightable text doesn't override italics via tailwind classes that reset things
text = text.replace('font-sans text-base leading-relaxed text-[#374151]', 'text-[18px] leading-[1.7] text-[#111827]')

with open('src/components/HighlightableText.tsx', 'w') as f:
    f.write(text)
