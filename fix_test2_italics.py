# Ah! HighlightableText DOES NOT USE `renderText` anymore!
# It relies entirely on `LatexRenderer` to render the DOM!
# THEN it uses `document.createTreeWalker(..., NodeFilter.SHOW_TEXT)` to find all text nodes!
# AND THEN it uses ranges to surround the nodes with highlight spans!
# THIS IS BRILLIANT!
# So `HighlightableText` WILL support `LatexRenderer` perfectly!
# If it supports `LatexRenderer`, why did the user see `<i>x</i>`?
# BECAUSE `LatexRenderer` didn't catch the `<i>x</i>` because of spaces or because it's not actually an `<i>` tag!
# Let's run my `fix_math_fractions_and_italics.py` script that looks for `<i>` and `<em>` tags to see where they are!
