const fs = require('fs');
const file = 'src/app/classroom/assignment/[id]/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// Fix answer choices style
content = content.replace(
    /className=\{\`relative flex-1 border min-h-\[44px\] rounded-\[12px\] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden \$\{isSelected \? 'border-indigo-600 shadow-\[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba\(79,70,229,0\.15\)\] bg-indigo-50\/30' : 'border-\[#E5E7EB\] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm'\} \$\{overrideBox\}\`\}/g,
    "className={`relative flex-1 border min-h-[44px] rounded-[12px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-[#111827] shadow-[inset_0_0_0_1px_#111827] bg-[#F3F4F6]' : 'border-[#E5E7EB] hover:border-slate-400 bg-white hover:bg-slate-50 shadow-sm'} ${overrideBox}`}"
);

// Fix letter box style
content = content.replace(
    /className=\{\`w-\[50px\] flex-shrink-0 flex items-center justify-center font-bold text-\[15px\] border-r transition-colors \$\{isSelected \? 'border-indigo-600 text-white border-indigo-600' : 'bg-\[#F9FAFB\] text-\[#4B5563\] border-\[#E5E7EB\] group-hover:bg-\[#F3F4F6\]'\}\`\}/g,
    "className={`w-[50px] flex-shrink-0 flex items-center justify-center font-bold text-[15px] border-r transition-colors ${isSelected ? 'border-[#111827] text-white bg-[#111827]' : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] group-hover:bg-[#F3F4F6]'}`}"
);

// Delete 'Save & Exit' button from Assignment page
const saveAndExitTarget = `                    <button
                        onClick={() => setIsExitModalOpen(true)}
                        className="bg-white border-2 border-slate-200 hover:border-[#111827] hover:text-[#111827] text-slate-700 px-5 py-2 rounded-full font-bold text-[13px] transition-all shadow-sm ml-2"
                    >
                        Save & Exit
                    </button>`;
content = content.replace(saveAndExitTarget, "");

fs.writeFileSync(file, content);
