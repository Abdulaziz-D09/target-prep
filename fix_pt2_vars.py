import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Split to only touch Math section (or both?)
# The user wants math variables formatted. Let's apply it to the Math sections.
math_idx = text.find('Section: Section 2, Module 1: Math')
english_part = text[:math_idx]
math_part = text[math_idx:]

# 1. Fix Q9 table
q9_broken = """Type of entree  Number of people
chicken «( —«20

ith

 Total  50"""

q9_fixed = """__TABLE__
Type of entree | Number of people
--- | ---
chicken | 20
beef | 16
vegetarian | 9
fish | 5
Total | 50
__ENDTABLE__"""

math_part = math_part.replace(q9_broken, q9_fixed)

# Also there was a previous version of Q9 broken table
q9_broken2 = """Type of entree | Number of people
chicken «(| —«20

ith

| Total | 50"""
math_part = math_part.replace(q9_broken2, q9_fixed)

# 2. Fix variables
# We want to match isolated letters (a,b,c,d,x,y,z,w, A,B,C,D, etc.) that are NOT inside $...$ or <...>.
# Words like "a" or "I" should be excluded.
# Let's write a targeted regex replacement. We should only replace outside of math blocks ($...$)
# and outside of HTML tags.

def format_vars(text):
    # We will split the text by $...$ to ensure we don't mess up existing math
    parts = re.split(r'(\$.*?\$)', text)
    
    # List of variables we want to match:
    # Lowercase: x, y, z, w, a, b, c, d, h, k, l, m, n, p, r, s, t, u, v
    # Uppercase: A, B, C, D, P, Q, R, S, T, U, V, X, Y, Z
    # We avoid 'a' and 'I' as standalone words unless in specific contexts, but wait, 'a' as in "ais a constant" 
    # The user said "if they are not words like if they have a meaning in the sentence then do not make them italics"
    # "if they are just unknown numbers just to find them then make them italics"
    
    # So we'll skip 'a' and 'I' and 'A'. But wait, "Circle A", "triangle ABC".
    # We can match words that are exactly 1-3 uppercase letters like ABC, QRS.
    
    def replacer(p):
        if p.startswith('$') and p.endswith('$'):
            return p
        
        # Replace isolated single lowercase letters (except a, i)
        p = re.sub(r'(?<![a-zA-Z0-9\<\>])([bcdefghjklmnopqrstuvwxyz])(?![a-zA-Z0-9\<\>])', r'$\1$', p)
        # Replace isolated 'a' if it's followed by "is a constant" or similar math context?
        # Actually, let's just do it manually for 'a' to be safe: "where a is a constant", "value of a"
        p = re.sub(r'(?<![a-zA-Z0-9\<\>])a(?=\s+is\s+a\s+constant)', r'$a$', p)
        p = re.sub(r'value\s+of\s+a(?![a-zA-Z0-9])', r'value of $a$', p)
        
        # Uppercase letters (except A, I). Let's do B-Z.
        p = re.sub(r'(?<![a-zA-Z0-9\<\>])([BCDEFGHJKLMNOPQRSTUVWXYZ])(?![a-zA-Z0-9\<\>])', r'$\1$', p)
        
        # Handle 'Circle A'
        p = re.sub(r'Circle A(?![a-zA-Z0-9\<\>])', r'Circle $A$', p)
        
        # Handle uppercase strings like ABC, QRS, A'B'C'
        p = re.sub(r'(?<![a-zA-Z0-9\<\>])([A-Z]{2,4})(?![a-zA-Z0-9\<\>])', r'$\1$', p)
        
        # Replace <i>...</i> with $...$ for variables
        p = re.sub(r'\<i\>([a-zA-Z0-9]+)\</i\>', r'$\1$', p)
        
        # Replace xy-plane with $xy$-plane
        p = p.replace('xy-plane', '$xy$-plane')
        
        return p

    return "".join(replacer(part) for part in parts)

math_part = format_vars(math_part)

# Clean up any double dollars
math_part = math_part.replace('$$', '$')
math_part = math_part.replace('$$xy$$', '$xy$')
math_part = re.sub(r'\$([a-zA-Z0-9])\$\$([a-zA-Z0-9])\$', r'$\1\2$', math_part)

with open('test2_questions.txt', 'w') as f:
    f.write(english_part + math_part)

print("Vars fixed!")
