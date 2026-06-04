import traceback

def get_header_target(number_var, flag_key, is_qb=False):
    block = """                                {/* Header: Connected Question Number & Mark for Review & ABC */}
                                <div className="flex mb-6 mt-4 shadow-sm w-full">
                                    {/* Number */}
                                    <div className="bg-[#111827] text-white font-bold text-[15px] w-[50px] flex flex-shrink-0 items-center justify-center">
                                        {""" + number_var + """ + 1}
                                    </div>

                                    {/* Mark for Review (Middle) */}
                                    <button
                                        onClick={() => """ + ("handleToggleReview(" + flag_key + ")" if is_qb else ("setFlaggedQuestions(s => ({ ...s, [" + flag_key + "]: !s[" + flag_key + "] }))" if number_var == "currentIdx" else "toggleFlag(" + flag_key + ")")) + """}
                                        className="flex flex-1 items-center gap-2 px-4 py-2.5 bg-white border-b border-[#E5E7EB] """ + ("text-[#4B5563] text-[14px] justify-start transition-colors group/mfr hover:bg-slate-50" if is_qb else "group/mfr text-[#4B5563] text-[15px] transition-colors justify-start") + """"
                                    >
                                        <Bookmark className={`w-[14px] h-[14px] transition-colors ${flaggedQuestions[""" + flag_key + """] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                        <span className={flaggedQuestions[""" + flag_key + """] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                                    </button>

                                    {/* ABC Elimination (Right) */}
                                    <div className="bg-[#F3F4F6] flex items-center pr-2">"""
    
    if is_qb:
        block += """
                                        {isMultipleChoiceQuestion(q) && (
                                        <button
                                            onClick={() => setIsEliminationMode(!isEliminationMode)}
                                            className={`flex items-center justify-center px-3 py-1 ml-2 font-bold text-[14px] transition-colors rounded ${isEliminationMode ? 'bg-[#111827] text-white' : 'bg-transparent text-slate-700 hover:bg-slate-200'}`}
                                        >
                                            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                        </button>
                                        )}
                                    </div>
                                </div>"""
    else:
        block += """
                                        <button
                                            onClick={() => setIsEliminationMode(!isEliminationMode)}
                                            className={`flex items-center justify-center px-3 py-1 ml-2 font-bold text-[14px] transition-colors rounded ${isEliminationMode ? 'bg-[#111827] text-white' : 'bg-transparent text-slate-700 hover:bg-slate-200'}`}
                                        >
                                            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                        </button>
                                    </div>
                                </div>"""
    return block


def get_header_replacement(number_var, flag_key, is_qb=False):
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


def get_options_main_target():
    return """className={`relative flex-1 p-3 px-4 border min-h-[58px] rounded-[10px] flex items-center cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm'}`}
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

                                                    {/* Letter Circle inside the box */}
                                                    <div className={`w-[28px] h-[28px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center font-bold text-[13px] mr-4 transition-colors ${isSelected ? 'border-indigo-600 text-white bg-indigo-600 shadow-sm' : 'border-slate-400 text-slate-700'}`}>
                                                        {letter}
                                                    </div>

                                                    {/* Answer Text */}
                                                    <span className={`text-[17px] font-sans flex-1 ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                        {cleanOCR(opt)}
                                                    </span>"""

def get_options_main_repl():
    return """className={`relative flex-1 border min-h-[58px] rounded-[12px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-[#E5E7EB] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm'}`}
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
                                                    </div>"""

def get_options_review_target():
    return """className={`p-4 border-2 rounded-xl flex items-center gap-4 ${bgClass}`}
                                                                    >
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${isThisCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : isThisSelected ? 'bg-red-500 border-red-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                                                                            {String.fromCharCode(65 + oIdx)}
                                                                        </div>
                                                                        <span className="font-medium">{cleanOCR(opt)}</span>"""

def get_options_review_repl():
    return """className={`border-2 rounded-[12px] flex items-stretch overflow-hidden ${bgClass}`}
                                                                    >
                                                                        <div className={`w-[50px] flex-shrink-0 flex items-center justify-center text-[15px] font-bold border-r ${isThisCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : isThisSelected ? 'bg-red-500 border-red-600 text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563]'}`}>
                                                                            {String.fromCharCode(65 + oIdx)}
                                                                        </div>
                                                                        <div className="flex-1 p-4 flex items-center">
                                                                            <span className="font-medium">{cleanOCR(opt)}</span>
                                                                        </div>"""


