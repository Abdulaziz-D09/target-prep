import pdfplumber
import sys

try:
    with pdfplumber.open('../Practice test 1.pdf') as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        # Print first 5 pages
        for i, page in enumerate(pdf.pages[:5]):
            print(f"--- Page {i+1} ---")
            text = page.extract_text()
            if text:
                print(text[:500])
                print("...")
            else:
                print("[No text found]")
except Exception as e:
    print(f"Error: {e}")
