import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Fix Q15: Remove the newline between the equation and the question text.
# The user wants it to look like PT1 Math Q13:
# 13. $x^{2}-\frac{81}{16}=0$ How many distinct real solutions does the given equation have?
# In test2, Q15 currently is:
# 15.
# $x^2 - 2x = 29$
# What is one of the solutions to the given equation?

q15_bad = """15.
$x^2 - 2x = 29$
What is one of the solutions to the given equation?"""

q15_good = "15. $x^2 - 2x = 29$ What is one of the solutions to the given equation?"

text = text.replace(q15_bad, q15_good)


# Now fix Q10: Note Figure not drawn to scale is disconnected in PT2.
# In PT1 Q2:
# ![Q2 Graph](/pt1/m1-q2.png)
# Note: Figure not drawn to scale. In the figure, line $p$ is parallel to line $r$, and line $t$ intersects both lines. What is the value of $x$?
# 
# In test2 Q10 M1 currently is:
# 10.
# 
# Note: Figure not drawn to scale.
# 
# ![Graph](/pt2/m1-q10.png)
# 
# In the figure shown, lines \ell and $k$ are parallel and line $j$ intersects both lines. If $z > 116$,

q10_bad = """10.

Note: Figure not drawn to scale.

![Graph](/pt2/m1-q10.png)

In the figure shown, lines $\\ell$ and $k$ are parallel and line $j$ intersects both lines. If $z > 116$,"""

q10_good = """10.
![Graph](/pt2/m1-q10.png)
Note: Figure not drawn to scale. In the figure shown, lines $\\ell$ and $k$ are parallel and line $j$ intersects both lines. If $z > 116$,"""

text = text.replace(q10_bad, q10_good)

with open('test2_questions.txt', 'w') as f:
    f.write(text)

