import re

# `HighlightableText` does:
# preSelectionRange.selectNodeContents(containerRef.current);
# ...
# And for rendering:
# const renderText = () => {
#    let lastIndex = 0;
#    const nodes: React.ReactNode[] = [];
#    const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);
#    ...
#    nodes.push(<span key={i}>{text.slice(lastIndex, hl.startIndex)}</span>);
#    ...
# }

# This means `HighlightableText` renders the text as a RAW string!
# It does NOT parse HTML tags at all! It just treats `<i>` as literal text.
# So if `currentQuestion.passage` contains `<i>Arrow of God</i>`, `HighlightableText` will print "<i>Arrow of God</i>".

# AND, if `currentQuestion.passage` contains `__TABLE__`, `HighlightableText` will literally print `__TABLE__`!
# Because ONLY `LatexRenderer` handles `__TABLE__` and HTML tags!

# Wait! `PassageRenderer` is used for the left pane. Let's look at `PassageRenderer`.
