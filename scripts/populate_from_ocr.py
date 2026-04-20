#!/usr/bin/env python3
"""
Parse OCR output from math-bank images and update math_bank.json
to fill in missing question text and options.

OCR text format (typical):
  Question ID XXXXXXXX
  Assessment  Test  Domain  Skill  Difficulty
  SAT  Math  [domain]  [skill]
  •••
  ID: XXXXXXXX
  [question stem with math expressions]
  A. [option A]
  B. [option B]  
  C. [option C]
  D. [option D]
"""

import json
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BANK_PATH = os.path.join(SCRIPT_DIR, '..', 'src', 'data', 'math_bank.json')
OCR_PATH = os.path.join(SCRIPT_DIR, 'ocr_output.json')

def parse_ocr_text(raw_text, question_id):
    """Parse OCR text to extract question stem and options."""
    lines = raw_text.strip().split('\n')
    
    # Find where the actual question content starts
    # Skip the metadata header (Question ID, Assessment, Domain, etc.)
    content_start = 0
    for i, line in enumerate(lines):
        # The ID line is usually the last metadata line
        if line.strip().startswith('ID:') or line.strip().startswith('Id:'):
            content_start = i + 1
            break
    
    if content_start == 0:
        # Try to find content after "•••" or difficulty markers
        for i, line in enumerate(lines):
            if '•••' in line or '...' in line:
                content_start = i + 1
                break
    
    if content_start == 0:
        # Fallback: skip first 5 lines which are usually header
        content_start = min(5, len(lines))
    
    content_lines = lines[content_start:]
    if not content_lines:
        return None, []
    
    # Now parse question stem and options from content lines
    question_parts = []
    options = []
    
    # Option patterns: "A.", "A)", "Choice A", etc.
    option_pattern = re.compile(r'^(?:Choice\s+)?([A-D])\s*[.):\s]\s*(.*)', re.IGNORECASE)
    
    in_options = False
    current_option_letter = None
    current_option_text = ""
    
    for line in content_lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if this line starts an option
        m = option_pattern.match(line)
        if m:
            # Save previous option if any
            if current_option_letter is not None:
                options.append((current_option_letter, current_option_text.strip()))
            
            current_option_letter = m.group(1).upper()
            current_option_text = m.group(2).strip()
            in_options = True
        elif in_options and current_option_letter:
            # Continuation of current option text
            current_option_text += ' ' + line
        else:
            # Still in question stem
            question_parts.append(line)
    
    # Save last option
    if current_option_letter is not None:
        options.append((current_option_letter, current_option_text.strip()))
    
    question_text = ' '.join(question_parts).strip()
    
    # Clean up question text
    question_text = clean_math_text(question_text)
    
    # Build ordered options list
    ordered_options = ['', '', '', '']
    for letter, text in options:
        idx = ord(letter) - ord('A')
        if 0 <= idx < 4:
            ordered_options[idx] = clean_math_text(text)
    
    return question_text, ordered_options

def clean_math_text(text):
    """Clean up OCR artifacts from math text."""
    if not text:
        return text
    
    # Fix common OCR errors in math
    text = text.replace('°', '³')  # degree sign often misread for cube
    text = text.replace('©', 'C')
    text = text.replace('®', '')
    text = text.replace('™', '')
    text = text.replace('  ', ' ')
    
    # Remove trailing College Board metadata fragments
    text = re.sub(r'\s*Choice [A-D] is (?:correct|incorrect)\..*$', '', text)
    
    # Clean multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def needs_image_for_diagram(q, ocr_text):
    """Check if question genuinely needs the image for a visual element."""
    combo = (q.get('question', '') + ' ' + q.get('explanation', '') + ' ' + ocr_text).lower()
    visual_indicators = [
        'graph', 'figure', 'diagram', 'table', 'shown above',
        'shown below', 'scatterplot', 'scatter plot', 'bar graph',
        'line of best fit', 'histogram', 'box plot', 'number line',
        'coordinate', 'xy-plane', 'x y-plane', 'the figure',
        'shown in the', 'the graph of', 'in the figure', 'data in the',
        'based on the graph', 'plotted', 'data shown', 'data set',
        'the table', 'dot plot', 'system of equations is graphed',
        'represented by the graph', 'circle with center',
        'triangle', 'rectangle', 'polygon', 'shaded region',
    ]
    for indicator in visual_indicators:
        if indicator in combo:
            return True
    return False

