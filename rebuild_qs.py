import json
import re

def extract_array(content, array_name):
    start_marker = f"const {array_name}: Question[] = ["
    start_idx = content.find(start_marker)
    if start_idx == -1:
        return []
    
    # Find matching closing bracket
    bracket_level = 0
    in_string = False
    escape = False
    
    for i in range(start_idx + len(start_marker) - 1, len(content)):
        char = content[i]
        
        if not in_string:
            if char == '[':
                bracket_level += 1
            elif char == ']':
                bracket_level -= 1
                if bracket_level == 0:
                    arr_str = content[start_idx + len(start_marker) - 1 : i + 1]
                    try:
                        import ast
                        # ast.literal_eval doesn't work well with JS objects (unquoted keys, boolean).
                        # Let's just use regex to extract the objects.
                    except:
                        pass
                    return arr_str
            elif char == '"' or char == "'":
                in_string = True
                string_char = char
        else:
            if escape:
                escape = False
            elif char == '\\':
                escape = True
            elif char == string_char:
                in_string = False
                
    return "[]"

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

em1_str = extract_array(content, 'englishModule1')

# Now load the other JSONs
with open('module2_parsed.json', 'r') as f:
    em2 = f.read()

with open('math_parsed.json', 'r') as f:
    math_parsed = json.load(f)
    math_m1 = json.dumps(math_parsed['m1'], indent=4)
    math_m2 = json.dumps(math_parsed['m2'], indent=4)

with open('test2_parsed.json', 'r') as f:
    test2_parsed = json.load(f)
    pt2_em1 = json.dumps(test2_parsed[0]['questions'], indent=4)
    pt2_em2 = json.dumps(test2_parsed[1]['questions'], indent=4)

with open('test2_math.json', 'r') as f:
    test2_math = json.load(f)
    pt2_mm1 = json.dumps(test2_math[0]['questions'], indent=4)
    pt2_mm2 = json.dumps(test2_math[1]['questions'], indent=4)

# Create the new questions.ts content
new_content = """import { TestModule, TestSection } from './types'; // Optional, let's just define them inline.

export interface Question {
    id: string | number;
    type: 'Reading' | 'Grammar' | 'Math';
    passage?: string;
    question: string;
    options: string[];
    answer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    calc?: boolean;
}

export interface TestModule {
    questions: Question[];
    timeMinutes: number;
}

export interface TestSection {
    name: string;
    modules: TestModule[];
}

export interface PracticeTest {
    id: number;
    title: string;
    description: string;
    type: string;
    duration: string;
    totalQuestions: number;
    moduleCount: number;
    color: string;
    sections: TestSection[];
}

const englishModule1: Question[] = """ + em1_str + """;

export const practiceTests: PracticeTest[] = [
  {
    id: 1,
    title: "Practice Test 1",
    description: "Full-length Digital SAT practice test with Reading, Writing, and Math sections.",
    type: "Full Test",
    duration: "2h 14m",
    totalQuestions: 98,
    moduleCount: 4,
    color: "blue",
    sections: [
      {
        name: "Reading and Writing",
        modules: [
          {
            timeMinutes: 32,
            questions: englishModule1
          },
          {
            timeMinutes: 32,
            questions: """ + em2 + """
          }
        ]
      },
      {
        name: "Math",
        modules: [
          {
            timeMinutes: 35,
            questions: """ + math_m1 + """
          },
          {
            timeMinutes: 35,
            questions: """ + math_m2 + """
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Practice Test 2",
    description: "Full-length Digital SAT practice test with Reading, Writing, and Math sections.",
    type: "Full Test",
    duration: "2h 14m",
    totalQuestions: 98,
    moduleCount: 4,
    color: "blue",
    sections: [
      {
        name: "Reading and Writing",
        modules: [
          {
            timeMinutes: 32,
            questions: """ + pt2_em1 + """
          },
          {
            timeMinutes: 32,
            questions: """ + pt2_em2 + """
          }
        ]
      },
      {
        name: "Math",
        modules: [
          {
            timeMinutes: 35,
            questions: """ + pt2_mm1 + """
          },
          {
            timeMinutes: 35,
            questions: """ + pt2_mm2 + """
          }
        ]
      }
    ]
  }
];

export const satDates = [
    { month: 'AUG', date: 'August 23, 2025', target: '2025-08-23T08:00:00', registrationDeadline: 'August 8, 2025', lateRegistrationDeadline: 'August 12, 2025', changeDeadline: 'August 12, 2025' },
    { month: 'SEP', date: 'September 13, 2025', target: '2025-09-13T08:00:00', registrationDeadline: 'August 29, 2025', lateRegistrationDeadline: 'September 2, 2025', changeDeadline: 'September 2, 2025' },
    { month: 'OCT', date: 'October 4, 2025', target: '2025-10-04T08:00:00', registrationDeadline: 'September 19, 2025', lateRegistrationDeadline: 'September 23, 2025', changeDeadline: 'September 23, 2025' },
    { month: 'NOV', date: 'November 8, 2025', target: '2025-11-08T08:00:00', registrationDeadline: 'October 24, 2025', lateRegistrationDeadline: 'October 28, 2025', changeDeadline: 'October 28, 2025' },
    { month: 'DEC', date: 'December 6, 2025', target: '2025-12-06T08:00:00', registrationDeadline: 'November 21, 2025', lateRegistrationDeadline: 'November 25, 2025', changeDeadline: 'November 25, 2025' },
    { month: 'MAR', date: 'March 14, 2026', target: '2026-03-14T08:00:00', registrationDeadline: 'February 27, 2026', lateRegistrationDeadline: 'March 3, 2026', changeDeadline: 'March 3, 2026' },
    { month: 'MAY', date: 'May 2, 2026', target: '2026-05-02T08:00:00', registrationDeadline: 'April 17, 2026', lateRegistrationDeadline: 'April 21, 2026', changeDeadline: 'April 21, 2026' },
    { month: 'JUN', date: 'June 6, 2026', target: '2026-06-06T08:00:00', registrationDeadline: 'May 22, 2026', lateRegistrationDeadline: 'May 26, 2026', changeDeadline: 'May 26, 2026' }
];

export const studyResources = [
    { id: 1, title: 'Grammar Rules Guide', description: 'Comprehensive guide to SAT grammar and punctuation rules.', category: 'English', icon: 'book-open', color: 'purple', href: '/dashboard/resources/grammar' },
    { id: 2, title: 'Reading Strategies', description: 'Techniques for active reading and passage analysis.', category: 'English', icon: 'eye', color: 'emerald', href: '/dashboard/resources/reading' },
    { id: 3, title: 'SAT Vocabulary 500', description: 'Most frequently tested vocabulary words with examples.', category: 'English', icon: 'file-text', color: 'rose', href: '/dashboard/resources/vocabulary' },
    { id: 4, title: 'Desmos Mastery', description: 'Learn how to solve complex algebra using the built-in calculator.', category: 'Math', icon: 'calculator', color: 'blue', href: '/dashboard/resources/desmos' },
    { id: 5, title: 'Geometry Formulas', description: 'Essential formulas and when to apply them.', category: 'Math', icon: 'pen-tool', color: 'amber', href: '/dashboard/resources/geometry' },
];
"""

with open('src/data/questions.ts', 'w') as f:
    f.write(new_content)

print("questions.ts successfully rebuilt.")
