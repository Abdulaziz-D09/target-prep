#!/usr/bin/env python3
"""
deep_clean.py — second-pass cleanup: remove questions that reference
'the expression above' or 'the equation above' without an associated image.
These are meaningless without the missing diagram.
"""
import json, os, re

BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')

def run(path, label):
    with open(path, encoding='utf-8') as f:
        qs = json.load(f)

    ABOVE = re.compile(r'\b(the expression|the equation|the graph|the figure|the table|the polynomial|the function|the system)\s+above\b', re.I)
    WHICH_ABOVE = re.compile(r'^Which of the following is\s*(a factor|equivalent|an equivalent)', re.I)

    removed, kept = [], []
    for q in qs:
        txt  = (q.get('question') or '').strip()
        img  = q.get('image') or ''
        crop = q.get('imageCrop')
        passage = (q.get('passage') or '').strip()

        # image-dependent question without any image
        if ABOVE.search(txt) and not img and not crop and not passage:
            removed.append(q['id'])
            continue

        # Very vague question with no context
        if WHICH_ABOVE.match(txt) and len(txt) < 60 and not img and not crop:
            removed.append(q['id'])
            continue

        kept.append(q)

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(kept, f, indent=2, ensure_ascii=False)

    print(f'{label}: {len(qs)} -> {len(kept)} (removed {len(removed)})')
    for qid in removed[:10]:
        print(f'  removed: {qid}')

run(os.path.join(BASE, 'math_bank.json'), 'Math')
run(os.path.join(BASE, 'ebrw_bank.json'), 'EBRW')
print('Done.')
