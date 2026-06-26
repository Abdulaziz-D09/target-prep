const fs = require('fs');
const file = 'src/app/classroom/assignment/[id]/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// The assignment page had this connected header
const optionContainerStr = " className={`relative flex-1 border h-auto min-h-[56px] rounded-[10px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-[#111827] shadow-[inset_0_0_0_1px_#111827] z-10 bg-[#F3F4F6]' : 'border-[#E5E7EB] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm'} ${overrideBox}`}";

content = content.replace(
    /className=\{\`relative flex-1 border min-h-\[44px\] rounded-\[12px\] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden \$\{isSelected \? 'border-\[#111827\] shadow-\[inset_0_0_0_1px_#111827\] bg-\[#F3F4F6\]' : 'border-\[#E5E7EB\] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm'\} \$\{overrideBox\}\`\}/g,
    optionContainerStr
);

const letterCircleStr = "className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-bold text-[14px] border-[1.5px] transition-all ${isSelected ? 'border-[#111827] bg-[#111827] text-white shadow-md' : 'border-[#D1D5DB] text-[#4B5563] bg-white group-hover:border-[#9CA3AF] group-hover:text-[#111827]'}`}";

content = content.replace(
    /className=\{\`w-\[50px\] flex-shrink-0 flex items-center justify-center font-bold text-\[15px\] border-r transition-colors \$\{isSelected \? 'border-\[#111827\] text-white bg-\[#111827\]' : 'bg-\[#F9FAFB\] text-\[#4B5563\] border-\[#E5E7EB\] group-hover:bg-\[#F3F4F6\]'\}\`\}/g,
    `className="w-[52px] flex-shrink-0 flex items-center justify-center bg-transparent">\n                                                <div ${letterCircleStr}>\n                                                    {letter}\n                                                </div>`
);

content = content.replace(
    /\{letter\}\s*<\/div>\s*\{\/\* Answer Text \*\/\}/g,
    `</div>\n\n                                            {/* Answer Text */}`
);

fs.writeFileSync(file, content);
