def update_qb_options():
    file = 'src/app/question-bank/page.tsx'
    with open(file, 'r') as f:
        content = f.read()

    target1 = """                                        let boxClass = `relative flex-1 rounded-[10px] border px-[14px] py-[11px] min-h-[50px] flex items-center transition-all duration-200 overflow-hidden ${(isChecked || isTriedWrong) ? 'cursor-default pointer-events-none' : 'cursor-pointer'} select-text`;
                                        let circleClass = 'mr-3.5 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] text-[12px] font-bold transition-colors';
                                        const textTone = isEliminated ? 'text-slate-400' : 'text-[#111827]';

                                        if (isCorrectSelection) {
                                            boxClass += ' border-emerald-500 bg-emerald-50/60 shadow-[inset_0_0_0_1px_#10b981]';
                                            circleClass += ' border-emerald-500 bg-emerald-500 text-white';
                                        } else if (isTriedWrong) {
                                            boxClass += ' border-red-500 bg-red-50/60 shadow-[inset_0_0_0_1px_#ef4444]';
                                            circleClass += ' border-red-500 bg-red-500 text-white';
                                        } else if (isSelected) {
                                            boxClass += ' border-indigo-600 bg-indigo-50/30 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)]';
                                            circleClass += ' border-indigo-600 bg-indigo-600 text-white shadow-sm';
                                        } else {
                                            boxClass += ' border-[#E5E7EB] bg-white';
                                            circleClass += ' border-slate-400 text-slate-700';
                                            if (!isChecked && !isTriedWrong) {
                                                boxClass += ' hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm';
                                            }
                                        }"""
                                        
    repl1 = """                                        let boxClass = `relative flex-1 rounded-[12px] border min-h-[50px] flex items-stretch transition-all duration-200 overflow-hidden ${(isChecked || isTriedWrong) ? 'cursor-default pointer-events-none' : 'cursor-pointer'} select-text group`;
                                        let circleClass = 'flex w-[50px] flex-shrink-0 items-center justify-center border-r text-[15px] font-bold transition-colors';
                                        const textTone = isEliminated ? 'text-slate-400' : 'text-[#111827]';

                                        if (isCorrectSelection) {
                                            boxClass += ' border-emerald-500 bg-emerald-50/60 shadow-[inset_0_0_0_1px_#10b981]';
                                            circleClass += ' border-emerald-500 bg-emerald-500 text-white';
                                        } else if (isTriedWrong) {
                                            boxClass += ' border-red-500 bg-red-50/60 shadow-[inset_0_0_0_1px_#ef4444]';
                                            circleClass += ' border-red-500 bg-red-500 text-white';
                                        } else if (isSelected) {
                                            boxClass += ' border-indigo-600 bg-indigo-50/30 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)]';
                                            circleClass += ' border-indigo-600 bg-indigo-600 text-white shadow-sm';
                                        } else {
                                            boxClass += ' border-[#E5E7EB] bg-white';
                                            circleClass += ' bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] group-hover:bg-[#F3F4F6]';
                                            if (!isChecked && !isTriedWrong) {
                                                boxClass += ' hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm';
                                            }
                                        }"""
                                        
    target2 = """                                            <div className={circleClass}>
                                                {letter}
                                            </div>
                                            <div className={`text-[16px] flex-1 ${textTone}`}>
                                                {optionText}
                                            </div>"""
                                            
    repl2 = """                                            <div className={circleClass}>
                                                {letter}
                                            </div>
                                            <div className="flex-1 p-4 flex items-center">
                                                <div className={`text-[16px] ${textTone}`}>
                                                    {optionText}
                                                </div>
                                            </div>"""

    if target1 in content and target2 in content:
        content = content.replace(target1, repl1)
        content = content.replace(target2, repl2)
        with open(file, 'w') as f:
            f.write(content)
        print("Success QB options")
    else:
        print("Failed to find QB options targets")

update_qb_options()
