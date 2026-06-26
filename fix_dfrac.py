import os

files_to_check = [
    'src/data/questions.ts',
    'test2_questions.txt',
    'test2_explanations.txt',
    'test1_questions.txt',
    'test1_explanations.txt',
    'test2_math.json',
    'test2_parsed.json',
    'test2_reading.json'
]

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        content = f.read()
    
    orig = content
    
    # In TS/JSON, \frac might be \\frac. In txt it might be \frac.
    # So we replace \frac directly to \dfrac after checking for ^{
    # Actually, we can just replace "{\\frac{" with "{\\dfrac{" 
    # Wait, the string is ^{\\frac{t}{4}} or ^{\frac{t}{4}}
    content = content.replace("^{\\frac{", "^{\\dfrac{")
    content = content.replace("^{\\\\frac{", "^{\\\\dfrac{")
    
    if content != orig:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for f in files_to_check:
    process_file(f)
