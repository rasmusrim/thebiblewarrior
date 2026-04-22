#!/bin/bash
# Split LUK.mp3 into per-day audio clips based on assets/timestamps.json
# Also re-encodes FILEM.mp3 as day-47.
#
# Usage: ./scripts/split_audio.sh
#
# Edit assets/timestamps.json to adjust timestamps, then re-run.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TIMESTAMPS="$ROOT/assets/timestamps.json"
OUTPUT_DIR="$ROOT/books/1/audio"

mkdir -p "$OUTPUT_DIR"

if [ ! -f "$TIMESTAMPS" ]; then
  echo "Error: $TIMESTAMPS not found"
  exit 1
fi

SOURCE=$(python3 -c "import json; print(json.load(open('$TIMESTAMPS'))['source'])")
SOURCE="$ROOT/$SOURCE"

if [ ! -f "$SOURCE" ]; then
  echo "Error: $SOURCE not found"
  exit 1
fi

COUNT=$(python3 -c "import json; print(len(json.load(open('$TIMESTAMPS'))['segments']))")

for i in $(seq 0 $((COUNT - 1))); do
  FILE=$(python3 -c "import json; print(json.load(open('$TIMESTAMPS'))['segments'][$i]['file'])")
  START=$(python3 -c "import json; print(json.load(open('$TIMESTAMPS'))['segments'][$i]['start'])")
  END=$(python3 -c "import json; print(json.load(open('$TIMESTAMPS'))['segments'][$i]['end'])")
  REF=$(python3 -c "import json; print(json.load(open('$TIMESTAMPS'))['segments'][$i]['ref'])")

  echo "[$((i+1))/$COUNT] $FILE — $REF ($START → $END)"
  ffmpeg -y -i "$SOURCE" -ss "$START" -to "$END" -b:a 64k -ac 1 "$OUTPUT_DIR/${FILE}.mp3" -loglevel error
done

# Philemon
if [ -f "$ROOT/assets/FILEM.mp3" ]; then
  echo "Re-encoding Philemon (day-47)..."
  ffmpeg -y -i "$ROOT/assets/FILEM.mp3" -b:a 64k -ac 1 "$OUTPUT_DIR/day-47.mp3" -loglevel error
fi

echo ""
echo "Done! $(ls "$OUTPUT_DIR"/*.mp3 | wc -l) audio files in $OUTPUT_DIR"
