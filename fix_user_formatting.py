import re

def process_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace **text** with <b>text</b>
    content = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', content)
    
    # Replace *text* with <i>text</i>
    content = re.sub(r'\*([^\*]+?)\*', r'<i>\1</i>', content)
    
    # Replace _text_ with <u>text</u>
    # But be careful not to replace underscores in words or URLs. We assume _text_ has word boundaries or spaces
    content = re.sub(r'\b_([^_]+?)_\b', r'<u>\1</u>', content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('test1_questions.txt')
process_file('test2_questions.txt')
