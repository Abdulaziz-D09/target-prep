#!/usr/bin/env python3
"""
Rebuild math_bank.json with proper text extracted from the answer-key PDFs.

The original build_math_bank.py extracted text via pypdf but lost all inline
math symbols (they are embedded images inside the PDF).  The *rationale*
section, however, often contains the same expressions in plain Unicode text.

This script:
1.  Re-reads every answer-key PDF.
2.  For each question, pulls out the rationale text which has full math.
3.  Uses the rationale to reconstruct the question text and option text
    when the extracted fields are blank / too short.
4.  Removes image/imageLayout for questions that no longer need them
    (pure text questions).  Keeps images for questions that contain
    graphs, tables, or figures that cannot be represented as text.
5.  Writes the updated math_bank.json.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from typing import Any

from pypdf import PdfReader

REPO_ROOT = Path(__file__).resolve().parents[2]
APP_ROOT  = Path(__file__).resolve().parents[1]
ANSWER_ROOT = REPO_ROOT / "Math (1)"
OUTPUT_JSON = APP_ROOT / "src" / "data" / "math_bank.json"
EXISTING_JSON = OUTPUT_JSON  # we patch in-place

SKILL_LABELS = {
    "Linear Equations in One Variable": "Linear equations in one variable",
    "Linear Functions": "Linear functions",
    "Linear Equations in Two Variables": "Linear equations in two variables",
    "Systems of Linear Equations": "Systems of two linear equations in two variables",
    "Linear Inequalities": "Linear inequalities in one or two variables",
    "Equivalent Expressions": "Equivalent expressions",
    "Nonlinear Equations and Systems": "Nonlinear equations in one variable and systems of equations in two variables",
    "Nonlinear Functions": "Nonlinear functions",
    "Ratios, Rates, Proportions, and Units": "Ratios, rates, proportional relationships, and units",
    "Percentages": "Percentages",
    "One-Variable Data": "One-variable data: Distributions and measures of center and spread",
    "Two-Variable Data": "Two-variable data: Models and scatterplots",
    "Probability": "Probability and conditional probability",
    "Sample Statistics and Margin of Error": "Inference from sample statistics and margin of error",
    "Evaluating Statistical Claims": "Evaluating statistical claims: Observational studies and experiments",
    "Area and Volume": "Area and volume",
    "Lines, Angles, and Triangles": "Lines, angles, and triangles",
    "Right Triangles and Trigonometry": "Right triangles and trigonometry",
    "Circles": "Circles",
}


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\u00a0", " ")
    text = text.replace("\r", "")
    return text


def collapse(text: str) -> str:
    return re.sub(r"\s+", " ", normalize(text)).strip()


def extract_question_id(text: str) -> str:
    m = re.match(r"Question ID\s+([a-f0-9]+)", normalize(text))
    if not m:
        raise ValueError("missing question id")
    return m.group(1)


def build_blocks(reader: PdfReader) -> list[str]:
    blocks: list[str] = []
    current = ""
    for page in reader.pages:
        page_text = normalize(page.extract_text() or "")
        if page_text.startswith("Question ID "):
            if current:
                blocks.append(current)
            current = page_text
        else:
            current += "\n" + page_text
    if current:
        blocks.append(current)
    return blocks


def split_options(body: str) -> tuple[str, list[str]]:
    option_pattern = re.compile(r"(?m)^\s*([A-D])\.\s*")
    matches = list(option_pattern.finditer(body))
    if len(matches) < 4:
        return collapse(body), []
    selected = None
    for idx in range(max(len(matches) - 4, 0), -1, -1):
        candidate = matches[idx:idx + 4]
        if [m.group(1) for m in candidate] == ["A", "B", "C", "D"]:
            selected = candidate
            break
    if selected is None:
        return collapse(body), []
    prompt = body[:selected[0].start()].strip()
    options = []
    for idx, m in enumerate(selected):
        start = m.end()
        end = selected[idx + 1].start() if idx < 3 else len(body)
        options.append(collapse(body[start:end]))
    return collapse(prompt), options


def extract_correct_answer(answer_section: str) -> str:
    norm = normalize(answer_section)
    if "Correct Answer:" in norm and "Rationale" in norm:
        ca = norm.split("Correct Answer:", 1)[1].split("Rationale", 1)[0]
        ca = collapse(ca)
        if ca:
            return ca
    m = re.search(r"Rationale\s+The correct answer is\s+(.+?)(?:\.|(?:\s*\n))", norm, re.I | re.S)
    if m:
        return collapse(m.group(1))
    m = re.search(r"Rationale\s+Choice\s+([A-D])\s+is\s+correct", norm, re.I)
    if m:
        return m.group(1).upper()
    raise ValueError("missing correct answer")


def extract_rationale(answer_section: str) -> str:
    m = re.search(
        r"Rationale\s*(.*?)(?:Question Difficulty:|Assessment\s+SAT)",
        normalize(answer_section),
        re.S,
    )
    return collapse(m.group(1)) if m else ""


def extract_difficulty(answer_section: str) -> str:
    m = re.search(r"Question Difficulty:\s*([A-Za-z]+)", normalize(answer_section))
    return m.group(1) if m else "Medium"


def split_answer_variants(answer_text: str) -> list[str]:
    variants = []
    for chunk in re.split(r"\s+or\s+", collapse(answer_text), flags=re.I):
        for part in re.split(r"\s*;\s*", chunk):
            cleaned = part.strip().strip(".")
            if cleaned and cleaned not in variants:
                variants.append(cleaned)
    return variants or [collapse(answer_text)]


# ── Extract option text from rationale ──────────────────────────────────────
def extract_options_from_rationale(rationale: str, correct_letter: str) -> list[str]:
    """
    Try to pull out the option descriptions from the rationale text.
    The rationale typically says things like:
      "Choice A is incorrect. This is equivalent to 11x³ + 5x³, not 11x³ −5x³."
      "Choice B is correct. ... yields 6x³."
    We try to extract the math expression for each option.
    """
    options = ["", "", "", ""]
    letters = "ABCD"
    
    for i, letter in enumerate(letters):
        # For the correct answer, look for "yields <expr>" or "results in <expr>" or "is equivalent to <expr>"
        if letter == correct_letter:
            # Try patterns like "yields X", "results in X", "gives X", "is X"
            patterns = [
                rf"Choice\s+{letter}\s+is\s+correct.*?(?:yields?|results?\s+in|gives?|is\s+equivalent\s+to|simplif(?:ies|y)\s+to|can\s+be\s+rewritten\s+as)\s+([^.]+?)(?:\.|,\s+which)",
            ]
            for pat in patterns:
                m = re.search(pat, rationale, re.I | re.S)
                if m:
                    options[i] = collapse(m.group(1))
                    break
        else:
            # For incorrect answers, look for "This is equivalent to X" or "This expression is equivalent to X"
            patterns = [
                rf"Choice\s+{letter}\s+is\s+incorrect.*?(?:This\s+(?:expression\s+)?is\s+equivalent\s+to|This\s+is\s+the\s+value\s+of)\s+([^,.\n]+)",
                rf"Choice\s+{letter}\s+is\s+incorrect.*?(?:If\s+.*?then\s+.*?would\s+be\s+equivalent\s+to)\s+([^,.\n]+)",
            ]
            for pat in patterns:
                m = re.search(pat, rationale, re.I | re.S)
                if m:
                    options[i] = collapse(m.group(1))
                    break
    
    return options


def extract_question_expression_from_rationale(rationale: str, question_text: str) -> str:
    """
    Try to extract the main expression from the rationale.
    For example, if the question is "Which expression is equivalent to ?" 
    and the rationale says "The given expression can be rewritten as 11x³ + -5x³",
    we want to find "11x³ − 5x³".
    """
    patterns = [
        r"(?:the\s+given\s+expression|It'?s\s+given\s+that)\s*,?\s*([^,]+?)\s*,?\s*(?:can\s+be|is\s+equivalent|yields|gives)",
        r"(?:The\s+expression)\s+([^,]+?)\s+(?:can\s+be|is\s+equivalent|has|yields|gives)",
        r"(?:given\s+expression)\s+([^,]+?)(?:\s*,|\s+can|\s+is|\s+yields|\s+gives)",
    ]
    for pat in patterns:
        m = re.search(pat, rationale, re.I | re.S)
        if m:
            expr = collapse(m.group(1))
            # Filter out overly long matches (probably grabbed a sentence)
            if len(expr) < 80:
                return expr
    return ""


# ── Determine if a question needs its image (graph/table/figure) ────────────
IMAGE_NEEDED_KEYWORDS = [
    "graph", "figure", "diagram", "table", "shown above", "shown below",
    "scatter", "plot", "circle", "triangle", "rectangle", "quadrilateral",
    "line segment", "coordinate", "xy-plane", "number line", "histogram",
    "bar graph", "pie chart", "box plot", "the graph of",
    "shown in the figure", "shown in the graph", "shown in the table",
    "the figure above", "the figure below", "depicted",
]

def question_needs_image(question: dict) -> bool:
    """Questions with graphs, diagrams, or data tables still need images."""
    q_text = (question.get("question", "") + " " + question.get("explanation", "")).lower()
    for kw in IMAGE_NEEDED_KEYWORDS:
        if kw in q_text:
            return True
    return False


def main() -> None:
    # Load existing bank
    existing_data: list[dict[str, Any]] = json.loads(EXISTING_JSON.read_text())
    existing_map: dict[str, dict[str, Any]] = {q["id"]: q for q in existing_data}
    
    print(f"Loaded {len(existing_data)} questions from {EXISTING_JSON}")
    
    # Parse all answer-key PDFs
    pdf_data: dict[str, dict[str, Any]] = {}  # question_id -> extracted data
    
    for answer_pdf in sorted(ANSWER_ROOT.rglob("*.pdf")):
        reader = PdfReader(str(answer_pdf))
        blocks = build_blocks(reader)
        domain = answer_pdf.parent.name
        skill_key = re.sub(r"\s+\d+$", "", answer_pdf.stem.replace(" Answer Key", ""))
        skill = SKILL_LABELS.get(skill_key, skill_key)
        
        for block in blocks:
            try:
                qid = extract_question_id(block)
            except ValueError:
                continue
            
            q_marker = f"ID: {qid}\n"
            a_marker = f"\nID: {qid} Answer"
            
            if q_marker not in block or a_marker not in block:
                continue
            
            q_body = block.split(q_marker, 1)[1].split(a_marker, 1)[0]
            a_section = block.split(a_marker, 1)[1]
            
            q_text, options = split_options(q_body)
            try:
                correct = extract_correct_answer(a_section)
            except ValueError:
                correct = ""
            rationale = extract_rationale(a_section)
            difficulty = extract_difficulty(a_section)
            answer_type = "multiple_choice" if re.fullmatch(r"[A-D]", correct) else "numeric"
            
            pdf_data[qid] = {
                "question_text": q_text,
                "options": options,
                "correct": correct,
                "rationale": rationale,
                "difficulty": difficulty,
                "domain": domain,
                "skill": skill,
                "answer_type": answer_type,
            }
    
    print(f"Parsed {len(pdf_data)} questions from answer-key PDFs")
    
    # Now patch the existing bank
    updated = 0
    text_fixed = 0
    options_fixed = 0
    images_removed = 0
    
    for q in existing_data:
        qid = q["id"]
        pdf = pdf_data.get(qid)
        if not pdf:
            continue
        
        # Always use best-available rationale
        if pdf["rationale"] and (not q.get("explanation") or len(pdf["rationale"]) > len(q.get("explanation", ""))):
            q["explanation"] = pdf["rationale"]
        
        # Fix question text if it's empty or placeholder
        q_text = q.get("question", "")
        needs_text_fix = (
            not q_text
            or q_text == "Solve the problem shown in the image."
            or q_text.endswith(" ?")  # trailing question mark means math was lost: "equivalent to ?"
            or q_text.strip().endswith("to")
            or q_text.strip().endswith("to the")
        )
        
        if needs_text_fix and pdf["question_text"]:
            # The PDF also lost the math, but let's try to reconstruct from rationale
            expr = extract_question_expression_from_rationale(pdf["rationale"], pdf["question_text"])
            if expr and pdf["question_text"].endswith("?"):
                # Insert the expression before the question mark
                base = pdf["question_text"][:-1].rstrip()
                q["question"] = f"{base} {expr}?"
                text_fixed += 1
            elif pdf["question_text"] and len(pdf["question_text"]) > len(q_text):
                q["question"] = pdf["question_text"]
                if pdf["question_text"] != q_text:
                    text_fixed += 1
        
        # Fix empty options
        has_empty_options = q.get("options") and any(opt == "" for opt in q["options"])
        
        if has_empty_options and pdf["answer_type"] == "multiple_choice":
            # Try to extract options from rationale
            correct_letter = pdf["correct"] if re.fullmatch(r"[A-D]", pdf["correct"]) else ""
            if correct_letter:
                extracted_opts = extract_options_from_rationale(pdf["rationale"], correct_letter)
                
                for i in range(min(len(q["options"]), 4)):
                    if q["options"][i] == "" and extracted_opts[i]:
                        q["options"][i] = extracted_opts[i]
                        options_fixed += 1
        
        # If we now have both question text and all options filled,
        # and the question doesn't need a graph/diagram, remove the image
        all_options_filled = q.get("options") and all(opt != "" for opt in q["options"])
        has_question_text = q.get("question") and not q["question"].endswith(" ?")
        
        if all_options_filled and has_question_text and not question_needs_image(q):
            if "image" in q:
                del q["image"]
                images_removed += 1
            if "imageLayout" in q:
                del q["imageLayout"]
        
        updated += 1
    
    # Count remaining issues
    still_empty_opts = sum(1 for q in existing_data if q.get("options") and any(o == "" for o in q["options"]))
    still_needs_image = sum(1 for q in existing_data if "image" in q)
    
    print(f"\nResults:")
    print(f"  Updated: {updated}")
    print(f"  Question text fixed: {text_fixed}")
    print(f"  Option texts fixed: {options_fixed}")
    print(f"  Images removed (text-only now): {images_removed}")
    print(f"  Still have empty options: {still_empty_opts}")
    print(f"  Still need image: {still_needs_image}")
    
    # Write
    OUTPUT_JSON.write_text(json.dumps(existing_data, ensure_ascii=False, indent=2) + "\n")
    print(f"\nWrote {len(existing_data)} questions to {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
