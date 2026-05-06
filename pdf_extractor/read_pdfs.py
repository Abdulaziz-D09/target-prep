from PyPDF2 import PdfReader
import json

for pdf in ['V1', 'V2', 'V3']:
    print(f"Reading {pdf}.pdf...")
    reader = PdfReader(f"{pdf}.pdf")
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    with open(f"{pdf}.txt", "w") as f:
        f.write(text)
    print(f"Wrote {pdf}.txt ({len(text)} chars)")
