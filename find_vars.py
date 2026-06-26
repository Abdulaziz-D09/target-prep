import re

with open('test1_questions.txt', 'r') as f:
    text = f.read()

math_text = text[text.find('### Section 2, Module 1: Math'):]

# Find all single letters surrounded by spaces or punctuation, not inside $ $ or <i> </i>
# We can just remove all $...$ and <i>...</i> first, then find \b[a-zA-Z]\b
clean_text = re.sub(r'\$.*?\$', '', math_text)
clean_text = re.sub(r'<i>.*?</i>', '', clean_text)
clean_text = re.sub(r'!\[.*?\]\(.*?\)', '', clean_text)
clean_text = re.sub(r'__TABLE__.*?__ENDTABLE__', '', clean_text, flags=re.DOTALL)

words = re.findall(r'\b[a-zA-Z]\b', clean_text)
from collections import Counter
c = Counter(words)
for word, count in c.most_common():
    print(f"{word}: {count}")

