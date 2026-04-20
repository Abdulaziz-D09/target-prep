#!/usr/bin/env python3
"""
Fix math_bank.json: Clean up garbled question text and remove image dependency
for questions that have proper text content.

Strategy:
1. Questions with good text + good options: keep as-is, remove imageLayout
2. Questions with good text + empty options: try to extract from explanation
3. Questions with garbled text: try to reconstruct from explanation
4. Keep image field for questions that genuinely need diagrams/graphs/tables
"""

import json
import re
import sys
import os

BANK_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'math_bank.json')

def needs_diagram(q):
    """Check if a question genuinely needs a visual diagram/graph/table."""
    qt = (q.get('question','') + ' ' + q.get('explanation','')).lower()
    indicators = [
        'graph', 'figure', 'diagram', 'table', 'shown above',
        'shown below', 'scatterplot', 'scatter plot', 'bar graph', 
        'line of best fit', 'histogram', 'box plot', 'number line',
        'coordinate', 'xy-plane', 'x y-plane', 'circle', 'triangle',
        'rectangle', 'polygon', 'shaded', 'plotted', 'the figure',
        'shown in the', 'the graph of', 'in the figure', 'data in the',
        'based on the graph', 'intersect', 'parabola', 
        'system of equations is graphed', 'line in the',
        'represented by the graph', 'data shown', 'data set',
        'the table', 'survey', 'frequency', 'dot plot',
    ]
    # If the question text references a visual element
    for ind in indicators:
        if ind in qt:
            return True
    return False

def clean_question_text(text):
    """Clean up garbled OCR artifacts from question text."""
    if not text:
        return text
    
    # Remove trailing fragments that are clearly from OCR errors
    # e.g., "equivalent to as . Choice B?" or "rewritten as . Combining like terms?"
    text = re.sub(r'\s+as\s*\.\s*Choice\s+[A-D]\??$', '?', text)
    text = re.sub(r'\s+as\s*\.\s*(Combining|Adding|Subtracting)\s+.*\??$', '?', text)
    text = re.sub(r',\s*which\s+can\s+be\s+rewritten\s+as\s*$', '?', text)
    text = re.sub(r'\s+can\s+be\s+factored\s+as\s+.*$', '?', text)
    text = re.sub(r'using the distributive property\??$', 'using the distributive property?', text)
    
    # Clean up double spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Make sure question ends with ?
    if text and not text.endswith('?') and not text.endswith('.'):
        text = text.rstrip(',;:') + '?'
    
    return text

def clean_explanation(text):
    """Clean up explanation text."""
    if not text:
        return text
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def process_question(q):
    """Process a single question to fix its text content."""
    result = dict(q)
    
    # Clean question text
    result['question'] = clean_question_text(q.get('question', ''))
    
    # Clean explanation
    result['explanation'] = clean_explanation(q.get('explanation', ''))
    
    # Clean options
    opts = q.get('options', [])
    cleaned_opts = [re.sub(r'\s+', ' ', o).strip() for o in opts]
    result['options'] = cleaned_opts
    
    # For questions that don't need a diagram, we can remove image fields
    # but keep them for questions that reference visual elements
    has_image = bool(q.get('image'))
    all_opts_empty = all(not o.strip() for o in cleaned_opts)
    
    if has_image and not needs_diagram(q):
        # Question doesn't need a diagram - image was just used for text rendering
        # Remove imageLayout since we want text-based rendering
        if 'imageLayout' in result:
            del result['imageLayout']
        # Keep image field but questions with empty opts that don't need diagrams
        # are problematic - the image was showing the math expressions
        # We'll keep the image for now so they still render
    
    if has_image and needs_diagram(q):
        # Keep both image and imageLayout for diagram questions
        pass
    
    # Remove passage field if empty (math questions don't have passages)
    if not result.get('passage','').strip():
        result['passage'] = ''
    
    return result

def main():
    with open(BANK_PATH, 'r') as f:
        data = json.load(f)
    
    print(f"Processing {len(data)} questions...")
    
    processed = []
    stats = {
        'total': len(data),
        'cleaned_text': 0,
        'needs_diagram': 0, 
        'all_opts_empty': 0,
        'has_good_opts': 0,
        'removed_layout': 0,
    }
    
    for q in data:
        result = process_question(q)
        processed.append(result)
        
        opts = result.get('options', [])
        non_empty = [o for o in opts if o.strip()]
        
        if result['question'] != q.get('question', ''):
            stats['cleaned_text'] += 1
        if needs_diagram(q):
            stats['needs_diagram'] += 1
        if len(non_empty) < 2 and result.get('answerType') == 'multiple_choice':
            stats['all_opts_empty'] += 1
        else:
            stats['has_good_opts'] += 1
        if 'imageLayout' not in result and 'imageLayout' in q:
            stats['removed_layout'] += 1
    
    # Write output
    with open(BANK_PATH, 'w') as f:
        json.dump(processed, f, indent=2, ensure_ascii=False)
    
    print(f"\nResults:")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    print(f"\nWrote to {BANK_PATH}")

if __name__ == '__main__':
    main()
