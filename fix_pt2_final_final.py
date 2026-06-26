import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Fix M1 Q8
text = text.replace("The function f is defined by $f(x) = 62 - \\frac{1}{7}$. What is the y-intercept of the graph of\ny = f(x) in the xy-plane?", 
                    "The function $f$ is defined by $f(x) = 62 - \\frac{1}{7}$. What is the $y$-intercept of the graph of\n$y = f(x)$ in the $xy$-plane?")
text = text.replace("The function f is defined by $f(x) = 62 - \\frac{1}{7}$. What is the y-intercept of the graph of\n$y$ = f(x) in the xy-plane?", 
                    "The function $f$ is defined by $f(x) = 62 - \\frac{1}{7}$. What is the $y$-intercept of the graph of\n$y = f(x)$ in the $xy$-plane?")
text = text.replace("What is the y-intercept of the graph of\n$y$ = $f(x)$ in the $xy$-plane?",
                    "What is the $y$-intercept of the graph of\n$y = f(x)$ in the $xy$-plane?")

# Let's just do a generic replace for M1 Q8 text
text = text.replace("The function f is defined", "The function $f$ is defined")
text = text.replace("What is the y-intercept", "What is the $y$-intercept")
text = text.replace("y = f(x) in the xy-plane", "$y = f(x)$ in the $xy$-plane")
text = text.replace("$y$ = f(x) in the $xy$-plane", "$y = f(x)$ in the $xy$-plane")
text = text.replace("$y$ = $f(x)$ in the $xy$-plane", "$y = f(x)$ in the $xy$-plane")
text = text.replace("What is the $y$-intercept of the graph of\n$y$ = $f(x)$ in the $xy$-plane?", "What is the $y$-intercept of the graph of\n$y = f(x)$ in the $xy$-plane?")

# Fix M1 Q12
text = text.replace("What is the value of f(\\frac{1}{4})?", "What is the value of $f(\\frac{1}{4})$?")
text = text.replace("What is the value of $f$(\\frac{1}{4})?", "What is the value of $f(\\frac{1}{4})$?")

# Fix M2 Q14
text = text.replace("f(n) is p%", "$f(n)$ is $p$\%")
text = text.replace("f(n) is $p$\%", "$f(n)$ is $p$\%")

# Wait, let's fix the M1 Q12 fraction to be like the picture.
text = text.replace("$f(x) = 3(\\frac{1}{4} - x)^2 + \\frac{13}{4}$", "$f(x) = 3(\\frac{1}{4} - x)^2 + \\frac{13}{4}$")

# Let's fix the Q9 table (Wait, the user said "pic2 is question 9" and my table was:
# Type of entree | Number of people
# --- | ---
# chicken | 20
# beef | 16
# vegetarian | 9
# fish | 5
# Total | 50
# BUT the user's pic shows Beef 13, Chicken 20, Fish 8, Vegetarian 9, Total 50)
q9_wrong = """__TABLE__
Type of entree | Number of people
--- | ---
chicken | 20
beef | 16
vegetarian | 9
fish | 5
Total | 50
__ENDTABLE__"""

q9_correct = """__TABLE__
Type of entree | Number of people
--- | ---
Beef | 13
Chicken | 20
Fish | 8
Vegetarian | 9
Total | 50
__ENDTABLE__"""
text = text.replace(q9_wrong, q9_correct)

with open('test2_questions.txt', 'w') as f:
    f.write(text)

print("Final tiny fixes applied!")
