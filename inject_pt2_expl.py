import re

with open("test2_explanations.txt", "r") as f:
    text = f.read()

sections = re.split(r'# SECTION .*? — MODULE .*? \([^)]*\) — \d+ Questions|MODULE 1 \(\d+ Questions\)|MODULE 2 — HARD \(\d+ Questions\)', text)

modules_exps = []
for p in sections[1:5]:
    exps = {}
    chunks = re.split(r'^## Question (\d+)', p, flags=re.MULTILINE)
    for i in range(1, len(chunks), 2):
        num = int(chunks[i])
        exps[num] = chunks[i+1].strip()
    modules_exps.append(exps)

with open("src/data/questions.ts", "r") as f:
    ts_code = f.read()

def inject_explanations(ts_code, module_id, exps):
    pattern = rf'("id": "{module_id}-q(\d+)",\s*"num": \d+,[\s\S]*?"difficulty": "[^"]*")(\s*\}})'
    count = 0
    def replacer(match):
        nonlocal count
        block = match.group(1)
        qnum = int(match.group(2))
        end = match.group(3)
        if qnum in exps:
            count += 1
            exp_text = exps[qnum].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
            return f'{block},\n        "explanation": "{exp_text}"{end}'
        return match.group(0)
    
    new_code = re.sub(pattern, replacer, ts_code)
    print(f"{module_id}: Injected {count} explanations")
    return new_code

ts_code = inject_explanations(ts_code, "pt2-reading-m1", modules_exps[0])
ts_code = inject_explanations(ts_code, "pt2-reading-m2", modules_exps[1])
ts_code = inject_explanations(ts_code, "pt2-math-m1", modules_exps[2])
ts_code = inject_explanations(ts_code, "pt2-math-m2", modules_exps[3])

with open("src/data/questions.ts", "w") as f:
    f.write(ts_code)
