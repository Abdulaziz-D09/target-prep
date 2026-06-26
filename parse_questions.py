import json
import re
import sys
import os

def parse_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    matches = list(re.finditer(r"(?:#+ |)[\*]*Question[\*]*\s+ID[\*]*:[\*]*\s*([A-Za-z0-9]+)[\*]*", content, re.IGNORECASE))
    
    questions = []

    for i in range(len(matches)):
        start = matches[i].start()
        end = matches[i+1].start() if i + 1 < len(matches) else len(content)
        block = content[start:end]
        
        q_id = matches[i].group(1).strip()
        
        metadata_match = re.search(r"<table>(.*?)</table>", block, re.DOTALL | re.IGNORECASE)
        domain = "Reading and Writing"
        skill = ""
        difficulty = ""
        
        if metadata_match:
            table_content = metadata_match.group(1)
            tbody_match = re.search(r"<tbody>(.*?)</tbody>", table_content, re.DOTALL | re.IGNORECASE)
            if tbody_match:
                row_match = re.search(r"<tr>(.*?)</tr>", tbody_match.group(1), re.DOTALL | re.IGNORECASE)
                if row_match:
                    cells = re.findall(r"<td>(.*?)</td>", row_match.group(1), re.DOTALL | re.IGNORECASE)
                    cells = [re.sub(r"<[^>]+>", "", c).strip() for c in cells]
                    if len(cells) >= 5:
                        domain = cells[2]
                        skill = cells[3]
                        difficulty = cells[4]

        question_section_match = re.search(r"(?:#+ |)[\*]*Question[\*]*(?!\s*ID)\s+(.*?)(?:(?:#+ |)[\*]*Answer[\*]*|Correct Answer:)", block, re.DOTALL | re.IGNORECASE)
        passage = ""
        question_text = ""
        
        if question_section_match:
            raw_q = question_section_match.group(1).strip()
            q_paragraphs = [p.strip() for p in raw_q.split("\n\n") if p.strip()]
            if len(q_paragraphs) > 1:
                question_text = q_paragraphs[-1]
                passage = "\n\n".join(q_paragraphs[:-1])
            else:
                passage = raw_q

        answer_section_match = re.search(r"(?:#+ |)[\*]*Answer[\*]*\s*(.*)", block, re.DOTALL | re.IGNORECASE)
        options = []
        if answer_section_match:
            raw_options = answer_section_match.group(1).strip()
            option_matches = re.findall(r"(?:^|\n)([A-D])\.\s*(.*?)(?=(?:\n[A-D]\.)|\n(?:#+ |\*\*)?(?:Correct Answer|Rationale|Choice [A-D] is|Question ID)|$)", raw_options, re.DOTALL | re.IGNORECASE)
            for letter, opt_text in option_matches:
                options.append(opt_text.strip())

        correct_answer_match = re.search(r"(?:#+ |\*\*|)Correct Answer:\s*([A-D])(?:\*\*|)", block, re.IGNORECASE)
        answer_idx = None
        if correct_answer_match:
            ans_letter = correct_answer_match.group(1).upper()
            answer_idx = ord(ans_letter) - ord("A")

        rationale_match = re.search(r"(?:#+ |\*\*|)Rationale(?:\*\*|)\s*(.*)", block, re.DOTALL | re.IGNORECASE)
        explanation = ""
        if rationale_match:
            explanation = rationale_match.group(1).strip()
        else:
            fallback_rationale = re.search(r"(Choice [A-D] is the best answer.*)", block, re.DOTALL | re.IGNORECASE)
            if fallback_rationale:
                explanation = fallback_rationale.group(1).strip()

        questions.append({
            "id": q_id,
            "type": "Reading and Writing",
            "difficulty": difficulty,
            "passage": passage,
            "question": question_text,
            "options": options,
            "answer": answer_idx,
            "explanation": explanation,
            "domain": domain,
            "skill": skill
        })
    return questions

if __name__ == "__main__":
    filepaths = [
        "/Users/abdulazizdavronov/Downloads/EQB(1-903).md",
        "/Users/abdulazizdavronov/Downloads/EQB(904-1806).md"
    ]
    
    all_questions = []
    
    for filepath in filepaths:
        if os.path.exists(filepath):
            questions = parse_file(filepath)
            all_questions.extend(questions)
            print(f"Processed {len(questions)} questions from {filepath}")
        else:
            print(f"File not found: {filepath}")

    out_path = "src/data/ebrw_bank.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=4)
        
    print(f"Successfully saved {len(all_questions)} total questions to {out_path}!")
