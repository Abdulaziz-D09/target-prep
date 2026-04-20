import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Classroom = {
  id: string;
  name: string;
  grade: string;
  joinCode: string;
  createdAt: string;
};

export type Student = {
  id: string;
  name: string;
  classroomId: string;
  joinedAt: string;
  avatar: string; // initials color key: 'blue' | 'indigo' | 'rose' | 'emerald' | 'amber'
};

export type QuestionOption = { A: string; B: string; C: string; D: string };

export type Question = {
  id: string;
  stem: string;
  options: QuestionOption;
  answer: 'A' | 'B' | 'C' | 'D';
  passage?: string;
};

export type Assignment = {
  id: string;
  title: string;
  subject: 'English' | 'Math';
  classroomIds: string[];
  questions: Question[];
  timeLimitMinutes: number;
  createdAt: string;
};

export type StudentProgress = {
  studentId: string;
  assignmentId: string;
  answered: number;
  correct: number;
  total: number;
  completed: boolean;
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: 'cls-1',
    name: 'SAT March–May 2026',
    grade: '11th Grade',
    joinCode: 'SAT001',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cls-2',
    name: 'Math Bootcamp',
    grade: '10th Grade',
    joinCode: 'MATH2A',
    createdAt: '2026-02-01T00:00:00Z',
  },
];

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alex Kim', classroomId: 'cls-1', joinedAt: '2026-01-16T00:00:00Z', avatar: 'blue' },
  { id: 's2', name: 'Sara Chen', classroomId: 'cls-1', joinedAt: '2026-01-17T00:00:00Z', avatar: 'rose' },
  { id: 's3', name: 'James Park', classroomId: 'cls-1', joinedAt: '2026-01-18T00:00:00Z', avatar: 'emerald' },
  { id: 's4', name: 'Mia Torres', classroomId: 'cls-1', joinedAt: '2026-01-20T00:00:00Z', avatar: 'amber' },
  { id: 's5', name: 'Noah Wang', classroomId: 'cls-1', joinedAt: '2026-01-22T00:00:00Z', avatar: 'indigo' },
  { id: 's6', name: 'Lily Patel', classroomId: 'cls-2', joinedAt: '2026-02-02T00:00:00Z', avatar: 'rose' },
  { id: 's7', name: 'Ethan Brooks', classroomId: 'cls-2', joinedAt: '2026-02-03T00:00:00Z', avatar: 'blue' },
  { id: 's8', name: 'Zara Johnson', classroomId: 'cls-2', joinedAt: '2026-02-04T00:00:00Z', avatar: 'emerald' },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn-1',
    title: 'Classwork Feb 18',
    subject: 'English',
    classroomIds: ['cls-1'],
    questions: [],
    timeLimitMinutes: 45,
    createdAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'asgn-2',
    title: 'Algebra Fundamentals',
    subject: 'Math',
    classroomIds: ['cls-2'],
    questions: [],
    timeLimitMinutes: 35,
    createdAt: '2026-02-20T00:00:00Z',
  },
];

const MOCK_PROGRESS: StudentProgress[] = [
  { studentId: 's1', assignmentId: 'asgn-1', answered: 10, correct: 8, total: 10, completed: true },
  { studentId: 's2', assignmentId: 'asgn-1', answered: 7, correct: 5, total: 10, completed: false },
  { studentId: 's3', assignmentId: 'asgn-1', answered: 10, correct: 9, total: 10, completed: true },
  { studentId: 's4', assignmentId: 'asgn-1', answered: 3, correct: 2, total: 10, completed: false },
  { studentId: 's5', assignmentId: 'asgn-1', answered: 0, correct: 0, total: 10, completed: false },
  { studentId: 's6', assignmentId: 'asgn-2', answered: 8, correct: 7, total: 8, completed: true },
  { studentId: 's7', assignmentId: 'asgn-2', answered: 8, correct: 6, total: 8, completed: true },
  { studentId: 's8', assignmentId: 'asgn-2', answered: 4, correct: 3, total: 8, completed: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ─── Store ────────────────────────────────────────────────────────────────────

type State = {
  classrooms: Classroom[];
  students: Student[];
  assignments: Assignment[];
  progress: StudentProgress[];
  seeded: boolean;
};

type Actions = {
  seed: () => void;
  addClassroom: (name: string, grade: string) => Classroom;
  deleteClassroom: (id: string) => void;
  addAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (id: string) => void;
};

function normalizeAssignmentTimeLimit(assignment: Assignment): Assignment {
  const fallback = assignment.questions.length > 0 ? Math.max(20, Math.ceil(assignment.questions.length * 1.5)) : 45;
  return {
    ...assignment,
    timeLimitMinutes: Math.max(5, Number(assignment.timeLimitMinutes) || fallback),
  };
}

export const useClassroomStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      classrooms: [],
      students: [],
      assignments: [],
      progress: [],
      seeded: false,

      seed: () => {
        const current = get();

        if (current.seeded) {
          const normalized = current.assignments.map(normalizeAssignmentTimeLimit);
          const needsPatch = normalized.some((assignment, idx) => assignment.timeLimitMinutes !== current.assignments[idx].timeLimitMinutes);
          if (needsPatch) set({ assignments: normalized });
          return;
        }

        set({
          classrooms: MOCK_CLASSROOMS,
          students: MOCK_STUDENTS,
          assignments: MOCK_ASSIGNMENTS.map(normalizeAssignmentTimeLimit),
          progress: MOCK_PROGRESS,
          seeded: true,
        });
      },

      addClassroom: (name, grade) => {
        const cls: Classroom = {
          id: `cls-${Date.now()}`,
          name,
          grade,
          joinCode: randomCode(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ classrooms: [...s.classrooms, cls] }));
        return cls;
      },

      deleteClassroom: (id) => {
        set((s) => ({
          classrooms: s.classrooms.filter((c) => c.id !== id),
          students: s.students.filter((st) => st.classroomId !== id),
        }));
      },

      addAssignment: (data) => {
        const asgn = normalizeAssignmentTimeLimit({
          ...data,
          id: `asgn-${Date.now()}`,
          createdAt: new Date().toISOString(),
        });
        set((s) => ({ assignments: [...s.assignments, asgn] }));
      },

      deleteAssignment: (id) => {
        set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) }));
      },
    }),
    {
      name: 'targetprep-classrooms',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
