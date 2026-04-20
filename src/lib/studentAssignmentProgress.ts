export const STUDENT_ASSIGNMENT_PROGRESS_KEY = 'targetprep_student_assignment_progress';

export type StudentAssignmentOption = 'A' | 'B' | 'C' | 'D';

export type StudentAssignmentSnapshot = {
    answers: Record<string, StudentAssignmentOption>;
    currentIndex: number;
    completed: boolean;
    timeRemaining: number;
    hasStarted: boolean;
    updatedAt: string;
};

export type StudentAssignmentProgressMap = Record<string, StudentAssignmentSnapshot>;

export function readStudentAssignmentProgress(): StudentAssignmentProgressMap {
    if (typeof window === 'undefined') return {};

    try {
        const raw = window.localStorage.getItem(STUDENT_ASSIGNMENT_PROGRESS_KEY);
        if (!raw) return {};

        const parsed = JSON.parse(raw) as StudentAssignmentProgressMap;
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

export function writeStudentAssignmentProgress(progress: StudentAssignmentProgressMap) {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(STUDENT_ASSIGNMENT_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
        // Ignore write failures (private mode/quota limits).
    }
}

export function upsertStudentAssignmentSnapshot(assignmentId: string, snapshot: StudentAssignmentSnapshot) {
    const current = readStudentAssignmentProgress();
    writeStudentAssignmentProgress({
        ...current,
        [assignmentId]: snapshot,
    });
}
