import re

def update(file_path, number_var, flag_key, is_qb=False, indent=32):
    with open(file_path, 'r') as f:
        content = f.read()

    pattern = r'(\s*)\{\/\*\s*Header[: ].*?\*\/\}\n\s*<div className="flex items-center mb-6 mt-[24] w-full bg-white border border-\[#E5E7EB\] rounded-\[12px\] p-1\.5 shadow-sm">.*?(?=\n\s*\{\/\*|\n\s*\{currentQuestion|\n\s*\{q\.image|\n\s*<div className="text-\[17px\]|\n\s*<div className="text-\[16px\])'
    
    # Actually, let's just use a simpler regex that replaces the block we just inserted.
    pattern = r'(\s*)\{\/\*\s*Header[^\n]*\n\s*<div className="flex items-center mb-6 mt-[24] w-full bg-white border border-\[#E5E7EB\] rounded-\[12px\] p-1\.5 shadow-sm">.*?(?=\n\s*\{\/\*|\n\s*\{currentQuestion|\n\s*\{q\.image|\n\s*<div className="text-\[17px\]|\n\s*<div className="text-\[16px\])'

    replacement = r'''\1{/* Header: Connected Question Number & Mark for Review & ABC */}
\1<div className="inline-flex items-center mb-6 mt-4 bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
\1    {/* Number */}
\1    <div className="bg-[#111827] text-white font-bold text-[15px] w-[50px] self-stretch flex flex-shrink-0 items-center justify-center rounded-l-[11px] rounded-r-[12px]">
\1        {''' + number_var + ''' + 1}
\1    </div>
\1    {/* Mark for Review (Middle) */}
\1    <button
\1        onClick={() => ''' + ("handleToggleReview(" + flag_key + ")" if is_qb else ("setFlaggedQuestions(s => ({ ...s, [" + flag_key + "]: !s[" + flag_key + "] }))" if number_var == "currentIdx" else "toggleFlag(" + flag_key + ")")) + '''}
\1        className="flex items-center gap-2 px-6 py-2.5 group/mfr text-[#4B5563] text-[15px] transition-colors justify-start bg-transparent"
\1    >
\1        <Bookmark className={`w-[16px] h-[16px] transition-colors ${flaggedQuestions[''' + flag_key + '''] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
\1        <span className={flaggedQuestions[''' + flag_key + '''] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
\1    </button>
\1    {/* ABC Elimination (Right) */}'''
    if is_qb:
        replacement += r'''
\1    {isMultipleChoiceQuestion(q) && (
\1    <div className="self-stretch flex items-center rounded-r-[11px] rounded-l-[12px] bg-transparent border-l border-[#E5E7EB]">
\1        <button
\1            onClick={() => setIsEliminationMode(!isEliminationMode)}
\1            className={`flex items-center justify-center px-4 self-stretch font-bold text-[14px] transition-colors ${isEliminationMode ? 'bg-[#111827] text-white rounded-r-[11px] rounded-l-[12px]' : 'text-slate-700 hover:bg-slate-50 rounded-r-[11px] rounded-l-[12px]'}`}
\1        >
\1            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
\1        </button>
\1    </div>
\1    )}
\1</div>'''
    else:
        replacement += r'''
\1    <div className="self-stretch flex items-center rounded-r-[11px] rounded-l-[12px] bg-transparent border-l border-[#E5E7EB]">
\1        <button
\1            onClick={() => setIsEliminationMode(!isEliminationMode)}
\1            className={`flex items-center justify-center px-4 self-stretch font-bold text-[14px] transition-colors ${isEliminationMode ? 'bg-[#111827] text-white rounded-r-[11px] rounded-l-[12px]' : 'text-slate-700 hover:bg-slate-50 rounded-r-[11px] rounded-l-[12px]'}`}
\1        >
\1            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
\1        </button>
\1    </div>
\1</div>'''

    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Fix the mt-4 for qb
    if is_qb:
        new_content = new_content.replace('mb-6 mt-4 bg-white', 'mb-6 mt-2 bg-white')
        
    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Success {file_path}")
    else:
        print(f"Failed {file_path}")

update('src/app/practice/test/[id]/page.tsx', 'currentQuestionIndex', 'questionKey')
update('src/app/classroom/assignment/[id]/page.tsx', 'currentIdx', 'currentIdx', indent=24)
update('src/app/practice/test/baseline/page.tsx', 'currentQuestionIndex', 'questionKey')
update('src/app/question-bank/page.tsx', 'idx', 'idx', is_qb=True, indent=36)
