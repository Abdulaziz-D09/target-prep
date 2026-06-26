import re
import os

files_to_check = [
    'test2_reading.json',
    'src/data/questions.ts',
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
    
    # Fix QS -> \overline{QS}
    content = re.sub(r'(?<!\$)\\\\{1,2}overline\{QS\}(?!\$)', r'$\\overline{QS}$', content)
    content = re.sub(r'length of QS', r'length of $\\overline{QS}$', content)

    if content != orig:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for f in files_to_check:
    process_file(f)
