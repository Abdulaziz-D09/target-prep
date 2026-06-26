import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Replace \frac{a}{b} with a/b
text = re.sub(r'\\frac{([^}]*)}{([^}]*)}', r'\1/\2', text)

# Replace \cdot with .
text = text.replace(r'\cdot', '.')

# Replace \cos and \sin with cos and sin
text = text.replace(r'\cos', 'cos')
text = text.replace(r'\sin', 'sin')

# Remove $ signs
text = text.replace('$', '')

with open('test2_questions.txt', 'w') as f:
    f.write(text)

