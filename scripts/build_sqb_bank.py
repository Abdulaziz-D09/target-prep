#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path
from typing import Any

try:
    from pypdf import PdfReader
except ModuleNotFoundError as error:  # pragma: no cover - CLI dependency guard
    raise SystemExit("Missing dependency: install pypdf with `python3 -m pip install --user pypdf`.") from error


def normalize_id(value: str) -> str:
    return "".join(ch for ch in unicodedata.normalize("NFKC", value).lower() if ch.isalnum())


def normalize_page_text(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\u00a0", " ")
    text = text.replace("\r", "")
    return re.sub(r"\n{3,}", "\n\n", text)


def collapse_inline(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\u00a0", " ")
    text = text.replace("\n", " ")
    return re.sub(r"\s+", " ", text).strip()


def normalize_for_match(text: str) -> tuple[str, list[int]]:
    normalized = []
    mapping: list[int] = []

    for index, char in enumerate(unicodedata.normalize("NFKC", text).lower()):
        if char.isalnum():
            normalized.append(char)
            mapping.append(index)

    return "".join(normalized), mapping


def split_prompt(prompt: str, fallback_question: str) -> tuple[str, str]:
    prompt_norm, prompt_map = normalize_for_match(prompt)
    fallback_norm, _ = normalize_for_match(fallback_question)
    question_position = prompt_norm.find(fallback_norm)

    if question_position != -1:
        raw_start = prompt_map[question_position]
        return collapse_inline(prompt[:raw_start]), collapse_inline(prompt[raw_start:])

    lines = [line.strip() for line in prompt.splitlines() if line.strip()]
    if not lines:
        return "", ""

    if len(lines) == 1:
        return "", collapse_inline(lines[0])

    return collapse_inline("\n".join(lines[:-1])), collapse_inline(lines[-1])


def split_options(body: str) -> tuple[str, list[str]]:
    option_pattern = re.compile(r"(?m)^\s*([A-D])\.\s+")
    matches = list(option_pattern.finditer(body))

    selected_matches = None
    for index in range(max(len(matches) - 4, 0), -1, -1):
        candidate = matches[index : index + 4]
        if [match.group(1) for match in candidate] == ["A", "B", "C", "D"]:
            selected_matches = candidate
            break

    if selected_matches is None:
        raise ValueError("expected exactly four answer options")

    prompt = body[: selected_matches[0].start()].strip()
    options: list[str] = []

    for index, match in enumerate(selected_matches):
        option_start = match.end()
        option_end = selected_matches[index + 1].start() if index < 3 else len(body)
        options.append(collapse_inline(body[option_start:option_end]))

    return prompt, options


def extract_rationale(answer_section: str) -> str:
    rationale_match = re.search(
        r"Rationale\s*(.*?)(?:Question Difficulty:|Assessment\s+SAT)",
        answer_section,
        flags=re.S,
    )
    return collapse_inline(rationale_match.group(1)) if rationale_match else ""


def extract_difficulty(answer_section: str) -> str:
    difficulty_match = re.search(r"Question Difficulty:\s*([A-Za-z]+)", answer_section)
    return difficulty_match.group(1) if difficulty_match else "Medium"


def load_existing_questions(path: Path) -> dict[str, dict[str, Any]]:
    questions = json.loads(path.read_text())
    return {normalize_id(question["id"]): question for question in questions}


def build_blocks(reader: PdfReader) -> list[str]:
    blocks: list[str] = []
    current = ""

    for page in reader.pages:
        page_text = normalize_page_text(page.extract_text() or "")

        if page_text.startswith("Question ID "):
            if current:
                blocks.append(current)
            current = page_text
        else:
            current += "\n" + page_text

    if current:
        blocks.append(current)

    return blocks


def parse_block(block: str, existing_questions: dict[str, dict[str, Any]]) -> dict[str, Any]:
    id_match = re.match(r"Question ID\s+([a-f0-9]+)", block)
    if not id_match:
        raise ValueError("missing question id")

    question_id = id_match.group(1)
    normalized_question_id = normalize_id(question_id)
    existing_question = existing_questions.get(normalized_question_id)

    if existing_question is None:
        raise ValueError(f"missing existing question for id {question_id}")

    start_marker = f"ID: {question_id}\n"
    answer_marker = f"\nID: {question_id} Answer"

    if start_marker not in block or answer_marker not in block:
        raise ValueError(f"could not find question markers for {question_id}")

    question_body = block.split(start_marker, 1)[1].split(answer_marker, 1)[0]
    prompt, options = split_options(question_body)
    passage, question = split_prompt(prompt, existing_question.get("question", ""))

    answer_section = block.split(answer_marker, 1)[1]
    answer_match = re.search(r"Correct Answer:\s*([A-D])", answer_section)

    if not answer_match:
        raise ValueError(f"missing correct answer for {question_id}")

    parsed: dict[str, Any] = {
        "id": question_id,
        "type": existing_question.get("type", "Reading"),
        "passage": passage,
        "question": question,
        "options": options,
        "answer": ord(answer_match.group(1)) - 65,
        "explanation": extract_rationale(answer_section),
        "difficulty": extract_difficulty(answer_section),
    }

    if existing_question.get("image"):
        parsed["image"] = existing_question["image"]

    return parsed


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the SAT question-bank JSON from a College Board SQB PDF export.")
    parser.add_argument("input_pdf", type=Path, help="Absolute or relative path to the SQB PDF export.")
    parser.add_argument("output_json", type=Path, help="Where to write the generated JSON file.")
    parser.add_argument(
        "--existing-json",
        type=Path,
        required=True,
        help="Existing question-bank JSON used for fallback type/question splitting metadata.",
    )
    args = parser.parse_args()

    existing_questions = load_existing_questions(args.existing_json)
    reader = PdfReader(str(args.input_pdf))
    blocks = build_blocks(reader)

    parsed_questions = [parse_block(block, existing_questions) for block in blocks]
    args.output_json.write_text(json.dumps(parsed_questions, ensure_ascii=False, indent=2) + "\n")

    print(f"built {len(parsed_questions)} questions -> {args.output_json}")


if __name__ == "__main__":
    main()
