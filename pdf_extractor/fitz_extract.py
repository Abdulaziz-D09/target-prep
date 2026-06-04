import fitz

try:
    doc = fitz.open('../Practice test 1.pdf')
    print(f"Total pages: {len(doc)}")
    for i in range(min(5, len(doc))):
        page = doc[i]
        text = page.get_text()
        print(f"--- Page {i+1} ---")
        if text.strip():
            print(text[:500])
        else:
            print("[No text found]")
except Exception as e:
    print(f"Error: {e}")
