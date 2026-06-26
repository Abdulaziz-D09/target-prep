import re

with open('test1_questions.txt', 'r') as f:
    text = f.read()

# Replace "\nA. ...\n\nB. ...\n\nC. ...\n\nD. ..." with single newlines
def remove_double_newline_between_options(text):
    # Match an option followed by double newline followed by another option
    # e.g. ^(A\..*)\n\n(B\.)
    text = re.sub(r'^([A-D]\..*)\n\n([A-D]\.)', r'\1\n\2', text, flags=re.MULTILINE)
    text = re.sub(r'^([A-D]\..*)\n\n([A-D]\.)', r'\1\n\2', text, flags=re.MULTILINE)
    text = re.sub(r'^([A-D]\..*)\n\n([A-D]\.)', r'\1\n\2', text, flags=re.MULTILINE)
    return text

text = remove_double_newline_between_options(text)

with open('test1_questions.txt', 'w') as f:
    f.write(text)
    
print("Fixed option spacing.")
