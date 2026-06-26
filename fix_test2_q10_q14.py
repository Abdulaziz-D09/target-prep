import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Fix question 13 where question 14 is inside question 13.
# Let's inspect test2_questions.txt around q13 and q14.
