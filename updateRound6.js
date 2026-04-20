const fs = require('fs');
const path = require('path');

// 1. Update src/app/page.tsx
const pageFile = path.resolve(__dirname, 'src/app/page.tsx');
let pageCode = fs.readFileSync(pageFile, 'utf8');

// Remove animate-in zoom-in-95 duration-200 to fix any white box flash / instant popout
pageCode = pageCode.replace(
    `animate-in zoom-in-95 duration-200`,
    ``
);

// Remove the Countdowns section
pageCode = pageCode.replace(
    /\{\/\* Countdowns \*\/\}[\s\S]*?(?=\{\/\* Modal Footer CTA \*\/)/m,
    ``
);

// Update FEES section
pageCode = pageCode.replace(
    `<div className="pt-3 border-t border-slate-200 mt-2">
                    <p className="text-xs text-slate-500 italic">Regional/International extra fees apply depending on test center location ($43 - $53).</p>
                  </div>`,
    `<div className="flex justify-between items-center">
                    <span className="text-slate-700 text-[15px]">International Fee</span>
                    <span className="font-bold text-slate-900">+$43</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 mt-2 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total (International)</span>
                    <span className="font-bold text-[#2563EB]">$111</span>
                  </div>`
);

fs.writeFileSync(pageFile, pageCode);

// 2. Update src/app/practice/page.tsx
const practiceFile = path.resolve(__dirname, 'src/app/practice/page.tsx');
let practiceCode = fs.readFileSync(practiceFile, 'utf8');

// "make the practice tests have 5 tests per row and have this exact size do not change it make it close to the walls but not touching"
// Currently: <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
practiceCode = practiceCode.replace(
    `<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">`,
    `<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">`
);

// "make it close to the walls but not touching"
// This indicates the parent wrapper in view-section needs to be max width, but actually we can just apply a large max-w or remove container constraints.
// Let's replace the outer container if we can: <div className="view-section">
practiceCode = practiceCode.replace(
    `<div className="view-section">`,
    `<div className="w-full max-w-[1600px] mx-auto px-6 py-8">`
);

fs.writeFileSync(practiceFile, practiceCode);

// 3. Update src/data/questions.ts
const dataFile = path.resolve(__dirname, 'src/data/questions.ts');
let dataCode = fs.readFileSync(dataFile, 'utf8');

// "discription for the practice tests change it just delete full-length part"
dataCode = dataCode.replace(/Full-length/g, "Full");

// Also there was "Full English SAT test" in previous screenshot. We can leave it, we just replaced "Full-length" -> "Full".

fs.writeFileSync(dataFile, dataCode);

// 4. Update src/app/practice/test/[id]/page.tsx
const testFile = path.resolve(__dirname, 'src/app/practice/test/[id]/page.tsx');
let testCode = fs.readFileSync(testFile, 'utf8');

// "make the middle line mover have two triangles in the middle of it having the same placement but there is a gap between them and they are looking opposite"
testCode = testCode.replace(
    `<div className="w-8 h-8 bg-[#111827] rounded-[4px] flex items-center justify-center gap-[4px]">
                                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[5px] border-r-white"></div>
                                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-white"></div>
                                </div>`,
    `<div className="w-8 h-8 bg-[#111827] rounded-[4px] flex items-center justify-center gap-2">
                                    <div className="w-0 h-0 border-t-[4.5px] border-t-transparent border-b-[4.5px] border-b-transparent border-r-[6px] border-r-white"></div>
                                    <div className="w-0 h-0 border-t-[4.5px] border-t-transparent border-b-[4.5px] border-b-transparent border-l-[6px] border-l-white"></div>
                                </div>`
);

fs.writeFileSync(testFile, testCode);

console.log("Applied final tweaks: removed modal animations, countdowns. Expanded grid layout width natively and added International Fee.");
