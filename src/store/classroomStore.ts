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
  school?: string;
  gradeLevel?: string;
  plannedExamDate?: string;
  scorePredictor?: string;
  history?: { date: string; accuracy: number }[];
  mockSessionId?: string;
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
  subject: 'English' | 'Math' | 'Both';
  classroomIds: string[];
  questions: Question[];
  timeLimitMinutes: number;
  allowExit?: boolean;
  createdAt: string;
};


export type MockSession = {
  id: string;
  title: string;
  place: string;
  date: string;
  timeLimitMinutes: number;
  maxStudents: number;
  attachedTestIds: string[];
  joinCode: string;
  createdAt: string;
  status: 'upcoming' | 'active' | 'completed';
  strictMode?: boolean;
  host?: string;
  customTests?: { id: string; name: string; questions: any[] }[];
  subject?: 'Full' | 'English' | 'Math';
  distributionMode?: 'random' | 'manual';
  studentAssignments?: Record<string, string>;
  joinLocked?: boolean;
  joinDeadline?: string;
};

export type MockResult = {
  id: string;
  mockId: string;
  studentId: string;
  assignedTestId: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  completedAt: string;
  englishScore?: number;
  mathScore?: number;
  timeSpent?: number; // in seconds
  answers?: Record<string, number>;
  kickedOut?: boolean;
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
  { id: 's1', name: 'Alex Kim', classroomId: 'cls-1', joinedAt: '2026-01-16T00:00:00Z', avatar: 'blue', plannedExamDate: 'June 6', scorePredictor: '1480-1520', history: [{date: 'W1', accuracy: 60}, {date: 'W2', accuracy: 68}, {date: 'W3', accuracy: 75}, {date: 'W4', accuracy: 80}] },
  { id: 's2', name: 'Sara Chen', classroomId: 'cls-1', joinedAt: '2026-01-17T00:00:00Z', avatar: 'rose', plannedExamDate: 'June 6', scorePredictor: '1350-1410', history: [{date: 'W1', accuracy: 50}, {date: 'W2', accuracy: 55}, {date: 'W3', accuracy: 62}, {date: 'W4', accuracy: 65}] },
  { id: 's3', name: 'James Park', classroomId: 'cls-1', joinedAt: '2026-01-18T00:00:00Z', avatar: 'emerald', plannedExamDate: 'Aug 24', scorePredictor: '1550-1600', history: [{date: 'W1', accuracy: 80}, {date: 'W2', accuracy: 85}, {date: 'W3', accuracy: 88}, {date: 'W4', accuracy: 92}] },
  { id: 's4', name: 'Mia Torres', classroomId: 'cls-1', joinedAt: '2026-01-20T00:00:00Z', avatar: 'amber', plannedExamDate: 'June 6', scorePredictor: '--', history: [{date: 'W1', accuracy: 40}, {date: 'W2', accuracy: 42}, {date: 'W3', accuracy: 45}, {date: 'W4', accuracy: 45}] },
  { id: 's5', name: 'Noah Wang', classroomId: 'cls-1', joinedAt: '2026-01-22T00:00:00Z', avatar: 'indigo', plannedExamDate: 'Aug 24', scorePredictor: '1400-1460', history: [{date: 'W1', accuracy: 70}, {date: 'W2', accuracy: 70}, {date: 'W3', accuracy: 72}, {date: 'W4', accuracy: 75}] },
  { id: 's6', name: 'Lily Patel', classroomId: 'cls-2', joinedAt: '2026-02-02T00:00:00Z', avatar: 'rose', plannedExamDate: 'Nov 2', scorePredictor: '1280-1340', history: [{date: 'W1', accuracy: 55}, {date: 'W2', accuracy: 60}, {date: 'W3', accuracy: 65}, {date: 'W4', accuracy: 70}] },
  { id: 's7', name: 'Ethan Brooks', classroomId: 'cls-2', joinedAt: '2026-02-03T00:00:00Z', avatar: 'blue', plannedExamDate: 'Nov 2', scorePredictor: '1380-1440', history: [{date: 'W1', accuracy: 65}, {date: 'W2', accuracy: 70}, {date: 'W3', accuracy: 75}, {date: 'W4', accuracy: 78}] },
  { id: 's8', name: 'Zara Johnson', classroomId: 'cls-2', joinedAt: '2026-02-04T00:00:00Z', avatar: 'emerald', plannedExamDate: 'Nov 2', scorePredictor: '1500-1550', history: [{date: 'W1', accuracy: 82}, {date: 'W2', accuracy: 85}, {date: 'W3', accuracy: 89}, {date: 'W4', accuracy: 91}] },
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
  mockSessions: MockSession[];
  mockResults: MockResult[];
  joinedClassroomIds: string[];
  seeded: boolean;
};

