import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Let's fix the question the user just screamed about:
# M2 Q22 (squirrels): 
# A. $N = 200(2.20)^{4t}$
# B. $N = 200(1.20)^{4t}$
# C. $N = 200(1.20)^{\frac{t}{4}}$
# D. $N = 200(2.20)^{\frac{t}{4}}$
# The user wants exactly this in test2_questions.txt

# The question text itself:
# An exponential model for the number of squirrels in a certain area estimates that there were
# 200 squirrels in the area in the year 2003, and that at the end of each 4-year period for the
# next 20 years, the number of squirrels in the area was 120% more than the number at the
# end of the previous 4-year period. Which of the following equations represents this model,
# where $N$ is the estimated number of squirrels in this area $t$ years after 2003, and
# 0 \le t \le 20?

# The user's screenshot shows:
# 0 \le t \le 20?
# A. $N = 200(2.20)^{4t}$
# B. $N = 200(1.20)^{4t}$
# C. $N = 200(1.20)^{\frac{t}{4}}$
# D. $N = 200(2.20)^{\frac{t}{4}}$

text = text.replace("0<t< 20?", "0 \\le t \\le 20?")
text = text.replace("0 < t < 20?", "0 \\le t \\le 20?")

text = text.replace("A. $N$ = 200(2.20)^{4t}", "A. $N = 200(2.20)^{4t}$")
text = text.replace("B. $N$ = 200(1.20)^{4t}", "B. $N = 200(1.20)^{4t}$")
text = text.replace("C. $N$ = 200(1.20)^{\\frac{t}{4}}", "C. $N = 200(1.20)^{\\frac{t}{4}}$")
text = text.replace("D. $N$ = 200(2.20)^{\\frac{t}{4}}", "D. $N = 200(2.20)^{\\frac{t}{4}}$")

# Let's fix ALL A., B., C., D. options in Math sections to be fully wrapped in $$ if they are mathematical
# We can do this with a script.
# Actually, the user says "what the fuck is thisb it needs to be like pic2... it need sto be exactly same as practice test 1."
# In PT1, variables in questions are $N$, $t$. Options are A. $N = ...$.
# The problem might also be the way "b. $N$ = 200(2.20)#" was rendered in the actual file!

with open('test2_questions.txt', 'w') as f:
    f.write(text)

