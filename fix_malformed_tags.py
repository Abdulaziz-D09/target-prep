import re

def fix_malformed(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Sometimes they wrote <i>text<i> instead of <i>text</i>
    content = re.sub(r'<i>([^<]+)<i>', r'<i>\1</i>', content)
    
    # Similarly, check if there are <u>text<u> instead of <u>text</u>
    content = re.sub(r'<u>([^<]+)<u>', r'<u>\1</u>', content)
    
    # <b>text<b> instead of <b>text</b>
    content = re.sub(r'<b>([^<]+)<b>', r'<b>\1</b>', content)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

fix_malformed('test1_questions.txt')
fix_malformed('test2_questions.txt')