def get_options_assign_target():
    return """className={`relative flex-1 p-3 px-4 border min-h-[58px] rounded-[10px] flex items-center cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm'} ${overrideBox}`}
                                        >
                                            <input
                                                type="radio"
                                                name="answer"
                                                id={`opt-${letter}`}
                                                className="sr-only"
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (!isEliminated) handleSelectAnswer(letter);
                                                }}
                                            />

                                            <div className={`w-[28px] h-[28px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center font-bold text-[13px] mr-4 transition-colors ${isSelected ? 'border-indigo-600 text-white bg-indigo-600 shadow-sm' : 'border-slate-400 text-slate-700'}`}>
                                                {letter}
                                            </div>

                                            <span className={`text-[17px] font-sans flex-1 ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                {optText}
                                            </span>"""

def get_options_assign_repl():
    return """className={`relative flex-1 border min-h-[58px] rounded-[12px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-[#E5E7EB] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm'} ${overrideBox}`}
                                        >
                                            <input
                                                type="radio"
                                                name="answer"
                                                id={`opt-${letter}`}
                                                className="sr-only"
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (!isEliminated) handleSelectAnswer(letter);
                                                }}
                                            />

                                            {/* Letter Box (Flush to edges) */}
                                            <div className={`w-[50px] flex-shrink-0 flex items-center justify-center font-bold text-[15px] border-r transition-colors ${isSelected ? 'border-indigo-600 text-white border-indigo-600' : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] group-hover:bg-[#F3F4F6]'}`}>
                                                {letter}
                                            </div>

                                            {/* Answer Text */}
                                            <div className="flex-1 p-4 flex items-center">
                                                <span className={`text-[17px] font-sans ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                    {optText}
                                                </span>
                                            </div>"""


def update_file(file_path, number_var, flag_key, is_qb=False, indent=32):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            
        # 1. Update Header
        target_h = get_header_target(number_var, flag_key, is_qb)
        repl_h = get_header_replacement(number_var, flag_key, is_qb)
        
        def adjust(l):
            if l.startswith(" " * 32):
                return (" " * indent) + l[32:]
            return l
            
        target_h = '\n'.join(adjust(l) for l in target_h.split('\n'))
        repl_h = '\n'.join(adjust(l) for l in repl_h.split('\n'))
        
        if is_qb:
            target_h = target_h.replace('Header: Connected Question Number & Mark for Review & ABC', 'Header bar')
            repl_h = repl_h.replace('Header: Connected Question Number & Mark for Review & ABC', 'Header bar')
            target_h = target_h.replace('<div className="flex mb-6 mt-4 shadow-sm w-full">', '<div className="flex mb-6 mt-2 shadow-sm w-full">')
            repl_h = repl_h.replace('mb-6 mt-4', 'mb-6 mt-2')

        if target_h in content:
            content = content.replace(target_h, repl_h)
            
        # 2. Update Options
        if file_path == 'src/app/classroom/assignment/[id]/page.tsx':
            target_o = get_options_assign_target()
            repl_o = get_options_assign_repl()
            if target_o in content:
                content = content.replace(target_o, repl_o)
        elif is_qb:
            # We already have a specific regex for QB that works well, but we should do string replacement
            pass # We'll do QB separately below
        else:
            # practice test & baseline
            target_o = get_options_main_target()
            repl_o = get_options_main_repl()
            target_o = '\n'.join(adjust(l) for l in target_o.split('\n'))
            repl_o = '\n'.join(adjust(l) for l in repl_o.split('\n'))
            
            if target_o in content:
                content = content.replace(target_o, repl_o)
                
            target_rev = get_options_review_target()
            repl_rev = get_options_review_repl()
            target_rev = '\n'.join(adjust(l) for l in target_rev.split('\n'))
            repl_rev = '\n'.join(adjust(l) for l in repl_rev.split('\n'))
            if target_rev in content:
                content = content.replace(target_rev, repl_rev)
                
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Success {file_path}")
    except Exception as e:
        traceback.print_exc()

update_file('src/app/practice/test/[id]/page.tsx', 'currentQuestionIndex', 'questionKey')
update_file('src/app/classroom/assignment/[id]/page.tsx', 'currentIdx', 'currentIdx', indent=24)
update_file('src/app/practice/test/baseline/page.tsx', 'currentQuestionIndex', 'questionKey')
update_file('src/app/question-bank/page.tsx', 'idx', 'idx', is_qb=True, indent=36)
