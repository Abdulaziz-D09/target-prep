import json
import urllib.request
import os
import uuid
import time
from urllib.error import HTTPError

def load_env():
    env_file = ".env.local"
    if os.path.exists(env_file):
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY="):
                    val = line.split("=", 1)[1]
                    val = val.strip('"').strip("'")
                    return val
    return os.environ.get("GEMINI_API_KEY", "")

API_KEY = load_env()
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

def generate_batch(count):
    prompt = f"""
Generate a JSON array of EXACTLY {count} distinct, high-quality, non-repeating SAT English questions.
These questions must be entirely unique and very challenging.
Focus strictly on the "Form, Structure, and Sense" skill within "Standard English Conventions".
Make sure the questions test verbs, pronouns, and subject-verb agreement or similar grammar concepts typical of this skill.

Respond ONLY with a valid JSON array, do not wrap in markdown tags like ```json, just output the raw JSON array.

EACH OBJECT SCHEMA:
{{
  "type": "Grammar",
  "passage": "1 paragraph of text for the question. Must include a blank '_____' where the answer goes.",
  "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "options": [ "option A", "option B", "option C", "option D" ],
  "answer": 0, 1, 2, or 3,
  "explanation": "Detailed step by step logic.",
  "difficulty": "Hard",
  "domain": "Standard English Conventions",
  "skill": "Form, Structure, and Sense"
}}
"""
    
    data = {"contents": [{"parts":[{"text": prompt}]}], "generationConfig": {"temperature": 0.9}}
    req = urllib.request.Request(URL, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    
    max_retries = 10
    for attempt in range(max_retries):
        try:
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode("utf-8"))
            if "candidates" not in result or len(result["candidates"]) == 0:
                print("No candidates in response:", result)
                return []
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            text = text.strip()
            if text.startswith('```json'): text = text[7:]
            if text.startswith('```'): text = text[3:]
            if text.endswith('```'): text = text[:-3]
            objs = json.loads(text.strip())
            for o in objs:
                o["id"] = uuid.uuid4().hex[:8]
                if "options" not in o: o["options"] = []
                if "type" not in o: o["type"] = "Grammar"
                o["skill"] = "Form, Structure, and Sense"
                o["domain"] = "Standard English Conventions"
            return objs
        except HTTPError as e:
            if e.code == 429:
                print(f"Rate limited (429). Retrying in {10 * (attempt + 1)}s...")
                time.sleep(10 * (attempt + 1))
            else:
                print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
                return []
        except Exception as e:
            print(f"Error parse: {e}")
            return []
    return []

def main():
    ebrw_path = "src/data/ebrw_bank.json"

    with open(ebrw_path, "r") as f: 
        ebrw_bank = json.load(f)

    target_count = 131
    generated = 0
    
    print(f"Generating {target_count} English questions...")
    
    while generated < target_count:
        batch_size = min(30, target_count - generated)
        print(f"Requesting batch of {batch_size} questions...")
        q = generate_batch(batch_size)
        if q:
            ebrw_bank.extend(q)
            generated += len(q)
            with open(ebrw_path, "w") as f:
                json.dump(ebrw_bank, f, indent=2)
            print(f"Success! Appended {len(q)} questions. Total generated: {generated}/{target_count}")
        time.sleep(4)
        
if __name__ == '__main__':
    main()
