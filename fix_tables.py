import re

with open('test2_questions.txt', 'r') as f:
    lines = f.readlines()

new_lines = []
in_table = False

for line in lines:
    if line.strip() == '__TABLE__':
        in_table = True
        new_lines.append(line)
        continue
    elif line.strip() == '__ENDTABLE__':
        in_table = False
        new_lines.append(line)
        continue
        
    if in_table and line.strip() != '' and '|' in line:
        parts = line.strip().split('|')
        # Check if already has leading/trailing
        has_leading = line.strip().startswith('|')
        has_trailing = line.strip().endswith('|')
        
        # We just wrap it with | if it doesn't have it
        clean_line = line.strip()
        if not has_leading:
            clean_line = '| ' + clean_line
        if not has_trailing:
            clean_line = clean_line + ' |'
            
        new_lines.append(clean_line + '\n')
    else:
        new_lines.append(line)

with open('test2_questions.txt', 'w') as f:
    f.writelines(new_lines)

