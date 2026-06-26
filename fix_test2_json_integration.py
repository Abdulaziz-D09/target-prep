import json

with open('reading_test.json', 'r') as f:
    reading_data = json.load(f)

with open('test2_parsed.json', 'r') as f:
    orig_data = json.load(f)

# Keep math modules (orig_data[2] and orig_data[3]) if they exist
# Wait, let's see how many modules are in orig_data
if len(orig_data) > 2:
    merged_data = reading_data + orig_data[2:]
else:
    # We might need to generate math from python!
    import re
    # re-parse math using the parser script from earlier
    with open("test2_questions.txt", "r") as tf:
        text = tf.read()
    m1_m_marker = "Section: Section 2, Module 1: Math, Difficulty: unknown (22"
    m2_m_marker = "Section: Section 2, Module 2: Math, Difficulty: hard (22"
    
    start1 = text.find(m1_m_marker)
    start2 = text.find(m2_m_marker)
    
    m1_math = text[start1:start2]
    m2_math = text[start2:]
    
    def custom_parse_math(mod_text):
        questions = []
        chunks = re.split(r'\n(\d+)\.\n', "\n" + mod_text)
        for i in range(1, len(chunks), 2):
            q_num = int(chunks[i])
            q_content = chunks[i+1].strip()
            ans_match = re.search(r'Answer:\s*([A-D0-9\.\-/]+)\s*$', q_content)
            answer = ""
            if ans_match:
                answer = ans_match.group(1)
                q_content = q_content[:ans_match.start()].strip()
                
            opts_match = re.search(r'\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)$', q_content, re.DOTALL)
            options = []
            if opts_match:
                options = [opts_match.group(1).strip(), opts_match.group(2).strip(), opts_match.group(3).strip(), opts_match.group(4).strip()]
                q_content = q_content[:opts_match.start()].strip()
                
            question = q_content
            passage = ""
            
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
                "passage": passage,
                "question": question,
                "options": options,
                "answer": ans_idx,
                "type": q_type
            })
        return questions

    merged_data = reading_data + [{"questions": custom_parse_math(m1_math)}, {"questions": custom_parse_math(m2_math)}]

with open('test2_parsed.json', 'w') as f:
    json.dump(merged_data, f, indent=2)

with open('test2_reading.json', 'w') as f:
    json.dump(merged_data, f, indent=2)

print("Merged Data saved to test2_parsed.json and test2_reading.json!")
