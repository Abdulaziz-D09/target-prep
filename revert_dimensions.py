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

        # 1. Revert Header heights and widths
        content = content.replace('h-[58px]', 'h-[44px]')
        # Wait, if I replace h-[58px] with h-[44px], it will ALSO replace the min-h-[58px] in the options!
        # Because I previously had min-h-[58px] for options!
        # Actually min-h-[58px] was untouched because I only replaced h-[44px] with h-[58px] last time.
        # But wait! Did I replace w-[50px] with w-[58px] for the option letter box? Yes.
        
        # Let's do exact replacements to be safe.
        # Header container: 
        content = content.replace('w-full max-w-[450px] bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm h-[58px]', 'w-full bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm h-[44px]')
        
        # Header Number block:
        content = content.replace('w-[58px] h-[58px] flex flex-shrink-0 items-center justify-center rounded-l-[11px]', 'w-[44px] h-[44px] flex flex-shrink-0 items-center justify-center rounded-l-[11px]')
        
        # Header ABC block:
        content = content.replace('w-[58px] h-[58px] flex flex-shrink-0 items-center justify-center border-l border-[#E5E7EB] rounded-r-[11px] bg-transparent', 'w-[44px] h-[44px] flex flex-shrink-0 items-center justify-center border-l border-[#E5E7EB] rounded-r-[11px] bg-transparent')
        
        # Mark for Review padding:
        content = content.replace('px-6 py-3', 'px-6 py-2.5')
        content = content.replace('px-4 py-3', 'px-4 py-2.5')

        # Option letter block width:
        content = content.replace('w-[58px] flex-shrink-0 flex items-center justify-center font-bold text-[15px] border-r transition-colors', 'w-[50px] flex-shrink-0 flex items-center justify-center font-bold text-[15px] border-r transition-colors')

        # Option eliminate button width (was 50px, got changed to 58px accidentally)
        content = content.replace('w-[58px] flex items-center justify-start flex-shrink-0', 'w-[50px] flex items-center justify-start flex-shrink-0')

        with open(file, 'w') as f:
            f.write(content)
        print(f"Success {file}")
    except Exception as e:
        traceback.print_exc()

for f in files:
    update_file(f)
