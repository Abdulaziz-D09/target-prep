#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
import unicodedata
from pathlib import Path
from typing import Any

from PIL import Image
from pypdf import PdfReader, PdfWriter


REPO_ROOT = Path(__file__).resolve().parents[2]
APP_ROOT = Path(__file__).resolve().parents[1]
QUESTION_ROOT = REPO_ROOT / "Math"
ANSWER_ROOT = REPO_ROOT / "Math (1)"
OUTPUT_JSON = APP_ROOT / "src" / "data" / "math_bank.json"
OUTPUT_IMAGE_DIR = APP_ROOT / "public" / "math-bank"
THUMBNAIL_SIZE = 1320
IMAGE_WIDTH = 1020
IMAGE_HEIGHT = 1320

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


def normalize_text(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\u00a0", " ")
    text = text.replace("\r", "")
    return text


def collapse_inline(text: str) -> str:
    return re.sub(r"\s+", " ", normalize_text(text)).strip()


def build_blocks(reader: PdfReader) -> list[str]:
    blocks: list[str] = []
    current = ""

    for page in reader.pages:
        page_text = normalize_text(page.extract_text() or "")

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
        return collapse_inline(body), []

    selected_matches = None
    for index in range(max(len(matches) - 4, 0), -1, -1):
        candidate = matches[index : index + 4]
        if [match.group(1) for match in candidate] == ["A", "B", "C", "D"]:
            selected_matches = candidate
            break

    if selected_matches is None:
        return collapse_inline(body), []

    prompt = body[: selected_matches[0].start()].strip()
    options: list[str] = []

    for index, match in enumerate(selected_matches):
        option_start = match.end()
        option_end = selected_matches[index + 1].start() if index < 3 else len(body)
        options.append(collapse_inline(body[option_start:option_end]))

    return collapse_inline(prompt), options


def extract_correct_answer(answer_section: str) -> str:
    normalized = normalize_text(answer_section)

    if "Correct Answer:" in normalized and "Rationale" in normalized:
        correct_answer = normalized.split("Correct Answer:", 1)[1].split("Rationale", 1)[0]
        collapsed = collapse_inline(correct_answer)
        if collapsed:
            return collapsed

    rationale_answer = re.search(r"Rationale\s+The correct answer is\s+(.+?)(?:\.|\n)", normalized, flags=re.I | re.S)
    if rationale_answer:
        return collapse_inline(rationale_answer.group(1))

    rationale_choice = re.search(r"Rationale\s+Choice\s+([A-D])\s+is\s+correct", normalized, flags=re.I)
    if rationale_choice:
        return rationale_choice.group(1).upper()

    raise ValueError("missing correct answer markers")


def extract_rationale(answer_section: str) -> str:
    match = re.search(
        r"Rationale\s*(.*?)(?:Question Difficulty:|Assessment\s+SAT)",
        normalize_text(answer_section),
        flags=re.S,
    )
    return collapse_inline(match.group(1)) if match else ""


def extract_difficulty(answer_section: str) -> str:
    match = re.search(r"Question Difficulty:\s*([A-Za-z]+)", normalize_text(answer_section))
    return match.group(1) if match else "Medium"


def split_answer_variants(answer_text: str) -> list[str]:
    variants: list[str] = []

    for chunk in re.split(r"\s+or\s+", collapse_inline(answer_text), flags=re.I):
        for part in re.split(r"\s*;\s*", chunk):
            cleaned = part.strip().strip(".")
            if cleaned and cleaned not in variants:
                variants.append(cleaned)

    return variants or [collapse_inline(answer_text)]


def extract_question_id(text: str) -> str:
    match = re.match(r"Question ID\s+([a-f0-9]+)", normalize_text(text))
    if not match:
        raise ValueError("missing question id")
    return match.group(1)


def clamp(value: int, minimum: int, maximum: int) -> int:
    return max(minimum, min(value, maximum))


def to_crop(x: int, y: int, width: int, height: int) -> dict[str, float]:
    return {
        "x": round(x / IMAGE_WIDTH, 6),
        "y": round(y / IMAGE_HEIGHT, 6),
        "width": round(width / IMAGE_WIDTH, 6),
        "height": round(height / IMAGE_HEIGHT, 6),
    }


def build_darkness_bands(
    samples: list[tuple[int, int]],
    *,
    minimum_dark: int,
    minimum_height: int,
    quiet_samples: int = 2,
) -> list[tuple[int, int]]:
    if not samples:
        return []

    row_step = samples[1][0] - samples[0][0] if len(samples) > 1 else 1
    bands: list[tuple[int, int]] = []
    in_band = False
    band_start = samples[0][0]
    quiet_count = 0
    last_dark_y = samples[0][0]

    for y, value in samples:
        if value >= minimum_dark:
            if not in_band:
                in_band = True
                band_start = y
            quiet_count = 0
            last_dark_y = y
            continue

        if not in_band:
            continue

        quiet_count += 1
        if quiet_count >= quiet_samples:
            band_end = last_dark_y + row_step
            if band_end - band_start >= minimum_height:
                bands.append((band_start, band_end))
            in_band = False
            quiet_count = 0

    if in_band:
        band_end = last_dark_y + row_step
        if band_end - band_start >= minimum_height:
            bands.append((band_start, band_end))

    return bands


def detect_math_image_layout(image_path: Path, answer_type: str) -> dict[str, Any]:
    image = Image.open(image_path).convert("L")
    width, height = image.size

    if (width, height) != (IMAGE_WIDTH, IMAGE_HEIGHT):
        raise ValueError(f"unexpected image size for {image_path}: {(width, height)}")

    pixels = image.load()
    content_start_y = 280
    row_step = 2
    label_probe = range(8, 90, 2)
    stem_x = 16
    stem_width = 972
    option_x = 48
    option_width = 940

    label_samples: list[tuple[int, int]] = []
    for y in range(content_start_y, height - 20, row_step):
        label_dark = 0
        for x in label_probe:
            if pixels[x, y] < 245:
                label_dark += 1
        label_samples.append((y, label_dark))

    label_bands = build_darkness_bands(label_samples, minimum_dark=2, minimum_height=8)

    layout: dict[str, Any] = {}

    if answer_type == "multiple_choice" and len(label_bands) >= 4:
        selected_option_bands = label_bands[-4:]
        stem_end = selected_option_bands[0][0] - 18
        option_crops = []

        for index, (start, end) in enumerate(selected_option_bands):
            next_start = selected_option_bands[index + 1][0] if index < len(selected_option_bands) - 1 else start + 66
            crop_y = clamp(start - 8, content_start_y, height - 50)
            crop_end = clamp(
                end + 8,
                crop_y + 24,
                height - 18,
            )
            option_crops.append(to_crop(option_x, crop_y, option_width, crop_end - crop_y))

        layout["options"] = option_crops
    else:
        full_samples: list[tuple[int, int]] = []
        for y in range(content_start_y, height - 20, row_step):
            full_dark = 0
            for x in range(12, width - 12, 4):
                if pixels[x, y] < 245:
                    full_dark += 1
            full_samples.append((y, full_dark))

        content_bands = build_darkness_bands(full_samples, minimum_dark=3, minimum_height=10)
        content_bottom = content_bands[-1][1] if content_bands else 420
        stem_end = content_bottom + 18

    stem_end = clamp(stem_end, content_start_y + 44, height - 18)
    layout["stem"] = to_crop(stem_x, content_start_y, stem_width, stem_end - content_start_y)
    return layout


class QuestionPdfCache:
    def __init__(self, pdf_path: Path):
        self.pdf_path = pdf_path
        self.reader = PdfReader(str(pdf_path))
        self.page_by_id: dict[str, int] = {}

        for index, page in enumerate(self.reader.pages):
            page_text = normalize_text(page.extract_text() or "")
            if not page_text.startswith("Question ID "):
                continue
            question_id = extract_question_id(page_text)
            self.page_by_id[question_id] = index

    def render_question_image(self, question_id: str, output_path: Path) -> None:
        if output_path.exists():
            return

        if question_id not in self.page_by_id:
            raise KeyError(f"{question_id} not found in {self.pdf_path}")

        writer = PdfWriter()
        writer.add_page(self.reader.pages[self.page_by_id[question_id]])
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with tempfile.TemporaryDirectory() as temp_dir_raw:
            temp_dir = Path(temp_dir_raw)
            single_page_pdf = temp_dir / f"{question_id}.pdf"
            preview_png = temp_dir / f"{single_page_pdf.name}.png"
            preview_jpg = temp_dir / f"{question_id}.jpg"

            with single_page_pdf.open("wb") as handle:
                writer.write(handle)

            subprocess.run(
                ["qlmanage", "-t", "-s", str(THUMBNAIL_SIZE), "-o", str(temp_dir), str(single_page_pdf)],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

            if not preview_png.exists():
                raise FileNotFoundError(f"Quick Look did not render {single_page_pdf}")

            subprocess.run(
                [
                    "sips",
                    "-s",
                    "format",
                    "jpeg",
                    "-s",
                    "formatOptions",
                    "82",
                    str(preview_png),
                    "--out",
                    str(preview_jpg),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

            shutil.copy2(preview_jpg, output_path)


def main() -> None:
    if not QUESTION_ROOT.exists():
        raise SystemExit(f"Missing question source directory: {QUESTION_ROOT}")
    if not ANSWER_ROOT.exists():
        raise SystemExit(f"Missing answer source directory: {ANSWER_ROOT}")

    question_pdf_by_stem: dict[str, Path] = {}
    for pdf_path in QUESTION_ROOT.rglob("*.pdf"):
        stem = pdf_path.stem
        if stem in question_pdf_by_stem:
            raise SystemExit(f"Duplicate question PDF stem: {stem}")
        question_pdf_by_stem[stem] = pdf_path

    question_pdf_caches: dict[Path, QuestionPdfCache] = {}
    parsed_questions: list[dict[str, Any]] = []

    for answer_pdf_path in sorted(ANSWER_ROOT.rglob("*.pdf")):
        question_pdf_stem = answer_pdf_path.stem.replace(" Answer Key", "")
        question_pdf_path = question_pdf_by_stem.get(question_pdf_stem)

        if question_pdf_path is None:
            raise SystemExit(f"Could not find matching question PDF for {answer_pdf_path.name}")

        cache = question_pdf_caches.setdefault(question_pdf_path, QuestionPdfCache(question_pdf_path))
        answer_reader = PdfReader(str(answer_pdf_path))
        blocks = build_blocks(answer_reader)

        domain = answer_pdf_path.parent.name
        skill_key = re.sub(r"\s+\d+$", "", question_pdf_stem)
        skill = SKILL_LABELS.get(skill_key, skill_key)

        for block in blocks:
            question_id = extract_question_id(block)
            question_marker = f"ID: {question_id}\n"
            answer_marker = f"\nID: {question_id} Answer"

            if question_marker not in block or answer_marker not in block:
                raise ValueError(f"could not find question markers for {question_id}")

            question_body = block.split(question_marker, 1)[1].split(answer_marker, 1)[0]
            answer_section = block.split(answer_marker, 1)[1]
            question_text, options = split_options(question_body)
            correct_answer = extract_correct_answer(answer_section)
            answer_type = "multiple_choice" if re.fullmatch(r"[A-D]", correct_answer) else "numeric"
            image_path = OUTPUT_IMAGE_DIR / f"{question_id}.jpg"
            cache.render_question_image(question_id, image_path)

            question_payload: dict[str, Any] = {
                "id": question_id,
                "type": "Math",
                "passage": "",
                "question": question_text or "Solve the problem shown in the image.",
                "options": options,
                "explanation": extract_rationale(answer_section),
                "difficulty": extract_difficulty(answer_section),
                "domain": domain,
                "skill": skill,
                "image": f"/math-bank/{question_id}.jpg",
                "imageLayout": detect_math_image_layout(image_path, answer_type),
                "answerType": answer_type,
                "answerText": correct_answer,
            }

            if answer_type == "multiple_choice":
                question_payload["answer"] = ord(correct_answer) - 65
            else:
                question_payload["acceptableAnswers"] = split_answer_variants(correct_answer)

            parsed_questions.append(question_payload)

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(parsed_questions, ensure_ascii=False, indent=2) + "\n")

    domain_counts: dict[str, int] = {}
    for question in parsed_questions:
        domain_counts[question["domain"]] = domain_counts.get(question["domain"], 0) + 1

    print(f"built {len(parsed_questions)} math questions -> {OUTPUT_JSON}")
    for domain, count in sorted(domain_counts.items()):
        print(f"{domain}: {count}")


if __name__ == "__main__":
    main()
