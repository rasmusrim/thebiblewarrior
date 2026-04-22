#!/usr/bin/env python3
"""
Align Whisper word-level transcription against verse text to find
precise start/end timestamps for each verse range needed by data.json.

Usage:
  python3 scripts/align_verses.py assets/LUK.json

Outputs a timestamps file suitable for split_audio.sh:
  day-01 00:00:00.000 00:03:45.123
  day-02 00:03:45.123 00:07:12.456
  ...
"""

import json
import sys
from pathlib import Path

# Day definitions: (day_number, from_chapter, from_verse, to_chapter, to_verse)
DAYS = [
    (1, 1, 1, 1, 25),
    (2, 1, 26, 1, 56),
    (3, 1, 57, 1, 80),
    (4, 2, 1, 2, 21),
    (5, 2, 41, 2, 52),
    # day 6 = video
    (7, 3, 1, 3, 22),
    (8, 4, 1, 4, 13),
    (9, 4, 14, 4, 44),
    (10, 5, 1, 5, 26),
    (11, 5, 27, 5, 39),
    (12, 6, 1, 6, 26),
    (13, 6, 27, 6, 49),
    (14, 7, 1, 7, 35),
    (15, 7, 36, 7, 50),
    (16, 8, 1, 8, 21),
    (17, 8, 22, 8, 56),
    (18, 9, 1, 9, 27),
    # day 19 = video
    (20, 9, 28, 9, 62),
    (21, 10, 1, 10, 24),
    (22, 10, 25, 10, 42),
    (23, 11, 1, 11, 36),
    (24, 11, 37, 11, 54),
    (25, 12, 1, 12, 34),
    (26, 12, 35, 12, 59),
    (27, 13, 1, 13, 35),
    (28, 14, 1, 14, 35),
    (29, 15, 1, 15, 32),
    (30, 16, 1, 16, 31),
    (31, 17, 1, 17, 37),
    (32, 18, 1, 18, 42),
    (33, 19, 1, 19, 27),
    (34, 19, 28, 19, 47),
    # day 35 = video
    (36, 20, 1, 20, 19),
    (37, 20, 20, 20, 47),
    (38, 21, 1, 21, 38),
    (39, 22, 1, 22, 38),
    (40, 22, 39, 22, 71),
    (41, 23, 1, 23, 25),
    (42, 23, 26, 23, 56),
    # day 43 = video
    (44, 24, 1, 24, 35),
    (45, 24, 36, 24, 53),
    # day 46 = video
    # day 47 = Philemon (separate file)
    # day 48 = video
]


def format_ts(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}"


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 align_verses.py <whisper_json>")
        print("")
        print("This script requires verse text files to align against.")
        print("First fetch verse text, then run this script.")
        sys.exit(1)

    whisper_json = Path(sys.argv[1])
    if not whisper_json.exists():
        print(f"File not found: {whisper_json}")
        sys.exit(1)

    with open(whisper_json) as f:
        data = json.load(f)

    # Extract word-level timestamps from Whisper output
    words = []
    for segment in data.get("segments", []):
        for word_info in segment.get("words", []):
            words.append({
                "word": word_info["word"].strip(),
                "start": word_info["start"],
                "end": word_info["end"],
            })

    print(f"Loaded {len(words)} words from Whisper transcription")
    print("")
    print("TODO: Implement verse text matching.")
    print("Steps needed:")
    print("  1. Fetch verse text from a Bible API or local files")
    print("  2. Find the first word of each verse in the Whisper output")
    print("  3. Output timestamps for each day's reading range")
    print("")
    print("For now, output the total duration:")
    if words:
        print(f"  First word: {words[0]['word']} at {format_ts(words[0]['start'])}")
        print(f"  Last word: {words[-1]['word']} at {format_ts(words[-1]['end'])}")


if __name__ == "__main__":
    main()
