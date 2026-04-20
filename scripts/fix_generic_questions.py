#!/usr/bin/env python3
"""
Second pass: Fix questions where the question text is generic/incomplete.
The OCR captured the math expression, but the parser didn't merge it
into the question text properly.

Examples:
  OCR: "(x+ 5) + (2x-3)\nWhich of the following is equivalent to\nthe given expression?"
  Current question: "Which of the following is equivalent to the given expression?"
  Should be: "(x + 5) + (2x − 3)\n\nWhich of the following is equivalent to the given expression?"
"""

import json
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BANK_PATH = os.path.join(SCRIPT_DIR, '..', 'src', 'data', 'math_bank.json')
OCR_PATH = os.path.join(SCRIPT_DIR, 'ocr_output.json')

# Patterns that indicate a generic/incomplete question
GENERIC_PATTERNS = [
    'equivalent to the given expression',
    'equivalent to ?',
    'Which expression is equivalent to ?',
    'Which expression is equivalent to',
    'Which of the following is equivalent to ?',
    'expression is equivalent to for some',
    'can be rewritten as ?',
    'is equivalent to can be factored',
]

def extract_question_from_ocr(ocr_text, question_id):
    """Extract the full question text including any math expressions from OCR."""
    lines = ocr_text.strip().split('\n')
    
    # Find content after the ID line
    content_start = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('ID:') or stripped.startswith('Id:'):
            content_start = i + 1
            break
    
    if content_start == 0:
        for i, line in enumerate(lines):
            if '•••' in line or '•0•' in line:
                content_start = i + 1
                break
    
    if content_start == 0:
        content_start = min(5, len(lines))
    
    content_lines = lines[content_start:]
    if not content_lines:
        return None
    
    # Collect everything before options as the question stem
    question_parts = []
    option_pattern = re.compile(r'^(?:Choice\s+)?([A-D])\s*[.):\s]\s*(.*)', re.IGNORECASE)
    
    for line in content_lines:
        stripped = line.strip()
        if not stripped:
            continue
        if option_pattern.match(stripped):
            break
        # Skip metadata fragments that leaked through
        if any(skip in stripped.lower() for skip in ['expressions', 'expression\n']):
            if len(stripped) < 15:  # Short metadata label
                continue
        question_parts.append(stripped)
    
    if question_parts:
        return '\n'.join(question_parts).strip()
    return None


def main():
    with open(BANK_PATH, 'r') as f:
        bank = json.load(f)
    
    with open(OCR_PATH, 'r') as f:
        ocr_data = json.load(f)
    
    fixed = 0
    already_good = 0
    
    for i, q in enumerate(bank):
        current_q = q.get('question', '').strip()
        
        # Check if question text is generic/incomplete
        is_generic = False
        for pattern in GENERIC_PATTERNS:
            if pattern in current_q:
                is_generic = True
                break
        
        # Also catch questions ending with "equivalent to ?"
        if current_q.endswith('equivalent to ?') or current_q.endswith('equivalent to?'):
            is_generic = True
        
        if not is_generic:
            already_good += 1
            continue
        
        # Get OCR text
        ocr_text = ocr_data.get(q['id'], '')
        if not ocr_text:
            continue
        
        full_question = extract_question_from_ocr(ocr_text, q['id'])
        if not full_question:
            continue
        
        # Only update if OCR gives us more content
        if len(full_question) > len(current_q):
            bank[i]['question'] = full_question
            fixed += 1
            if fixed <= 5:
                print(f"Fixed {q['id']}:")
                print(f"  Before: {current_q[:80]}")
                print(f"  After:  {full_question[:120]}")
                print()
    
    print(f"\nFixed {fixed} generic questions")
    print(f"Already good: {already_good}")
    
    # Also fix questions that still show "Option A/B/C/D" because all options  
    # are empty - check remaining empty ones
    still_empty = sum(1 for q in bank if q.get('answerType') != 'numeric' and all(not o.strip() for o in q.get('options',[])))
    print(f"Still empty options: {still_empty}")
    
    with open(BANK_PATH, 'w') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    
    print(f"Written to {BANK_PATH}")

if __name__ == '__main__':
    main()
