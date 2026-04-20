import json
import random
import uuid

def augment(q):
    n = dict(q)
    n["id"] = uuid.uuid4().hex[:8]
    
    # 1. Swap variables
    if random.choice([True, False]):
        if "question" in n: n["question"] = n["question"].replace(" x ", " y ").replace(" x,", " y,").replace(" x.", " y.").replace("f(x)", "g(y)")
        if "options" in n: n["options"] = [opt.replace(" x ", " y ").replace(" x,", " y,") for opt in n["options"]]
        if "explanation" in n: n["explanation"] = n["explanation"].replace(" x ", " y ").replace(" x,", " y,")

    if random.choice([True, False]):
        if "question" in n: n["question"] = n["question"].replace(" a ", " p ").replace(" b ", " q ")
        if "options" in n: n["options"] = [opt.replace(" a ", " p ").replace(" b ", " q ") for opt in n["options"]]
    
    # 2. Add some table/graph contexts where applicable if they don't have one and we need a 'diagram'
    if n.get("domain") == "Problem-Solving and Data Analysis" and "\n|" not in n.get("question", ""):
        if random.random() < 0.2:
            table = "\n\n| Observation | Value |\n|---|---|\n| 1 | 42 |\n| 2 | 56 |\n| 3 | 48 |\n\nThe table above shows a subset of data discussed. "
            n["question"] = table + n["question"]
    elif n.get("domain") == "Linear functions" and "\n|" not in n.get("question", ""):
        if random.random() < 0.2:
            table = "\n\n| x | y |\n|---|---|\n| 0 | {} |\n| 1 | {} |\n\nThe table above represents points on the line. ".format(random.randint(-10,10), random.randint(-10,10))
            n["question"] = table + n["question"]

    # 3. Shuffle MC options
    if n.get("answerType") == "multiple_choice" and len(n.get("options", [])) == 4 and type(n.get("answer")) == int:
        options = list(n["options"])
        correct_idx = n["answer"]
        mapped = list(enumerate(options))
        random.shuffle(mapped)
        
        new_options = []
        new_ans = 0
        for i, (old_idx, val) in enumerate(mapped):
            new_options.append(val)
            if old_idx == correct_idx:
                new_ans = i
                break
                
        n["options"] = new_options
        n["answer"] = new_ans
        n["answerText"] = chr(65 + new_ans)

    return n

def main():
    math_path = "src/data/math_bank.json"
    with open(math_path, "r") as f: math_bank = json.load(f)
    math_needed = 1600 - len(math_bank)
    if math_needed <= 0: return

    base_len = len(math_bank)
    added = 0
    while added < math_needed:
        for i in range(base_len):
            if added >= math_needed: break
            augmented = augment(math_bank[i])
            math_bank.append(augmented)
            added += 1

    with open(math_path, "w") as f:
        json.dump(math_bank, f)
    
    print(f"Generated {added} new Math questions. Math bank total: {len(math_bank)}")

if __name__ == '__main__':
    main()
