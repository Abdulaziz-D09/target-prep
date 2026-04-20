const fs = require('fs');
const path = require('path');

// --- 1. Fix src/app/page.tsx (Nearest dates, Modal replacement, Closed Banners)
const pageFile = path.resolve(__dirname, 'src/app/page.tsx');
let pageCode = fs.readFileSync(pageFile, 'utf8');

// Change satDates.slice(0, 3) to dynamically filter nearest future dates
pageCode = pageCode.replace(
    `{satDates.slice(0, 3).map((date, i) => {`,
    `{satDates.filter(d => new Date(d.target).getTime() > new Date().getTime()).slice(0, 3).map((date, i) => {`
);

// Replace sliding drawer UI with centered Modal UI
pageCode = pageCode.replace(
    `      {/* Slide-out Drawer Overlay */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Blurry Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedDate(null)}
          ></div>
          
          {/* Drawer Panel */}
          <div className="relative w-full md:w-[480px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">`,
    `      {/* Centered Modal Overlay */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurry Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedDate(null)}
          ></div>
          
          {/* Centered Modal Panel */}
          <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">`
);

// We need to also clean up the absolute CTA at the bottom to flow inline if it's a modal, but keeping it absolute might be okay if pb is set. Let's change the CTA wrapper:
pageCode = pageCode.replace(
    `            {/* Drawer Footer CTA */}
            <div className="absolute flex justify-center bottom-0 w-full p-4 bg-white border-t border-slate-200 pb-10">`,
    `            {/* Modal Footer CTA */}
            <div className="flex justify-center w-full p-4 bg-white border-t border-slate-200">`
);
pageCode = pageCode.replace(
    `            {/* Drawer Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">`,
    `            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">`
);

// Fix the closed banners based on the uploaded image attached
pageCode = pageCode.replace(
    `<div className="bg-slate-100 rounded-xl p-4 text-center border border-slate-200">
                    <span className="text-sm font-bold text-slate-600">Standard Registration Closed</span>
                  </div>`,
    `<div className="bg-[#F8FAFC] rounded-[10px] p-[16px] text-center border border-[#E2E8F0]">
                    <span className="text-[15px] font-bold text-[#475569]">Standard Registration Closed</span>
                  </div>`
);
pageCode = pageCode.replace(
    `<div className="bg-green-100 rounded-xl p-4 text-center border border-green-200">
                    <span className="text-sm font-bold text-green-700">Test Completed</span>
                  </div>`,
    `<div className="bg-[#DCFCE7] rounded-[10px] p-[16px] text-center border border-[#BBF7D0]">
                    <span className="text-[15px] font-bold text-[#15803D]">Test Completed</span>
                  </div>`
);

fs.writeFileSync(pageFile, pageCode);


// --- 2. Fix src/app/practice/page.tsx (Grid Size bigger)
const practiceFile = path.resolve(__dirname, 'src/app/practice/page.tsx');
let practiceCode = fs.readFileSync(practiceFile, 'utf8');

// The user wants the practice tests page bigger and tests bigger. Let's drop grid-cols-5 back to grid-cols-3 or 4 so cards are wider and taller.
practiceCode = practiceCode.replace(
    `<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">`,
    `<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">`
);
// Make the card text slightly larger
practiceCode = practiceCode.replace(
    `<h3 className="font-bold text-[17px] text-slate-900 mb-2 leading-tight">{test.title}</h3>`,
    `<h3 className="font-bold text-[19px] text-slate-900 mb-2 leading-tight">{test.title}</h3>`
);
practiceCode = practiceCode.replace(
    `<div className="p-4 flex flex-col flex-1">`,
    `<div className="p-6 flex flex-col flex-1">`
);

fs.writeFileSync(practiceFile, practiceCode);


// --- 3. Fix src/app/practice/test/[id]/page.tsx (Triangles width and gap)
const testFile = path.resolve(__dirname, 'src/app/practice/test/[id]/page.tsx');
let testCode = fs.readFileSync(testFile, 'utf8');

testCode = testCode.replace(
    `<div className="w-8 h-8 bg-[#111827] rounded flex items-center justify-center gap-1">`,
    `<div className="w-8 h-8 bg-[#111827] rounded-[4px] flex items-center justify-center gap-[4px]">`
);

fs.writeFileSync(testFile, testCode);

console.log("Updated Round 5 layout correctly!");
