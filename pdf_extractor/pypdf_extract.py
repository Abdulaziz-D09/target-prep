import sys
from PyPDF2 import PdfReader

reader = PdfReader('../Practice test 1.pdf')
text = ""
for page in reader.pages[:10]:
    text += page.extract_text() + "\n"

print(text[:1000])
