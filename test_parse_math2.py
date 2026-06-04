import re
with open('test2_questions.txt', 'r') as f:
    text = f.read()

m2 = text.split('## Section 2, Module 2: Math')[1]
q_matches = re.finditer(r'\*\*(\d+)\.\*\*', m2)
nums = [int(m.group(1)) for m in q_matches]
print("Module 2 Math Question numbers found:", nums)
