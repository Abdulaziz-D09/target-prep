import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Let's fix test2_questions.txt to prevent the parser from swapping question and passage
# Wait, actually test2_questions.txt has them in order: passage, then question.
# But sometimes the question prompt comes before the passage text?
