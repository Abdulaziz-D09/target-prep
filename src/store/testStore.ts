'use client';
import { create } from 'zustand';

interface TestState {
    // Test progress
    currentTestId: number | null;
    currentSectionIndex: number;
    currentModuleIndex: number;
    currentQuestionIndex: number;
    userAnswers: Record<string, number>;
    flaggedQuestions: Record<string, boolean>;
    eliminatedAnswers: Record<string, number[]>; // Array of eliminated option indices
    timeRemaining: number;
    isIntroScreen: boolean;
    isTestActive: boolean;
    showResults: boolean;
    highlights: Record<string, Highlight[]>; // Array of highlights per question key
    // Progress tracking (persisted via localStorage)
    completedTests: CompletedTest[];
    streak: number;
    totalQuestionsAnswered: number;
}

export interface CompletedTest {
    testId: number;
    testTitle: string;
    date: string;
    englishScore: number;
    mathScore: number;
    totalScore: number;
    totalCorrect: number;
    totalQuestions: number;
    answers: Record<string, number>;
    eliminated: Record<string, number[]>;
}

export interface Highlight {
    id: string;
    start: number;
    end: number;
    color: string;
    isUnderline?: boolean;
    note?: string;
    text: string;
}

interface TestActions {
    startTest: (testId: number) => void;
    beginTimer: () => void;
    selectAnswer: (questionKey: string, answerIndex: number) => void;
    toggleFlag: (questionKey: string) => void;
    toggleElimination: (questionKey: string, answerIndex: number) => void;
    addHighlight: (questionKey: string, highlight: Highlight) => void;
    removeHighlight: (questionKey: string, highlightId: string) => void;
    updateHighlight: (questionKey: string, highlightId: string, updates: Partial<Highlight>) => void;
    nextQuestion: () => { action: 'next' | 'moduleEnd' | 'sectionEnd' | 'testEnd' };
    prevQuestion: () => void;
    setTimeRemaining: (time: number) => void;
    goToModule: (sectionIndex: number, moduleIndex: number) => void;
    endTest: (results: CompletedTest) => void;
    resetTest: () => void;
}

type TestStore = TestState & TestActions;

const PROGRESS_STORAGE_KEY = 'targetprep_progress';

function loadProgress(): Partial<TestState> {
    if (typeof window === 'undefined') return {};
    try {
        const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            return {
                completedTests: parsed.completedTests || [],
                streak: parsed.streak || 0,
                // Backward-compat: older snapshots used `totalQuestions`.
                totalQuestionsAnswered: parsed.totalQuestionsAnswered ?? parsed.totalQuestions ?? 0,
            };
        }
    } catch { }
    return {};
}

function saveProgress(state: Partial<TestState>) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
            completedTests: state.completedTests,
            streak: state.streak,
            totalQuestionsAnswered: state.totalQuestionsAnswered,
        }));
    } catch { }
}

const initialProgress = loadProgress();

export const useTestStore = create<TestStore>((set, get) => ({
    currentTestId: null,
    currentSectionIndex: 0,
    currentModuleIndex: 0,
    currentQuestionIndex: 0,
    userAnswers: {},
    flaggedQuestions: {},
    eliminatedAnswers: {},
    timeRemaining: 0,
    isIntroScreen: false,
    isTestActive: false,
    showResults: false,
    highlights: {},
    completedTests: initialProgress.completedTests ?? [],
    streak: initialProgress.streak ?? 0,
    totalQuestionsAnswered: initialProgress.totalQuestionsAnswered ?? 0,

    startTest: (testId) => set({
        currentTestId: testId, currentSectionIndex: 0, currentModuleIndex: 0,
        currentQuestionIndex: 0, userAnswers: {}, flaggedQuestions: {}, eliminatedAnswers: {},
        highlights: {}, isIntroScreen: true, isTestActive: false, showResults: false,
    }),

    beginTimer: () => set({ isIntroScreen: false, isTestActive: true }),

    selectAnswer: (questionKey, answerIndex) => set(s => ({
        userAnswers: { ...s.userAnswers, [questionKey]: answerIndex },
    })),

    toggleFlag: (questionKey) => set(s => ({
        flaggedQuestions: { ...s.flaggedQuestions, [questionKey]: !s.flaggedQuestions[questionKey] }
    })),

    toggleElimination: (questionKey, answerIndex) => set(s => {
        const currentEliminated = s.eliminatedAnswers[questionKey] || [];
        const isEliminated = currentEliminated.includes(answerIndex);
        const newEliminated = isEliminated
            ? currentEliminated.filter(i => i !== answerIndex)
            : [...currentEliminated, answerIndex];

        // If they eliminate an answer they currently have selected, unselect it
        let newUserAnswers = { ...s.userAnswers };
        if (!isEliminated && s.userAnswers[questionKey] === answerIndex) {
            delete newUserAnswers[questionKey];
        }

        return {
            eliminatedAnswers: { ...s.eliminatedAnswers, [questionKey]: newEliminated },
            userAnswers: newUserAnswers
        };
    }),

    addHighlight: (questionKey, highlight) => set(s => {
        const current = s.highlights[questionKey] || [];
        return { highlights: { ...s.highlights, [questionKey]: [...current, highlight] } };
    }),

    removeHighlight: (questionKey, highlightId) => set(s => {
        const current = s.highlights[questionKey] || [];
        return { highlights: { ...s.highlights, [questionKey]: current.filter(h => h.id !== highlightId) } };
    }),

    updateHighlight: (questionKey, highlightId, updates) => set(s => {
        const current = s.highlights[questionKey] || [];
        return {
            highlights: {
                ...s.highlights,
                [questionKey]: current.map(h => h.id === highlightId ? { ...h, ...updates } : h)
            }
        };
    }),

    nextQuestion: () => {
        set(s => ({ currentQuestionIndex: s.currentQuestionIndex + 1 }));
        return { action: 'next' as const };
    },

    prevQuestion: () => set(s => {
        if (s.currentQuestionIndex > 0) return { currentQuestionIndex: s.currentQuestionIndex - 1 };
        return {};
    }),

    setTimeRemaining: (time) => set({ timeRemaining: time }),

    goToModule: (sectionIndex, moduleIndex) => set({
        currentSectionIndex: sectionIndex, currentModuleIndex: moduleIndex, currentQuestionIndex: 0,
    }),

    endTest: (results) => {
        const s = get();
        const updated = [...s.completedTests, results];
        const newState = {
            completedTests: updated,
            streak: s.streak + 1,
            totalQuestionsAnswered: s.totalQuestionsAnswered + results.totalQuestions,
            eliminatedAnswers: {}, // Reset elims on finish
            isTestActive: false,
            showResults: true,
        };
        set(newState);
        saveProgress(newState);
    },

    resetTest: () => set({
        currentTestId: null, currentSectionIndex: 0, currentModuleIndex: 0,
        currentQuestionIndex: 0, userAnswers: {}, flaggedQuestions: {}, eliminatedAnswers: {},
        highlights: {}, timeRemaining: 0, isIntroScreen: false, isTestActive: false, showResults: false,
    }),
}));
