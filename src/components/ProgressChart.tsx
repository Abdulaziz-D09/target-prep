import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export function ProgressChart({ history }: { history: any[] }) {
    const data = useMemo(() => {
        // We want chronological order for the chart (oldest to newest)
        return [...history].reverse().map((test, i) => ({
            name: `Test ${i + 1}`,
            date: new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            total: Math.max(400, Math.min(1600, Math.round(test.totalScore / 10) * 10)),
            math: Math.max(200, Math.min(800, Math.round(test.mathScore / 10) * 10)),
            reading: Math.max(200, Math.min(800, Math.round(test.englishScore / 10) * 10)),
        }));
    }, [history]);

    if (data.length < 2) return null;

    return (
        <motion.div 
            className="site-panel rounded-[26px] p-5 sm:p-7 mb-7 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="mb-6">
                <h3 className="site-text-strong font-black text-2xl tracking-[-0.03em]">Score Progression</h3>
                <p className="site-text-muted text-sm mt-1">Your total score trend over time.</p>
            </div>
            
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                            cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] p-4 rounded-[20px]">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{payload[0].payload.name} • {label}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <p className="font-black text-2xl text-slate-800">
                                                    {payload[0].value}
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
                            dataKey="total" 
                            name="Total Score"
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorTotal)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
