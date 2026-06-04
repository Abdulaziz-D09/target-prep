import re
import os

files = [
    'src/app/practice/test/[id]/page.tsx',
    'src/app/practice/test/baseline/page.tsx',
    'src/app/question-bank/page.tsx',
    'src/app/classroom/assignment/[id]/page.tsx',
    'src/app/study-plan/page.tsx'
]

# Pattern for the main practice test/baseline/assignment options
pattern1 = r'className=\{`relative flex-1 p-3 px-4 border min-h-\[58px\] rounded-\[10px\] flex items-center cursor-pointer transition-all duration-200 overflow-hidden \$\{isSelected \? \'border-indigo-600 shadow-\[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba\(79,70,229,0\.15\)\] bg-indigo-50\/30\' \: \'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm\'\}`\}\n\s*>\n\s*<input.*?\/>\n\s*\{\/\* Letter Circle inside the box \*\/\}\n\s*<div className=\{`w-\[28px\] h-\[28px\] rounded-full border-\[1\.5px\] flex-shrink-0 flex items-center justify-center font-bold text-\[13px\] mr-4 transition-colors \$\{isSelected \? \'border-indigo-600 text-white bg-indigo-600 shadow-sm\' \: \'border-slate-400 text-slate-700\'\}`\}>\n\s*\{letter\}\n\s*<\/div>\n\s*\{\/\* Answer Text \*\/\}\n\s*<span className=\{`text-\[17px\] font-sans flex-1 \$\{isEliminated \? \'text-slate-400\' \: \'text-\[#111827\]\'\}`\}>\n\s*\{cleanOCR\(opt\)\}\n\s*<\/span>'

replacement1 = r'''className={`relative flex-1 border min-h-[58px] rounded-[12px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-[#E5E7EB] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm'}`}
>
    <input
        type="radio"
        name="answer"
        id={`opt-${i}`}
        className="sr-only"
        checked={isSelected}
        onChange={() => {
            if (!isEliminated) selectAnswer(questionKey, i);
        }}
    />

    {/* Letter Box (Flush to edges) */}
    <div className={`w-[50px] flex-shrink-0 flex items-center justify-center font-bold text-[15px] border-r transition-colors ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] group-hover:bg-[#F3F4F6]'}`}>
        {letter}
    </div>

    {/* Answer Text */}
    <div className="flex-1 p-4 flex items-center">
        <span className={`text-[17px] font-sans ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
            {cleanOCR(opt)}
        </span>
    </div>'''

for file in files:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
            
        # Try replacing main pattern
        new_content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)
        
        # But wait, onChange depends on selectAnswer which might have different signature in different files!
        # E.g. in assignment, it might not be `selectAnswer(questionKey, i)`!
        
        if new_content != content:
            # We don't save yet, we need to handle the input tag correctly!
            print(f"Matched main pattern in {file}, but need to preserve input tag!")
