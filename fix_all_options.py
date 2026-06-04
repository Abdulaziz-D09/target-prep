import re
import os

files = [
    'src/app/practice/test/[id]/page.tsx',
    'src/app/practice/test/baseline/page.tsx',
    'src/app/question-bank/page.tsx',
    'src/app/classroom/assignment/[id]/page.tsx',
    'src/app/study-plan/page.tsx'
]

def update_options(file):
    if not os.path.exists(file): return
    with open(file, 'r') as f:
        content = f.read()

    # Pattern for the main 4 practice/baseline/assignment files where we have `<label className="relative flex-1 p-3 px-4 border min-h-[58px] ...">`
    # We want to replace the `className` of the label, and replace the `div` inside it.
    
    # 1. Replace the label className
    content = re.sub(
        r'className=\{`relative flex-1 p-3 px-4 border min-h-\[58px\] rounded-\[10px\] flex items-center cursor-pointer transition-all duration-200 overflow-hidden \$\{isSelected \? \'border-indigo-600 shadow-\[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba\(79,70,229,0\.15\)\] bg-indigo-50\/30\' \: \'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm\'\}(.*?)\`\}',
        r'className={`relative flex-1 border min-h-[58px] rounded-[12px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? \'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30\' : \'border-[#E5E7EB] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm\'}\1`}',
        content
    )
    
    # 2. Replace the inner circle with the block
    content = re.sub(
        r'\{\/\*\s*Letter Circle inside the box\s*\*\/\}\n\s*<div className=\{`w-\[28px\] h-\[28px\] rounded-full border-\[1\.5px\] flex-shrink-0 flex items-center justify-center font-bold text-\[13px\] mr-4 transition-colors \$\{isSelected \? \'border-indigo-600 text-white bg-indigo-600 shadow-sm\' \: \'border-slate-400 text-slate-700\'\}`\}>\n\s*\{letter\}\n\s*<\/div>',
        r'''{/* Letter Box (Flush to edges) */}
                                                    <div className={`w-[50px] flex-shrink-0 flex items-center justify-center font-bold text-[15px] border-r transition-colors ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] group-hover:bg-[#F3F4F6]'}`}>
                                                        {letter}
                                                    </div>''',
        content
    )
    
    # 3. Replace the answer text span to have padding inside its container (since we removed it from the label)
    content = re.sub(
        r'\{\/\*\s*Answer Text\s*\*\/\}\n\s*<span className=\{`text-\[17px\] font-sans flex-1 \$\{isEliminated \? \'text-slate-400\' \: \'text-\[#111827\]\'\}`\}>\n\s*\{([^\}]+)\}\n\s*<\/span>',
        r'''{/* Answer Text */}
                                                    <div className="flex-1 p-4 flex items-center">
                                                        <span className={`text-[17px] font-sans ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                            {\1}
                                                        </span>
                                                    </div>''',
        content
    )

    # 4. Fix Question Bank option layout (it's slightly different)
    # Question bank uses `let boxClass = ...`
    qb_box_pattern = r'let boxClass = `relative flex-1 rounded-\[10px\] border px-\[14px\] py-\[11px\] min-h-\[50px\] flex items-center transition-all duration-200 overflow-hidden \$\{\(isChecked \|\| isTriedWrong\) \? \'cursor-default pointer-events-none\' \: \'cursor-pointer\'\} select-text`;\n\s*let circleClass = \'mr-3\.5 flex h-\[26px\] w-\[26px\] flex-shrink-0 items-center justify-center rounded-full border-\[1\.5px\] text-\[12px\] font-bold transition-colors\';'
    
    qb_box_repl = r'''let boxClass = `relative flex-1 rounded-[12px] border min-h-[50px] flex items-stretch transition-all duration-200 overflow-hidden ${(isChecked || isTriedWrong) ? 'cursor-default pointer-events-none' : 'cursor-pointer'} select-text group`;
                                        let circleClass = 'flex w-[50px] flex-shrink-0 items-center justify-center border-r text-[15px] font-bold transition-colors';'''
                                        
    content = re.sub(qb_box_pattern, qb_box_repl, content)

    # Change the colors for QB
    content = content.replace(
        "circleClass += ' border-emerald-500 bg-emerald-500 text-white';",
        "circleClass += ' border-emerald-500 bg-emerald-500 text-white';"
    ).replace(
        "circleClass += ' border-red-500 bg-red-500 text-white';",
        "circleClass += ' border-red-500 bg-red-500 text-white';"
    ).replace(
        "circleClass += ' border-indigo-600 bg-indigo-600 text-white shadow-sm';",
        "circleClass += ' border-indigo-600 bg-indigo-600 text-white shadow-sm';"
    )
    # the unselected state needs to be updated. Wait, for QB I can just update the JSX!
    qb_jsx_pattern = r'<div className=\{circleClass\}>\n\s*\{letter\}\n\s*<\/div>\n\s*<div className={`text-\[16px\] flex-1 \$\{textTone\}`}>\n\s*\{optionText\}\n\s*<\/div>'
    
    qb_jsx_repl = r'''<div className={`${circleClass} ${!(isCorrectSelection || isTriedWrong || isSelected) ? 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] group-hover:bg-[#F3F4F6]' : ''}`}>
                                                {letter}
                                            </div>
                                            <div className="flex-1 p-4 flex items-center">
                                                <div className={`text-[16px] ${textTone}`}>
                                                    {optionText}
                                                </div>
                                            </div>'''
                                            
    content = re.sub(qb_jsx_pattern, qb_jsx_repl, content)

    # 5. Fix Practice Test / Baseline review modal (where it's not clickable, just showing options)
    # The review modal has `className={`p-4 border-2 rounded-xl flex items-center gap-4 ${bgClass}`}`
    review_pattern = r'className=\{`p-4 border-2 rounded-xl flex items-center gap-4 \$\{bgClass\}`\}\s*>\n\s*<div className=\{`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border \$\{isThisCorrect \? \'bg-emerald-500 border-emerald-600 text-white\' \: isThisSelected \? \'bg-red-500 border-red-600 text-white\' \: \'bg-slate-100 border-slate-300\'\}`\}>\n\s*\{String.fromCharCode\(65 \+ oIdx\)\}\n\s*<\/div>\n\s*<span className="font-medium">\{cleanOCR\(opt\)\}<\/span>'
    
    review_repl = r'''className={`border-2 rounded-[12px] flex items-stretch overflow-hidden ${bgClass}`}
                                                                    >
                                                                        <div className={`w-[50px] flex-shrink-0 flex items-center justify-center text-[15px] font-bold border-r ${isThisCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : isThisSelected ? 'bg-red-500 border-red-600 text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563]'}`}>
                                                                            {String.fromCharCode(65 + oIdx)}
                                                                        </div>
                                                                        <div className="flex-1 p-4 flex items-center">
                                                                            <span className="font-medium">{cleanOCR(opt)}</span>
                                                                        </div>'''
                                                                        
    content = re.sub(review_pattern, review_repl, content)

    with open(file, 'w') as f:
        f.write(content)
    print(f"Updated {file}")

for file in files:
    update_options(file)
