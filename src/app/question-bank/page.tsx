'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Filter, Shuffle, ChevronDown, CheckCircle,
    BookOpen, Trophy, X, Zap,
    RotateCcw, Target, Flame, Star, Bookmark, ChevronUp, Maximize2,
    Clock, Highlighter, ArrowLeft, Pause, Play, Calculator, FileText
} from 'lucide-react';
import ebrwData from '@/data/ebrw_bank.json';
import mathData from '@/data/math_bank.json';
import { HighlightableText } from '@/components/HighlightableText';
import { PassageRenderer } from '@/components/PassageRenderer';
import { Highlight } from '@/store/testStore';
import { useRouter } from 'next/navigation';
import DesmosCalculator from '@/components/DesmosCalculator';
import { ReferenceSheet } from '@/components/ReferenceSheet';
import {
    FloatingPageShapes,
    itemRevealVariants,
    pageRevealVariants,
    sectionRevealVariants,
    staggerContainerVariants,
} from '@/components/SiteMotion';

// ── Types ────────────────────────────────────────────────────────────────────
type AnswerType = 'multiple_choice' | 'numeric';
type ImageCrop = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type MathImageLayout = {
    stem: ImageCrop;
    options?: ImageCrop[];
};

interface Question {
    id: string;
    type: string;
    passage: string;
    question: string;
    options: string[];
    answer?: number;
    answerType: AnswerType;
    answerText?: string;
    acceptableAnswers?: string[];
    explanation: string;
    difficulty: string;
    domain: string;
    skill: string;
    image?: string;
    imageLayout?: MathImageLayout;
}
interface SessionResult { total: number; correct: number; wrong: number; skipped: number; }
type View = 'browse' | 'quiz' | 'summary';
type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';
const QB_REVIEW_STORAGE_KEY = 'targetprep_qb_review_ids';
type RawBankQuestion = {
    id: string;
    type?: string;
    passage?: string;
    question?: string;
    options?: string[];
    answer?: number;
    answerType?: AnswerType;
    answerText?: string;
    acceptableAnswers?: string[];
    imageLayout?: MathImageLayout;
    explanation?: string;
    difficulty?: string;
    domain?: string;
    skill?: string;
    image?: string;
};

// ── Skill Detection ──────────────────────────────────────────────────────────
function detectSkill(q: RawBankQuestion): { domain: string; skill: string } {
    const qt = (q.question || '').toLowerCase();
    const pt = (q.passage || '').toLowerCase();
    const combined = qt + ' ' + pt;
    // Normalize spaced-out text (e.g., "confor ms" → "conforms")
    const qn = qt.replace(/\s+/g, '');

    // Standard English Conventions — Boundaries (conforms to conventions of standard English)
    if (qn.includes('conformstotheconventions') || qn.includes('conformstoconventions') ||
        qt.includes('confor') || qt.includes('punctuat') || qt.includes('punc') ||
        qt.includes('comma') || qt.includes('semicolon') || qt.includes('colon') ||
        qt.includes('apostrophe') || qt.includes('dash') || qt.includes('fragment') ||
        qt.includes('run-on') || qt.includes('boundary'))
        return { domain: 'Standard English Conventions', skill: 'Boundaries' };

    // Standard English Conventions — Form, Structure, and Sense
    if (qn.includes('withthecorrect') ||
        qt.includes('verb') || qt.includes('tense') || qt.includes('pronoun') ||
        qt.includes('modifier') || qt.includes('possessive') || qt.includes('agreement') ||
        qt.includes('clause') || qt.includes('parallel') || qt.includes('grammatically'))
        return { domain: 'Standard English Conventions', skill: 'Form, Structure, and Sense' };

    // Expression of Ideas — Transitions (logical transition)
    if (qn.includes('logicaltransition') || qt.includes('tr ansition') || qt.includes('transition'))
        return { domain: 'Expression of Ideas', skill: 'Transitions' };

    // Expression of Ideas — Rhetorical Synthesis
    if (qn.includes('mosteffectively') || qt.includes('eff ectiv') || qt.includes('effectively') ||
        qt.includes('rhetorical') || qt.includes('synthesis') ||
        combined.includes('a student is writing') || combined.includes('a researcher is writing'))
        return { domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis' };

    // Craft and Structure — Words in Context (precise word or phrase)
    if (qn.includes('precisew') || qn.includes('preciseword') || qt.includes('pr ecise wor') ||
        qt.includes('as used') || (qt.includes('wor d') && qt.includes('phr ase')))
        return { domain: 'Craft and Structure', skill: 'Words in Context' };

    // Craft and Structure — Cross-Text Connections
    if (pt.includes('text 1') || pt.includes('text 2'))
        return { domain: 'Craft and Structure', skill: 'Cross-Text Connections' };

    // Craft and Structure — Text Structure and Purpose
    if (qt.includes('purpose') || qt.includes('structur') || qt.includes('function') ||
        qt.includes('role') || qt.includes('primarily'))
        return { domain: 'Craft and Structure', skill: 'Text Structure and Purpose' };

    // Information and Ideas — Command of Evidence
    if (qt.includes('quotation') || qt.includes('suppor t') || qt.includes('support') ||
        qt.includes('weaken') || qt.includes('strengthen') || qt.includes('illustr ate') ||
        qt.includes('graph') || qt.includes('table') || qt.includes('chart') || qt.includes('data') ||
        qt.includes('evidence') || qt.includes('underlined claim') || qt.includes('underlined sentence'))
        return { domain: 'Information and Ideas', skill: 'Command of Evidence' };

    // Information and Ideas — Central Ideas and Details
    if (qt.includes('main idea') || qt.includes('main purpose') || qt.includes('best states') ||
        qt.includes('best describes') || qt.includes('central') || qt.includes('summary'))
        return { domain: 'Information and Ideas', skill: 'Central Ideas and Details' };

    // Information and Ideas — Inferences (logically completes, most logically)
    if (qt.includes('infer') || qt.includes('conclude') || qt.includes('logically completes') ||
        qt.includes('most logically') || qt.includes('imply') || qt.includes('suggest'))
        return { domain: 'Information and Ideas', skill: 'Inferences' };

    return { domain: 'Information and Ideas', skill: 'Inferences' };
}



// Build question list
const allEnglishQuestions: Question[] = (ebrwData as RawBankQuestion[]).map((q) => {
    const { domain, skill } = detectSkill(q);
    return {
        id: q.id,
        type: q.type || 'Reading',
        passage: q.passage || '',
        question: q.question || '',
        options: Array.isArray(q.options) ? q.options : [],
        answer: typeof q.answer === 'number' ? q.answer : 0,
        answerType: 'multiple_choice',
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'Medium',
        domain,
        skill,
        image: q.image,
    };
});

const allMathQuestions: Question[] = (mathData as RawBankQuestion[]).map((q) => ({
    id: q.id,
    type: q.type || 'Math',
    passage: q.passage || '',
    question: q.question || '',
    options: Array.isArray(q.options) ? q.options : [],
    answer: typeof q.answer === 'number' ? q.answer : undefined,
    answerType: q.answerType || (typeof q.answer === 'number' ? 'multiple_choice' : 'numeric'),
    answerText: q.answerText,
    acceptableAnswers: Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers : undefined,
    explanation: q.explanation || '',
    difficulty: q.difficulty || 'Medium',
    domain: q.domain || 'Math',
    skill: q.skill || 'Math',
    image: q.image,
    imageLayout: q.imageLayout,
}));

const allQuestionBankQuestions = [...allEnglishQuestions, ...allMathQuestions];


function shuffleArray<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; }

function cleanOptionText(option: string) {
    return option.replace(/\s*ID:\s*[a-f0-9]+\s*Answer\s*$/i, '').replace(/\s+/g, ' ').trim();
}

function compactText(text: string) {
    return text.replace(/\s+/g, ' ').trim();
}

function splitSentences(text: string) {
    return compactText(text)
        .split(/(?<=[.!?])\s+/)
        .map(sentence => sentence.trim())
        .filter(Boolean);
}

