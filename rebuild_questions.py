import json
import re

# 1. Read existing questions.ts to extract englishModule1, satDates, studyResources
with open('src/data/questions.ts', 'r') as f:
    content = f.read()

# Extract englishModule1
# It starts at 'const englishModule1: Question[] = [' and ends at '];' before the next const
em1_match = re.search(r'const englishModule1: Question\[\] = (\[.*?\]);\s*const', content, re.DOTALL)
if em1_match:
    em1_str = em1_match.group(1)
    em1 = json.loads(re.sub(r'//.*', '', em1_str)) # might fail if trailing commas, let's just use python's json? No, it's JS.
else:
    # let's just find all questions with id em1-
    em1 = []
    # This is fragile, let's just use regex to extract the 27 objects
    pass

