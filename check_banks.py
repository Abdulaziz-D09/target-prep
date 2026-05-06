import json
from collections import Counter

try:
    with open('src/data/ebrw_bank.json') as f: ebrw = json.load(f)
    print(f"EBRW Bank: {len(ebrw)} questions")
    print(Counter(q.get('skill', 'Unknown') for q in ebrw))
except Exception as e: print(e)

try:
    with open('src/data/math_bank.json') as f: math = json.load(f)
    print(f"Math Bank: {len(math)} questions")
    print(Counter(q.get('domain', 'Unknown') for q in math))
    tables = sum(1 for q in math if 'table' in q.get('question', '').lower() or '|' in q.get('question', ''))
    print(f"Math questions with tables/graphs: {tables}")
except Exception as e: print(e)
