import json
import urllib.request
import os
import uuid
import time
import concurrent.futures
from urllib.error import HTTPError

API_KEY = os.environ.get("GEMINI_API_KEY", "")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

def generate_batch(count, q_type, prompt_addition):
    prompt = f"""
Generate a JSON array of EXACTLY {count} distinct, high-quality, non-repeating SAT {q_type} questions.
These questions must be entirely unique and very challenging.
{prompt_addition}

Respond ONLY with a valid JSON array, do not wrap in markdown tags like ```json, just output the raw JSON array.

EACH OBJECT SCHEMA:
"""
    if q_type == "Math":
        prompt += """
{
  "type": "Math",
  "question": "A complete, challenging SAT Math question text. You MUST use markdown tables (e.g. | x | y |\n|---|---|\n| 1 | 2 |) if representing data. Make up random contexts.",
  "options": [ "A", "B", "C", "D" ] (or empty [] if answerType is numeric),
  "answerType": "multiple_choice" or "numeric",
  "answer": 0, 1, 2, or 3 (if multiple choice),
  "answerText": "A" (or the numerical answer, or string value for multiple choice like '4'),
  "explanation": "Detailed step by step logic.",
  "difficulty": "Easy", "Medium", or "Hard",
  "domain": "Algebra", "Advanced Math", "Problem-Solving and Data Analysis", or "Geometry and Trigonometry",
  "skill": "Relevant SAT skill name"
}
"""
    elif q_type == "Reading":
        prompt += """
{
  "type": "Grammar",
  "passage": "1 paragraph of text for the question.",
  "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "options": [ "option A", "option B", "option C", "option D" ],
  "answer": 0, 1, 2, or 3,
  "explanation": "Detailed step by step logic.",
  "difficulty": "Hard",
  "domain": "Standard English Conventions",
  "skill": "Form, Structure, and Sense"
}
"""
    
    data = {"contents": [{"parts":[{"text": prompt}]}], "generationConfig": {"temperature": 0.9}}
    req = urllib.request.Request(URL, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    
    max_retries = 10
    for attempt in range(max_retries):
        try:
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode("utf-8"))
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            text = text.strip()
            if text.startswith('```json'): text = text[7:]
            if text.startswith('```'): text = text[3:]
            if text.endswith('```'): text = text[:-3]
            objs = json.loads(text.strip())
            for o in objs:
                o["id"] = uuid.uuid4().hex[:8]
                # Default arrays so we don't break the UI
                if "options" not in o: o["options"] = []
                if "type" not in o: o["type"] = q_type
                if q_type == "Math" and "answerType" not in o: o["answerType"] = "multiple_choice"
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
    math_path = "src/data/math_bank.json"

    with open(ebrw_path, "r") as f: ebrw_bank = json.load(f)
    with open(math_path, "r") as f: math_bank = json.load(f)

    ebrw_needed = 1600 - len(ebrw_bank)
    math_needed = 1600 - len(math_bank)
    
    print(f"EBRW needed: {ebrw_needed}, Math needed: {math_needed}")

    if ebrw_needed > 0:
        print(f"Generating {ebrw_needed} English questions...")
        q = generate_batch(ebrw_needed, "Reading", "Focus strictly on grammar rules and sense.")
        if q:
            ebrw_bank.extend(q[:ebrw_needed])
            with open(ebrw_path, "w") as f:
                json.dump(ebrw_bank, f)
            print(f"Appended {len(q)} English questions. Total is now exactly 1600.")
            ebrw_needed = 0

    if math_needed > 0:
        print(f"Generating Math questions...")
        while math_needed > 0:
            batch_size = min(30, math_needed)
            print(f"Requesting {batch_size} math questions...")
            q = generate_batch(batch_size, "Math", "Focus strictly on challenging word problems and complex expressions. Add tables.")
            if q:
                math_bank.extend(q)
                with open(math_path, "w") as f:
                    json.dump(math_bank, f)
                math_needed = 1600 - len(math_bank)
                print(f"Success! {len(q)} generated. Math needed: {math_needed}")
            time.sleep(4)

if __name__ == '__main__':
    main()
