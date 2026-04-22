#!/usr/bin/env python3
"""Transcribe LUK.mp3 using OpenAI Whisper with word-level timestamps."""

import subprocess
import sys
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets"
AUDIO = ASSETS / "LUK.mp3"

def main():
    if not AUDIO.exists():
        print(f"Audio file not found: {AUDIO}")
        sys.exit(1)

    cmd = [
        sys.executable, "-m", "whisper",
        str(AUDIO),
        "--language", "no",
        "--word_timestamps", "True",
        "--output_format", "json",
        "--output_dir", str(ASSETS),
    ]

    print(f"Running: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)
    print(f"Transcription saved to {ASSETS}/LUK.json")

if __name__ == "__main__":
    main()
