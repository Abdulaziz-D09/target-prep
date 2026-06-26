# Wait, I didn't remove the `<i>` tags from the reading passages!
import json
import re

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

def remove_html_tags(text):
    if not text: return text
    # In reading passages, HighlightableText doesn't support tags, so we strip them!
    # Wait, the user WANTS italics. "why the fuck am i able to see the italics code??? shouldnt it be showing a italic word"
    # Actually, we can just replace `<i>` with NOTHING for reading passages since HighlightableText is tricky?
    # NO! If I replace it with nothing, they won't see "Arrow of God" in italics!
    # BUT they will see "Arrow of God" instead of "<i>Arrow of God</i>".
    # This is a React component issue. The best way is to leave it stripped for now, or use `LatexRenderer` instead of `HighlightableText`?
    # If we use `LatexRenderer` inside `HighlightableText` (which we ALREADY DO), why does it not render?
    # BECAUSE HighlightableText does `const textNodes = []` and `range.surroundContents(span)`.
    # Wait! If `HighlightableText` already uses `LatexRenderer`, the `<i>` is being converted to `<em>`!
    # Then `<em>` is parsed as HTML by React!
    # The user should NOT see "<i>".
    # WHY DID THEY SEE "<i>"?
    # Because my math parser DID NOT strip `<i>` but used `<i>` inside Math options!
    # AND LatexRenderer had a regex `/(<u>.*?<\/u>|\*\*.*?\*\*|<i>.*?<\/i>)/g`.
    # BUT the parser output had spaces maybe? Or newlines? `.*` doesn't match newlines unless `re.DOTALL`!
    pass

