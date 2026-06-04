import re

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

# 1. Update Practice Test 1 to use englishModule1 and englishModule2
# Find the start of practiceTests
pt_start = content.find('export const practiceTests: PracticeTest[] = [')

# We need to replace the inline arrays for Practice Test 1.
# Practice Test 1 has Reading and Writing section with two modules.
# We will use regex to find the first module's questions array and replace it with `questions: englishModule1`
# Then the second module's questions array with `questions: englishModule2`

# Find the first { timeMinutes: 32, questions: [ ... ] } after pt_start
# A safe way is to replace the chunk:
# timeMinutes: 32,\n      questions: [\n      {\n          id: "f1bfbed3" ... until the end of that array.
# Let's just find the first two occurrences of timeMinutes: 32, questions: [ ... ] after pt_start
def replacer(m):
    return '{\n        timeMinutes: 32,\n        questions: englishModule1\n      }'

def replacer2(m):
    return '{\n        timeMinutes: 32,\n        questions: englishModule2\n      }'

# First module replacement: we know it starts with id: "f1bfbed3"
content = re.sub(r'\{\s*timeMinutes:\s*32,\s*questions:\s*\[\s*\{\s*id:\s*"f1bfbed3".*?\]\s*\}', replacer, content, flags=re.DOTALL, count=1)

# Second module replacement: we know it starts with id: "em1-87aa7bab"
content = re.sub(r'\{\s*timeMinutes:\s*32,\s*questions:\s*\[\s*\{\s*id:\s*"em1-87aa7bab".*?\]\s*\}', replacer2, content, flags=re.DOTALL, count=1)

# 2. Delete Practice Tests 3-5
# Look for { id: 3, title: "Practice Test 3" ...
content = re.sub(r',\s*\{\s*id:\s*3,\s*title:\s*"Practice Test 3".*?\]\s*\}\s*\]\s*\}\s*', '', content, flags=re.DOTALL)
content = re.sub(r',\s*\{\s*id:\s*4,\s*title:\s*"Practice Test 4".*?\]\s*\}\s*\]\s*\}\s*', '', content, flags=re.DOTALL)
content = re.sub(r',\s*\{\s*id:\s*5,\s*title:\s*"Practice Test 5".*?\]\s*\}\s*\]\s*\}\s*', '', content, flags=re.DOTALL)

with open('src/data/questions.ts', 'w') as f:
    f.write(content)
print("Updated practiceTests array")
