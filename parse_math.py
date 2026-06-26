import json
import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

m1_m_marker = "Section: Section 2, Module 1: Math, Difficulty: unknown (22"
m2_m_marker = "Section: Section 2, Module 2: Math, Difficulty: hard (22"
    
start1 = text.find(m1_m_marker)
start2 = text.find(m2_m_marker)

m1_math = text[start1:start2]
m2_math = text[start2:]

def to_latex_math(text_content):
    if not text_content: return text_content
    
    # 1. Format fractions: number/number -> \frac{num}{den}
    text_content = re.sub(r'(?<!\w)(\d+)/(\d+)(?!\w)', r'$\\frac{\1}{\2}$', text_content)
    # variables: x/y -> \frac{x}{y}
    text_content = re.sub(r'(?<!\w)([a-zA-Z\d]+)/([a-zA-Z\d]+)(?!\w)', r'$\\frac{\1}{\2}$', text_content)
    
    # 2. Add italics for variables: x, y, p, n, k, m, b, f(x), g(x), etc.
    vars_to_italicize = ['x', 'y', 'p', 'n', 'k', 'm', 'b', 'h', 'l', 'c', 'd', 'z']
    for v in vars_to_italicize:
        # Match standalone variables
        text_content = re.sub(rf'(?<![a-zA-Z\$\>])({v})(?![a-zA-Z\<\$])', rf'<i>\1</i>', text_content)
        
    # Also f(x), g(x)
    text_content = re.sub(r'(?<![a-zA-Z])([fg]\([a-zA-Z]\))(?![a-zA-Z])', r'<i>\1</i>', text_content)
    text_content = text_content.replace('<i><i>', '<i>').replace('</i></i>', '</i>')
    
    return text_content

def parse_math_module(mod_text):
    questions = []
    # Split by \n1. \n, \n2. \n, etc.
    chunks = re.split(r'\n\s*(\d+)\.\s*\n', "\n" + mod_text)
    
    for i in range(1, len(chunks), 2):
        q_num = int(chunks[i])
        q_content = chunks[i+1].strip()
        
        ans_match = re.search(r'\nAnswer:\s*(.*?)\s*$', q_content)
        answer = ""
        if ans_match:
            answer = ans_match.group(1).strip()
            q_content = q_content[:ans_match.start()].strip()
            
        # Options are exactly A. B. C. D.
        # But wait! What if it's A., B., C., D. spread across lines?
        # We can use a regex that matches \nA. ... \nB. ... \nC. ... \nD. ... at the END of the content
        # Note: some answer choices might have newlines inside them!
        opts_match = re.search(r'\n([A-D])\.\s*(.*?)(?=\n[A-D]\.\s*|$)', q_content, re.DOTALL)
        options = []
        if opts_match:
            # We need to find all A., B., C., D.
            opts_dict = {}
            for m in re.finditer(r'\n([A-D])\.\s*(.*?)(?=\n[A-D]\.\s*|$)', q_content, re.DOTALL):
                opts_dict[m.group(1)] = m.group(2).strip()
            
            if len(opts_dict) == 4:
                options = [opts_dict['A'], opts_dict['B'], opts_dict['C'], opts_dict['D']]
                # Remove options from question
                first_opt_match = re.search(r'\nA\.\s*', q_content)
                q_content = q_content[:first_opt_match.start()].strip()
            else:
                # SPR question? Or bad parse?
                pass
                
        # Format the text
        question = to_latex_math(q_content)
        options = [to_latex_math(opt) for opt in options]
        
        ans_idx = -1
        if answer in ['A', 'B', 'C', 'D']:
            ans_idx = ord(answer) - 65
        else:
            try:
                ans_idx = float(answer) if '.' in answer else int(answer)
            except:
                ans_idx = answer
                
        q_type = "Math" if len(options) > 0 else "Math (SPR)"
        
        questions.append({
            "num": q_num,
            "passage": "",
            "question": question,
            "options": options,
            "answer": ans_idx,
            "type": q_type
        })
    return questions

m1_q = parse_math_module(m1_math)
m2_q = parse_math_module(m2_math)

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# Re-assign
if len(data) >= 4:
    data[2]['questions'] = m1_q
    data[3]['questions'] = m2_q
else:
    data.append({"questions": m1_q})
    data.append({"questions": m2_q})
    
with open('test2_parsed.json', 'w') as f:
    json.dump(data, f, indent=2)
with open('test2_reading.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Fixed Math Modules! M1: {len(m1_q)} qs, M2: {len(m2_q)} qs")
