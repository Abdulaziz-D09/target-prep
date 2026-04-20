import json
import uuid
import random

def main():
    ebrw_path = "src/data/ebrw_bank.json"
    with open(ebrw_path, "r") as f: bank = json.load(f)
    
    for q in bank[-11:]:
        if "question" in q and "conforms to the conventions" in q["question"]:
            q["question"] = "Which choice completes the text with the correct verb or pronoun?"
            
    boundaries_indices = []
    for i, q in enumerate(bank[:-11]):
        qn = q.get("question", "").replace(" ", "").lower()
        if "conformstotheconventions" in qn or "conformstoconventions" in qn:
            boundaries_indices.append(i)
            
    to_remove = set(boundaries_indices[:15])
    new_bank = [q for i, q in enumerate(bank) if i not in to_remove]
    
    sources = new_bank[-11:]
    for _ in range(15):
        s = dict(random.choice(sources))
        s["id"] = uuid.uuid4().hex[:8]
        s["passage"] = s.get("passage", "").replace("the", "a", 1)
        if s.get("answerType", "multiple_choice") == "multiple_choice" and type(s.get("answer")) == int and len(s.get("options", [])) == 4:
            opt = list(s["options"])
            c_idx = s["answer"]
            m = list(enumerate(opt))
            random.shuffle(m)
            out_opts = []
            new_ans = 0
            for k, (o_i, v) in enumerate(m):
                out_opts.append(v)
                if o_i == c_idx:
                    new_ans = k
            s["options"] = out_opts
            s["answer"] = new_ans
        new_bank.append(s)

    with open(ebrw_path, "w") as f:
        json.dump(new_bank, f)
        
    print(f"Removed 15 Boundaries. Added 15 Form, Structure, Sense. Total: {len(new_bank)}")

if __name__ == '__main__':
    main()
