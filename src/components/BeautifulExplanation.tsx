import React from 'react';
import { cleanOCR } from '@/components/PassageRenderer';
import { LatexRenderer } from '@/components/LatexRenderer';
import { CheckCircle2, XCircle, Brain } from 'lucide-react';

export const BeautifulExplanation = ({ text }: { text: string }) => {
    if (!text) return null;

    let preprocessedText = text
        .replace(/Choice ([A-D]) is (?:correct|the best answer)/gi, '\n✅ Why Choice $1 is Correct\n$&')
        .replace(/Choice ([A-D]) is incorrect/gi, '\n❌ Why Choice $1 is Incorrect\n$&');

    return (
        <div className="space-y-3 font-medium">
            {preprocessedText.split('\n').map((line, i) => {
                if (!line.trim()) return null;

                // Handle the Correct/Incorrect Headers by replacing emojis with sleek icons
                if (line.includes('✅ Why') || line.includes('Why it is Correct')) {
                    const cleanLine = line.replace(/✅/g, '').trim();
                    return (
                        <div key={i} className="flex items-center gap-2 mt-8 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-bold text-slate-900 text-[16px] tracking-tight">{cleanLine}</h4>
                        </div>
                    );
                }

                if (line.includes('❌ Why') || line.includes('Why the Others Are Wrong')) {
                    const cleanLine = line.replace(/❌/g, '').trim();
                    return (
                        <div key={i} className="flex items-center gap-2 mt-8 mb-2">
                            <XCircle className="w-5 h-5 text-rose-500" />
                            <h4 className="font-bold text-slate-900 text-[16px] tracking-tight">{cleanLine}</h4>
                        </div>
                    );
                }

                // Handle 'Core Logic:' or 'Answer:'
                let isCoreLogic = line.startsWith('Core Logic:');
                let isAnswer = line.startsWith('Answer:');

                let contentToRender = line;
                if (isCoreLogic) contentToRender = line.replace('Core Logic:', '').trim();
                if (isAnswer) contentToRender = line.replace('Answer:', '').trim();

                // Process bold and italic markdown
                const parts = contentToRender.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith('*') && part.endsWith('*')) {
                        return <em key={j} className="text-slate-800 italic">{part.slice(1, -1)}</em>;
                    }
                    return <LatexRenderer key={j} text={cleanOCR(part)} />;
                });

                if (isCoreLogic) {
                    return (
                        <div key={i} className="text-[15px] text-slate-700 leading-relaxed mb-4">
                            <span className="font-bold text-slate-900 mr-2 inline-flex items-center gap-1.5 align-middle">
                                <Brain className="w-[18px] h-[18px] text-indigo-500 -mt-0.5" />
                                Core Logic:
                            </span>
                            {parts}
                        </div>
                    );
                }

                if (isAnswer) {
                    return (
                        <div key={i} className="text-[15px] text-slate-700 leading-relaxed mb-4">
                            <span className="font-bold text-slate-900 mr-2">Answer:</span>
                            {parts}
                        </div>
                    );
                }

                return (
                    <div key={i} className="text-[15px] text-slate-600 leading-[1.7]">
                        {parts}
                    </div>
                );
            })}
        </div>
    );
};
