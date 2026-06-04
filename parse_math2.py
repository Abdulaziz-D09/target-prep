import json

with open('math_text.txt', 'r') as f:
    text = f.read()

mod1_start = text.find("Section 2, Module 1: Math")
mod2_start = text.find("Section 2, Module 2: Math")

mod1_text = text[mod1_start:mod2_start] if mod2_start != -1 else text[mod1_start:]
mod2_text = text[mod2_start:] if mod2_start != -1 else ""

def parse_module(mod_text, expected_qs=22):
    questions = []
    current_text = mod_text
    
    # skip prologue
    first_q_idx = current_text.find("1.")
    current_text = current_text[first_q_idx:]
    
    q_num = 1
    while current_text:
        # The current text starts with `q_num.` or `(Duplicate...):22.`
        prefix1 = f"{q_num}."
        prefix2 = f"(Duplicate numbering from source document):{q_num}."
        
        if current_text.startswith(prefix1):
            current_text = current_text[len(prefix1):]
        elif current_text.startswith(prefix2):
            current_text = current_text[len(prefix2):]
        else:
            break
            
        # Find the next question number
        next_q = q_num + 1
        # It could be `next_q.` or `(Duplicate...):22.` or `(Duplicate...):22.` again.
        # But wait, Math M1 has duplicate 22s.
        next_prefix1 = f"Answer: A{next_q}."
        next_prefix2 = f"Answer: B{next_q}."
        next_prefix3 = f"Answer: C{next_q}."
        next_prefix4 = f"Answer: D{next_q}."
        
        # for grid-in, it could be `Answer: 45004.` (answer is 4500, next q is 4)
        # So we search for `Answer: [something]{next_q}.` or `Answer: [something](Duplicate numbering...):22.`
        # Let's just find `Answer: `
        
        ans_idx = current_text.find("Answer: ")
        if ans_idx == -1:
            break
            
        # we need to find where the NEXT question starts AFTER `Answer: `
        ans_start = ans_idx + len("Answer: ")
        
        # The next question will start with `next_q.`
        # Or if q_num is 22, the next might be `(Duplicate numbering from source document):22.`
        # Let's search from ans_start for `next_q.`
        
        next_q_str = str(next_q) + "."
        dup_str = f"(Duplicate numbering from source document):22."
        
        best_idx = -1
        # the answer might be just a few characters
        # e.g. "Answer: D2." -> ans_start is before 'D', next_q is '2.'
        if str(next_q) in current_text[ans_start:ans_start+200]:
            idx = current_text.find(next_q_str, ans_start, ans_start+200)
            if idx != -1:
                best_idx = idx
        
        if best_idx == -1 and "(Duplicate" in current_text[ans_start:ans_start+50]:
            idx = current_text.find(dup_str, ans_start, ans_start+50)
            if idx != -1:
                best_idx = idx
                next_q = 22 # Stay on 22
                
        if best_idx == -1:
            # Maybe it's the last question
            best_idx = len(current_text)
            
        chunk = current_text[:best_idx]
        current_text = current_text[best_idx:]
        
        # chunk contains the question, options, and answer
        # e.g. "If 9x+4=67... A. 7B. 70C. 130D. 670Answer: D"
        ans_match = chunk.find("Answer: ")
        question_options = chunk[:ans_match].strip()
        answer_raw = chunk[ans_match + len("Answer: "):].strip()
        
        # Options
        opt_a = question_options.find("A. ")
        opt_b = question_options.find("B. ")
        opt_c = question_options.find("C. ")
        opt_d = question_options.find("D. ")
        
        if opt_a != -1 and opt_b != -1 and opt_c != -1 and opt_d != -1:
            question = question_options[:opt_a].strip()
            o_a = question_options[opt_a+3:opt_b].strip()
            o_b = question_options[opt_b+3:opt_c].strip()
            o_c = question_options[opt_c+3:opt_d].strip()
            o_d = question_options[opt_d+3:].strip()
            options = [o_a, o_b, o_c, o_d]
            ans_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
            ans_val = ans_map.get(answer_raw[0].upper(), 0) if answer_raw else 0
        else:
            options = []
            question = question_options
            import re
            num_match = re.search(r'([-\d.]+)', answer_raw)
            if num_match:
                try:
                    ans_val = float(num_match.group(1))
                except:
                    ans_val = 0
            else:
                ans_val = 0
                
        questions.append({
            'num': q_num,
            'question': question,
            'options': options,
            'answer': ans_val
        })
        
        if best_idx == len(current_text):
            break
            
        q_num = next_q
        
    return questions

m1_qs = parse_module(mod1_text)
m2_qs = parse_module(mod2_text)

print(f"Parsed {len(m1_qs)} Math M1 questions")
print(f"Parsed {len(m2_qs)} Math M2 questions")

with open('math_parsed.json', 'w') as f:
    json.dump({'m1': m1_qs, 'm2': m2_qs}, f, indent=2)
