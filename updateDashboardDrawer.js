const fs = require('fs');
const path = require('path');

const pageFile = path.resolve(__dirname, 'src/app/page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// 1. Add X import and satDates import
code = code.replace(
    `import { Clock, Flame, TrendingUp, CheckCircle, Calendar, ExternalLink, ArrowRight, ChevronRight } from 'lucide-react';\nimport Link from 'next/link';`,
    `import { Clock, Flame, TrendingUp, CheckCircle, Calendar, ExternalLink, ArrowRight, ChevronRight, X, AlertCircle, FileCheck2, Info } from 'lucide-react';\nimport Link from 'next/link';\nimport { satDates } from '@/data/questions';`
);

// 2. Add Selected Date state inside component
code = code.replace(
    `const [expired, setExpired] = useState(false);`,
    `const [expired, setExpired] = useState(false);\n  const [selectedDate, setSelectedDate] = useState<any>(null);\n  const [drawerTimeLeft, setDrawerTimeLeft] = useState<{days: number, hours: number, mins: number, secs: number} | null>(null);\n  const [drawerRegTimeLeft, setDrawerRegTimeLeft] = useState<{days: number, hours: number, mins: number, secs: number} | null>(null);`
);

// 3. Add effect for Drawer countdown
code = code.replace(
    `return () => clearInterval(interval);\n  }, []);`,
    `return () => clearInterval(interval);\n  }, []);\n\n  useEffect(() => {\n    if (!selectedDate) return;\n    \n    const targetTestDate = new Date(selectedDate.target).getTime();\n    const regDeadlineArr = selectedDate.registrationDeadline.split(', ');\n    const regYear = regDeadlineArr.length === 2 ? regDeadlineArr[1] : new Date().getFullYear();\n    const regStr = \`\${selectedDate.registrationDeadline}, \${regYear} 23:59:59\`;\n    const targetRegDate = new Date(regStr).getTime();\n\n    const updateDrawerCountdown = () => {\n      const now = new Date().getTime();\n      const testDist = targetTestDate - now;\n      const regDist = targetRegDate - now;\n\n      if (testDist > 0) {\n        setDrawerTimeLeft({\n          days: Math.floor(testDist / (1000 * 60 * 60 * 24)),\n          hours: Math.floor((testDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),\n          mins: Math.floor((testDist % (1000 * 60 * 60)) / (1000 * 60)),\n          secs: Math.floor((testDist % (1000 * 60)) / 1000),\n        });\n      } else setDrawerTimeLeft(null);\n\n      if (regDist > 0) {\n        setDrawerRegTimeLeft({\n          days: Math.floor(regDist / (1000 * 60 * 60 * 24)),\n          hours: Math.floor((regDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),\n          mins: Math.floor((regDist % (1000 * 60 * 60)) / (1000 * 60)),\n          secs: Math.floor((regDist % (1000 * 60)) / 1000),\n        });\n      } else setDrawerRegTimeLeft(null);\n    };\n    \n    updateDrawerCountdown();\n    const intId = setInterval(updateDrawerCountdown, 1000);\n    return () => clearInterval(intId);\n  }, [selectedDate]);`
);


// 4. Map the Upcoming Dates to satDates slice and add onClick
code = code.replace(
    `{[
              { m: 'MAR', d: 'March 14, 2026', dead: 'Registration Deadline: Feb 27, 2026', bg: 'bg-blue-100', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600' },
              { m: 'MAY', d: 'May 2, 2026', dead: 'Registration Deadline: Apr 17, 2026', bg: 'bg-slate-100', text: 'text-slate-600', hoverBg: 'group-hover:bg-blue-600' },
              { m: 'JUN', d: 'June 7, 2026', dead: 'Registration Deadline: May 9, 2026', bg: 'bg-slate-100', text: 'text-slate-600', hoverBg: 'group-hover:bg-blue-600' }
            ].map((date, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={\`w-10 h-10 \${date.bg} rounded-lg flex items-center justify-center \${date.text} font-bold text-sm \${date.hoverBg} group-hover:text-white transition-colors\`}>
                    {date.m}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{date.d}</p>
                    <p className="text-xs text-slate-500">{date.dead}</p>
                  </div>`,
    `{satDates.slice(0, 3).map((date, i) => {
                const isFirst = i === 0;
                const bg = isFirst ? 'bg-blue-100' : 'bg-slate-100';
                const text = isFirst ? 'text-blue-600' : 'text-slate-600';
                return (
              <div onClick={() => setSelectedDate(date)} key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={\`w-10 h-10 \${bg} rounded-lg flex items-center justify-center \${text} font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors\`}>
                    {date.month}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{date.date}</p>
                    <p className="text-xs text-slate-500">Registration Deadline: {date.registrationDeadline}</p>
                  </div>`
);

// Close map loop
code = code.replace(
    `</div>\n                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />\n              </div>\n            ))}`,
    `</div>\n                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />\n              </div>\n            )})}`
);

// 5. Append the Drawer logic at the end of the main div
const drawerComponent = `
      {/* Slide-out Drawer Overlay */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Blurry Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedDate(null)}
          ></div>
          
          {/* Drawer Panel */}
          <div className="relative w-full md:w-[480px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/80 backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedDate.date}</h2>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Registration Open
                </div>
              </div>
              <button 
                onClick={() => setSelectedDate(null)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
              
              {/* Deadlines Section */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Dates & Deadlines
                </h3>
                <div className="bg-white border text-[14px] border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-700">Registration Deadline</span>
                    <span className="font-bold text-slate-900">{selectedDate.registrationDeadline}</span>
                  </div>
                  <div className="p-4 border-b border-slate-100 flex flex-col group hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-700">Late Registration</span>
                      <span className="font-bold text-slate-900">{selectedDate.lateRegistrationDeadline}</span>
                    </div>
                    <span className="text-xs text-orange-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Additional $34 late fee applies</span>
                  </div>
                  <div className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-700">Changes / Cancellation</span>
                    <span className="font-bold text-slate-900">{selectedDate.changeDeadline}</span>
                  </div>
                </div>
              </section>

              {/* Fees Section */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Fees structure
                </h3>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 text-[15px]">Standard Registration</span>
                    <span className="font-bold text-slate-900">$68</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 text-[15px]">Late Registration Fee</span>
                    <span className="font-bold text-slate-900">+$34</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 text-[15px]">Test Center Change</span>
                    <span className="font-bold text-slate-900">+$29</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 text-[15px]">Cancel Registration</span>
                    <span className="font-bold text-slate-900">+$29</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 mt-2">
                    <p className="text-xs text-slate-500 italic">Regional/International extra fees apply depending on test center location ($43 - $53).</p>
                  </div>
                </div>
              </section>

              {/* Requirements Section */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4" /> What to Bring & Requirements
                </h3>
                <ul className="space-y-3">
                  {[
                    "Acceptable photo ID (Valid Passport, Driver's License, or School ID).",
                    "Printed or digital admission ticket from College Board.",
                    "Fully charged testing device with Bluebook app installed.",
                    "Arrive at test center by 7:45 AM (doors close roughly at 8:00 AM)."
                  ].map((req, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="min-w-[20px] pt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-sm text-slate-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Countdowns */}
              <section className="space-y-4 pt-4">
                 {/* Register Countdown */}
                 {drawerRegTimeLeft ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-orange-800 mb-3">Time Left to Register (Regular)</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Days', val: drawerRegTimeLeft.days },
                        { label: 'Hours', val: drawerRegTimeLeft.hours },
                        { label: 'Mins', val: drawerRegTimeLeft.mins },
                        { label: 'Secs', val: drawerRegTimeLeft.secs }
                      ].map(item => (
                        <div key={item.label} className="bg-white rounded border border-orange-100 p-2 text-center shadow-sm">
                          <div className="text-xl font-bold text-orange-600 leading-none mb-1">{item.val.toString().padStart(2, '0')}</div>
                          <div className="text-[10px] uppercase text-orange-500 tracking-wider font-semibold">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                 ) : (
                  <div className="bg-slate-100 rounded-xl p-4 text-center border border-slate-200">
                    <span className="text-sm font-bold text-slate-600">Standard Registration Closed</span>
                  </div>
                 )}

                 {/* Test Day Countdown */}
                 {drawerTimeLeft ? (
                  <div className="bg-blue-600 rounded-xl p-5 shadow-sm text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <h4 className="text-sm font-bold text-blue-100 mb-3">Countdown to Test Day!</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'Days', val: drawerTimeLeft.days },
                          { label: 'Hours', val: drawerTimeLeft.hours },
                          { label: 'Mins', val: drawerTimeLeft.mins },
                          { label: 'Secs', val: drawerTimeLeft.secs }
                        ].map(item => (
                          <div key={item.label} className="bg-blue-700/50 rounded border border-blue-500/50 p-2 text-center backdrop-blur-sm">
                            <div className="text-xl font-bold text-white leading-none mb-1">{item.val.toString().padStart(2, '0')}</div>
                            <div className="text-[10px] uppercase text-blue-200 tracking-wider font-semibold">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                 ) : (
                  <div className="bg-green-100 rounded-xl p-4 text-center border border-green-200">
                    <span className="text-sm font-bold text-green-700">Test Completed</span>
                  </div>
                 )}
              </section>

            </div>

            {/* Drawer Footer CTA */}
            <div className="absolute flex justify-center bottom-0 w-full p-4 bg-white border-t border-slate-200 pb-10">
               <a href="https://satreg.collegeboard.org" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#111827] text-white px-6 py-3.5 rounded-lg font-bold hover:bg-[#374151] transition-colors shadow-lg">
                Register for this SAT
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}
`;

code = code.replace(
    `</div>\n    </div>\n  );\n}`,
    `</div>\n${drawerComponent}\n    </div>\n  );\n}`
);

fs.writeFileSync(pageFile, code);
console.log("Updated page.tsx with Drawer logic!");
