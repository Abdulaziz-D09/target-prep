import re

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

em1 = re.findall(r'"id": "em1-[^"]+"', content)
print("em1:", len(em1))

em2e = re.findall(r'"id": "em2e-[^"]+"', content)
print("em2e:", len(em2e))

em2h = re.findall(r'"id": "em2h-[^"]+"', content)
print("em2h:", len(em2h))

pt2_math = re.findall(r'id: "pt2-math-[^"]+"', content)
print("pt2 math:", len(pt2_math))

# Check for Practice Test 2 English IDs (e.g., from test2.txt). I saw '356ad646' etc.
# These don't have a prefix. Let's count how many questions are between 'title: "Practice Test 2"' and 'name: Math' or end of file.

pt2_idx = content.find('title: "Practice Test 2"')
if pt2_idx != -1:
    pt2_content = content[pt2_idx:]
    pt2_qs = re.findall(r'id:\s*"[0-9a-f]{8}"', pt2_content)
    print("pt2 english (approx):", len(pt2_qs))

