import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { MockResult } from '@/store/classroomStore';

interface Props {
    mockResults: MockResult[];
    title: string;
    subtitle: string;
}

export function TeacherAnalyticsChart({ mockResults, title, subtitle }: Props) {
    const data = useMemo(() => {
        // Group by day to create a smooth trend line
        const grouped: Record<string, { totalScore: number; count: number }> = {};
        
        mockResults.forEach(m => {
            if (!m.completedAt) return;
            const dateStr = new Date(m.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!grouped[dateStr]) grouped[dateStr] = { totalScore: 0, count: 0 };
            grouped[dateStr].totalScore += m.score;
            grouped[dateStr].count += 1;
        });

        // Convert to array and sort chronologically (assuming sorting by date string is ok for short term, or just sort by the Date object)
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a + " 2026").getTime() - new Date(b + " 2026").getTime());

        return sortedDates.map(dateStr => {
            const rawAvg = grouped[dateStr].totalScore / grouped[dateStr].count;
            return {
                date: dateStr,
                score: Math.max(400, Math.min(1600, Math.round(rawAvg / 10) * 10))
            };
        });
    }, [mockResults]);

    if (data.length < 2) {
        return (
            <motion.div 
                className="site-panel rounded-[26px] p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <span className="text-xl">📊</span>
                </div>
                <h3 className="site-text-strong font-black text-xl mb-1">Not Enough Data</h3>
                <p className="site-text-muted text-sm max-w-xs">Need at least 2 completed mock tests on different days to show a trend graph.</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="site-panel rounded-[26px] p-6 sm:p-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="mb-6">
                <h3 className="site-text-strong font-black text-xl tracking-[-0.02em]">{title}</h3>
                <p className="site-text-muted text-sm mt-1">{subtitle}</p>
            </div>
            
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis 
                            domain={[400, 1600]} 
                            ticks={[400, 600, 800, 1000, 1200, 1400, 1600]}
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip 
                            cursor={{ stroke: 'rgba(79, 70, 229, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] p-4 rounded-[20px]">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                <p className="font-black text-2xl text-slate-800">
                                                    {payload[0].value}
                                                    <span className="text-sm font-medium text-slate-400 ml-1">avg</span>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="score" 
                            name="Avg Score"
                            stroke="#4f46e5" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorScore)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#4338ca' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
