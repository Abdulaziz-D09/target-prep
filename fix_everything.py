import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# 1. Fix the "op" -> "\frac{2}{5}" corruption
text = text.replace('pe$\\frac{2}{5}$le', 'people')
text = text.replace('pe$\\\\frac{2}{5}$le', 'people')
text = text.replace('$\\frac{2}{5}$tion', 'option')
text = text.replace('$\\frac{2}{5}$eration', 'operation')
text = text.replace('pr$\\frac{2}{5}$erty', 'property')
text = text.replace('pr$\\frac{2}{5}$erties', 'properties')
text = text.replace('c$\\frac{2}{5}$y', 'copy')
# also catch generic ones:
text = text.replace('$\\frac{2}{5}$', 'op') # Wait! Are there actual 2/5 fractions?
# In M1 Q19: $D$. \frac{2}{5}. So I shouldn't blind replace!

# Let's read text and only replace the broken words:
text = text.replace('people', 'people') # already people? 
# Wait, let's fix people specifically:
text = re.sub(r'pe\$\\(?:\\)?frac\{2\}\{5\}le', 'people', text)
text = re.sub(r'p\$\\(?:\\)?frac\{2\}\{5\}ulation', 'population', text)
text = re.sub(r'sl\$\\(?:\\)?frac\{2\}\{5\}e', 'slope', text)
text = re.sub(r'pr\$\\(?:\\)?frac\{2\}\{5\}ert', 'propert', text)
text = re.sub(r'c\$\\(?:\\)?frac\{2\}\{5\}y', 'copy', text)
text = re.sub(r'\$\\(?:\\)?frac\{2\}\{5\}tion', 'option', text)
text = re.sub(r'\$\\(?:\\)?frac\{2\}\{5\}posit', 'opposit', text)
text = re.sub(r't\$\\(?:\\)?frac\{2\}\{5\}', 'top', text)
text = re.sub(r'st\$\\(?:\\)?frac\{2\}\{5\}', 'stop', text)

# Let's fix the M2 Q9 table! The user showed a pic of M2 Q9 where the table is broken in the text!
# Wait, M2 Q9 is:
# Type of entree  Number of pe$\frac{2}{5}$le
# chicken «( —«20
# ith Total 50
# This table got completely corrupted in my text!
bad_q9 = """Type of entree  Number of pe$\\frac{2}{5}$le
chicken «( —«20

ith

 Total  50"""

bad_q9_regex = r"Type of entree.*?Total\s*50"
good_q9_table = """__TABLE__
Type of entree | Number of people
--- | ---
Beef | 13
Chicken | 20
Fish | 8
Vegetarian | 9
Total | 50
__ENDTABLE__"""

text = re.sub(bad_q9_regex, good_q9_table, text, flags=re.DOTALL)


# 2. Fix M1 Q5 (or 6?) table. The user manually removed the `|` separators!
# I need to restore the tables for A, B, C, D in M1 Q5.
m1_q5_bad = """A.

__TABLE__
\\$r\\$  \\$g\\$
---  ---
0  55
2  53
4  51
__ENDTABLE__

\\$B\\$\\.

__TABLE__
\\$r\\$  \\$g\\$
---  ---
0  53
2  55
4  51
__ENDTABLE__

\\$C\\$\\.

__TABLE__
\\$r\\$  \\$g\\$
---  ---
0  51
2  55
4  53
__ENDTABLE__

\\$D\\$\\.

__TABLE__
\\$r\\$  \\$g\\$
---  ---
0  51
2  53
4  55
__ENDTABLE__"""

m1_q5_good = """A.

__TABLE__
$r$ | $g$
--- | ---
0 | 55
2 | 53
4 | 51
__ENDTABLE__

B.

__TABLE__
$r$ | $g$
--- | ---
0 | 53
2 | 55
4 | 51
__ENDTABLE__

C.

__TABLE__
$r$ | $g$
--- | ---
0 | 51
2 | 55
4 | 53
__ENDTABLE__

D.

__TABLE__
$r$ | $g$
--- | ---
0 | 51
2 | 53
4 | 55
__ENDTABLE__"""

# Since the text might have variations like B. instead of $B$., let's just use regex to replace all 4 tables in Q5
# M1 Q5 is the only one with this sequence of tables.
for letter in ['A', 'B', 'C', 'D']:
    bad_table_pattern = re.compile(rf"{letter}\.\s*__TABLE__\s*(?:\$)?r(?:\$)?\s+(?:\$)?g(?:\$)?\s*---\s*---\s*0\s+(\d+)\s*2\s+(\d+)\s*4\s+(\d+)\s*__ENDTABLE__")
    
    def repl(m):
        return f"{letter}.\n\n__TABLE__\n$r$ | $g$\n--- | ---\n0 | {m.group(1)}\n2 | {m.group(2)}\n4 | {m.group(3)}\n__ENDTABLE__"
        
    text = bad_table_pattern.sub(repl, text)

# Also fix the question text for Q5: $r$ + $g$ < 56$ -> $r + g < 56$
text = text.replace("$r$ + $g$ < 56$", "$r + g < 56$")

# 3. Fix the powers! The user complained about ^x and ^2. They must be inside $ $.
text = text.replace("y = x^2 - 35", "$y = x^2 - 35$")
text = text.replace("x^2 - 35", "$x^2 - 35$")
text = text.replace("x^2", "$x^2$")
text = text.replace("$$x^2$$", "$x^2$")
# Revert that $x^2$ generic replace, it's too dangerous. Let's do exact replaces based on the image.
text = text.replace("$y = $x^2$ - 35$", "$y = x^2 - 35$")

# M2 Q11: "In the xy-plane, the graph of y = 2x intersects the graph of y = x^2 - 35"
# It should be: "In the $xy$-plane, the graph of $y = 2x$ intersects the graph of $y = x^2 - 35$"
text = text.replace("y = 2x intersects", "$y = 2x$ intersects")
text = text.replace("y = x^2 — 35", "$y = x^2 - 35$")
text = text.replace("y = x^2 - 35", "$y = x^2 - 35$")
text = text.replace("$y$ = $x$^2 — 35", "$y = x^2 - 35$")

# M1 Q12: 13/4 -> \frac{13}{4} etc. was fixed but let's double check it.

# M2 Q4:
text = text.replace("A. =\n\nC. -3\n\n5\nD. $\\frac{5}{8}$", "A. $-\\frac{8}{5}$\nB. $-\\frac{6}{5}$\nC. $-3$\nD. $\\frac{5}{8}$")
text = text.replace("8\nA. =\n\nC. -3\n\n5\nD. $\\frac{5}{8}$", "A. $-\\frac{8}{5}$\nB. $-\\frac{6}{5}$\nC. $-3$\nD. $\\frac{5}{8}$")

# M1 Q22:
text = text.replace("A. $N$ = 200(2.20)<i>\nAt\n\n$B$. $N$ = 200(1.20)\n\n$C$. $N$ = 200(1.20)#\n\n$b$. $N$ = 200(2.20)#",
                    "A. $N = 200(2.20)^{4t}$\nB. $N = 200(1.20)^{4t}$\nC. $N = 200(1.20)^{\\frac{t}{4}}$\nD. $N = 200(2.20)^{\\frac{t}{4}}$")

with open('test2_questions.txt', 'w') as f:
    f.write(text)

