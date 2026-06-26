import re

def fix_bold(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Revert <b>text</b> back to **text**
    content = re.sub(r'<b>([\s\S]*?)</b>', r'**\1**', content)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

fix_bold('test1_questions.txt')
fix_bold('test2_questions.txt')
