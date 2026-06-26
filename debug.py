import re

text = """D
27.

While researching a topic, a student has taken the following notes:"""

q_chunk = '\n'.join(text.split('\n')[1:]).strip()
print(repr(q_chunk))
q_chunk = re.sub(r'^\s*\d+\.\s*\n*', '', q_chunk).strip()
print(repr(q_chunk))
