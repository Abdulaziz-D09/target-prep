import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Fix question 13 and 14 overlap in test2_questions.txt
# From what I saw, test2_questions.txt has question 14 inside question 13.
# Wait, actually looking at test2_questions.txt around lines 280-320 (module 1) and 845-910 (module 2):
# Module 1:
# 293: Answer: B
# 294: 
# 295: 14.
# 296: Which choice most logically completes the text?
# 
# Module 2:
# 873: Answer: C
# 874: 
# 875: 14.
# 876: 
# 877: Which choice most effectively uses data from the table to complete the example?

# The user said: "what the fuck is this why is question 14 inside question 13"
# Let's check parser_all.py to see how it separates questions.
# Maybe test2.json or test2_parsed.json got question 14 merged into question 13.
