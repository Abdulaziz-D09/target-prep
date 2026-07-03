import json
import urllib.request
import os
import time
import concurrent.futures
from urllib.error import HTTPError

def load_env():
    env_file = ".env.local"
    if os.path.exists(env_file):
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY="):
                    return line.split("=", 1)[1].strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY", "")

API_KEY = load_env()
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

def needs_blank(q):
    if q.get("type") == "Math": return False
    domain = q.get("domain", "")
    skill = q.get("skill", "")
    passage = q.get("passage", "")
    if "Standard English Conventions" not in domain and "Form, Structure, and Sense" not in skill and "Boundaries" not in skill:
        return False
    if "___" in passage or "\\_" in passage or "..." in passage:
        return False
    return True

def fix_passage(q):
    prompt = f"""
Here is a SAT English question. The passage is missing a blank line '______' indicating where the correct answer should go. Sometimes the passage is completely missing the word, and sometimes the passage accidentally already includes the correct answer word instead of a blank. 
Your task is to return ONLY the fixed passage text, with exactly one '______' inserted in the correct grammatical location for the answer options. Do not include any other text, no markdown tags.

Passage: {q.get('passage')}
Question: {q.get('question')}
Options: {q.get('options')}
Answer Index: {q.get('answer')}
"""
    data = {"contents": [{"parts":[{"text": prompt}]}], "generationConfig": {"temperature": 0.1}}
    req = urllib.request.Request(URL, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    
    max_retries = 5
    for attempt in range(max_retries):
        try:
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode("utf-8"))
            if "candidates" not in result or len(result["candidates"]) == 0:
                return None
            text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            return text
        except HTTPError as e:
            if e.code == 429:
                time.sleep(2 * (attempt + 1))
            else:
                return None
        except Exception:
            return None
    return None

def main():
    ebrw_path = "src/data/ebrw_bank.json"
    with open(ebrw_path, "r") as f:
        bank = json.load(f)
    
    to_fix = [q for q in bank if needs_blank(q)]
    print(f"Found {len(to_fix)} questions needing blanks.")
    
    fixed_count = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_q = {executor.submit(fix_passage, q): q for q in to_fix}
        for future in concurrent.futures.as_completed(future_to_q):
            q = future_to_q[future]
            fixed_text = future.result()
            if fixed_text and "______" in fixed_text:
                q["passage"] = fixed_text
                fixed_count += 1
                if fixed_count % 20 == 0:
                    print(f"Fixed {fixed_count}/{len(to_fix)}...")
            elif fixed_text and "___" in fixed_text:
                q["passage"] = fixed_text
                fixed_count += 1
            else:
                print(f"Failed to fix: {q['id']}")

    print(f"Successfully fixed {fixed_count} passages.")
    
    with open(ebrw_path, "w") as f:
        json.dump(bank, f, indent=2)
        
if __name__ == '__main__':
    main()
