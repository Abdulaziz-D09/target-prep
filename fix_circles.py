import re
import os
import traceback

files = [
    'src/app/practice/test/[id]/page.tsx',
    'src/app/practice/test/baseline/page.tsx',
    'src/app/classroom/assignment/[id]/page.tsx'
]

def get_options_main_target():
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
                                                            {cleanOCR(opt || '')}
                                                        </span>
                                                    </div>"""

def get_options_main_repl():
    return """className={`relative flex-1 p-4 px-5 border min-h-[58px] rounded-[12px] flex items-center cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm'}`}
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
                                                    <div className={`w-[28px] h-[28px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center font-bold text-[13px] mr-5 transition-colors ${isSelected ? 'border-indigo-600 text-white bg-indigo-600 shadow-sm' : 'border-slate-400 text-slate-700'}`}>
                                                        {letter}
                                                    </div>

                                                    {/* Answer Text */}
                                                    <span className={`text-[17px] font-sans flex-1 ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                        {cleanOCR(opt || '')}
                                                    </span>"""

def get_options_review_target():
    return """className={`border-2 rounded-[12px] flex items-stretch overflow-hidden ${bgClass}`}
                                                                    >
                                                                        <div className={`w-[50px] flex-shrink-0 flex items-center justify-center text-[15px] font-bold border-r ${isThisCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : isThisSelected ? 'bg-red-500 border-red-600 text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563]'}`}>
                                                                            {String.fromCharCode(65 + oIdx)}
                                                                        </div>
                                                                        <div className="flex-1 p-4 flex items-center">
                                                                            <span className="font-medium">{cleanOCR(opt || '')}</span>
                                                                        </div>"""

def get_options_review_repl():
    return """className={`p-4 border-2 rounded-[12px] flex items-center gap-4 ${bgClass}`}
                                                                    >
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${isThisCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : isThisSelected ? 'bg-red-500 border-red-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                                                                            {String.fromCharCode(65 + oIdx)}
                                                                        </div>
                                                                        <span className="font-medium">{cleanOCR(opt || '')}</span>"""

def get_options_assign_target():
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

def get_options_assign_repl():
    return """className={`relative flex-1 p-4 px-5 border min-h-[58px] rounded-[12px] flex items-center cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm'} ${overrideBox}`}
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

                                            {/* Letter Circle inside the box */}
                                            <div className={`w-[28px] h-[28px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center font-bold text-[13px] mr-5 transition-colors ${isSelected ? 'border-indigo-600 text-white bg-indigo-600 shadow-sm' : 'border-slate-400 text-slate-700'}`}>
                                                {letter}
                                            </div>

                                            {/* Answer Text */}
                                            <span className={`text-[17px] font-sans flex-1 ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                {optText}
                                            </span>"""

def update_file(file_path, indent=32):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            
        def adjust(l):
            if l.startswith(" " * 32):
                return (" " * indent) + l[32:]
            return l
            
        if file_path == 'src/app/classroom/assignment/[id]/page.tsx':
            target_o = get_options_assign_target()
            repl_o = get_options_assign_repl()
            target_o = '\n'.join(adjust(l) for l in target_o.split('\n'))
            repl_o = '\n'.join(adjust(l) for l in repl_o.split('\n'))
            if target_o in content:
                content = content.replace(target_o, repl_o)
        else:
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

update_file('src/app/practice/test/[id]/page.tsx')
update_file('src/app/practice/test/baseline/page.tsx')
update_file('src/app/classroom/assignment/[id]/page.tsx', indent=24)