def main():
    # Load data
    with open(BANK_PATH, 'r') as f:
        bank = json.load(f)
    
    with open(OCR_PATH, 'r') as f:
        ocr_data = json.load(f)
    
    print(f"Loaded {len(bank)} questions, {len(ocr_data)} OCR results")
    
    # Build lookup by question ID
    bank_by_id = {}
    for i, q in enumerate(bank):
        bank_by_id[q['id']] = (i, q)
    
    stats = {
        'updated_question': 0,
        'updated_options': 0,
        'removed_image': 0,
        'kept_image_for_diagram': 0,
        'skipped_good': 0,
        'no_ocr': 0,
        'ocr_failed': 0,
    }
    
    for q_id, ocr_text in ocr_data.items():
        if q_id not in bank_by_id:
            continue
        
        idx, q = bank_by_id[q_id]
        
        # Skip questions that already have good data
        opts = q.get('options', [])
        has_good_options = len([o for o in opts if o.strip()]) >= 2
        has_good_question = len(q.get('question', '').strip()) > 20
        
        # Parse OCR text
        ocr_question, ocr_options = parse_ocr_text(ocr_text, q_id)
        
        if not ocr_question and not any(ocr_options):
            stats['ocr_failed'] += 1
            continue
        
        updated = False
        
        # Update question text if current is weak
        if not has_good_question and ocr_question and len(ocr_question) > 10:
            bank[idx]['question'] = ocr_question
            stats['updated_question'] += 1
            updated = True
        elif not has_good_question and ocr_question:
            # Even short OCR text is better than nothing
            bank[idx]['question'] = ocr_question
            stats['updated_question'] += 1
            updated = True
        
        # Update options if current are empty
        if not has_good_options and q.get('answerType') != 'numeric':
            non_empty_ocr = [o for o in ocr_options if o.strip()]
            if len(non_empty_ocr) >= 2:
                bank[idx]['options'] = ocr_options
                stats['updated_options'] += 1
                updated = True
        
        # For questions that don't need a diagram, remove the image reference
        # so the UI doesn't show the ugly CB screenshot
        if q.get('image') and not needs_image_for_diagram(q, ocr_text):
            if has_good_options or len([o for o in bank[idx].get('options', []) if o.strip()]) >= 2:
                # We have text options now, no need for the image
                bank[idx]['image'] = ''
                if 'imageLayout' in bank[idx]:
                    del bank[idx]['imageLayout']
                stats['removed_image'] += 1
            else:
                # Still need image as fallback
                stats['kept_image_for_diagram'] += 1
        elif q.get('image'):
            stats['kept_image_for_diagram'] += 1
        
        if not updated:
            stats['skipped_good'] += 1
    
    # Write updated bank
    with open(BANK_PATH, 'w') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    
    print(f"\nResults:")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    
    # Final stats
    updated_bank = bank
    good_q = sum(1 for q in updated_bank if len(q.get('question','').strip()) > 10)
    good_opts = sum(1 for q in updated_bank if len([o for o in q.get('options',[]) if o.strip()]) >= 2)
    has_image = sum(1 for q in updated_bank if q.get('image','').strip())
    
    print(f"\nFinal stats:")
    print(f"  Questions with good text: {good_q}/{len(updated_bank)}")
    print(f"  Questions with good options: {good_opts}/{len(updated_bank)}")
    print(f"  Questions still with images: {has_image}/{len(updated_bank)}")

if __name__ == '__main__':
    main()