function normalizeExplanationSentence(sentence: string) {
    const cleaned = sentence.trim();
    if (!cleaned) return '';
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function shortenSentence(sentence: string, maxLength = 180) {
    const normalized = normalizeExplanationSentence(sentence);
    return normalized.length > maxLength ? `${normalized.slice(0, maxLength).trimEnd()}…` : normalized;
}

function isMultipleChoiceQuestion(question: Question) {
    return question.answerType === 'multiple_choice';
}

function isNumericQuestion(question: Question) {
    return question.answerType === 'numeric';
}

function cleanNumericInput(value: string) {
    return value.replace(/\u2212/g, '-').replace(/\u2013/g, '-').replace(/\u2014/g, '-').trim();
}

function normalizeAnswerToken(value: string) {
    return cleanNumericInput(value).replace(/,/g, '').replace(/\s+/g, '');
}

function parseAnswerValue(value: string) {
    const trimmed = cleanNumericInput(value).replace(/,/g, '');
    if (!trimmed) return null;

    const mixedNumber = trimmed.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedNumber) {
        const whole = Number(mixedNumber[1]);
        const numerator = Number(mixedNumber[2]);
        const denominator = Number(mixedNumber[3]);
        if (!Number.isFinite(whole) || !Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
        const sign = whole < 0 ? -1 : 1;
        return whole + sign * (numerator / denominator);
    }

    const normalized = normalizeAnswerToken(trimmed);
    if (/^-?\d+\/-?\d+$/.test(normalized)) {
        const [numerator, denominator] = normalized.split('/').map(Number);
        if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
        return numerator / denominator;
    }

    if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) {
        const numeric = Number(normalized);
        return Number.isFinite(numeric) ? numeric : null;
    }

    return null;
}

function answersMatch(question: Question, response: string) {
    const normalizedResponse = normalizeAnswerToken(response);
    if (!normalizedResponse) return false;

    const variants = (question.acceptableAnswers?.length ? question.acceptableAnswers : [question.answerText || '']).filter(Boolean);

    return variants.some((variant) => {
        const normalizedVariant = normalizeAnswerToken(variant);
        if (normalizedVariant === normalizedResponse) return true;

        const variantValue = parseAnswerValue(variant);
        const responseValue = parseAnswerValue(response);
        return variantValue !== null && responseValue !== null && Math.abs(variantValue - responseValue) < 1e-9;
    });
}

function buildExplanationDetails(question: Question) {
    const answerLetter = typeof question.answer === 'number' ? String.fromCharCode(65 + question.answer) : 'Ans';
    const answerText = isNumericQuestion(question)
        ? compactText(question.answerText || question.acceptableAnswers?.[0] || 'See explanation.')
        : cleanOptionText(question.options[question.answer ?? 0] || '') || `Choice ${answerLetter}`;
    const normalizedExplanation = compactText(question.explanation || '')
        .replace(isMultipleChoiceQuestion(question) ? new RegExp(`^Choice\\s+${answerLetter}\\s+is\\s+the\\s+best\\s+answer(?:\\s+because)?\\s*`, 'i') : /^$/, '')
        .replace(/^Choice\s+[A-D]\s+is\s+the\s+best\s+answer(?:\s+because)?\s*/i, '')
        .replace(/^Choice\s+[A-D]\s+is\s+correct\.?\s*/i, '')
        .replace(/^The best answer is choice\s+[A-D]\.?\s*/i, '')
        .replace(/^The correct answer is\s+/i, '')
        .replace(/^Choice\s+[A-D]\.?\s*/i, '')
        .replace(/^Because\s+/i, '');
    const sentences = splitSentences(normalizedExplanation);
    const summary = shortenSentence(
        sentences[0] || (isNumericQuestion(question)
            ? 'Use the relationships shown in the problem to solve for the numeric value that satisfies the conditions.'
            : `Option ${answerLetter} is the one that stays closest to the passage and the task in the question.`),
        190
    );
    const defaultSteps = isNumericQuestion(question)
        ? [
            'Translate the numbers, variables, or diagram details into an equation or relationship.',
            'Work the algebra or arithmetic carefully and simplify before entering your response.',
            'Check that your final value matches the condition shown in the problem image.'
        ]
        : [
            'Reread the key line in the passage and the exact task in the question.',
            'Eliminate choices that add claims the text never makes or that miss the author’s focus.',
            `Choose ${answerLetter} because it matches the passage most directly.`
        ];
    const steps = (sentences.slice(1, 4).length ? sentences.slice(1, 4) : defaultSteps).map(step => shortenSentence(step, 150));

    return { answerLabel: answerLetter, answerText, summary, steps };
}

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimCount({ to, dur = 1200 }: { to: number; dur?: number }) {
    const [v, setV] = useState(0);
    useEffect(() => { const s = Date.now(); const t = () => { const p = Math.min((Date.now() - s) / dur, 1); setV(Math.floor(p * to)); if (p < 1) requestAnimationFrame(t); }; t(); }, [to, dur]);
    return <>{v.toLocaleString()}</>;
}

const englishDomainOrder = [
    { name: 'Craft and Structure', skills: ['Cross-Text Connections', 'Text Structure and Purpose', 'Words in Context'] },
    { name: 'Expression of Ideas', skills: ['Rhetorical Synthesis', 'Transitions'] },
    { name: 'Information and Ideas', skills: ['Central Ideas and Details', 'Command of Evidence', 'Inferences'] },
    { name: 'Standard English Conventions', skills: ['Boundaries', 'Form, Structure, and Sense'] }
];

const mathDomainOrder = [
    { name: 'Algebra', skills: ['Linear equations in one variable', 'Linear functions', 'Linear equations in two variables', 'Systems of two linear equations in two variables', 'Linear inequalities in one or two variables'] },
    { name: 'Advanced Math', skills: ['Equivalent expressions', 'Nonlinear equations in one variable and systems of equations in two variables', 'Nonlinear functions'] },
    { name: 'Problem-Solving and Data Analysis', skills: ['Ratios, rates, proportional relationships, and units', 'Percentages', 'One-variable data: Distributions and measures of center and spread', 'Two-variable data: Models and scatterplots', 'Probability and conditional probability', 'Inference from sample statistics and margin of error', 'Evaluating statistical claims: Observational studies and experiments'] },
    { name: 'Geometry and Trigonometry', skills: ['Area and volume', 'Lines, angles, and triangles', 'Right triangles and trigonometry', 'Circles'] },
];

const FULL_MATH_IMAGE_ASPECT_RATIO = 1320 / 1020;

function MathImageSlice({
    src,
    crop,
    alt,
    className = '',
    imageClassName = '',
}: {
    src: string;
    crop: ImageCrop;
    alt: string;
    className?: string;
    imageClassName?: string;
}) {
    const aspectRatio = `${crop.width} / ${crop.height * FULL_MATH_IMAGE_ASPECT_RATIO}`;

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={`absolute max-w-none select-none ${imageClassName}`}
                style={{
                    width: `${100 / crop.width}%`,
                    left: `-${(crop.x / crop.width) * 100}%`,
                    top: `-${(crop.y / crop.height) * 100}%`,
                }}
                draggable={false}
            />
        </div>
    );
}


