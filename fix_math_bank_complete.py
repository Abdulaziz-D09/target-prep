#!/usr/bin/env python3
"""
Comprehensive fix for math_bank.json
Fixes all formatting issues to make text look human-readable
"""
import json
import re
import shutil
from datetime import datetime

INPUT = 'src/data/math_bank.json'
OUTPUT = 'src/data/math_bank.json'
BACKUP = f'src/data/math_bank.json.bak.{datetime.now().strftime("%Y%m%d_%H%M%S")}'

with open(INPUT, 'r') as f:
    data = json.load(f)

# Backup
shutil.copy(INPUT, BACKUP)
print(f"Backup saved to {BACKUP}")
print(f"Processing {len(data)} questions...\n")

stats = {
    'difficulty_fixed': 0,
    'possessive_fixed': 0,
    'html_tag_fixed': 0,
    'illegible_fixed': 0,
    'chart_artifact_fixed': 0,
    'bar_chart_fixed': 0,
    'out_of_range_fixed': 0,
    'bare_image_fixed': 0,
    'dollar_fix': 0,
}

def fix_text(text, is_explanation=False):
    if not isinstance(text, str):
        return text
    
    # 1. Fix possessives: word'$s$ -> word's
    # This covers: It'$s$, airplane'$s$, student'$s$, shop'$s$, etc.
    text = re.sub(r"([a-zA-Z])'\\?\$s\\?\$", r"\1's", text)
    
    # 2. Fix broken HTML underline tags: <$u$> -> <u> and </$u$> -> </u>
    text = re.sub(r'<\$u\$>', '<u>', text)
    text = re.sub(r'</\$u\$>', '</u>', text)
    
    # 3. Remove [illegible] placeholders (replace with empty or reasonable text)
    text = text.replace('[illegible]', '')
    
    # 4. Remove chart artifact placeholders
    # [CHART TYPE] Line chart...  -> just remove the entire bracket+content line
    text = re.sub(r'\[CHART TYPE\][^\n]*\n?', '', text)
    text = re.sub(r'\[AXES & SERIES\][^\n]*\n?', '', text)
    text = re.sub(r'\[AXES \& SERIES\][^\n]*\n?', '', text)
    text = re.sub(r'\[DIMENSIONS\][^\n]*\n?', '', text)
    text = re.sub(r'\[PRECISION\][^\n]*\n?', '', text)
    text = re.sub(r'\[CAPTION\]\s*\$?[A-D]\$?\.\n?', '', text)
    text = re.sub(r'\[PROOF ROW\][^\n]*\n?', '', text)
    
    # 5. Remove [out of range] placeholder
    text = re.sub(r'\[out of range\]', '', text)
    
    # 6. Remove bar chart ASCII artifacts from text (NOT from difficulty field - that's handled separately)
    text = re.sub(r'\[█[█░]*\]', '', text)
    text = re.sub(r'\[■[■□]*\]', '', text)
    text = re.sub(r'(?:\[filled_bar\]|\[empty_bar\]|\[black_bar\]|\[white_bar\]|\[black_box\]|\[white_box\])+', '', text)
    text = re.sub(r'\[Graphic:[^\]]*\]', '', text)
    
    # 7. Fix dollar sign formatting: $\$400$ -> $400, \$400$ -> $400
    # The pattern $\$400$ in rendered markdown shows as $[?] or weird
    text = re.sub(r'\$\\\$(\d[\d,\.]*)\$', r'$\1', text)
    text = re.sub(r'\\\$(\d[\d,\.]*)', r'$\1', text)
    
    # 8. Clean up multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip() if text else text

def fix_difficulty(diff):
    """Strip all bracket noise from difficulty, keep only Easy/Medium/Hard/Assessment"""
    if not isinstance(diff, str):
        return diff
    
    # Match the valid difficulty word at the start
    m = re.match(r'^(Easy|Medium|Hard|Assessment)', diff)
    if m:
        return m.group(1)
    
    # If no valid prefix but has the word somewhere
    for level in ['Easy', 'Medium', 'Hard', 'Assessment']:
        if level in diff:
            return level
    
    return diff

changes = 0
for i, item in enumerate(data):
    item_changed = False
    
    # Fix difficulty field
    old_diff = item.get('difficulty', '')
    new_diff = fix_difficulty(old_diff)
    if old_diff != new_diff:
        item['difficulty'] = new_diff
        stats['difficulty_fixed'] += 1
        item_changed = True
    
    # Fix text fields
    for field in ['question', 'explanation', 'answerText', 'passage']:
        if field in item and isinstance(item[field], str):
            old_val = item[field]
            new_val = fix_text(old_val)
            if old_val != new_val:
                item[field] = new_val
                item_changed = True
    
    # Fix options (list of strings)
    if 'options' in item and isinstance(item['options'], list):
        new_options = []
        for opt in item['options']:
            if isinstance(opt, str):
                old_opt = opt
                new_opt = fix_text(opt)
                if old_opt != new_opt:
                    item_changed = True
                new_options.append(new_opt)
            else:
                new_options.append(opt)
        item['options'] = new_options
    
    if item_changed:
        changes += 1

print(f"Fixed {changes} questions total")
print(f"\nStatistics:")
print(f"  Difficulty fields cleaned: computed from run")

# Write output
with open(OUTPUT, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\nSaved to {OUTPUT}")
