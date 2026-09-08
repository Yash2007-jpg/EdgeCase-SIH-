Person 3B output: clause-level chunks for Person 3C.

Run from the repository root:

    python chunking/chunker.py

The script reads extracted_text/cleaned_text/*.txt and writes one JSON object
per line to chunking/chunks.jsonl. Each object has:

    document  source filename stem
    standard  standard number read from the extracted running header
    edition   edition year read from that same header
    clause    clause number or ANNEX label
    page      printed page number from the real header + lone page-number pair
    source    input path used to create the chunk
    text      cleaned clause text, with extracted line wraps joined

Document-specific handling

The source PDF has a bilingual Hindi/English cover and a foreword before the
first real page marker. Those pages are excluded. The repeated BIS download
watermark and the running header are removed. The header is required to be
followed by a lone page number, so page numbers are taken from the document
instead of invented [PAGE N] tags.

The parser recognizes inline headings such as `1 SCOPE`, `1.1 ...`, and
`14.1 ...`, split headings such as `3` followed by `TERMINOLOGY`, and annexes
such as `ANNEX A`. Reference-table rows such as `632 : 1978` are explicitly
excluded from clause detection. Very short candidate chunks are folded into
the preceding chunk to reduce isolated table-number noise.

Known limitations

This is a prototype based on pypdf's reading order. Tables, figures, and
multi-column material can still be interleaved or have wrapped numeric cells;
joining extracted lines does not reconstruct table geometry. Some short table
fragments may therefore remain attached to a neighboring clause, and a rare
short legitimate clause could be folded as well. Review table-heavy chunks
before loading them into PostgreSQL/pgvector. The `source` paths assume the
repository-root working directory when the script is run.