// ══════════════════════════════════════════════════════════════════════════════
//  BROWSE VIEW
// ══════════════════════════════════════════════════════════════════════════════
function BrowseView({ onStartQuiz, reviewedIds }: { onStartQuiz: (qs: Question[], label: string) => void; reviewedIds: Set<string> }) {
    const shouldReduceMotion = useReducedMotion();
    const [diff, setDiff] = useState<Difficulty>('All');
    const [showDiff, setShowDiff] = useState(false);
    const [shuffled, setShuffled] = useState(false);
    const [reviewOnly, setReviewOnly] = useState(false);

    const englishGroups = useMemo(() => {
        const g: Record<string, Record<string, Question[]>> = {};
        allEnglishQuestions.forEach(q => { if (!g[q.domain]) g[q.domain] = {}; if (!g[q.domain][q.skill]) g[q.domain][q.skill] = []; g[q.domain][q.skill].push(q); });
        return g;
    }, []);

    const mathGroups = useMemo(() => {
        const g: Record<string, Record<string, Question[]>> = {};
        allMathQuestions.forEach(q => { if (!g[q.domain]) g[q.domain] = {}; if (!g[q.domain][q.skill]) g[q.domain][q.skill] = []; g[q.domain][q.skill].push(q); });
        return g;
    }, []);

    const filter = useCallback((qs: Question[]) => {
        let f = qs;
        if (diff !== 'All') f = f.filter(q => q.difficulty === diff);
        if (reviewOnly) f = f.filter(q => reviewedIds.has(q.id));
        if (shuffled) f = shuffleArray(f);
        return f;
    }, [diff, reviewOnly, reviewedIds, shuffled]);

    const englishReadyCount = useMemo(() => filter(allEnglishQuestions).length, [filter]);
    const mathReadyCount = useMemo(() => filter(allMathQuestions).length, [filter]);
    const mathQuestionCount = useMemo(() => allMathQuestions.length, []);
    const reviewedCount = useMemo(() => allQuestionBankQuestions.filter(q => reviewedIds.has(q.id)).length, [reviewedIds]);
    const launch = (qs: Question[], label: string) => { const f = filter(qs); if (f.length > 0) onStartQuiz(f, label); };

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="site-atmosphere site-atmosphere--question-bank" />
            <FloatingPageShapes theme="question-bank" />

            <motion.div
                className="relative z-10 mx-auto max-w-[1320px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                <motion.section className="site-hero-shell site-hero--question-bank relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10" variants={sectionRevealVariants}>
                    <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-sky-300/8 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-44 w-44 translate-x-8 translate-y-8 rounded-full bg-rose-300/12 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <p className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]">
                                <BookOpen className="h-3.5 w-3.5" />
                                Targeted Practice
                            </p>
                            <h1 className="site-hero-title mt-4 text-3xl font-black tracking-[-0.05em] sm:text-[2.6rem]">
                                SAT Question Bank
                            </h1>
                            <p className="site-hero-body mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]">
                                Pick a section, choose a skill, and start practicing right away. Use difficulty, shuffle, and review to control what shows up.
                            </p>
                        </motion.div>

                        <motion.div className="grid gap-3 sm:grid-cols-2 xl:max-w-[360px] xl:justify-self-end" variants={staggerContainerVariants}>
                            <motion.div className="site-hero-stat rounded-[22px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Reading bank</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{allEnglishQuestions.length}</p>
                            </motion.div>
                            <motion.div className="site-hero-stat rounded-[22px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Math catalog</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{mathQuestionCount}</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.div className="site-panel relative z-40 mb-5 flex flex-wrap items-center gap-3 overflow-visible rounded-[24px] p-4" variants={sectionRevealVariants}>
                    <div className="relative">
                        <button
                            onClick={() => setShowDiff(!showDiff)}
                            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                                diff !== 'All'
                                    ? 'border-[#8e1f3d] bg-[#8e1f3d] text-white'
                                    : 'site-button-secondary'
                            }`}
                        >
                            <Filter className="h-4 w-4" />
                            {diff === 'All' ? 'All Difficulties' : diff}
                            <ChevronDown className={`h-4 w-4 transition-transform ${showDiff ? 'rotate-180' : ''}`} />
                        </button>

                        {showDiff && (
                            <div className="absolute left-0 top-full z-[90] mt-2 w-44 rounded-2xl site-panel p-2 shadow-xl" style={{ animation: 'qb-pop 0.25s ease both' }}>
                                {(['All', 'Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => { setDiff(d); setShowDiff(false); }}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[14px] font-medium transition-all ${
                                            diff === d ? 'site-subpanel font-bold site-text-strong' : 'site-button-secondary site-text'
                                        }`}
                                    >
                                        <span>{d === 'All' ? 'All Difficulties' : d}</span>
                                        {d === 'Easy' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                        {d === 'Medium' && <Zap className="h-4 w-4 text-amber-500" />}
                                        {d === 'Hard' && <Flame className="h-4 w-4 text-rose-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShuffled(!shuffled)}
                        className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                            shuffled
                                ? 'border-[#0f2744] bg-[#0f2744] text-white'
                                : 'site-button-secondary'
                        }`}
                    >
                        <Shuffle className="h-4 w-4" />
                        Shuffle
                    </button>

                    <button
                        onClick={() => setReviewOnly(!reviewOnly)}
                        className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                            reviewOnly
                                ? 'border-[#8e1f3d] bg-[#8e1f3d] text-white'
                                : 'site-button-secondary'
                        }`}
                    >
                        <Bookmark className={`h-4 w-4 ${reviewOnly ? 'fill-white text-white' : 'text-slate-500'}`} />
                        Review
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${reviewOnly ? 'bg-white/15 text-white' : 'site-chip site-text'}`}>
                            {reviewedCount}
                        </span>
                    </button>
                </motion.div>

                <motion.section className="relative z-10 grid gap-6 lg:grid-cols-2" variants={sectionRevealVariants}>
                    <motion.div className="site-panel overflow-hidden rounded-[28px]" variants={itemRevealVariants}>
                        <div className="site-qb-header--reading flex items-center justify-between gap-4 px-5 py-4">
                            <div>
                                <h2 className="text-[1.45rem] font-black tracking-[-0.03em]">Reading &amp; Writing</h2>
                                <p className="text-sm opacity-80">{englishReadyCount} questions</p>
                            </div>
                            <button
                                onClick={() => launch(allEnglishQuestions, 'All English')}
                                disabled={englishReadyCount === 0}
                                className="site-hero-secondary-btn rounded-full px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Review All Topics
                            </button>
                        </div>

                        <motion.div className="grid gap-4 p-5" variants={staggerContainerVariants}>
                            {englishDomainOrder.map((domainObj) => {
                                const domainSkills = englishGroups[domainObj.name] || {};
                                const domainQuestions = filter(Object.values(domainSkills).flat());

                                return (
                                    <motion.article
                                        key={domainObj.name}
                                        className="site-subpanel qb-topic-card rounded-[24px] p-4"
                                        variants={itemRevealVariants}
                                        whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                                        transition={{ type: 'spring', stiffness: 250, damping: 22 }}
                                    >
                                        <button
                                            onClick={() => launch(Object.values(domainSkills).flat(), domainObj.name)}
                                            disabled={domainQuestions.length === 0}
                                            className="mb-4 flex w-full items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <span className="site-text-strong text-[1.02rem] font-black tracking-[-0.02em]">
                                                {domainObj.name}
                                            </span>
                                            <span className="site-chip px-3 py-1 text-xs font-bold site-text shadow-sm rounded-full">{domainQuestions.length} questions</span>
                                        </button>

                                        <div className="space-y-2">
                                            {domainObj.skills.map((skill) => {
                                                const questions = filter(domainSkills[skill] || []);
                                                return (
                                                    <button
                                                        key={skill}
                                                        onClick={() => { if (questions.length > 0) onStartQuiz(questions, skill); }}
                                                        disabled={questions.length === 0}
                                                        className="site-subpanel-soft qb-topic-pill flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-35"
                                                    >
                                                        <span className="site-text text-[15px] font-medium">{skill}</span>
                                                        <span className="site-text-muted text-sm">{questions.length} questions</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    <motion.div className="site-panel overflow-hidden rounded-[28px]" variants={itemRevealVariants}>
                        <div className="site-qb-header--math flex items-center justify-between gap-4 px-5 py-4">
                            <div>
                                <h2 className="text-[1.45rem] font-black tracking-[-0.03em]">Math</h2>
                                <p className="text-sm opacity-80">{mathReadyCount} questions</p>
                            </div>
                            <button
                                onClick={() => launch(allMathQuestions, 'All Math')}
                                disabled={mathReadyCount === 0}
                                className="site-hero-secondary-btn rounded-full px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Review All Topics
                            </button>
                        </div>

                        <motion.div className="grid gap-4 p-5" variants={staggerContainerVariants}>
                            {mathDomainOrder.map((topic) => {
                                const domainSkills = mathGroups[topic.name] || {};
                                const domainQuestions = filter(Object.values(domainSkills).flat());

                                return (
                                <motion.article
                                    key={topic.name}
                                    className="site-subpanel qb-topic-card rounded-[24px] p-4"
                                    variants={itemRevealVariants}
                                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 250, damping: 22 }}
                                >
                                    <button
                                        onClick={() => launch(domainQuestions, topic.name)}
                                        disabled={domainQuestions.length === 0}
                                        className="mb-3 flex w-full items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <span className="site-text-strong text-[1.05rem] font-black tracking-[-0.02em]">
                                            {topic.name}
                                        </span>
                                        <span className="site-chip px-3 py-1 text-xs font-bold site-text shadow-sm rounded-full">{domainQuestions.length} questions</span>
                                    </button>

                                    <div className="space-y-2">
                                        {topic.skills.map((skill) => {
                                            const questions = filter(domainSkills[skill] || []);
                                            return (
                                                <button
                                                    key={skill}
                                                    onClick={() => launch(questions, skill)}
                                                    disabled={questions.length === 0}
                                                    className="site-subpanel-soft qb-topic-pill flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-35"
                                                >
                                                    <span className="site-text text-[15px] font-medium">{skill}</span>
                                                    <span className="site-text-muted text-sm">{questions.length} questions</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.article>
                            );})}
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.section className="mt-10 grid gap-6 lg:grid-cols-3" variants={sectionRevealVariants}>
                    <motion.article className="site-panel-soft rounded-[28px] p-6" variants={itemRevealVariants}>
                        <h3 className="site-text-strong text-xl font-black tracking-[-0.03em]">About the SAT Question Bank</h3>
                        <p className="site-text-muted mt-4 text-sm leading-7">
                            Use this page when you want quick, focused practice. Choose a section, pick a topic, and work through a short set without starting a full test.
                        </p>
                    </motion.article>

                    <motion.article className="site-panel-soft rounded-[28px] p-6" variants={itemRevealVariants}>
                        <h3 className="site-text-strong text-xl font-black tracking-[-0.03em]">Related Sources</h3>
                        <div className="mt-4 space-y-3 text-sm font-medium">
                            <a href="https://satsuitequestionbank.collegeboard.org" target="_blank" rel="noreferrer" className="block text-sky-600 hover:text-sky-700">
                                College Board SAT Suite Question Bank
                            </a>
                            <a href="https://bluebook.collegeboard.org" target="_blank" rel="noreferrer" className="block text-sky-600 hover:text-sky-700">
                                Bluebook Practice App
                            </a>
                            <a href="https://satsuite.collegeboard.org/sat/practice-preparation" target="_blank" rel="noreferrer" className="block text-sky-600 hover:text-sky-700">
                                SAT Practice and Preparation
                            </a>
                        </div>
                    </motion.article>

                    <motion.article className="site-panel-soft rounded-[28px] p-6" variants={itemRevealVariants}>
                        <h3 className="site-text-strong text-xl font-black tracking-[-0.03em]">Frequently Asked Questions</h3>
                        <div className="site-text-muted mt-4 space-y-4 text-sm leading-7">
                            <div>
                                <p className="site-text-strong font-bold">How should I use the bank?</p>
                                <p>Pick one topic, answer a short set, then move to the next weak area.</p>
                            </div>
                            <div>
                                <p className="site-text-strong font-bold">What does shuffle do?</p>
                                <p>Shuffle changes the order of the questions in the set you open.</p>
                            </div>
                            <div>
                                <p className="site-text-strong font-bold">Should I use this or full tests?</p>
                                <p>Use question bank for weak spots. Use practice tests when you want the full timed experience.</p>
                            </div>
                        </div>
                    </motion.article>
                </motion.section>
            </motion.div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  QUIZ VIEW
// ══════════════════════════════════════════════════════════════════════════════
function QuizView({
    questions,
    reviewedIds,
    onBack,
    onFinish,
    onToggleReview,
}: {
    questions: Question[];
    reviewedIds: Set<string>;
    onBack: () => void;
    onFinish: (r: SessionResult) => void;
    onToggleReview: (questionId: string, nextValue: boolean) => void;
}) {
    const [idx, setIdx] = useState(0);
    const [sel, setSel] = useState<number | null>(null);
    const [showExp, setShowExp] = useState(false);
    const [resolvedQuestions, setResolvedQuestions] = useState<Record<number, boolean>>({});
    const [incorrectAttempts, setIncorrectAttempts] = useState<Record<number, Array<number | string>>>({});
    const [numericResponses, setNumericResponses] = useState<Record<number, string>>({});
    const [showNav, setShowNav] = useState(false);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const [leftPanelWidth, setLeftPanelWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

    const [isEliminationMode, setIsEliminationMode] = useState(false);
    const [eliminatedAnswers, setEliminatedAnswers] = useState<Record<number, number[]>>({});
    const [isHighlightActive, setIsHighlightActive] = useState(false);
    const [highlights, setHighlights] = useState<Record<string, Highlight[]>>({});
    const [timeSeconds, setTimeSeconds] = useState(0);
    const [isTimerHidden, setIsTimerHidden] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isDesmosOpen, setIsDesmosOpen] = useState(false);
    const [isReferenceOpen, setIsReferenceOpen] = useState(false);
    const [calcMode, setCalcMode] = useState<'graphing' | 'scientific'>('graphing');

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => setTimeSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        const nextFlags: Record<number, boolean> = {};
        questions.forEach((question, index) => {
            if (reviewedIds.has(question.id)) nextFlags[index] = true;
        });
        setFlaggedQuestions(nextFlags);
    }, [questions, reviewedIds]);

    useEffect(() => {
        window.dispatchEvent(new Event('hide-sidebar'));
        return () => { window.dispatchEvent(new Event('show-sidebar')); };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) setLeftPanelWidth(newWidth);
        };
        const handleMouseUp = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const q = questions[idx];
    const isMathQuestion = q?.type === 'Math';
    const isChecked = !!resolvedQuestions[idx];
    const wrongAttemptsForCurrent = incorrectAttempts[idx] || [];
    const currentNumericResponse = numericResponses[idx] || '';
    const showImageOnLeft = !q?.passage && !!q?.image && !isMathQuestion;
    const showQuestionCard = true;

    useEffect(() => {
        if (!isMathQuestion) {
            setIsDesmosOpen(false);
        }
    }, [isMathQuestion]);

    const load = (i: number) => {
        setIdx(i);
        setSel(resolvedQuestions[i] && isMultipleChoiceQuestion(questions[i]) ? (questions[i]?.answer ?? null) : null);
        setShowExp(false);
        setShowNav(false);
    };

    const handleSelect = (idxOption: number) => {
        if (!isChecked) {
            if (isEliminationMode) {
                setEliminatedAnswers(prev => {
                    const current = prev[idx] || [];
                    if (current.includes(idxOption)) {
                        return { ...prev, [idx]: current.filter(x => x !== idxOption) };
                    } else {
                        return { ...prev, [idx]: [...current, idxOption] };
                    }
                });
            } else {
                if (wrongAttemptsForCurrent.includes(idxOption)) return;
                if (sel === idxOption) {
                    setSel(null);
                } else {
                    setSel(idxOption);
                }
            }
        }
    };

    const handleNumericResponseChange = (value: string) => {
        setNumericResponses(prev => ({ ...prev, [idx]: value }));
    };

    const handleCheck = () => {
        if (isChecked) return;

        if (isNumericQuestion(q)) {
            const response = cleanNumericInput(currentNumericResponse);
            if (!response) return;
            if (answersMatch(q, response)) {
                setResolvedQuestions(prev => ({ ...prev, [idx]: true }));
                setNumericResponses(prev => ({ ...prev, [idx]: response }));
                return;
            }

            setIncorrectAttempts(prev => {
                const current = prev[idx] || [];
                if (current.includes(response)) return prev;
                return { ...prev, [idx]: [...current, response] };
            });
            return;
        }

        if (sel === null) return;
        if (sel === q.answer) {
            setResolvedQuestions(prev => ({ ...prev, [idx]: true }));
            return;
        }

        setIncorrectAttempts(prev => {
            const current = prev[idx] || [];
            if (current.includes(sel)) return prev;
            return { ...prev, [idx]: [...current, sel] };
        });
        setSel(null);
    };

    const handleToggleReview = (questionIndex: number) => {
        const questionId = questions[questionIndex]?.id;
        if (!questionId) return;

        const nextValue = !flaggedQuestions[questionIndex];
        setFlaggedQuestions(prev => {
            const updated = { ...prev };
            if (nextValue) updated[questionIndex] = true;
            else delete updated[questionIndex];
            return updated;
        });
        onToggleReview(questionId, nextValue);
    };

    const next = () => {
        if (idx < questions.length - 1) { load(idx + 1); rightPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }
        else {
            let c = 0, w = 0, s = 0;
            questions.forEach((_, i) => {
                const solved = !!resolvedQuestions[i];
                const wrongs = incorrectAttempts[i] || [];
                if (solved && wrongs.length === 0) c++;
                else if (solved || wrongs.length > 0) w++;
                else s++;
            });
            onFinish({ total: questions.length, correct: c, wrong: w, skipped: s });
        }
    };
    const prev = () => { if (idx > 0) load(idx - 1); };

    if (!q) return null;

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentEliminations = eliminatedAnswers[idx] || [];
    const explanation = buildExplanationDetails(q);
    const canCheck = isNumericQuestion(q) ? !!cleanNumericInput(currentNumericResponse) && !isChecked : sel !== null && !isChecked;

    return (
        <div className="h-[100dvh] flex flex-col overflow-hidden relative bg-slate-50">
            {/* Bluebook Official Header */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3 flex items-center justify-between z-30 shrink-0 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {/* Left: Back */}
                <div className="flex flex-1 items-center">
                    <button
                        onClick={onBack}
                        className="ml-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </button>
                </div>

                {/* Center: Stopwatch Timer */}
                <div className="flex flex-col items-center justify-center flex-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[260px]">
                    {!isTimerHidden ? (
                        <div className="timer-digits font-bold text-[20px] tracking-wider text-slate-800 flex items-center justify-center gap-2 bg-slate-100/80 backdrop-blur-sm px-5 py-1.5 rounded-full border border-slate-200 shadow-inner">
                            {formatTime(timeSeconds)}
                        </div>
                    ) : (
                        <div className="font-bold text-[22px] tracking-tight flex items-center justify-center gap-2 opacity-50 mb-1">
                            <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                    )}
                    <div className="mt-0.5 flex items-center gap-2">
                        <button
                            onClick={() => setIsTimerHidden(!isTimerHidden)}
                            className="text-[11px] font-bold tracking-widest uppercase text-slate-500 hover:text-indigo-600 bg-transparent px-4 py-1.5 rounded-full transition-colors"
                        >
                            {isTimerHidden ? 'Show Timer' : 'Hide Timer'}
                        </button>
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-slate-500 hover:text-indigo-600 bg-transparent px-4 py-1.5 rounded-full transition-colors"
                        >
                            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center justify-end flex-1 gap-2">
                    {isMathQuestion ? (
                        <>
                            <button
                                onClick={() => setIsDesmosOpen(!isDesmosOpen)}
                                className={`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent ${isDesmosOpen ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}`}
                            >
                                <Calculator className="w-[24px] h-[24px]" />
                                <span className="font-bold text-[12px] leading-none">Calculator</span>
                            </button>
                            <button
                                onClick={() => setIsReferenceOpen(!isReferenceOpen)}
                                className={`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent ${isReferenceOpen ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}`}
                            >
                                <FileText className="w-[24px] h-[24px]" />
                                <span className="font-bold text-[12px] leading-none text-slate-500">Reference</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsHighlightActive(!isHighlightActive)}
                            className={`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent ${isHighlightActive ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}`}
                        >
                            <Highlighter className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Highlight</span>
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen().catch(() => { });
                            } else {
                                if (document.exitFullscreen) {
                                    document.exitFullscreen();
                                }
                            }
                        }}
                        className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                    >
                        <Maximize2 className="w-[24px] h-[24px]" />
                        <span className="font-bold text-[12px] leading-none">Fullscreen</span>
                    </button>
                </div>
            </header>

            {/* Nav overlay */}
            {showNav && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowNav(false)}>
                        <div
                            className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                            onClick={e => e.stopPropagation()}
                        >
                        <div className="border-b border-[#E5E7EB] p-6 flex justify-between items-center bg-[#F9FAFB]">
                            <div>
                                <h3 className="font-bold text-lg text-[#111827]">Question Navigator</h3>
                                <p className="text-[14px] text-slate-500 font-medium mt-1">
                                    Current Question Difficulty: <span className="font-bold text-slate-700">{questions[idx]?.difficulty}</span>
                                </p>
                            </div>
                            <button onClick={() => setShowNav(false)} className="p-2 rounded-md hover:bg-[#E5E7EB] text-[#4B5563] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {/* Legend */}
                            <div className="flex flex-wrap gap-6 mb-8 mt-2 justify-center bg-[#F3F4F6] py-3 rounded-md">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm bg-emerald-500"></div>
                                    <span className="text-sm font-semibold text-[#6B7280]">Easy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm bg-amber-500"></div>
                                    <span className="text-sm font-semibold text-[#6B7280]">Medium</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm bg-rose-500"></div>
                                    <span className="text-sm font-semibold text-[#6B7280]">Hard</span>
                                </div>
                                <div className="w-px h-5 bg-slate-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-dashed border-amber-400 rounded-sm"></div>
                                    <span className="text-sm font-semibold text-[#6B7280]">Unanswered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
                                    <span className="text-sm font-semibold text-[#4B5563]">Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bookmark className="w-4 h-4 fill-red-500 text-red-500" />
                                    <span className="text-sm font-semibold text-[#4B5563]">For Review</span>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3">
                                {questions.map((_, k) => {
                                    const isAnswered = !!resolvedQuestions[k] || (incorrectAttempts[k] || []).length > 0;
                                    const isFlagged = flaggedQuestions[k];
                                    const isActive = k === idx;

                                    let boxClass = 'border-2 cursor-pointer font-bold text-[14px] w-12 h-12 flex items-center justify-center relative transition-all rounded-md ';

                                    const d = questions[k].difficulty;
                                    // Difficulty colors for every question
                                    if (isActive) {
                                        // Active: bold colored border + light bg + inset ring
                                        if (d === 'Easy') boxClass += 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-[inset_0_0_0_2px_#10B981]';
                                        else if (d === 'Hard') boxClass += 'border-rose-500 bg-rose-50 text-rose-800 shadow-[inset_0_0_0_2px_#F43F5E]';
                                        else boxClass += 'border-amber-500 bg-amber-50 text-amber-800 shadow-[inset_0_0_0_2px_#F59E0B]';
                                    } else if (isAnswered) {
                                        // Answered: solid colored background
                                        if (d === 'Easy') boxClass += 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600';
                                        else if (d === 'Hard') boxClass += 'border-rose-500 bg-rose-500 text-white hover:bg-rose-600';
                                        else boxClass += 'border-amber-500 bg-amber-500 text-white hover:bg-amber-600';
                                    } else {
                                        // Unanswered: colored dashed border + white bg
                                        if (d === 'Easy') boxClass += 'border-dashed border-emerald-400 text-emerald-600 bg-white hover:bg-emerald-50';
                                        else if (d === 'Hard') boxClass += 'border-dashed border-rose-400 text-rose-600 bg-white hover:bg-rose-50';
                                        else boxClass += 'border-dashed border-amber-400 text-amber-600 bg-white hover:bg-amber-50';
                                    }

                                    return (
                                        <button
                                            key={k}
                                            onClick={() => load(k)}
                                            className={boxClass}
                                        >
                                            {k + 1}
                                            {isFlagged && (
                                                <div className="absolute -top-2 -right-2 bg-white rounded-full">
                                                    <Bookmark className="w-4 h-4 fill-red-500 text-red-500" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`fixed inset-0 z-[70] transition ${showExp ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <button
                    type="button"
                    aria-label="Close explanation"
                    onClick={() => setShowExp(false)}
                    className={`absolute inset-0 bg-slate-950/20 transition-opacity ${showExp ? 'opacity-100' : 'opacity-0'}`}
                />
                <aside className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-slate-200 bg-white shadow-[-24px_0_60px_rgba(15,23,42,0.12)] transition-transform duration-300 ${showExp ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Explanation</p>
                            <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-slate-950">Why this answer works</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowExp(false)}
                            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                        <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Answer</p>
                            <div className="mt-3 flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#111827] text-sm font-black text-white">
                                    {explanation.answerLabel}
                                </div>
                                <p className="text-[14px] leading-6 text-slate-700">{explanation.answerText}</p>
                            </div>
                        </div>

                        <div className="rounded-[20px] border border-sky-100 bg-sky-50/70 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700/70">Short explanation</p>
                            <p className="mt-3 text-[14px] leading-6 text-slate-700">{explanation.summary}</p>
                        </div>

                        <div className="rounded-[20px] border border-rose-100 bg-rose-50/70 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-700/70">Steps to solve</p>
                            <div className="mt-3 space-y-3">
                                {explanation.steps.map((step, stepIndex) => (
                                    <div key={stepIndex} className="flex items-start gap-3">
                                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-black text-rose-700 shadow-sm">
                                            {stepIndex + 1}
                                        </div>
                                        <p className="pt-0.5 text-[14px] leading-6 text-slate-700">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Split pane */}
            <main className="flex-1 flex overflow-hidden">
                {/* ── MATH LAYOUT: Single centered column / split with Desmos ── */}
                {isMathQuestion ? (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Desmos Calculator (left side) — slides in */}
                        <div
                            className={`overflow-hidden bg-[#FAFAFA] border-r border-slate-200 flex flex-col ${!isDragging ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''} ${isDesmosOpen ? '' : 'pointer-events-none'}`}
                            style={{ width: isDesmosOpen ? `${leftPanelWidth}%` : '0%', opacity: isDesmosOpen ? 1 : 0 }}
                        >
                            <div className="h-[46px] bg-[#F9FAFB] border-b border-[#D1D5DB] flex items-center justify-between px-4 shrink-0 relative z-20">
                                <div className="w-[140px] flex items-center gap-2 text-slate-700 font-bold text-[14px]">
                                    <Calculator className="w-4 h-4 text-indigo-500" />
                                    Desmos Calculator
                                </div>
                                <div className="flex bg-[#F3F4F6] rounded-[6px] p-[2px] border border-[#E5E7EB]">
                                    <button
                                        onClick={() => setCalcMode('graphing')}
                                        className={`px-5 py-1 text-[13px] font-bold rounded-[4px] transition-colors ${calcMode === 'graphing' ? 'bg-[#111827] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}
                                    >
                                        Graphing
                                    </button>
                                    <button
                                        onClick={() => setCalcMode('scientific')}
                                        className={`px-5 py-1 text-[13px] font-bold rounded-[4px] transition-colors ${calcMode === 'scientific' ? 'bg-[#111827] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}
                                    >
                                        Scientific
                                    </button>
                                </div>
                                <div className="w-[140px]" />
                            </div>
                            <DesmosCalculator mode={calcMode} isDragging={isDragging} />
                        </div>

                        {/* Resizable Divider — only visible when Desmos is open */}
                        {isDesmosOpen && (
                            <div onMouseDown={() => setIsDragging(true)} className="w-[3px] bg-[#E5E7EB] hover:bg-[#D1D5DB] cursor-col-resize flex flex-col items-center justify-center flex-shrink-0 transition-colors z-20 relative group">
                                <div className="h-[36px] w-[16px] bg-[#111827] rounded-[4px] flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none shadow-sm gap-[2px]">
                                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-white"></div>
                                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-white"></div>
                                </div>
                            </div>
                        )}

                        {/* Math Question + Answers (centered, moves right when Desmos opens) */}
                        <div
                            ref={rightPanelRef}
                            className={`overflow-y-auto bg-white pb-28 flex justify-center ${!isDragging ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`}
                            style={{ width: isDesmosOpen ? `${100 - leftPanelWidth}%` : '100%' }}
                        >
                            <div className="p-6 lg:p-10 w-full max-w-[800px]">

                                {/* Header bar */}
                                <div className="flex mb-6 mt-2 shadow-sm w-full">
                                    <div className="bg-[#111827] text-white font-bold text-[15px] w-[50px] flex flex-shrink-0 items-center justify-center">
                                        {idx + 1}
                                    </div>
                                    <button
                                        onClick={() => handleToggleReview(idx)}
                                        className="flex flex-1 items-center gap-2 px-4 py-2.5 bg-white border-b border-[#E5E7EB] text-[#4B5563] text-[14px] justify-start transition-colors group/mfr hover:bg-slate-50"
                                    >
                                        <Bookmark className={`w-[14px] h-[14px] transition-colors ${flaggedQuestions[idx] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                        <span className={flaggedQuestions[idx] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                                    </button>
                                    <div className="bg-[#F3F4F6] flex items-center pr-2">
                                        {isMultipleChoiceQuestion(q) && (
                                        <button
                                            onClick={() => setIsEliminationMode(!isEliminationMode)}
                                            className={`flex items-center justify-center px-3 py-1 ml-2 font-bold text-[14px] transition-colors rounded ${isEliminationMode ? 'bg-[#111827] text-white' : 'bg-transparent text-slate-700 hover:bg-slate-200'}`}
                                        >
                                            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                        </button>
                                        )}
                                    </div>
                                </div>

                                {/* Math image (diagram/graph) if present */}
                                {q.image && (
                                    <div className="mb-5 rounded-xl overflow-hidden border border-slate-100 flex justify-center bg-slate-50 p-4" style={{ animation: 'qb-slideUp 0.2s ease both' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={q.image} alt="Question image" className="max-w-full h-auto max-h-[400px] object-contain rounded-lg shadow-sm" />
                                    </div>
                                )}

                                {/* Question text */}
                                {showQuestionCard && (
                                    <div className="bg-white rounded-xl border border-slate-100 p-5 mb-5 shadow-sm" style={{ animation: 'qb-slideUp 0.3s ease both' }}>
                                        <div className="text-[16px] text-slate-900 font-semibold leading-relaxed">
                                            <HighlightableText
                                                text={q.question || ''}
                                                className="text-[16px] leading-8 text-slate-900"
                                                highlights={highlights[`q-${idx}`] || []}
                                                onAddHighlight={(h) => setHighlights(p => ({ ...p, [`q-${idx}`]: [...(p[`q-${idx}`] || []), { ...h, id: Math.random().toString(36).substr(2, 9) }] }))}
                                                onRemoveHighlight={(id) => setHighlights(p => ({ ...p, [`q-${idx}`]: (p[`q-${idx}`] || []).filter(x => x.id !== id) }))}
                                                onUpdateHighlight={(id, updates) => setHighlights(p => ({ ...p, [`q-${idx}`]: (p[`q-${idx}`] || []).map(x => x.id === id ? { ...x, ...updates } : x) }))}
                                                isHighlightModeActive={isHighlightActive}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Answer options or numeric input */}
                                {isMultipleChoiceQuestion(q) ? (
                                <div className="space-y-4 w-full relative pl-[2px] pt-[2px] mb-6">
                                    {q.options.map((opt, i) => {
                                        const isSelected = sel === i;
                                        const isEliminated = currentEliminations.includes(i);
                                        const letter = String.fromCharCode(65 + i);
                                        const isTriedWrong = wrongAttemptsForCurrent.includes(i);
                                        const isCorrectSelection = isChecked && i === q.answer;
                                        const optionText = cleanOptionText(opt);

                                        let boxClass = `relative flex-1 rounded-[10px] border px-[14px] py-[11px] min-h-[50px] flex items-center transition-all duration-200 overflow-hidden ${(isChecked || isTriedWrong) ? 'cursor-default pointer-events-none' : 'cursor-pointer'} select-text`;
                                        let circleClass = 'mr-3.5 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] text-[12px] font-bold transition-colors';
                                        const textTone = isEliminated ? 'text-slate-400' : 'text-[#111827]';

                                        if (isCorrectSelection) {
                                            boxClass += ' border-emerald-500 bg-emerald-50/60 shadow-[inset_0_0_0_1px_#10b981]';
                                            circleClass += ' border-emerald-500 bg-emerald-500 text-white';
                                        } else if (isTriedWrong) {
                                            boxClass += ' border-red-500 bg-red-50/60 shadow-[inset_0_0_0_1px_#ef4444]';
                                            circleClass += ' border-red-500 bg-red-500 text-white';
                                        } else if (isSelected) {
                                            boxClass += ' border-indigo-600 bg-indigo-50/30 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)]';
                                            circleClass += ' border-indigo-600 bg-indigo-600 text-white shadow-sm';
                                        } else {
                                            boxClass += ' border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm';
                                            circleClass += ' border-slate-400 text-slate-700';
                                        }

                                        return (
                                            <div key={i} className="flex items-center gap-4 relative w-full group" style={{ animationDelay: `${i * 0.05}s`, animation: 'qb-slideUp 0.35s ease both' }}>
                                                <div
                                                    onClick={(e) => {
                                                        if (isChecked || isTriedWrong) return;
                                                        const selectedText = window.getSelection()?.toString();
                                                        if (selectedText && selectedText.length > 0) return;

                                                        if (isEliminationMode && !isChecked) {
                                                            e.preventDefault();
                                                            handleSelect(i);
                                                        } else if (!isEliminated && !isChecked) {
                                                            handleSelect(i);
                                                        }
                                                    }}
                                                    className={boxClass}
                                                >
                                                    <div className={circleClass}>{letter}</div>
                                                    <div className={`relative z-10 flex-1 ${textTone}`}>
                                                        <HighlightableText
                                                            text={optionText || `Option ${letter}`}
                                                            className="text-[15px] leading-6 text-inherit"
                                                            highlights={highlights[`opt-${idx}-${i}`] || []}
                                                            onAddHighlight={(h) => setHighlights(p => ({ ...p, [`opt-${idx}-${i}`]: [...(p[`opt-${idx}-${i}`] || []), { ...h, id: Math.random().toString(36).substr(2, 9) }] }))}
                                                            onRemoveHighlight={(id) => setHighlights(p => ({ ...p, [`opt-${idx}-${i}`]: (p[`opt-${idx}-${i}`] || []).filter(x => x.id !== id) }))}
                                                            onUpdateHighlight={(id, updates) => setHighlights(p => ({ ...p, [`opt-${idx}-${i}`]: (p[`opt-${idx}-${i}`] || []).map(x => x.id === id ? { ...x, ...updates } : x) }))}
                                                            isHighlightModeActive={isHighlightActive}
                                                        />
                                                    </div>
                                                    {isEliminated && !isChecked && !isTriedWrong && (
                                                        <div className="pointer-events-none absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-[50%] bg-slate-500"></div>
                                                    )}
                                                </div>

                                                <div className="flex w-[50px] flex-shrink-0 items-center justify-start">
                                                    {!isChecked && !isTriedWrong && isEliminationMode && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleSelect(i);
                                                                }}
                                                                className="group/btn z-20 flex items-center justify-center transition-colors"
                                                            >
                                                                {isEliminated ? (
                                                                    <span className="font-bluebook text-[14px] font-bold text-[#111827] underline decoration-[#111827] decoration-[1.5px] underline-offset-[3px] hover:text-slate-700">Undo</span>
                                                                ) : (
                                                                    <div className="relative flex h-[28px] w-[28px] items-center justify-center rounded-full border-[1px] border-slate-900 bg-white opacity-50 transition-colors group-hover/btn:bg-slate-100 hover:opacity-100">
                                                                        <span className="text-[12px] font-bold text-slate-900">{letter}</span>
                                                                        <div className="absolute h-[1.5px] w-[38px] bg-slate-900"></div>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                ) : (
                                    <div className="mb-6 rounded-[20px] border border-slate-200 bg-slate-50/80 p-5" style={{ animation: 'qb-slideUp 0.35s ease both' }}>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Student-produced response</p>
                                        <div className="mt-3 flex flex-col gap-3">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={currentNumericResponse}
                                                onChange={(event) => handleNumericResponseChange(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' && canCheck) {
                                                        event.preventDefault();
                                                        handleCheck();
                                                    }
                                                }}
                                                disabled={isChecked}
                                                placeholder="Enter your answer"
                                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[16px] font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            />
                                            <p className="text-[13px] leading-6 text-slate-500">
                                                Enter a decimal or fraction. Equivalent values are accepted when they match the correct answer.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── ENGLISH LAYOUT: Passage left, Question right (unchanged) ── */
                    <>
                        {/* Left Panel — Passage */}
                        <div className="overflow-y-auto bg-white" style={{ width: `${leftPanelWidth}%` }}>
                            <div className="p-8 pb-24 max-w-[800px] mx-auto">
                                {q.passage ? (
                                    <div className="rounded-[20px] border border-slate-100 bg-white px-6 py-7 shadow-[0_8px_25px_rgba(15,23,42,0.04)]" style={{ animation: 'qb-slideUp 0.4s ease both' }}>
                                        <PassageRenderer
                                            text={q.passage}
                                            className="text-[16px] leading-[1.9] text-slate-700"
                                            highlights={highlights[`p-${idx}`] || []}
                                            onAddHighlight={(h) => setHighlights(p => ({ ...p, [`p-${idx}`]: [...(p[`p-${idx}`] || []), { ...h, id: Math.random().toString(36).substr(2, 9) }] }))}
                                            onRemoveHighlight={(id) => setHighlights(p => ({ ...p, [`p-${idx}`]: (p[`p-${idx}`] || []).filter(x => x.id !== id) }))}
                                            onUpdateHighlight={(id, updates) => setHighlights(p => ({ ...p, [`p-${idx}`]: (p[`p-${idx}`] || []).map(x => x.id === id ? { ...x, ...updates } : x) }))}
                                            isHighlightModeActive={isHighlightActive}
                                        />
                                    </div>
                                ) : showImageOnLeft && q.image ? (
                                    <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.04)]" style={{ animation: 'qb-slideUp 0.4s ease both' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={q.image} alt="Question image" className="max-w-full h-auto w-full rounded-lg object-contain" />
                                    </div>
                                ) : (
                                    <div className="mt-8 rounded-[20px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center text-[17px] italic text-slate-400">
                                        No passage for this question.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Draggable Divider */}
                        <div onMouseDown={() => setIsDragging(true)} className="w-[3px] bg-[#E5E7EB] hover:bg-[#D1D5DB] cursor-col-resize flex flex-col items-center justify-center flex-shrink-0 transition-colors z-20 relative group">
                            <div className="h-[36px] w-[16px] bg-[#111827] rounded-[4px] flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none shadow-sm gap-[2px]">
                                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-white"></div>
                                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-white"></div>
                            </div>
                        </div>

                        {/* Right Panel — Question + Answers */}
                        <div ref={rightPanelRef} className="overflow-y-auto bg-white pb-28" style={{ width: `${100 - leftPanelWidth}%` }}>
                            <div className="p-6 lg:p-10 max-w-[800px] mx-auto">

                                {/* Header bar */}
                                <div className="flex mb-6 mt-2 shadow-sm w-full">
                                    <div className="bg-[#111827] text-white font-bold text-[15px] w-[50px] flex flex-shrink-0 items-center justify-center">
                                        {idx + 1}
                                    </div>
                                    <button
                                        onClick={() => handleToggleReview(idx)}
                                        className="flex flex-1 items-center gap-2 px-4 py-2.5 bg-white border-b border-[#E5E7EB] text-[#4B5563] text-[14px] justify-start transition-colors group/mfr hover:bg-slate-50"
                                    >
                                        <Bookmark className={`w-[14px] h-[14px] transition-colors ${flaggedQuestions[idx] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                        <span className={flaggedQuestions[idx] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                                    </button>
                                    <div className="bg-[#F3F4F6] flex items-center pr-2">
                                        {isMultipleChoiceQuestion(q) && (
                                        <button
                                            onClick={() => setIsEliminationMode(!isEliminationMode)}
                                            className={`flex items-center justify-center px-3 py-1 ml-2 font-bold text-[14px] transition-colors rounded ${isEliminationMode ? 'bg-[#111827] text-white' : 'bg-transparent text-slate-700 hover:bg-slate-200'}`}
                                        >
                                            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                        </button>
                                        )}
                                    </div>
                                </div>

                                {q.image && !showImageOnLeft && (
                                    <div className="mb-5 rounded-xl overflow-hidden border border-slate-100 flex justify-center bg-slate-50 p-4" style={{ animation: 'qb-slideUp 0.2s ease both' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={q.image} alt="Question image" className="max-w-full h-auto max-h-[400px] object-contain rounded-lg shadow-sm" />
                                    </div>
                                )}

                                {showQuestionCard && (
                                    <div className="bg-white rounded-xl border border-slate-100 p-5 mb-5 shadow-sm" style={{ animation: 'qb-slideUp 0.3s ease both' }}>
                                        <div className="text-[18px] text-slate-900 leading-relaxed">
                                            <HighlightableText
                                                text={q.question || ''}
                                                className="text-[18px] leading-[1.8] text-slate-900"
                                                highlights={highlights[`q-${idx}`] || []}
                                                onAddHighlight={(h) => setHighlights(p => ({ ...p, [`q-${idx}`]: [...(p[`q-${idx}`] || []), { ...h, id: Math.random().toString(36).substr(2, 9) }] }))}
                                                onRemoveHighlight={(id) => setHighlights(p => ({ ...p, [`q-${idx}`]: (p[`q-${idx}`] || []).filter(x => x.id !== id) }))}
                                                onUpdateHighlight={(id, updates) => setHighlights(p => ({ ...p, [`q-${idx}`]: (p[`q-${idx}`] || []).map(x => x.id === id ? { ...x, ...updates } : x) }))}
                                                isHighlightModeActive={isHighlightActive}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isMultipleChoiceQuestion(q) ? (
                                <div className="space-y-4 w-full relative pl-[2px] pt-[2px] mb-6">
                                    {q.options.map((opt, i) => {
                                        const isSelected = sel === i;
                                        const isEliminated = currentEliminations.includes(i);
                                        const letter = String.fromCharCode(65 + i);
                                        const isTriedWrong = wrongAttemptsForCurrent.includes(i);
                                        const isCorrectSelection = isChecked && i === q.answer;
                                        const optionText = cleanOptionText(opt);

                                        let boxClass = `relative flex-1 rounded-[10px] border px-[14px] py-[11px] min-h-[50px] flex items-center transition-all duration-200 overflow-hidden ${(isChecked || isTriedWrong) ? 'cursor-default pointer-events-none' : 'cursor-pointer'} select-text`;
                                        let circleClass = 'mr-3.5 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] text-[12px] font-bold transition-colors';
                                        const textTone = isEliminated ? 'text-slate-400' : 'text-[#111827]';

                                        if (isCorrectSelection) {
                                            boxClass += ' border-emerald-500 bg-emerald-50/60 shadow-[inset_0_0_0_1px_#10b981]';
                                            circleClass += ' border-emerald-500 bg-emerald-500 text-white';
                                        } else if (isTriedWrong) {
                                            boxClass += ' border-red-500 bg-red-50/60 shadow-[inset_0_0_0_1px_#ef4444]';
                                            circleClass += ' border-red-500 bg-red-500 text-white';
                                        } else if (isSelected) {
                                            boxClass += ' border-indigo-600 bg-indigo-50/30 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)]';
                                            circleClass += ' border-indigo-600 bg-indigo-600 text-white shadow-sm';
                                        } else {
                                            boxClass += ' border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm';
                                            circleClass += ' border-slate-400 text-slate-700';
                                        }

                                        return (
                                            <div key={i} className="flex items-center gap-4 relative w-full group" style={{ animationDelay: `${i * 0.05}s`, animation: 'qb-slideUp 0.35s ease both' }}>
                                                <div
                                                    onClick={(e) => {
                                                        if (isChecked || isTriedWrong) return;
                                                        const selectedText = window.getSelection()?.toString();
                                                        if (selectedText && selectedText.length > 0) return;

                                                        if (isEliminationMode && !isChecked) {
                                                            e.preventDefault();
                                                            handleSelect(i);
                                                        } else if (!isEliminated && !isChecked) {
                                                            handleSelect(i);
                                                        }
                                                    }}
                                                    className={boxClass}
                                                >
                                                    <div className={circleClass}>{letter}</div>
                                                            <div className={`relative z-10 flex-1 ${textTone}`}>
                                                        <HighlightableText
                                                            text={optionText || `Option ${letter}`}
                                                            className="text-[17px] leading-[1.7] text-inherit"
                                                            highlights={highlights[`opt-${idx}-${i}`] || []}
                                                            onAddHighlight={(h) => setHighlights(p => ({ ...p, [`opt-${idx}-${i}`]: [...(p[`opt-${idx}-${i}`] || []), { ...h, id: Math.random().toString(36).substr(2, 9) }] }))}
                                                            onRemoveHighlight={(id) => setHighlights(p => ({ ...p, [`opt-${idx}-${i}`]: (p[`opt-${idx}-${i}`] || []).filter(x => x.id !== id) }))}
                                                            onUpdateHighlight={(id, updates) => setHighlights(p => ({ ...p, [`opt-${idx}-${i}`]: (p[`opt-${idx}-${i}`] || []).map(x => x.id === id ? { ...x, ...updates } : x) }))}
                                                            isHighlightModeActive={isHighlightActive}
                                                        />
                                                    </div>
                                                    {isEliminated && !isChecked && !isTriedWrong && (
                                                        <div className="pointer-events-none absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-[50%] bg-slate-500"></div>
                                                    )}
                                                </div>

                                                <div className="flex w-[50px] flex-shrink-0 items-center justify-start">
                                                    {!isChecked && !isTriedWrong && isEliminationMode && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleSelect(i);
                                                                }}
                                                                className="group/btn z-20 flex items-center justify-center transition-colors"
                                                            >
                                                                {isEliminated ? (
                                                                    <span className="font-bluebook text-[14px] font-bold text-[#111827] underline decoration-[#111827] decoration-[1.5px] underline-offset-[3px] hover:text-slate-700">Undo</span>
                                                                ) : (
                                                                    <div className="relative flex h-[28px] w-[28px] items-center justify-center rounded-full border-[1px] border-slate-900 bg-white opacity-50 transition-colors group-hover/btn:bg-slate-100 hover:opacity-100">
                                                                        <span className="text-[12px] font-bold text-slate-900">{letter}</span>
                                                                        <div className="absolute h-[1.5px] w-[38px] bg-slate-900"></div>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                ) : (
                                    <div className="mb-6 rounded-[20px] border border-slate-200 bg-slate-50/80 p-5" style={{ animation: 'qb-slideUp 0.35s ease both' }}>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Student-produced response</p>
                                        <div className="mt-3 flex flex-col gap-3">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={currentNumericResponse}
                                                onChange={(event) => handleNumericResponseChange(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' && canCheck) {
                                                        event.preventDefault();
                                                        handleCheck();
                                                    }
                                                }}
                                                disabled={isChecked}
                                                placeholder="Enter your answer"
                                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[16px] font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            />
                                            <p className="text-[13px] leading-6 text-slate-500">
                                                Enter a decimal or fraction. Equivalent values are accepted when they match the correct answer.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Premium Bottom Navigation Bar */}
            <footer className="bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-6 h-[72px] flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-40 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] pb-safe pt-2">
                {/* Left controls name user panel or empty spacer */}
                <div className="flex-1 max-w-[200px]"></div>

                {/* Center Question Navigator */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setShowNav(!showNav)}
                        className="flex items-center justify-center px-4 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-all hover:scale-[1.02] shadow-sm"
                    >
                        <span className="text-[15px] tracking-wide mr-2">Question {idx + 1} of {questions.length}</span>
                        <ChevronUp className="w-[18px] h-[18px]" />
                    </button>
                </div>

                {/* Right controls */}
                <div className="flex items-center justify-end flex-1 gap-4 mb-2">
                    <button
                        onClick={() => setShowExp(true)}
                        className="rounded-full border-2 border-slate-200 bg-white px-6 py-2.5 text-[15px] font-bold text-slate-700 transition-all shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:scale-[1.02]"
                    >
                        Explanation
                    </button>
                    <button
                        onClick={handleCheck}
                        disabled={!canCheck}
                        className={`px-8 py-2.5 rounded-full font-bold text-[15px] transition-all flex items-center gap-2 ${!canCheck ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70 font-medium' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:scale-[1.02]'}`}>
                        Check Answer <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                        onClick={prev}
                        disabled={idx === 0}
                        className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-2.5 rounded-full font-bold text-[15px] transition-all disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:bg-slate-50 hover:scale-[1.02]"
                    >
                        Back
                    </button>
                    <button
                        onClick={next}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-9 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
                    >
                        {idx === questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </footer>

            <ReferenceSheet isOpen={isReferenceOpen} onClose={() => setIsReferenceOpen(false)} />
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  SUMMARY VIEW
// ══════════════════════════════════════════════════════════════════════════════
function SummaryView({ result, onRestart, onBack }: { result: SessionResult; onRestart: () => void; onBack: () => void }) {
    const pct = Math.round((result.correct / result.total) * 100);
    const grade = pct >= 90 ? { l: 'Excellent!', g: 'from-emerald-400 to-teal-500', icon: Trophy } : pct >= 70 ? { l: 'Great Job!', g: 'from-blue-400 to-indigo-500', icon: Star } : pct >= 50 ? { l: 'Keep Going!', g: 'from-amber-400 to-orange-500', icon: Zap } : { l: 'Keep Practicing!', g: 'from-rose-400 to-pink-500', icon: BookOpen };
    const GradeIcon = grade.icon;

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-transparent">
            <div className="site-atmosphere site-atmosphere--question-bank" />
            <FloatingPageShapes theme="question-bank" />
            <div className="relative z-10 max-w-md w-full px-6">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 text-center" style={{ animation: 'qb-pop 0.5s ease both' }}>
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${grade.g} flex items-center justify-center mx-auto mb-5 shadow-xl`} style={{ animation: 'qb-float 4s ease-in-out infinite' }}>
                        <GradeIcon className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-lg font-black text-[#1565c0] mb-1">{grade.l}</p>
                    <h2 className="text-5xl font-black text-[#d32f2f]"><AnimCount to={pct} />%</h2>
                    <p className="text-slate-500 text-[14px] mt-1">Question Bank Session</p>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {[{ n: result.correct, l: 'Correct', c: 'emerald' }, { n: result.wrong, l: 'Wrong', c: 'red' }, { n: result.skipped, l: 'Skipped', c: 'slate' }].map((s, i) => (
                            <div key={i} className={`bg-${s.c}-50 rounded-2xl p-4 border border-${s.c}-100`} style={{ animation: `qb-slideUp 0.4s ease ${0.2 + i * 0.1}s both` }}>
                                <p className={`text-2xl font-black text-${s.c}-700`}><AnimCount to={s.n} dur={800} /></p>
                                <p className={`text-[11px] font-bold text-${s.c}-600 uppercase tracking-wider mt-0.5`}>{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-3 mt-6" style={{ animation: 'qb-slideUp 0.5s ease 0.4s both' }}>
                    <button onClick={onRestart} className="w-full bg-[#1565c0] hover:bg-[#1d4ea8] text-white py-4 rounded-xl font-bold text-[15px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2">
                        <RotateCcw className="w-5 h-5" /> Practice Again
                    </button>
                    <button onClick={onBack} className="w-full bg-white border border-slate-200 text-[#1565c0] py-3.5 rounded-xl font-bold transition-all hover:bg-slate-50 hover:shadow-sm flex items-center justify-center gap-2">
                        <Target className="w-5 h-5" /> Choose Another Topic
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function QuestionBankPage() {
    const [view, setView] = useState<View>('browse');
    const [quizQ, setQuizQ] = useState<Question[]>([]);
    const [label, setLabel] = useState('');
    const [result, setResult] = useState<SessionResult | null>(null);
    const [reviewedQuestionIds, setReviewedQuestionIds] = useState<string[]>([]);
    const router = useRouter();
    const reviewedIdSet = useMemo(() => new Set(reviewedQuestionIds), [reviewedQuestionIds]);

    useEffect(() => {
        let frameId = 0;

        try {
            const raw = window.localStorage.getItem(QB_REVIEW_STORAGE_KEY);
            if (!raw) return undefined;

            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                const nextIds = parsed.filter((item): item is string => typeof item === 'string');
                frameId = window.requestAnimationFrame(() => setReviewedQuestionIds(nextIds));
            }
        } catch {
            frameId = window.requestAnimationFrame(() => setReviewedQuestionIds([]));
        }

        return () => {
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, []);

    const toggleReviewedQuestion = useCallback((questionId: string, nextValue: boolean) => {
        setReviewedQuestionIds(prev => {
            const nextIds = nextValue
                ? Array.from(new Set([...prev, questionId]))
                : prev.filter(id => id !== questionId);

            window.localStorage.setItem(QB_REVIEW_STORAGE_KEY, JSON.stringify(nextIds));
            return nextIds;
        });
    }, []);

    const start = (qs: Question[], l: string) => {
        setQuizQ(qs); setLabel(l); setResult(null); setView('quiz');
        router.push('/question-bank?view=quiz');
    };
    const finish = (r: SessionResult) => { setResult(r); setView('summary'); router.replace('/question-bank'); };

    if (view === 'quiz') return <QuizView questions={quizQ} reviewedIds={reviewedIdSet} onBack={() => { setView('browse'); router.replace('/question-bank'); }} onFinish={finish} onToggleReview={toggleReviewedQuestion} />;
    if (view === 'summary' && result) return <SummaryView result={result} onRestart={() => start(quizQ, label)} onBack={() => { setView('browse'); router.replace('/question-bank'); }} />;
    return <BrowseView onStartQuiz={start} reviewedIds={reviewedIdSet} />;
}
