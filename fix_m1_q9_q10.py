import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Fix the table for M1 Q9
bad_table_m1_q9 = """Type of entree  Number of pe$\\frac{2}{5}$le
chicken «( —«20

ith

 Total  50"""

good_table_m1_q9 = """__TABLE__
Type of entree | Number of people
--- | ---
Beef | 13
Chicken | 20
Fish | 8
Vegetarian | 9
Total | 50
__ENDTABLE__"""

text = text.replace(bad_table_m1_q9, good_table_m1_q9)

# Clean up "pe$\frac{2}{5}$le" just in case any remains
text = text.replace('pe$\\frac{2}{5}$le', 'people')

# Also fix the math formatting in Question 10 (M1 Q10)
# M1 Q10:
# In the figure shown, lines <$l$> and <$k$> are parallel and line $j$ intersects both lines. If $z$ > 116,
# which of the following must be true?
# A. y < 64
# B. y > 64
# ...
# Actually let's look at the options for Q10
text = text.replace('<$l$>', '$\\ell$') # usually l is \ell in latex but $l$ is fine too. Let's just do $l$ and $k$ instead of <$l$>.
text = text.replace('<$k$>', '$k$')
text = text.replace('line $j$', 'line $j$')
text = text.replace('$z$ > 116', '$z > 116$')

# Let's fix Question 15 that I saw was also formatted weird:
# $x^2 - 2x = 29$
# What is one of the solutions to the given equation?
# A. \sqrt{29}
# B. 1 + \sqrt{30}
# C. 30
# D. 29 + \sqrt{2}
# They should be fully wrapped in $$ like:
# A. $\\sqrt{29}$
# B. $1 + \\sqrt{30}$
# C. $30$
# D. $29 + \\sqrt{2}$
text = text.replace("A. \\sqrt{29}", "A. $\\sqrt{29}$")
text = text.replace("B. 1 + \\sqrt{30}", "B. $1 + \\sqrt{30}$")
text = text.replace("C. 30", "C. $30$")
text = text.replace("D. 29 + \\sqrt{2}", "D. $29 + \\sqrt{2}$")

# I need to fix $B$. $C$. $D$. for Question 10 and 15 and others:
# Let's just do a regex replace to clean up $A$. -> A., etc.
text = re.sub(r'\$([A-D])\$\.', r'\1.', text)
text = re.sub(r'\$([A-D])\$\s+\.', r'\1.', text)

with open('test2_questions.txt', 'w') as f:
    f.write(text)