type Actions = {
  seed: () => void;
  addClassroom: (name: string, grade: string) => Classroom;
  deleteClassroom: (id: string) => void;
  addAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (id: string) => void;
  joinClassroom: (code: string) => boolean;
  leaveClassroom: (id: string) => void;
  
  createMockSession: (data: Omit<MockSession, 'id' | 'joinCode' | 'createdAt' | 'status'>) => MockSession;
  updateMockSession: (id: string, updates: Partial<MockSession>) => void;
  updateMockSessionStatus: (id: string, status: MockSession['status']) => void;
  deleteMockSession: (id: string) => void;
  assignTestToStudent: (mockId: string, studentId: string, testId: string) => void;
  removeStudent: (studentId: string) => void;
  registerForMock: (mockId: string, studentInfo: { name: string; school: string; grade: string }) => { success: boolean; error?: string; session?: MockSession; student?: Student };
  joinMock: (code: string, studentId: string) => { success: boolean; error?: string; session?: MockSession; assignedTestId?: string };
  submitMockResult: (result: Omit<MockResult, 'id' | 'completedAt'>) => void;
  deleteMockResult: (id: string) => void;
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
      mockSessions: [],
      mockResults: [],
      joinedClassroomIds: [],
      seeded: false,

      seed: () => {
        const current = get();

        // Clear old mock data if it persists in local storage
        if (current.classrooms.some(c => c.id === 'cls-1' || c.id === 'cls-2')) {
            set({ classrooms: [], students: [], assignments: [], progress: [], seeded: true });
            return;
        }

        if (current.seeded) {
          const normalized = current.assignments.map(normalizeAssignmentTimeLimit);
          const needsPatch = normalized.some((assignment, idx) => assignment.timeLimitMinutes !== current.assignments[idx].timeLimitMinutes);
          if (needsPatch) set({ assignments: normalized });
          return;
        }

        set({
          classrooms: [],
          students: [],
          assignments: [],
          progress: [],
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

      joinClassroom: (code) => {
        const s = get();
        const cls = s.classrooms.find(c => c.joinCode === code.trim().toUpperCase());
        if (!cls) return false;
        if (s.joinedClassroomIds.includes(cls.id)) return true; // Already joined
        const newStudent: Student = {
            id: `stu-${Date.now()}`,
            name: "You (Student)",
            classroomId: cls.id,
            joinedAt: new Date().toISOString(),
            avatar: "blue",
        };
        set((s) => ({ 
            joinedClassroomIds: [...s.joinedClassroomIds, cls.id],
            students: [...s.students, newStudent]
        }));
        return true;
      },


      createMockSession: (data) => {
        const newSession: MockSession = {
          ...data,
          id: 'mock-' + Date.now(),
          joinCode: randomCode(),
          createdAt: new Date().toISOString(),
          status: 'upcoming'
        };
        set((state) => ({ mockSessions: [...state.mockSessions, newSession] }));
        return newSession;
      },
      updateMockSession: (id, updates) => set((state) => ({
        mockSessions: state.mockSessions.map((s) => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),
      updateMockSessionStatus: (id, status) => set((state) => ({
        mockSessions: state.mockSessions.map(s => s.id === id ? { ...s, status } : s)
      })),
      assignTestToStudent: (mockId, studentId, testId) => set((state) => ({
        mockSessions: state.mockSessions.map(s => {
            if (s.id === mockId) {
                const assignments = s.studentAssignments || {};
                return { ...s, studentAssignments: { ...assignments, [studentId]: testId } };
            }
            return s;
        })
      })),
      removeStudent: (studentId) => set((state) => ({
          students: state.students.filter(s => s.id !== studentId)
      })),
      registerForMock: (mockId, studentInfo) => {
        let result: any = { success: false };
        set((state) => {
            const session = state.mockSessions.find(s => s.id === mockId);
            if (!session) { result = { success: false, error: 'Session not found' }; return state; }
            if (session.status === 'completed') { result = { success: false, error: 'Session has already ended' }; return state; }
            if (session.joinLocked) { result = { success: false, error: 'Registration for this session is locked by the instructor.' }; return state; }
            
            let student = state.students.find(s => s.name === studentInfo.name && s.school === studentInfo.school);
            if (!student) {
                student = {
                    id: 'stu-' + Date.now(),
                    name: studentInfo.name,
                    school: studentInfo.school,
                    gradeLevel: studentInfo.grade,
                    classroomId: '', 
                    joinedAt: new Date().toISOString(),
                    avatar: 'blue',
                    mockSessionId: session.id
                };
                result = { success: true, session, student };
                return { students: [...state.students, student] };
            }
            const updatedStudents = state.students.map(s => 
                s.id === student.id ? { ...s, mockSessionId: session.id } : s
            );
            const returnedStudent = { ...student, mockSessionId: session.id };
            result = { success: true, session, student: returnedStudent };

            return { students: updatedStudents };
        });
        return result;
      },
      joinMock: (code, studentId) => {
        let result: any = { success: false };
        set((state) => {
            const session = state.mockSessions.find(s => s.joinCode === code);
            if (!session) { result = { success: false, error: 'Invalid join code' }; return state; }
            if (session.status !== 'active') { result = { success: false, error: 'Session is not active yet. Please wait for the teacher to start it.' }; return state; }
            if (session.joinLocked) { result = { success: false, error: 'Joining for this session has been locked by the teacher.' }; return state; }
            if (session.joinDeadline && new Date() > new Date(session.joinDeadline)) { result = { success: false, error: 'The joining deadline for this session has passed.' }; return state; }
            
            const student = state.students.find(s => s.id === studentId);
            if (!student || student.mockSessionId !== session.id) {
                result = { success: false, error: 'Not registered for this session' }; 
                return state; 
            }

            result = { success: true, session };

            if (session.studentAssignments && session.studentAssignments[student.id]) {
                result.assignedTestId = session.studentAssignments[student.id];
            } else if (session.customTests && session.customTests.length > 0) {
                result.assignedTestId = session.customTests[Math.floor(Math.random() * session.customTests.length)].id;
            } else if (session.attachedTestIds && session.attachedTestIds.length > 0) {
                result.assignedTestId = session.attachedTestIds[Math.floor(Math.random() * session.attachedTestIds.length)];
            } else {
                result.assignedTestId = '1';
            }

            return state;
        });
        return result;
      },
      submitMockResult: (result) => set((state) => {
        const newResult: MockResult = {
          ...result,
          id: 'res-' + Date.now(),
          completedAt: new Date().toISOString()
        };
        return { mockResults: [...state.mockResults, newResult] };
      }),
      deleteMockSession: (id) => set((state) => ({
        mockSessions: state.mockSessions.filter(s => s.id !== id),
        mockResults: state.mockResults.filter(r => r.mockId !== id)
      })),
      deleteMockResult: (id) => set((state) => ({
        mockResults: state.mockResults.filter(r => r.id !== id)
      })),
      leaveClassroom: (id) => {
        set((s) => ({ joinedClassroomIds: s.joinedClassroomIds.filter((cId) => cId !== id) }));
      },
    }),
    {
      name: 'targetprep-classrooms',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        } as unknown as Storage;
      }),
    }
  )
);

/**
 * Call this at the module level (outside React) to eagerly seed data before
 * the first render, preventing blank-page flashes caused by async useEffect.
 */
export function seedOnce() {
  if (typeof window !== 'undefined') {
    useClassroomStore.getState().seed();
  }
}
