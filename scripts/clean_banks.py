#!/usr/bin/env python3
"""
clean_banks.py  — remove corrupted questions from math_bank.json and ebrw_bank.json
Run: python3 scripts/clean_banks.py
"""

import json, re, sys, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
MATH_PATH  = os.path.join(BASE, 'math_bank.json')
EBRW_PATH  = os.path.join(BASE, 'ebrw_bank.json')

JUNK_OPT = re.compile(r'^(msup|в\.|Option [A-D]|\s*$)', re.UNICODE)
JUNK_Q   = re.compile(r'^[,;.\u2013\-\u2014\u2212]|^where |^which of the following is equivalent to\s*\?$', re.IGNORECASE)

def is_bad_option(o):
    s = (o or '').strip()
    return s == '' or bool(JUNK_OPT.match(s))

def is_bad_question(q):
    text = (q.get('question') or '').strip()
    # too short
    if len(text) < 10:
        return True, f'too short ({len(text)} chars): {text[:40]!r}'
    # starts with punctuation/junk
    if JUNK_Q.match(text):
        return True, f'bad start: {text[:60]!r}'
    # MC checks
    opts = q.get('options') or []
    if q.get('answerType') == 'multiple_choice' or (opts and len(opts) > 0):
        if len(opts) < 2:
            return True, f'too few options ({len(opts)})'
        # Count how many options are populated
        populated = [o for o in opts if (o or '').strip()]
        if len(populated) < 2:
            return True, f'fewer than 2 non-empty options'
        # Check for junk options (tolerate if question has imageCrop)
        has_crop = bool(q.get('imageCrop'))
        junk_opts = [o for o in opts if is_bad_option(o)]
        if junk_opts and not has_crop:
            return True, f'junk option(s): {junk_opts[:2]}'
    return False, ''

def clean_file(path, label):
    with open(path, encoding='utf-8') as f:
        qs = json.load(f)
    
    kept, removed = [], []
    for q in qs:
        bad, reason = is_bad_question(q)
        if bad:
            removed.append((q.get('id','?'), reason))
        else:
            kept.append(q)
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(kept, f, indent=2, ensure_ascii=False)
    
    print(f'\n{label}:')
    print(f'  Before: {len(qs)} | Removed: {len(removed)} | Kept: {len(kept)}')
    if removed:
        print(f'  Sample removed:')
        for qid, reason in removed[:8]:
            print(f'    [{qid}] {reason}')

clean_file(MATH_PATH, 'Math Bank')
clean_file(EBRW_PATH, 'EBRW Bank')
print('\nDone.')
