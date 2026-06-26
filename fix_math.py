import re

with open('test1_questions.txt', 'r') as f:
    lines = f.readlines()

out = []
in_math_section = False

for line in lines:
    if line.startswith('### Section 2'):
        in_math_section = True
    
    if not in_math_section:
        out.append(line)
        continue
    
    # We are in math section.
    # The OCR produced lines like:
    # **1.** If  9x+4=67  what is the value of  90x+40: 
    # Let's find segments with double spaces.
    
    # We can use a regex: match 2 or more spaces, then some text, then 2 or more spaces, or end of line.
    # Actually, simpler: replace patterns like "  [expr]  " with " $[expr]$ "
    # Wait, some are at the end of the line: "  90x+40: \n"
    
    # Let's write a function to fix a line.
    # Let's first clean trailing spaces and standardise.
    s = line.rstrip()
    
    # Replace double spaces + equation + double spaces
    # It might be tricky. Let's find all occurrences of 2 spaces.
    parts = re.split(r'  +', s)
    
    if len(parts) > 1:
        new_parts = []
        for i, p in enumerate(parts):
            if i > 0 and len(p) > 0:
                # Is it math?
                # Check if it has math characters, numbers, variables like x, y, \frac, \sqrt, =, <, >, etc.
                # If it's a single character like "a", "x", "y"
                # If it's "A'B'C'"
                is_math = bool(re.search(r'[\+\-\=\<\>\\]|\d|[xyabc]\b|A\'B\'C\'', p))
                # Also, if it has a period at the end like "\frac{1}{8x} ." it might be math.
                
                # We can just wrap it in $ if it doesn't already have $.
                if is_math and not p.startswith('$'):
                    # Handle punctuation attached
                    m = re.match(r'^(.*?)([.,:]?)$', p)
                    if m:
                        expr = m.group(1).strip()
                        punct = m.group(2)
                        p = f"${expr}${punct}"
                    else:
                        p = f"${p.strip()}$"
            new_parts.append(p)
        s = " ".join(new_parts)
    
    # Also fix some standalone equations on lines, like:
    # A.  4-x\le16 
    # This became parts: ["A.", "4-x\le16"] -> "A. $4-x\le16$"
    
    # What about lines that are just formulas?
    # e.g. "x+6y=28"
    if s.strip() and not s.startswith('**') and not re.match(r'^[A-D]\.', s) and not s.startswith('###') and not s.startswith('|') and not s.startswith('!['):
        # Could be an equation line
        if re.search(r'[\+\-\=\<\>\\]|x\^|y\^', s) and 'The' not in s and 'What' not in s and 'If' not in s:
            if not s.startswith('$'):
                s = f"${s.strip()}$"

    out.append(s + "\n")

with open('test1_questions.txt', 'w') as f:
    f.writelines(out)
