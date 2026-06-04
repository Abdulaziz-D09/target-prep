import re
import traceback

def get_replacement(number_var, flag_key, is_qb=False):
    block = """                                {/* Header: Connected Question Number & Mark for Review & ABC */}
                                <div className="flex items-center mb-6 mt-4 w-full max-w-[450px] bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm h-[44px]">
                                    {/* Number */}
                                    <div className="bg-[#111827] text-white font-bold text-[15px] w-[44px] h-[44px] flex flex-shrink-0 items-center justify-center rounded-l-[11px]">
                                        {""" + number_var + """ + 1}
                                    </div>

                                    {/* Mark for Review (Middle) */}
                                    <button
                                        onClick={() => """ + ("handleToggleReview(" + flag_key + ")" if is_qb else ("setFlaggedQuestions(s => ({ ...s, [" + flag_key + "]: !s[" + flag_key + "] }))" if number_var == "currentIdx" else "toggleFlag(" + flag_key + ")")) + """}
                                        className="flex flex-1 items-center gap-2 px-4 h-full """ + ("text-[#4B5563] text-[14px]" if is_qb else "text-[#4B5563] text-[15px]") + """ transition-colors justify-start bg-transparent group/mfr hover:bg-slate-50"
                                    >
                                        <Bookmark className={`w-[16px] h-[16px] transition-colors ${flaggedQuestions[""" + flag_key + """] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                        <span className={flaggedQuestions[""" + flag_key + """] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                                    </button>

                                    {/* ABC Elimination (Right) */}"""
    if is_qb:
        block += """
                                    {isMultipleChoiceQuestion(q) && (
                                    <div className="w-[44px] h-[44px] flex flex-shrink-0 items-center justify-center border-l border-[#E5E7EB] rounded-r-[11px] bg-transparent">
                                        <button
                                            onClick={() => setIsEliminationMode(!isEliminationMode)}
                                            className={`flex items-center justify-center w-full h-full font-bold text-[14px] transition-colors rounded-r-[11px] ${isEliminationMode ? 'bg-[#111827] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                        </button>
                                    </div>
                                    )}
                                </div>"""
    else:
        block += """
                                    <div className="w-[44px] h-[44px] flex flex-shrink-0 items-center justify-center border-l border-[#E5E7EB] rounded-r-[11px] bg-transparent">
                                        <button
                                            onClick={() => setIsEliminationMode(!isEliminationMode)}
                                            className={`flex items-center justify-center w-full h-full font-bold text-[14px] transition-colors rounded-r-[11px] ${isEliminationMode ? 'bg-[#111827] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                        </button>
                                    </div>
                                </div>"""
    return block

def update(file_path, number_var, flag_key, is_qb=False, indent=32):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            
        # We need to find the old block! It starts with {/* Header: Connected Question Number & Mark for Review & ABC */}
        # or {/* Header bar */} for QB.
        
        pattern = r'(\s*)\{\/\*\s*Header[: ].*?\*\/\}\n\s*<div className="inline-flex items-center mb-6 mt-[24] bg-white border border-\[#E5E7EB\] rounded-\[12px\] shadow-sm">.*?(?=\n\s*\{\/\*|\n\s*\{currentQuestion|\n\s*\{q\.image|\n\s*<div className="text-\[17px\]|\n\s*<div className="text-\[16px\])'
        
        # Actually since I already know the exact content of the LAST replacement, I can just do a regex replace from "Header" to the closing div.
        if is_qb:
            pattern = r'(\s*)\{\/\*\s*Header bar\s*\*\/\}\n\s*<div className="inline-flex items-center mb-6 mt-2 bg-white border border-\[#E5E7EB\] rounded-\[12px\] shadow-sm">.*?(?=\n\s*\{\/\*|\n\s*\{q\.image)'
        else:
            pattern = r'(\s*)\{\/\*\s*Header: Connected Question Number & Mark for Review & ABC\s*\*\/\}\n\s*<div className="inline-flex items-center mb-6 mt-4 bg-white border border-\[#E5E7EB\] rounded-\[12px\] shadow-sm">.*?(?=\n\s*\{\/\*|\n\s*\{currentQuestion)'
        
        replacement = get_replacement(number_var, flag_key, is_qb)
        
        # fix indentation
        lines_r = replacement.split('\n')
        def adjust(l):
            if l.startswith(" " * 32):
                return (" " * indent) + l[32:]
            return l
        replacement = '\n'.join(adjust(l) for l in lines_r)
        
        if is_qb:
            replacement = replacement.replace('Header: Connected Question Number & Mark for Review & ABC', 'Header bar')
            replacement = replacement.replace('mt-4 w-full max-w-[450px]', 'mt-2 w-full max-w-[450px]')
            
        import re
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(file_path, 'w') as f:
                f.write(new_content)
            print(f"Success {file_path}")
        else:
            print(f"Failed {file_path} - regex didn't match")
    except Exception as e:
        traceback.print_exc()

update('src/app/practice/test/[id]/page.tsx', 'currentQuestionIndex', 'questionKey')
update('src/app/classroom/assignment/[id]/page.tsx', 'currentIdx', 'currentIdx', indent=24)
update('src/app/practice/test/baseline/page.tsx', 'currentQuestionIndex', 'questionKey')
update('src/app/question-bank/page.tsx', 'idx', 'idx', is_qb=True, indent=36)
