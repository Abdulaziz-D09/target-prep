'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, FileText, BarChart2, BookOpen, Menu, X, LayoutGrid, SunMedium, Moon, CircleUserRound, GraduationCap, ClipboardList, Map, Rocket, LogOut, Settings, Plus } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { itemRevealVariants, siteEase } from '@/components/SiteMotion';
import { applySiteTone, readSiteTone, subscribeToSiteTone, syncDocumentTone, type SiteTone } from '@/lib/siteTone';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/login/actions';

const MotionLink = motion(Link);

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string };

const studentNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/study-plan', label: 'Study Vault', icon: Map },
    { href: '/practice', label: 'Practice Tests', icon: FileText },

    { href: '/question-bank', label: 'Question Bank', icon: LayoutGrid },
    { href: '/classroom', label: 'Classroom', icon: GraduationCap },
    { href: '/progress', label: 'Progress', icon: BarChart2 },
];

const studentMockNavItems: NavItem[] = [
    { href: '/dashboard/mocks', label: 'Active Mocks', icon: FileText },
    { href: '/dashboard/mocks/history', label: 'Mock History', icon: BookOpen },
    { href: '/dashboard/mocks/analytics', label: 'Analytics', icon: BarChart2 },
];

const teacherNavItems: NavItem[] = [
    { href: '/teacher', label: 'Home', icon: Home },
    { href: '/teacher/classes', label: 'Classes', icon: GraduationCap },
    { href: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/teacher/analytics', label: 'Analytics', icon: BarChart2 },
];

const teacherMockNavItems: NavItem[] = [
    { href: '/teacher/mocks', label: 'Active Mocks', icon: FileText },
    { href: '/teacher/mocks/create', label: 'Create Mock', icon: Plus },
    { href: '/teacher/mocks/history', label: 'Completed Mocks', icon: BookOpen },
    { href: '/teacher/mocks/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function Sidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isTeacherMode = pathname.startsWith('/teacher');
    const isMockMode = pathname.includes('/mocks') || (pathname === '/progress/review' && searchParams.get('mockId') !== null);
    
    let currentNavItems = isTeacherMode ? teacherNavItems : studentNavItems;
    if (isMockMode) {
        currentNavItems = isTeacherMode ? teacherMockNavItems : studentMockNavItems;
    }
    
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);
    const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profileForm, setProfileForm] = useState({
        first_name: '',
        last_name: ''
    });
    const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });
    const [isSaving, setIsSaving] = useState(false);
    const siteTone = useSyncExternalStore<SiteTone>(subscribeToSiteTone, readSiteTone, () => 'dark');
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data?.user);
            if (data?.user) {
                const metadata = data.user.user_metadata;
                setProfileForm({
                    first_name: metadata?.first_name || '',
                    last_name: metadata?.last_name || metadata?.surname || ''
                });
                
                if (metadata?.site_tone && metadata.site_tone !== readSiteTone()) {
                    applySiteTone(metadata.site_tone);
                }
            }
        });
    }, []);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setUpdateMessage({ text: '', type: '' });
        const supabase = createClient();
        
        const { data, error } = await supabase.auth.updateUser({
            data: profileForm
        });
        
        setIsSaving(false);
        if (error) {
            setUpdateMessage({ text: error.message, type: 'error' });
        } else {
            setUpdateMessage({ text: 'Profile updated successfully!', type: 'success' });
            setUser(data.user);
            setIsEditingProfile(false);
        }
    };

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

    useEffect(() => {
        setNavigatingTo(null);
    }, [pathname, searchParams]);

    const isActive = (href: string) => {
        if (href === '/dashboard/mocks/history') {
            return pathname.startsWith(href) || (pathname === '/progress/review' && searchParams.get('mockId') !== null);
        }
        if (href === '/dashboard' || href === '/teacher' || href === '/dashboard/mocks' || href === '/teacher/mocks') return pathname === href;
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
        if (!active) {
            setNavigatingTo(href);
        } else {
            event.preventDefault();
        }
    };

    // Hide sidebar on practice test mode, classroom assignments, or if explicitly toggled
    if (pathname.startsWith('/practice/test/') || pathname.startsWith('/classroom/assignment/') || isTemporarilyHidden) {
        return null;
    }



    const sidebarContent = (
        <div className="relative flex h-full flex-col overflow-hidden" style={{ minHeight: 0 }}>


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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-0 bg-transparent shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                        <Image src="/logo.png" alt="Target Prep Logo" width={48} height={48} className="h-full w-full object-cover rounded-2xl" />
                    </div>
                    <div>
                        <h1 className={`mb-0.5 text-[1.05rem] font-black leading-none tracking-tight ${isLightTone ? 'text-slate-900' : 'text-[#eef2f7]'}`}>Target Prep</h1>
                        <p className={`text-[11px] font-bold uppercase tracking-[0.22em] ${isLightTone ? 'text-slate-500' : 'text-[#d4dce8]'}`}>{isTeacherMode ? 'Teacher' : 'SAT Prep'}</p>
                    </div>
                </motion.div>
            </motion.div>

            <div className="px-5 pb-4">
                <div className={`relative flex w-full items-center p-1 overflow-hidden rounded-xl border ${
                    isLightTone 
                        ? 'border-slate-200 bg-slate-100/50' 
                        : 'border-white/10 bg-white/5'
                }`}>
                    <Link
                        href={isTeacherMode ? '/teacher' : '/dashboard'}
                        className={`relative flex-1 flex items-center justify-center gap-2 rounded-[10px] py-1.5 text-[13px] font-bold transition-colors z-10 ${
                            !isMockMode ? (isLightTone ? 'text-slate-900' : 'text-white') : (isLightTone ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200')
                        }`}
                    >
                        {!isMockMode && (
                            <motion.div layoutId="program-active" className={`absolute inset-0 rounded-[10px] shadow-sm border ${isLightTone ? 'bg-white border-slate-200/60' : 'bg-blue-600 border-blue-500'}`} transition={{ type: 'spring', stiffness: 350, damping: 25 }} />
                        )}
                        <span className="relative z-10 tracking-tight">SAT</span>
                    </Link>
                    <Link
                        href={isTeacherMode ? '/teacher/mocks' : '/dashboard/mocks'}
                        className={`relative flex-1 flex items-center justify-center gap-2 rounded-[10px] py-1.5 text-[13px] font-bold transition-colors z-10 ${
                            isMockMode ? (isLightTone ? 'text-slate-900' : 'text-white') : (isLightTone ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200')
                        }`}
                    >
                        {isMockMode && (
                            <motion.div layoutId="program-active" className={`absolute inset-0 rounded-[10px] shadow-sm border ${isLightTone ? 'bg-white border-slate-200/60' : 'bg-blue-600 border-blue-500'}`} transition={{ type: 'spring', stiffness: 350, damping: 25 }} />
                        )}
                        <span className="relative z-10 tracking-tight">Mock</span>
                    </Link>
                </div>
            </div>

            <LayoutGroup id="sidebar-nav">
            <nav className="relative flex-1 space-y-2 px-4 overflow-y-auto min-h-0">
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
                                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 border ${
                                    active
                                        ? isLightTone ? 'text-slate-900 border-slate-300 bg-white shadow-sm' : 'text-white border-white/20'
                                        : isLightTone ? 'text-slate-600 hover:text-slate-900 bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border-white/10 hover:border-white/20'
                                }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className={`absolute inset-0 rounded-2xl ${
                                            isLightTone
                                                ? 'bg-white shadow-sm'
                                                : 'bg-white/[0.08] backdrop-blur-md'
                                        }`}
                                        transition={{ type: 'spring', stiffness: 340, damping: 30, mass: 0.76 }}
                                    />
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
                                    className="relative z-10 tracking-tight flex items-center gap-2"
                                    variants={navLabelVariants}
                                    transition={shouldReduceMotion ? undefined : { type: 'spring', stiffness: 260, damping: 22 }}
                                >
                                    {item.label}
                                    {navigatingTo === item.href && (
                                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
                                    )}
                                </motion.span>
                                {item.badge && (
                                    <span className={`ml-auto relative z-10 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                                        isLightTone 
                                            ? 'bg-blue-100 text-blue-600' 
                                            : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </MotionLink>
                        </motion.div>
                    );
                })}
            </nav>
            </LayoutGroup>

            {/* Bottom Controls */}
            <div className="mt-auto px-4 pb-6 space-y-2">
                <div className={`mx-1 mb-3 h-px ${isLightTone ? 'bg-slate-200/60' : 'bg-white/[0.06]'}`} />
                <div className={`relative flex w-full items-center p-1 overflow-hidden rounded-2xl border ${
                    isLightTone 
                        ? 'border-slate-200 bg-slate-100/50' 
                        : 'border-white/10 bg-white/5'
                }`}>
                    <button
                        type="button"
                        onClick={() => {
                            applySiteTone('light');
                            if (user) createClient().auth.updateUser({ data: { site_tone: 'light' } });
                        }}
                        className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors z-10 ${
                            isLightTone ? 'text-slate-900' : 'text-slate-400 hover:text-slate-200'
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
                        onClick={() => {
                            applySiteTone('dark');
                            if (user) createClient().auth.updateUser({ data: { site_tone: 'dark' } });
                        }}
                        className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors z-10 ${
                            !isLightTone ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {!isLightTone && (
                            <motion.div layoutId="theme-active" className="absolute inset-0 rounded-xl bg-white/10 shadow-sm border border-white/10" />
                        )}
                        <Moon className="relative z-10 h-[17px] w-[17px]" />
                        <span className="relative z-10 tracking-tight">Dark</span>
                    </button>
                </div>

                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 border text-left ${
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
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-100/10 border border-blue-500/20 shrink-0">
                        <CircleUserRound className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="relative z-10 flex flex-col items-start leading-none gap-1 tracking-tight overflow-hidden">
                        <span className={`font-semibold truncate w-full ${isLightTone ? 'text-slate-700' : 'text-slate-200'}`}>
                            {user ? `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name?.charAt(0) || ''}.` : 'Loading...'}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wider ${isLightTone ? 'text-slate-500' : 'text-slate-500'}`}>
                            {user ? user.user_metadata?.role : 'Student'}
                        </span>
                    </div>
                </button>
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
                                    ? 'bg-[var(--site-shell-bg)]'
                                    : 'bg-[var(--site-shell-bg)]'
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

            {/* Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
                            onClick={() => setIsSettingsOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className={`relative w-full max-w-md overflow-hidden rounded-[28px] border shadow-2xl ${
                                isLightTone ? 'bg-white border-slate-200' : 'bg-[#0f141f] border-white/10'
                            }`}
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        >
                            <div className={`flex items-center justify-between border-b px-6 py-4 ${isLightTone ? 'border-slate-100' : 'border-white/5'}`}>
                                <h2 className={`text-lg font-black tracking-tight ${isLightTone ? 'text-slate-900' : 'text-white'}`}>Account Settings</h2>
                                <button onClick={() => setIsSettingsOpen(false)} className="rounded-full p-1.5 hover:bg-slate-500/10 transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            
                            <div className="px-6 py-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
                                        <CircleUserRound className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-black tracking-tight ${isLightTone ? 'text-slate-900' : 'text-white'}`}>
                                            {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{user?.email}</p>
                                    </div>
                                </div>
                                
                                {isEditingProfile ? (
                                    <form onSubmit={handleSaveSettings} className="space-y-4">
                                        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className={`rounded-2xl p-4 border ${isLightTone ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">First Name</label>
                                                    <input 
                                                        type="text" required
                                                        value={profileForm.first_name} 
                                                        onChange={e => setProfileForm({...profileForm, first_name: e.target.value})}
                                                        className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isLightTone ? 'bg-white border-slate-200 text-slate-900' : 'bg-black/20 border-white/10 text-white'}`}
                                                    />
                                                </div>
                                                <div className={`rounded-2xl p-4 border ${isLightTone ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Surname</label>
                                                    <input 
                                                        type="text" required
                                                        value={profileForm.last_name} 
                                                        onChange={e => setProfileForm({...profileForm, last_name: e.target.value})}
                                                        className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isLightTone ? 'bg-white border-slate-200 text-slate-900' : 'bg-black/20 border-white/10 text-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            

                                        </div>
                                        
                                        {updateMessage.text && (
                                            <div className={`rounded-xl p-3 text-sm font-semibold ${updateMessage.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {updateMessage.text}
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setIsEditingProfile(false)} disabled={isSaving} className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${isLightTone ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={isSaving} className={`flex-[2] flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-colors ${isSaving ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                                {isSaving ? 'Saving...' : 'Save Settings'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                            <div className={`rounded-2xl p-4 border ${isLightTone ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Role</p>
                                                <p className={`text-sm font-semibold capitalize ${isLightTone ? 'text-slate-700' : 'text-slate-200'}`}>{user?.user_metadata?.role || 'Student'}</p>
                                            </div>

                                        </div>

                                        {updateMessage.text && updateMessage.type === 'success' && (
                                            <div className="rounded-xl p-3 text-sm font-semibold bg-emerald-500/10 text-emerald-500">
                                                {updateMessage.text}
                                            </div>
                                        )}

                                        <button onClick={() => setIsEditingProfile(true)} className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${isLightTone ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}>
                                            Edit Profile
                                        </button>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <form action={signOut}>
                                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3.5 text-sm font-bold text-red-600 dark:text-red-500 transition-colors hover:bg-red-500/20">
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
