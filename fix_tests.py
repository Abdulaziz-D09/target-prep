import re
import json

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

# 1. Update Question interface using string replace
old_interface = """export interface Question {
    id: string;
    type: 'Reading' | 'Grammar' | 'Math';
    passage?: string;
    image?: string; // Path to graph/figure image (math questions)
    question: string;
    options: string[];
    answer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Assessment';
}"""

new_interface = """export interface Question {
    id?: any;
    type?: 'Reading' | 'Grammar' | 'Math';
    passage?: string;
    passage_q?: string;
    image?: string; // Path to graph/figure image (math questions)
    question?: string;
    options: string[];
    answer: any;
    explanation?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Assessment';
    calc?: boolean;
}"""
content = content.replace(old_interface, new_interface)

# 2. Clean **Answer:** safely
content = re.sub(r'\\\\n\*\*Answer:\*\*[^\"\\\\]{1,30}', '', content)
content = re.sub(r'\n\*\*Answer:\*\*[^\"\\\\]{1,30}', '', content)

# 3. Add Practice Test 1 Module 1 and 2
with open('pt1_english_patched.json', 'r') as f:
    qs = json.load(f)

m1 = qs[:27]
m2 = qs[27:]
m1_str = "const pt1_englishModule1: Question[] = " + json.dumps(m1, indent=4) + ";"
m2_str = "const pt1_englishModule2: Question[] = " + json.dumps(m2, indent=4) + ";"
content = content.replace('export const practiceTests', m1_str + '\n\n' + m2_str + '\n\nexport const practiceTests')

# 4. Find the questions block for Practice Test 1 Module 1 and 2 and replace them
# Module 1 starts with f1bfbed3
m1_start = content.find('id: "f1bfbed3"')
m1_block_start = content.rfind('questions: [', 0, m1_start)
m1_block_end = content.find('      {', m1_start) # Skip to next module
# Actually, the easiest way to replace the array is to find 'timeMinutes: 32,' and the array brackets.
def replace_module(content, marker_id, new_var):
    start = content.find(f'id: "{marker_id}"')
    if start == -1: return content
    q_start = content.rfind('questions: [', 0, start)
    # Find matching bracket for the questions array
    b_count = 0
    in_array = False
    q_end = -1
    for i in range(q_start + 11, len(content)):
        if content[i] == '[':
            b_count += 1
            in_array = True
        elif content[i] == ']':
            b_count -= 1
            if in_array and b_count == 0:
                q_end = i + 1
                break
    
    if q_end != -1:
        return content[:q_start] + f'questions: {new_var}' + content[q_end:]
    return content

content = replace_module(content, "f1bfbed3", "pt1_englishModule1")
content = replace_module(content, "em1-87aa7bab", "pt1_englishModule2")

# 5. Remove Practice Test 3, 4, 5
# Look for `{ id: 3, title: "Practice Test 3"`
pt3_start = content.find('    id: 3,\n    title: "Practice Test 3"')
if pt3_start != -1:
    # We want to remove from the previous `{` to the end of the array, but leaving `];`
    obj_start = content.rfind('  {\n    id: 3,', 0, pt3_start)
    if obj_start != -1:
        # Just slice it off!
        # Since Practice Test 3, 4, 5 are the last elements, we can just cut from here to the end of the array
        # The array ends with `];`
        end_array = content.find('];', pt3_start)
        if end_array != -1:
            content = content[:obj_start] + content[end_array:]

with open('src/data/questions.ts', 'w') as f:
    f.write(content)
print("Safely fixed everything!")
