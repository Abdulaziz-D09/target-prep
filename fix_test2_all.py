import json
import re

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# `HighlightableText` does use `<LatexRenderer>` but it uses `textNodes`.
# If `LatexRenderer` outputs `<em>...</em>`, the TreeWalker will find the text node inside `<em>`.
# This is PERFECT! It should work flawlessly!
# So why did the user see `<i>x</i>`?
# Ah!!! Look at Q10 in the math section:
# `lines <<i>l</i>> and <<i>k</i>> are parallel`
# `LatexRenderer` splits on `<i>`. So `<<i>l</i>>` becomes `<` + `<em>l</em>` + `>`.
# This is FINE.
# But what if there are math sections with `x/y` and they weren't in `<i>`?
# "when asking y or x or p or n or k or m or b always make them in italics did you understand all of them even the functions f(x) all of them all of the one letterred or functions any g(x) etc needs to be in italics"
# This tells me the user WANTS ME to ADD italics to these math variables! They weren't there before!

def format_math(text):
    if not text: return text
    
    # 1. Format fractions: number/number -> \frac{num}{den}
    text = re.sub(r'(?<!\w)(\d+)/(\d+)(?!\w)', r'$\\frac{\1}{\2}$', text)
    # variables: x/y -> \frac{x}{y}
    text = re.sub(r'(?<!\w)([a-zA-Z\d]+)/([a-zA-Z\d]+)(?!\w)', r'$\\frac{\1}{\2}$', text)
    
    # 2. Add italics for variables: x, y, p, n, k, m, b, f(x), g(x), etc.
    # We should just wrap them in `$x$` for latex, or `<i>x</i>`. 
    # Since LatexRenderer supports `<i>`, let's just replace standalone variables with `<i>var</i>`.
    
    # Variables that are standalone words: x, y, p, n, k, m, b, h, l, c, d, z
    # But ONLY in Math sections!
    
    vars_to_italicize = ['x', 'y', 'p', 'n', 'k', 'm', 'b', 'h', 'l', 'c', 'd', 'z']
    
    for v in vars_to_italicize:
        # Match standalone variables, not inside tags or words
        # Make sure not to match the 'x' in 'x-axis' maybe? Actually `x` in `xy-plane` is italicized.
        text = re.sub(rf'(?<![a-zA-Z\$\>])({v})(?![a-zA-Z\<\$])', rf'<i>\1</i>', text)
        
    # Also f(x), g(x)
    text = re.sub(r'(?<![a-zA-Z])([fg]\([a-zA-Z]\))(?![a-zA-Z])', r'<i>\1</i>', text)
    
    # Clean up double <i><i>x</i></i> just in case
    text = text.replace('<i><i>', '<i>').replace('</i></i>', '</i>')
    
    return text

for m_idx in range(2, 4):
    if m_idx >= len(data): break
    for q in data[m_idx]['questions']:
        q['question'] = format_math(q['question'])
        q['options'] = [format_math(opt) for opt in q['options']]
        if 'passage' in q:
            q['passage'] = format_math(q['passage'])

# Now let's fix tables! The user wanted tables for Q11, Q12, Q14.
# "just put this picture to the question 11"
# "pic3 is quesiton 12 make a table"
# "pic4 is module 2 question 14 make a table"
# "pic5 is math section module 1 question. 5 for the answer choices make the same kinds of tables that are shown in the pic5"
# Wait! In my previous run, I already added __TABLE__ for Q10 (Computer games), Q12 (Pineapple), Q14 (Mountains).
# Let's check math section M1 Q5 table!
