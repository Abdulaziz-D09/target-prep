'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, FileText, BarChart2, BookOpen, Menu, X, LayoutGrid, SunMedium, Moon, CircleUserRound, GraduationCap, ClipboardList } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { itemRevealVariants, siteEase } from '@/components/SiteMotion';
import { applySiteTone, readSiteTone, subscribeToSiteTone, syncDocumentTone, type SiteTone } from '@/lib/siteTone';

const MotionLink = motion(Link);

const studentNavItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/practice', label: 'Practice Tests', icon: FileText },
    { href: '/question-bank', label: 'Question Bank', icon: LayoutGrid },
    { href: '/classroom', label: 'Classroom', icon: GraduationCap },
    { href: '/progress', label: 'Progress', icon: BarChart2 },
    { href: '/resources', label: 'Playbook', icon: BookOpen },
];

const teacherNavItems = [
    { href: '/teacher', label: 'Home', icon: Home },
    { href: '/teacher/classes', label: 'Classes', icon: GraduationCap },
    { href: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
];

export default function Sidebar() {
    const pathname = usePathname();
    const isTeacherMode = pathname.startsWith('/teacher');
    const currentNavItems = isTeacherMode ? teacherNavItems : studentNavItems;
    
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);
    const [activePressHref, setActivePressHref] = useState<string | null>(null);
    const siteTone = useSyncExternalStore<SiteTone>(subscribeToSiteTone, readSiteTone, () => 'dark');
    const activePressTimeoutRef = useRef<number | null>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const hide = () => setIsTemporarilyHidden(true);
        const show = () => setIsTemporarilyHidden(false);

        window.addEventListener('hide-sidebar', hide);
        window.addEventListener('show-sidebar', show);

        return () => {
            window.removeEventListener('hide-sidebar', hide);
            window.removeEventListener('show-sidebar', show);
        };
    }, []);

    useEffect(() => {
        syncDocumentTone(siteTone);
    }, [siteTone]);

    useEffect(() => () => {
        if (activePressTimeoutRef.current !== null) {
            window.clearTimeout(activePressTimeoutRef.current);
        }
    }, []);

    const isActive = (href: string) => {
        if (href === '/dashboard' || href === '/teacher') return pathname === href;
        return pathname.startsWith(href);
    };

    const navIconVariants = {
        rest: { rotate: 0, scale: 1 },
        hover: shouldReduceMotion ? {} : { rotate: [0, -7, 6, -3, 0], scale: 1.08 },
    };

    const navLabelVariants = {
        rest: { },
        hover: shouldReduceMotion ? {} : { },
    };

    const isLightTone = siteTone === 'light';
    const ThemeIcon = isLightTone ? Moon : SunMedium;
    const nextTone: 'light' | 'dark' = isLightTone ? 'dark' : 'light';

    const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string, active: boolean) => {
        setMobileOpen(false);
        if (!active) return;

        event.preventDefault();

        setActivePressHref(href);
        if (activePressTimeoutRef.current !== null) {
            window.clearTimeout(activePressTimeoutRef.current);
        }
        activePressTimeoutRef.current = window.setTimeout(() => {
            setActivePressHref(null);
            activePressTimeoutRef.current = null;
        }, 170);
    };

    // Hide sidebar completely on full-screen practice, assignments, and temporary full-focus flows
    if (pathname.startsWith('/practice/test/') || pathname.startsWith('/classroom/assignment/') || isTemporarilyHidden) {
        return null;
    }



    const sidebarContent = (
        <div className="relative flex h-full flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {!isLightTone && (
                    <>
                        <motion.div
                            className="absolute -left-10 top-10 h-48 w-16 rotate-45 bg-blue-500/10 blur-xl mix-blend-screen"
                            animate={shouldReduceMotion ? undefined : { y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={shouldReduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute bottom-20 left-4 h-40 w-12 -rotate-12 bg-rose-500/10 blur-xl mix-blend-screen"
                            animate={shouldReduceMotion ? undefined : { y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
                            transition={shouldReduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        />
                    </>
                )}
            </div>

            <motion.div
                className="px-5 pb-6 pt-6 sm:px-6"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.42, ease: siteEase }}
            >
                <motion.div
                    className={`inline-flex items-center gap-3 rounded-2xl px-3 py-3 pr-5 transition-shadow ${
                        isLightTone
                            ? 'bg-transparent'
                            : 'bg-transparent'
                    }`}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    transition={shouldReduceMotion ? undefined : { type: 'spring', stiffness: 260, damping: 20 }}
                >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-0 bg-transparent">
                        <Image src="/logo.jpg" alt="Target Prep Logo" width={48} height={48} className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h1 className={`mb-0.5 text-[1.05rem] font-black leading-none tracking-tight ${isLightTone ? 'text-slate-900' : 'text-[#eef2f7]'}`}>Target Prep</h1>
                        <p className={`text-[11px] font-bold uppercase tracking-[0.22em] ${isLightTone ? 'text-slate-500' : 'text-[#d4dce8]'}`}>{isTeacherMode ? 'Teacher' : 'SAT Prep'}</p>
                    </div>
                </motion.div>

            </motion.div>

            <LayoutGroup id="sidebar-nav">
            <nav className="relative flex-1 space-y-2 px-4">
                {currentNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <motion.div
                            key={item.href}
                            variants={itemRevealVariants}
                            initial={shouldReduceMotion ? undefined : 'hidden'}
                            animate={shouldReduceMotion ? undefined : 'visible'}
                            transition={shouldReduceMotion ? undefined : { delay: 0.03 * currentNavItems.indexOf(item) }}
                        >
                            <MotionLink
                                href={item.href}
                                onClick={(event) => handleNavClick(event, item.href, active)}
                                initial="rest"
                                animate="rest"
                                whileHover="hover"
                                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                    active
                                        ? isLightTone ? 'text-slate-900 shadow-sm border-slate-300 bg-white' : 'text-white border-white/20 bg-white/5'
                                        : isLightTone ? 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm border-slate-200 hover:border-slate-300' : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
                                } border ${
                                    activePressHref === item.href
                                        ? isLightTone
                                            ? 'ring-1 ring-blue-200'
                                            : 'ring-1 ring-blue-500/50'
                                        : ''
                                }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className={`absolute inset-0 rounded-2xl ${
                                            isLightTone
                                                ? 'bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                                : 'bg-white/[0.08] border border-white/10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                                        }`}
                                        transition={{ type: 'spring', stiffness: 340, damping: 30, mass: 0.76 }}
                                    />
                                )}
                                {!active && (
                                    <span className={`absolute inset-0 rounded-2xl transition duration-300 ${
                                        isLightTone
                                            ? 'hover:bg-slate-100/50 hover:shadow-sm'
                                            : 'hover:bg-white/5'
                                    }`} />
                                )}
                                <motion.span
                                    className={`relative z-10 flex h-8 w-8 items-center justify-center transition-colors ${
                                        active
                                            ? isLightTone ? 'text-blue-600' : 'text-blue-400'
                                            : isLightTone
                                                ? 'text-slate-500 group-hover:text-slate-800'
                                                : 'text-slate-400 group-hover:text-slate-200'
                                    }`}
                                    variants={navIconVariants}
                                    transition={shouldReduceMotion ? undefined : { duration: 0.34, ease: 'easeInOut' }}
                                >
                                    <Icon className="h-[17px] w-[17px]" />
                                </motion.span>
                                <motion.span
                                    className="relative z-10 tracking-tight"
                                    variants={navLabelVariants}
                                    transition={shouldReduceMotion ? undefined : { type: 'spring', stiffness: 260, damping: 22 }}
                                >
                                    {item.label}
                                </motion.span>
                            </MotionLink>
                        </motion.div>
                    );
                })}
            </nav>
            </LayoutGroup>

            {/* Bottom Controls */}
            <div className="mt-auto px-4 pb-6 space-y-2">
                <div className={`relative flex w-full items-center p-1 overflow-hidden rounded-2xl border ${
                    isLightTone 
                        ? 'border-slate-200 bg-slate-100/50' 
                        : 'border-white/10 bg-white/5'
                }`}>
                    <button
                        type="button"
                        onClick={() => applySiteTone('light')}
                        className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors z-10 ${
                            isLightTone ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {isLightTone && (
                            <motion.div layoutId="theme-active" className="absolute inset-0 rounded-xl bg-white shadow-sm border border-slate-200/60" />
                        )}
                        <SunMedium className="relative z-10 h-[17px] w-[17px]" />
                        <span className="relative z-10 tracking-tight">Light</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => applySiteTone('dark')}
                        className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors z-10 ${
                            !isLightTone ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {!isLightTone && (
                            <motion.div layoutId="theme-active" className="absolute inset-0 rounded-xl bg-white/10 shadow-sm border border-white/10" />
                        )}
                        <Moon className="relative z-10 h-[17px] w-[17px]" />
                        <span className="relative z-10 tracking-tight">Dark</span>
                    </button>
                </div>

                <Link
                    href={isTeacherMode ? '/dashboard' : '/teacher'}
                    className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 border ${
                        isLightTone 
                            ? 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm border-slate-200 hover:border-slate-300' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <span className={`absolute inset-0 rounded-2xl transition duration-300 ${
                        isLightTone
                            ? 'hover:bg-slate-100/50 hover:shadow-sm'
                            : 'hover:bg-white/5'
                    }`} />
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-100/10 border border-blue-500/20">
                        <CircleUserRound className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="relative z-10 flex flex-col items-start leading-none gap-0.5 tracking-tight">
                        <span className={`font-semibold ${isLightTone ? 'text-slate-700' : 'text-slate-200'}`}>Abdullah D.</span>
                        <span className={`text-[10px] uppercase tracking-wider ${isLightTone ? 'text-slate-500' : 'text-slate-500'}`}>
                            {isTeacherMode ? 'Teacher' : 'Student'}
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );

    return (
        <>

            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden fixed top-4 left-4 z-50 rounded-xl p-2.5 text-white backdrop-blur-xl ${
                    isLightTone
                        ? 'bg-[rgba(132,143,159,0.26)] border-none shadow-none'
                        : 'bg-[rgba(94,108,128,0.24)] border-none shadow-none'
                }`}
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar */}
            <motion.aside
                className="hidden lg:flex w-[280px] bg-transparent flex-col h-full z-10 shrink-0"
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: -12 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.36, ease: siteEase }}
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <div className="lg:hidden">
                        <motion.div
                            className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm z-40"
                            onClick={() => setMobileOpen(false)}
                            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                        />
                        <motion.aside
                            className={`fixed left-0 top-0 bottom-0 w-[280px] flex flex-col z-50 backdrop-blur-3xl ${
                                isLightTone
                                    ? 'bg-white/95'
                                    : 'bg-[#090a0f]/95'
                            }`}
                            initial={shouldReduceMotion ? undefined : { x: -24, opacity: 0.92 }}
                            animate={shouldReduceMotion ? undefined : { x: 0, opacity: 1 }}
                            exit={shouldReduceMotion ? undefined : { x: -24, opacity: 0.92 }}
                            transition={shouldReduceMotion ? undefined : { duration: 0.28, ease: siteEase }}
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-6 right-4 rounded-lg bg-white/10 p-1.5 text-[#d8e0eb] hover:bg-white/18 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
