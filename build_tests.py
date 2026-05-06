import json
import uuid

def fix_id(q, prefix):
    q['id'] = f"{prefix}-{uuid.uuid4().hex[:6]}"
    return q

# Load V1-V3 English
with open('pdf_extractor/v1_parsed.json') as f: v1_eng = json.load(f)
with open('pdf_extractor/v2_parsed.json') as f: v2_eng = json.load(f)
with open('pdf_extractor/v3_parsed.json') as f: v3_eng = json.load(f)

# Load banks
with open('src/data/math_bank.json') as f: math_bank = json.load(f)
with open('src/data/ebrw_bank.json') as f: ebrw_bank = json.load(f)

# Keep track of used Math and EBRW
used_math = set()
used_ebrw = set()

def get_math_qs(count, is_hard=False):
    # Try to pick from different domains, and favor tables if possible
    # We will just pick non-repeating
    res = []
    for q in math_bank:
        if len(res) == count: break
        if q['id'] not in used_math:
            # simple difficulty heuristic
            if is_hard and q.get('difficulty') == 'Easy': continue
            if not is_hard and q.get('difficulty') == 'Hard': continue
            used_math.add(q['id'])
            res.append(q)
    
    # Fill if not enough
    for q in math_bank:
        if len(res) == count: break
        if q['id'] not in used_math:
            used_math.add(q['id'])
            res.append(q)
            
    # Sort them loosely
    res.sort(key=lambda x: {"Easy":0, "Medium":1, "Hard":2}.get(x.get('difficulty', 'Medium'), 1))
    return res

sat_order = [
    'Words in Context', 
    'Text Structure and Purpose', 
    'Cross-Text Connections',
    'Central Ideas and Details', 
    'Command of Evidence', 
    'Inferences',
    'Boundaries', 
    'Form, Structure, and Sense', 
    'Transitions', 
    'Rhetorical Synthesis'
]

def get_ebrw_qs(count):
    res = []
    # Try to pick proportional to real SAT
    # Real SAT English (27 questions):
    # ~5 Words in Context, ~3 Text Structure, ~2 Cross-Text, ~6 Central Ideas, ~3 Evidence, ~2 Inferences, ~4 Grammar, ~2 Transitions, ~2 Synthesis
    distribution = {
        'Words in Context': 5,
        'Text Structure and Purpose': 3,
        'Cross-Text Connections': 1,
        'Central Ideas and Details': 6,
        'Command of Evidence': 3,
        'Inferences': 1,
        'Boundaries': 2,
        'Form, Structure, and Sense': 2,
        'Transitions': 2,
        'Rhetorical Synthesis': 2
    }
    
    # Collect by skill
    for skill in sat_order:
        needed = distribution.get(skill, 0)
        added = 0
        for q in ebrw_bank:
            if added == needed: break
            if q['id'] not in used_ebrw and q.get('skill', '') == skill:
                used_ebrw.add(q['id'])
                res.append(q)
                added += 1
                
    # Fill remaining to reach count
    for q in ebrw_bank:
        if len(res) >= count: break
        if q['id'] not in used_ebrw:
            used_ebrw.add(q['id'])
            res.append(q)
            
    # Now sort the collected questions by sat_order
    def sort_key(q):
        skill = q.get('skill', '')
        if skill in sat_order:
            return sat_order.index(skill)
        return len(sat_order) # put at end if unknown
        
    res.sort(key=sort_key)
    return res[:count]

tests_data = []

for i in range(5):
    if i == 0: e_source = v1_eng
    elif i == 1: e_source = v2_eng
    elif i == 2: e_source = v3_eng
    else: e_source = get_ebrw_qs(54)
    
    e1 = [fix_id(q.copy(), f't{i+1}e1') for q in e_source[:27]]
    e2 = [fix_id(q.copy(), f't{i+1}e2') for q in e_source[27:]]
    
    m1 = [fix_id(q.copy(), f't{i+1}m1') for q in get_math_qs(22, is_hard=False)]
    m2 = [fix_id(q.copy(), f't{i+1}m2') for q in get_math_qs(22, is_hard=True)]
    
    tests_data.append({
        "id": i+1,
        "title": f"Practice Test {i+1}",
        "sections": [
            {
                "name": "Reading and Writing",
                "modules": [
                    {"timeMinutes": 32, "questions": e1},
                    {"timeMinutes": 32, "questions": e2}
                ]
            },
            {
                "name": "Math",
                "modules": [
                    {"timeMinutes": 35, "questions": m1},
                    {"timeMinutes": 35, "questions": m2}
                ]
            }
        ]
    })

# Format to TS file
ts_content = """import { PracticeTest } from './questions_types';

export interface Question {
  id: string;
  type: string;
  passage?: string;
  question: string;
  options: string[];
  answer: number | string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  domain?: string;
  skill?: string;
  calc?: boolean;
}

export interface TestModule {
  timeMinutes: number;
  questions: Question[];
}

export interface TestSection {
  name: string;
  modules: TestModule[];
}

export interface PracticeTest {
  id: number;
  title: string;
  description?: string;
  type?: string;
  duration?: string;
  totalQuestions?: number;
  moduleCount?: number;
  color?: string;
  sections: TestSection[];
}

export const practiceTests: PracticeTest[] = """

ts_content += json.dumps(tests_data, indent=2) + ";\n"

with open('src/data/questions.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Generated src/data/questions.ts successfully!")
