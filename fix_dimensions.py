import re
import os
import traceback

files = [
    'src/app/practice/test/[id]/page.tsx',
    'src/app/practice/test/baseline/page.tsx',
    'src/app/question-bank/page.tsx',
    'src/app/classroom/assignment/[id]/page.tsx',
    'src/app/study-plan/page.tsx'
]

def update_file(file):
    if not os.path.exists(file): return
    try:
        with open(file, 'r') as f:
            content = f.read()

        # 1. Update Header (height 44 -> 58, width 44 -> 58)
        content = content.replace('h-[44px]', 'h-[58px]')
        content = content.replace('w-[44px]', 'w-[58px]')
        content = content.replace('px-6 py-2.5', 'px-6 py-3') # adjust padding for Mark for Review
        content = content.replace('px-4 py-2.5', 'px-4 py-3')
        
        # 2. Update Options (letter box width 50 -> 58)
        # In options, we used w-[50px]
        content = content.replace('w-[50px]', 'w-[58px]')

        with open(file, 'w') as f:
            f.write(content)
        print(f"Success {file}")
    except Exception as e:
        traceback.print_exc()

for f in files:
    update_file(f)
