import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import { createSupabaseStorage } from '@/lib/supabaseStorage';
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
  user_id?: string;
};

export type QuestionOption = { A: string; B: string; C: string; D: string };

export type Question = {
  id: string;
  stem: string;
  options: QuestionOption;
  answer: 'A' | 'B' | 'C' | 'D';
  passage?: string;
  imageUrl?: string;
  imagePosition?: 'before-stem' | 'after-stem';
};

export type Assignment = {
  id: string;
  title: string;
  subject: 'English' | 'Math' | 'Both';
  classroomIds: string[];
  customTests: { id: string; name: string; questions: Question[] }[];
  timeLimitMinutes: number;
  dueDate?: string;
  allowExit?: boolean;
  strictToleranceSeconds?: number;
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
  customQuestions?: Record<string, any>;
  joinCode: string;
  strictToleranceSeconds?: number;
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
  answers?: Record<string, number | string>;
  kickedOut?: boolean;
};

export type StudentProgress = {
  studentId: string;
  assignmentId: string;
  answered: number;
  correct: number;
  total: number;
  completed: boolean;
  testProgress?: Record<string, { answered: number; correct: number; completed: boolean }>;
};

export type QuestionHistoryEntry = {
  id: string;
  studentId: string;
  assignmentId: string;
  questionId: string;
  chosenOption: string;
  isCorrect: boolean;
  answeredAt: string;
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
    customTests: [],
    timeLimitMinutes: 45,
    createdAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'asgn-2',
    title: 'Algebra Fundamentals',
    subject: 'Math',
    classroomIds: ['cls-2'],
    customTests: [],
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
  questionHistory: QuestionHistoryEntry[];
  mockSessions: MockSession[];
  mockResults: MockResult[];
  joinedClassroomIds: string[];
  seeded: boolean;
  lastSyncedAt: number;
};

type Actions = {
  seed: () => void;
  addClassroom: (name: string, grade: string) => Classroom;
  deleteClassroom: (id: string) => void;
  addAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  updateAssignmentQuestion: (assignmentId: string, questionId: string, newQuestion: any) => void;
  updateMockQuestion: (mockId: string, testId: string, questionId: string, newQuestion: any) => void;
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
  syncWithSupabase: () => Promise<void>;
  submitAssignmentProgress: (studentId: string, assignmentId: string, answered: number, correct: number, total: number, completed: boolean, testProgress?: Record<string, { answered: number; correct: number; completed: boolean }>) => void;
  logQuestionAnswer: (studentId: string, assignmentId: string, questionId: string, chosenOption: string, isCorrect: boolean) => void;
};

