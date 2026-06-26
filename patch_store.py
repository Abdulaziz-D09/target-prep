import re

with open("src/store/classroomStore.ts", "r") as f:
    content = f.read()

# 1. Add customQuestions?: Record<string, Question> to MockSession
content = content.replace("  attachedTestIds: string[];\n", "  attachedTestIds: string[];\n  customQuestions?: Record<string, any>;\n")

# 2. Add action types to ClassroomState
actions_block_match = re.search(r'  addAssignment: .*?;[\s\S]*?deleteAssignment: .*?;', content)
if actions_block_match:
    actions_block = actions_block_match.group(0)
    new_actions = """  updateAssignmentQuestion: (assignmentId: string, questionId: string, newQuestion: any) => void;
  updateMockQuestion: (mockId: string, testId: string, questionId: string, newQuestion: any) => void;"""
    content = content.replace(actions_block, actions_block + "\n" + new_actions)

# 3. Add implementations in set => ({ ... })
impl_block_match = re.search(r'deleteAssignment: \(id\) => \{[\s\S]*?\},', content)
if impl_block_match:
    impl_block = impl_block_match.group(0)
    new_impl = """
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
      },"""
    content = content.replace(impl_block, impl_block + "\n" + new_impl)

# 4. Update the DB sync logic for mocks
# When loading mocks, parse custom_questions
load_mocks_match = re.search(r'strictToleranceSeconds: m\.strict_tolerance_seconds,[\s\S]*?createdAt: m\.created_at', content)
if load_mocks_match:
    load_mocks = load_mocks_match.group(0)
    content = content.replace(load_mocks, load_mocks + ",\n              customQuestions: m.custom_questions || {}")

# When creating/updating mocks, sync custom_questions
add_mock_match = re.search(r'strict_tolerance_seconds: mock\.strictToleranceSeconds,[\s\S]*?created_at: mock\.createdAt', content)
if add_mock_match:
    add_mock = add_mock_match.group(0)
    content = content.replace(add_mock, add_mock + ",\n              custom_questions: mock.customQuestions || {}")

with open("src/store/classroomStore.ts", "w") as f:
    f.write(content)

print("Patched classroomStore.ts successfully.")
