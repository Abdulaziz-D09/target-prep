import json
import re

try:
    with open('.next/dev/server/chunks/ssr/src_data_math_bank_json_91171041._.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the string inside JSON.parse('...')
    match = re.search(r'JSON\.parse\(([\x27\x22`])(.*?)\1\)', content, flags=re.DOTALL)
    if match:
        # Evaluate the string literal to unescape it
        json_str = eval(match.group(1) + match.group(2) + match.group(1))
        parsed = json.loads(json_str)
        
        # Now move images to front
        for q in parsed:
            if 'question' in q and q['question']:
                img_match = re.search(r'!\[.*?\]\(.*?\)', q['question'])
                if img_match and not q['question'].startswith(img_match.group(0)):
                    q['question'] = img_match.group(0) + '\n\n' + q['question'].replace(img_match.group(0), '').strip()
        
        with open('src/data/math_bank.json', 'w', encoding='utf-8') as f:
            json.dump(parsed, f, indent=2)
        print('Extracted and fixed math_bank.json successfully. Array length:', len(parsed))
    else:
        print('Could not find JSON.parse block')
except Exception as e:
    print('Error:', e)