function normalizeAssignmentTimeLimit(assignment: Assignment): Assignment {
  const totalQuestions = assignment.customTests?.reduce((acc, test) => acc + (test.questions?.length || 0), 0) || 0;
  const fallback = totalQuestions > 0 ? Math.max(20, Math.ceil(totalQuestions * 1.5)) : 45;
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
      questionHistory: [],
      mockSessions: [],
      mockResults: [],
      joinedClassroomIds: [],
      seeded: false,
      lastSyncedAt: 0,

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

        // Only clear if we actually have no classes (protect against accidental wiping when seeded is false due to version mismatch)
        if (current.classrooms.length === 0) {
            set({
              classrooms: [],
              students: [],
              assignments: [],
              progress: [],
              questionHistory: [],
              seeded: true,
            });
        } else {
            set({ seeded: true });
        }
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

        createClient().auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            createClient().from('classrooms').insert({
              id: cls.id,
              name: cls.name,
              grade: cls.grade,
              join_code: cls.joinCode,
              teacher_id: session.user.id
            }).then(({ error }) => {
              if (error) console.error('Error syncing addClassroom:', error);
            });
          }
        });

        return cls;
      },

      deleteClassroom: (id) => {
        set((s) => ({
          classrooms: s.classrooms.filter((c) => c.id !== id),
          students: s.students.filter((st) => st.classroomId !== id),
        }));

        createClient().from('classrooms').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Error syncing deleteClassroom:', error);
        });
      },

      addAssignment: (data) => {
        const asgn = normalizeAssignmentTimeLimit({
          ...data,
          id: `asgn-${Date.now()}`,
          createdAt: new Date().toISOString(),
        });
        set((s) => ({ assignments: [...s.assignments, asgn] }));

        createClient().from('assignments').insert({
          id: asgn.id,
          title: asgn.title,
          subject: asgn.subject,
          classroom_ids: asgn.classroomIds,
          questions: asgn.customTests as any, // Store customTests in the existing questions jsonb column
          time_limit_minutes: asgn.timeLimitMinutes,
          allow_exit: asgn.allowExit
        }).then(({ error }) => {
          if (error) console.error('Error syncing addAssignment:', error);
        });
      },

      updateAssignment: (id, updates) => {
        set(state => ({
          assignments: state.assignments.map(a => a.id === id ? { ...a, ...updates } : a)
        }));

        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.subject !== undefined) dbUpdates.subject = updates.subject;
        // Since we are using questions column to store customTests
        if (updates.customTests !== undefined) dbUpdates.questions = updates.customTests;
        else if (updates.questions !== undefined) dbUpdates.questions = updates.questions;
        
        if (updates.timeLimitMinutes !== undefined) dbUpdates.time_limit_minutes = updates.timeLimitMinutes;
        if (updates.allowExit !== undefined) dbUpdates.allow_exit = updates.allowExit;
        
        if (Object.keys(dbUpdates).length > 0) {
          createClient().from('assignments').update(dbUpdates).eq('id', id).then(({ error }) => {
            if (error) console.error('Error syncing updateAssignment:', error);
          });
        }
      },

      deleteAssignment: (id) => {
        set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) }));

        createClient().from('assignments').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Error syncing deleteAssignment:', error);
        });
      },

      updateAssignmentQuestion: async (assignmentId, questionId, newQuestion) => {
        const { assignments } = get();
        const asgnIndex = assignments.findIndex(a => a.id === assignmentId);
        if (asgnIndex === -1) return;
        const newAsgns = [...assignments];
        const asgn = { ...newAsgns[asgnIndex] };
        const qIndex = asgn.questions.findIndex((q: any) => q.id === questionId);
        if (qIndex !== -1) {
          asgn.questions = [...asgn.questions];
          asgn.questions[qIndex] = newQuestion;
        } else {
          asgn.questions = [...asgn.questions, newQuestion];
        }
        newAsgns[asgnIndex] = asgn;
        set({ assignments: newAsgns });
        // Sync to supabase
        if (typeof window !== 'undefined') {
          const { supabase } = await import('@/lib/supabase/client');
          const { data: dbClassrooms } = await supabase.from('classrooms').select('id, assignments');
          if (dbClassrooms) {
            for (const c of dbClassrooms) {
              if (c.assignments) {
                const classAsgns = (c.assignments as any[]).map((a: any) => a.id === assignmentId ? asgn : a);
                await supabase.from('classrooms').update({ assignments: classAsgns }).eq('id', c.id);
              }
            }
          }
        }
      },
      updateMockQuestion: async (mockId, testId, questionId, newQuestion) => {
        const { mocks } = get();
        const mockIndex = mocks.findIndex(m => m.id === mockId);
        if (mockIndex === -1) return;
        const newMocks = [...mocks];
        const mock = { ...newMocks[mockIndex] };
        mock.customQuestions = { ...(mock.customQuestions || {}) };
        mock.customQuestions[questionId] = newQuestion;
        newMocks[mockIndex] = mock;
        set({ mocks: newMocks });
        // Sync to supabase
        if (typeof window !== 'undefined') {
          const { supabase } = await import('@/lib/supabase/client');
          await supabase.from('mocks').update({ custom_questions: mock.customQuestions }).eq('id', mockId);
        }
      },

      joinClassroom: (code) => {
        const s = get();
        const cls = s.classrooms.find(c => c.joinCode === code.trim().toUpperCase());
        if (!cls) return false;
        if (s.joinedClassroomIds.includes(cls.id)) return true; // Already joined
        const newStudent: Student = {
            id: `stu-${Date.now()}`,
            name: "New Student",
            classroomId: cls.id,
            joinedAt: new Date().toISOString(),
            avatar: "blue",
        };
        set((s) => ({ 
            joinedClassroomIds: [...s.joinedClassroomIds, cls.id],
            students: [...s.students, newStudent]
        }));

        createClient().auth.getSession().then(({ data: { session } }) => {
          const userId = session?.user?.id;
          const metadata = session?.user?.user_metadata;
          const fullName = metadata?.first_name ? `${metadata.first_name} ${metadata.last_name || ''}`.trim() : "Unknown Student";
          
          if (userId) {
            set((s) => ({
              students: s.students.map(stu => stu.id === newStudent.id ? { ...stu, user_id: userId, name: fullName } : stu)
            }));
          } else {
            set((s) => ({
              students: s.students.map(stu => stu.id === newStudent.id ? { ...stu, name: fullName } : stu)
            }));
          }
          
          createClient().from('students').insert({
            id: newStudent.id,
            name: fullName,
            classroom_id: newStudent.classroomId,
            joined_at: newStudent.joinedAt,
            avatar: newStudent.avatar,
            user_id: userId
          }).then(({ error }) => {
            if (error) console.error('Error syncing joinClassroom:', error);
          });
        });

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

        createClient().from('mock_sessions').insert({
          id: newSession.id,
          title: newSession.title,
          place: newSession.place,
          date: newSession.date,
          time_limit_minutes: newSession.timeLimitMinutes,
          max_students: newSession.maxStudents,
          attached_test_ids: newSession.attachedTestIds,
          join_code: newSession.joinCode,
          status: newSession.status,
          strict_mode: newSession.strictMode,
          host: newSession.host,
          custom_tests: newSession.customTests,
          subject: newSession.subject,
          distribution_mode: newSession.distributionMode,
          student_assignments: newSession.studentAssignments,
          join_locked: newSession.joinLocked,
          join_deadline: newSession.joinDeadline
        }).then(({ error }) => {
          if (error) console.error('Error syncing createMockSession:', error);
        });

        return newSession;
      },
      updateMockSession: (id, updates) => {
        set((state) => ({
          mockSessions: state.mockSessions.map((s) => 
            s.id === id ? { ...s, ...updates } : s
          )
        }));

        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.place !== undefined) dbUpdates.place = updates.place;
        if (updates.date !== undefined) dbUpdates.date = updates.date;
        if (updates.timeLimitMinutes !== undefined) dbUpdates.time_limit_minutes = updates.timeLimitMinutes;
        if (updates.maxStudents !== undefined) dbUpdates.max_students = updates.maxStudents;
        if (updates.attachedTestIds !== undefined) dbUpdates.attached_test_ids = updates.attachedTestIds;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.strictMode !== undefined) dbUpdates.strict_mode = updates.strictMode;
        if (updates.host !== undefined) dbUpdates.host = updates.host;
        if (updates.customTests !== undefined) dbUpdates.custom_tests = updates.customTests;
        if (updates.subject !== undefined) dbUpdates.subject = updates.subject;
        if (updates.distributionMode !== undefined) dbUpdates.distribution_mode = updates.distributionMode;
        if (updates.studentAssignments !== undefined) dbUpdates.student_assignments = updates.studentAssignments;
        if (updates.joinLocked !== undefined) dbUpdates.join_locked = updates.joinLocked;
        if (updates.joinDeadline !== undefined) dbUpdates.join_deadline = updates.joinDeadline;

        createClient().from('mock_sessions').update(dbUpdates).eq('id', id).then(({ error }) => {
          if (error) console.error('Error syncing updateMockSession:', error);
        });
      },
      updateMockSessionStatus: (id, status) => {
        set((state) => ({
          mockSessions: state.mockSessions.map(s => s.id === id ? { ...s, status } : s)
        }));

        createClient().from('mock_sessions').update({ status }).eq('id', id).then(({ error }) => {
          if (error) console.error('Error syncing updateMockSessionStatus:', error);
        });
      },
      assignTestToStudent: (mockId, studentId, testId) => {
        set((state) => ({
          mockSessions: state.mockSessions.map(s => {
              if (s.id === mockId) {
                  const assignments = s.studentAssignments || {};
                  return { ...s, studentAssignments: { ...assignments, [studentId]: testId } };
              }
              return s;
          })
        }));

        const updatedSession = get().mockSessions.find(s => s.id === mockId);
        if (updatedSession) {
          createClient().from('mock_sessions').update({
            student_assignments: updatedSession.studentAssignments
          }).eq('id', mockId).then(({ error }) => {
            if (error) console.error('Error syncing assignTestToStudent:', error);
          });
        }
      },
      removeStudent: (studentId) => {
        set((state) => ({
            students: state.students.filter(s => s.id !== studentId)
        }));

        createClient().from('students').delete().eq('id', studentId).then(({ error }) => {
          if (error) console.error('Error syncing removeStudent:', error);
        });
      },
      registerForMock: (mockId, studentInfo) => {
        let result: any = { success: false };
        set((state) => {
            const session = state.mockSessions.find(s => s.id === mockId);
            if (!session) { result = { success: false, error: 'Session not found' }; return state; }
            if (session.status === 'completed') { result = { success: false, error: 'Session has already ended' }; return state; }
            if (session.joinLocked) { result = { success: false, error: 'Registration for this session is locked by the instructor.' }; return state; }
            
            // Try to find a student record that belongs to this mock
            let student = state.students.find(s => s.name === studentInfo.name && s.school === studentInfo.school && s.mockSessionId === session.id);
            let isNew = false;

            if (!student) {
                // If not found, let's create a NEW record specifically for this mock session to bypass UPDATE RLS restrictions on existing students
                student = {
                    id: crypto.randomUUID(),
                    name: studentInfo.name,
                    school: studentInfo.school,
                    gradeLevel: studentInfo.grade,
                    classroomId: '', 
                    joinedAt: new Date().toISOString(),
                    avatar: 'blue',
                    mockSessionId: session.id
                };
                isNew = true;
                result = { success: true, session, student, isNew };
                return { students: [...state.students, student] };
            }
            
            result = { success: true, session, student, isNew: false };
            return state;
        });

        if (result.success && result.student) {
          createClient().auth.getSession().then(({ data: { session } }) => {
            const userId = session?.user?.id;
            if (userId) {
              set((s) => ({
                students: s.students.map(stu => stu.id === result.student.id ? { ...stu, user_id: userId } : stu)
              }));
            }
            
            const studentData = {
              id: result.student.id,
              name: result.student.name,
              school: result.student.school,
              grade_level: result.student.gradeLevel,
              classroom_id: result.student.classroomId || null,
              joined_at: result.student.joinedAt,
              avatar: result.student.avatar,
              mock_session_id: result.student.mockSessionId,
              user_id: userId
            };

            if (result.isNew) {
                createClient().from('students').insert(studentData).then(({ error }) => {
                  if (error) console.error('Error inserting registerForMock:', error.message || JSON.stringify(error));
                });
            } else {
                createClient().from('students').update(studentData).eq('id', result.student.id).then(({ error }) => {
                  if (error) console.error('Error updating registerForMock:', error.message || JSON.stringify(error));
                });
            }
          });
        }

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

            let assignedTestId = '1';
            if (session.studentAssignments && session.studentAssignments[student.id]) {
                assignedTestId = session.studentAssignments[student.id];
            } else {
                if (session.customTests && session.customTests.length > 0) {
                    assignedTestId = session.customTests[Math.floor(Math.random() * session.customTests.length)].id;
                } else if (session.attachedTestIds && session.attachedTestIds.length > 0) {
                    assignedTestId = session.attachedTestIds[Math.floor(Math.random() * session.attachedTestIds.length)];
                }
            }

            result = { success: true, session, assignedTestId };

            const hasAssignment = session.studentAssignments && session.studentAssignments[student.id];
            if (!hasAssignment) {
                const updatedSessions = state.mockSessions.map(s => {
                    if (s.id === session.id) {
                        const assignments = s.studentAssignments || {};
                        return { ...s, studentAssignments: { ...assignments, [student.id]: assignedTestId } };
                    }
                    return s;
                });
                
                // Sync to Supabase
                const assignments = { ...(session.studentAssignments || {}), [student.id]: assignedTestId };
                createClient().from('mock_sessions').update({
                    student_assignments: assignments
                }).eq('id', session.id).then(({ error }) => {
                    if (error) console.error('Error syncing random assignment in joinMock:', error);
                });

                return {
                    ...state,
                    mockSessions: updatedSessions
                };
            }

            return state;
        });
        return result;
      },
      submitMockResult: (result) => {
        const newResult: MockResult = {
          ...result,
          id: 'res-' + Date.now(),
          completedAt: new Date().toISOString()
        };
        set((state) => ({ mockResults: [...state.mockResults, newResult] }));

        createClient().from('mock_results').insert({
          id: newResult.id,
          mock_id: newResult.mockId,
          student_id: newResult.studentId,
          assigned_test_id: newResult.assignedTestId,
          score: newResult.score,
          total_correct: newResult.totalCorrect,
          total_questions: newResult.totalQuestions,
          completed_at: newResult.completedAt,
          english_score: newResult.englishScore,
          math_score: newResult.mathScore,
          time_spent: newResult.timeSpent,
          answers: newResult.answers,
          kicked_out: newResult.kickedOut
        }).then(({ error }) => {
          if (error) console.error('Error syncing submitMockResult:', error);
        });
      },
      deleteMockSession: (id) => {
        set((state) => ({
          mockSessions: state.mockSessions.filter(s => s.id !== id),
          mockResults: state.mockResults.filter(r => r.mockId !== id)
        }));

        createClient().from('mock_sessions').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Error syncing deleteMockSession:', error);
        });
      },
      deleteMockResult: (id) => {
        set((state) => ({
          mockResults: state.mockResults.filter(r => r.id !== id)
        }));

        createClient().from('mock_results').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Error syncing deleteMockResult:', error);
        });
      },
      leaveClassroom: (id) => {
        set((s) => ({ joinedClassroomIds: s.joinedClassroomIds.filter((cId) => cId !== id) }));

        createClient().auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            set((s) => ({
              students: s.students.filter(stu => !(stu.classroomId === id && stu.user_id === session.user.id))
            }));
            createClient().from('students').delete().eq('user_id', session.user.id).eq('classroom_id', id).then(({ error }) => {
              if (error) console.error('Error syncing leaveClassroom:', error);
            });
          }
        });
      },

      syncWithSupabase: async () => {
        try {
          // Throttle: skip if synced less than 30 seconds ago
          const now = Date.now();
          if (now - get().lastSyncedAt < 30_000) return;
          set({ lastSyncedAt: now });

          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) return;

          const [
            classroomsRes, 
            studentsRes, 
            assignmentsRes, 
            progressRes, 
            mockSessionsRes, 
            mockResultsRes,
            questionHistoryRes
          ] = await Promise.all([
            supabase.from('classrooms').select('*'),
            supabase.from('students').select('*'),
            supabase.from('assignments').select('*'),
            supabase.from('student_progress').select('*'),
            supabase.from('mock_sessions').select('*'),
            supabase.from('mock_results').select('*'),
            supabase.from('question_history').select('*'),
          ]);

          const updates: Partial<State> = {};

          if (classroomsRes.data) {
            updates.classrooms = classroomsRes.data.map(c => ({
              id: c.id,
              name: c.name,
              grade: c.grade,
              joinCode: c.join_code,
              createdAt: c.created_at,
            }));
          }

          if (studentsRes.data) {
            updates.students = studentsRes.data.map(s => ({
              id: s.id,
              name: s.name,
              classroomId: s.classroom_id,
              joinedAt: s.joined_at,
              avatar: s.avatar,
              school: s.school,
              gradeLevel: s.grade_level,
              plannedExamDate: s.planned_exam_date,
              scorePredictor: s.score_predictor,
              history: s.history || [],
              mockSessionId: s.mock_session_id,
              user_id: s.user_id,
            }));

            const studentProfiles = studentsRes.data.filter(s => s.user_id === session.user.id);
            updates.joinedClassroomIds = studentProfiles.map(s => s.classroom_id).filter(Boolean);
          }

          if (assignmentsRes.data) {
            updates.assignments = assignmentsRes.data.map(a => ({
              id: a.id,
              title: a.title,
              subject: a.subject,
              classroomIds: a.classroom_ids || [],
              questions: Array.isArray(a.questions) && !a.questions[0]?.questions ? a.questions : [], // fallback for old format
              customTests: (Array.isArray(a.questions) && a.questions[0]?.questions) ? a.questions : (a.custom_tests || []), // Extract customTests from questions if stored there
              timeLimitMinutes: a.time_limit_minutes,
              allowExit: a.allow_exit,
              createdAt: a.created_at,
            }));
          }

          if (progressRes.data) {
            updates.progress = progressRes.data.map(p => ({
              studentId: p.student_id,
              assignmentId: p.assignment_id,
              answered: p.answered,
              correct: p.correct,
              total: p.total,
              completed: p.completed,
            }));
          }

          if (mockSessionsRes.data) {
            updates.mockSessions = mockSessionsRes.data.map(m => ({
              id: m.id,
              title: m.title,
              place: m.place,
              date: m.date,
              timeLimitMinutes: m.time_limit_minutes,
              maxStudents: m.max_students,
              attachedTestIds: m.attached_test_ids || [],
              joinCode: m.join_code,
              createdAt: m.created_at,
              status: m.status,
              strictMode: m.strict_mode,
              host: m.host,
              customTests: m.custom_tests || [],
              subject: m.subject,
              distributionMode: m.distribution_mode,
              studentAssignments: m.student_assignments || {},
              joinLocked: m.join_locked,
              joinDeadline: m.join_deadline,
            }));
          }

          if (mockResultsRes.data) {
            updates.mockResults = mockResultsRes.data.map(r => ({
              id: r.id,
              mockId: r.mock_id,
              studentId: r.student_id,
              assignedTestId: r.assigned_test_id,
              score: r.score,
              totalCorrect: r.total_correct,
              totalQuestions: r.total_questions,
              completedAt: r.completed_at,
              englishScore: r.english_score,
              mathScore: r.math_score,
              timeSpent: r.time_spent,
              answers: r.answers || {},
              kickedOut: r.kicked_out,
            }));
          }

          if (questionHistoryRes.data) {
            updates.questionHistory = questionHistoryRes.data.map((q: any) => ({
              id: q.id,
              studentId: q.student_id,
              assignmentId: q.assignment_id,
              questionId: q.question_id,
              chosenOption: q.chosen_option,
              isCorrect: q.is_correct,
              answeredAt: q.answered_at,
            }));
          }

          set(updates);
        } catch (err) {
          console.warn('Failed to sync classrooms data with Supabase:', err);
        }
      },
      submitAssignmentProgress: (studentId, assignmentId, answered, correct, total, completed, testProgress) => {
        set((state) => {
          const index = state.progress.findIndex(p => p.studentId === studentId && p.assignmentId === assignmentId);
          const newProgress = [...state.progress];
          
          let updatedTestProgress = testProgress;
          if (index !== -1 && !testProgress && newProgress[index].testProgress) {
             updatedTestProgress = newProgress[index].testProgress;
          } else if (index !== -1 && testProgress) {
             updatedTestProgress = { ...newProgress[index].testProgress, ...testProgress };
          }

          const progressItem: StudentProgress = {
            studentId,
            assignmentId,
            answered,
            correct,
            total,
            completed,
            testProgress: updatedTestProgress
          };

          if (index !== -1) {
            newProgress[index] = progressItem;
          } else {
            newProgress.push(progressItem);
          }
          return { progress: newProgress };
        });

        // For simplicity we aren't saving testProgress to supabase yet
        // since it requires schema changes, but it's kept in localStorage.
        createClient().from('student_progress').upsert({
          student_id: studentId,
          assignment_id: assignmentId,
          answered,
          correct,
          total,
          completed
        }).then(({ error }) => {
          if (error) console.error('Error syncing submitAssignmentProgress:', error);
        });
      },
      logQuestionAnswer: (studentId, assignmentId, questionId, chosenOption, isCorrect) => {
        const entry: QuestionHistoryEntry = {
          id: `qh-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          studentId,
          assignmentId,
          questionId,
          chosenOption,
          isCorrect,
          answeredAt: new Date().toISOString()
        };
        set((state) => ({ questionHistory: [...state.questionHistory, entry] }));

        createClient().from('question_history').insert({
          id: entry.id,
          student_id: studentId,
          assignment_id: assignmentId,
          question_id: questionId,
          chosen_option: chosenOption,
          is_correct: isCorrect,
          answered_at: entry.answeredAt
        }).then(({ error }) => {
          if (error) console.error('Error syncing logQuestionAnswer:', error);
        });
      },
    }),
    {
      name: 'targetprep-classrooms',
      storage: createJSONStorage(() => createSupabaseStorage('classroom_state')),
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
