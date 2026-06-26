with open('parser_all.py', 'r') as f:
    text = f.read()

text = text.replace(r"r'(\b\d+)/(\d+\b)'", r"r'(?<!\d)(\d+)/(\d+)'")

with open('parser_all.py', 'w') as f:
    f.write(text)
