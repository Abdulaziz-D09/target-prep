import re
import os

files_to_check = [
    'src/data/questions.ts',
    'test2_questions.txt',
    'test2_explanations.txt',
    'test1_questions.txt',
    'test1_explanations.txt',
    'test2_math.json',
    'test2_parsed.json',
    'data2.json'
]

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        content = f.read()
    
    orig = content
    
    # Remove Note: Figure not drawn to scale.
    content = re.sub(r'(?i)\(Note:\s+Figure\s+not\s+drawn\s+to\s+scale\.\s*', '(', content)
    content = re.sub(r'(?i)Note:\s+Figure\s+not\s+drawn\s+to\s+scale\.\s*', '', content)
    
    # Fix QS -> \overline{QS} in the specific sentence "Which expression represents the length of QS?" or "length of \\overline{QS}" without $
    # In TS: "\\overline{QS}" -> "$\\overline{QS}$" if not already wrapped
    content = re.sub(r'(?<!\$)\\\\{1,2}overline\{QS\}(?!\$)', r'$\\overline{QS}$', content)
    # If it's just "length of QS", change to "length of $\overline{QS}$"
    content = re.sub(r'length of QS', r'length of $\\overline{QS}$', content)

    # Let's do it smarter. For questions.ts, it's a TS file, so backslashes need to be doubled.
    if filepath.endswith('.ts'):
        content = content.replace('^{t/4}', '^{\\\\frac{t}{4}}')
        content = content.replace('^{4/4}', '^{\\\\frac{4}{4}}')
        content = content.replace('^{8/4}', '^{\\\\frac{8}{4}}')
        content = content.replace('^(t/4)', '^{\\\\frac{t}{4}}')
    else:
        content = content.replace('^{t/4}', '^{\\frac{t}{4}}')
        content = content.replace('^{4/4}', '^{\\frac{4}{4}}')
        content = content.replace('^{8/4}', '^{\\frac{8}{4}}')
        content = content.replace('^(t/4)', '^{\\frac{t}{4}}')

    if content != orig:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for f in files_to_check:
    process_file(f)
