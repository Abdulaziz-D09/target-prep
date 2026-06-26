import re

# Okay, `PassageRenderer` uses `HighlightableText`.
# "export function PassageRenderer ... return <HighlightableText />"
# Yes! Look at line 4: `import { HighlightableText } from './HighlightableText';`
# So `PassageRenderer` delegates to `HighlightableText`.
# Which means `HighlightableText` IS rendering the raw text including HTML!
# Which means ANY HTML tag in the text will literally display as `<i>` or `<em>`!
# This is why the user is so angry! "why the fuck am i able to see the italics code??? shouldnt it be showing a italic word"

# How to fix this?
# In `HighlightableText.tsx`, we need to parse formatting tags OR just strip them if we can't render them.
# BUT wait, the SAT uses italics for book titles and variables! We MUST render them!
# How do we render italics in `HighlightableText` when it uses `window.getSelection()` and a complex `renderText` function?
# `renderText` just slices `text`!
