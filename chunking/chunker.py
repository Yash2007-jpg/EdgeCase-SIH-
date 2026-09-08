"""Create clause-level JSONL chunks from Person 3A extracted text."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path


HEADER_RE = re.compile(r"^\s*(IS\s+\d+)\s*:\s*(\d{4})\s*$", re.IGNORECASE)
REFERENCE_ROW_RE = re.compile(r"^\d+\s*:\s*\d{4}\b")
NUMBERED_RE = re.compile(r"^(\d+(?:\.\d+)*)(?:\s+)(.+?)\s*$")
ANNEX_RE = re.compile(r"^(ANNEX\s+[A-Z])\b(?:\s+(.*))?$", re.IGNORECASE)
WATERMARK_RE = re.compile(
    r"^(?:Free Standard provided by BIS via BSB Edge Private Limited to |"
    r"hyderabad\(.*\)\s+\d+\.\d+\.\d+\.\d+\.)$",
    re.IGNORECASE,
)


@dataclass
class Page:
    number: int
    lines: list[str]


def normalized_lines(text: str) -> list[str]:
    return [" ".join(line.split()) for line in text.splitlines() if line.strip()]


def find_pages(text: str) -> tuple[str, str, list[Page]]:
    """Keep only pages with the real ``header + lone page number`` marker."""
    raw_pages = re.split(r"\f", text)
    pages: list[Page] = []
    standard = ""
    edition = ""

    for raw_page in raw_pages:
        lines = normalized_lines(raw_page)
        marker_index = None
        page_number = None
        for index, line in enumerate(lines[:-1]):
            match = HEADER_RE.match(line)
            if match and re.fullmatch(r"\d+", lines[index + 1]):
                marker_index = index
                page_number = int(lines[index + 1])
                if not standard:
                    standard = match.group(1).upper()
                    edition = match.group(2)
                break
        if marker_index is not None and page_number is not None:
            # The page marker is evidence from the extracted document, not a
            # synthetic tag added to the text.
            page_lines = lines[marker_index + 2 :]
            pages.append(Page(page_number, page_lines))

    return standard, edition, pages


def remove_repeated_noise(pages: list[Page]) -> list[Page]:
    """Remove repeated watermark lines while retaining legitimate repeated prose."""
    counts = Counter(line for page in pages for line in set(page.lines))
    threshold = max(3, int(len(pages) * 0.75))
    repeated = {line for line, count in counts.items() if count >= threshold}

    def is_noise(line: str) -> bool:
        return line in repeated or WATERMARK_RE.match(line) is not None

    return [Page(page.number, [line for line in page.lines if not is_noise(line)]) for page in pages]


def uppercase_heading(text: str) -> bool:
    words = re.findall(r"[A-Za-z]+", text)
    return bool(words) and all(word.upper() == word for word in words)


def clause_at(lines: list[str], index: int, current_top_level: int) -> tuple[str, int] | None:
    line = lines[index]
    if REFERENCE_ROW_RE.match(line):
        return None

    annex = ANNEX_RE.match(line)
    if annex:
        return annex.group(1).upper(), index

    numbered = NUMBERED_RE.match(line)
    if numbered:
        clause, remainder = numbered.groups()
        major = int(clause.split(".", 1)[0])
        if "." in clause:
            # Reference tables produce values such as 11.5 and 37.5. A
            # plausible clause has words after the number and stays near the
            # document's observed top-level section range.
            if major > max(current_top_level, 30) or not re.search(r"[A-Za-z]", remainder):
                return None
            return clause, index
        if major <= 30 and uppercase_heading(remainder):
            return clause, index
        return None

    if re.fullmatch(r"\d{1,2}", line) and index + 1 < len(lines):
        next_line = lines[index + 1]
        if uppercase_heading(next_line) and int(line) <= 30:
            return line, index + 1
    return None


def extract_chunks(source: Path) -> list[dict[str, object]]:
    standard, edition, raw_pages = find_pages(source.read_text(encoding="utf-8", errors="replace"))
    pages = remove_repeated_noise(raw_pages)
    chunks: list[dict[str, object]] = []
    current_top_level = 0

    for page in pages:
        starts: list[tuple[int, str]] = []
        for index in range(len(page.lines)):
            candidate = clause_at(page.lines, index, current_top_level)
            if candidate is None:
                continue
            clause, body_index = candidate
            if "." not in clause and clause.isdigit():
                current_top_level = max(current_top_level, int(clause))
            starts.append((body_index, clause))

        for start_index, (body_index, clause) in enumerate(starts):
            end_index = starts[start_index + 1][0] if start_index + 1 < len(starts) else len(page.lines)
            body = " ".join(page.lines[body_index:end_index]).strip()
            if not body:
                continue
            chunks.append(
                {
                    "document": source.stem,
                    "standard": standard,
                    "edition": edition,
                    "clause": clause,
                    "page": page.number,
                    "source": source.as_posix(),
                    "text": body,
                }
            )

    return fold_short_fragments(chunks)


def fold_short_fragments(chunks: list[dict[str, object]], minimum_chars: int = 120) -> list[dict[str, object]]:
    """Fold likely table fragments into a neighboring clause chunk."""
    folded: list[dict[str, object]] = []
    for chunk in chunks:
        is_short = len(str(chunk["text"])) < minimum_chars
        if is_short and folded and not str(chunk["clause"]).upper().startswith("ANNEX"):
            folded[-1]["text"] = f'{folded[-1]["text"]} {chunk["text"]}'
        else:
            folded.append(chunk)
    return folded


def write_chunks(input_dir: Path, output_path: Path) -> list[dict[str, object]]:
    all_chunks: list[dict[str, object]] = []
    for source in sorted(input_dir.glob("*.txt")):
        all_chunks.extend(extract_chunks(source))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as output:
        for chunk in all_chunks:
            output.write(json.dumps(chunk, ensure_ascii=False) + "\n")
    return all_chunks


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, default=Path("extracted_text/cleaned_text"))
    parser.add_argument("--output", type=Path, default=Path("chunking/chunks.jsonl"))
    args = parser.parse_args()
    chunks = write_chunks(args.input_dir, args.output)
    print(f"Wrote {len(chunks)} chunks to {args.output}")
    for chunk in chunks[:3]:
        print(json.dumps({key: chunk[key] for key in ("standard", "edition", "clause", "page")}, ensure_ascii=False))


if __name__ == "__main__":
    main()