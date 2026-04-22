# Adding a New Book to The Bible Warrior

This guide explains how to add a new book in the series to the app.

## 1. Assets Needed

- **Photos**: One photo per page of the physical book (prayer prompts, quiz questions, reflections)
- **Audio MP3**: Full audio Bible recording for the book(s) covered
- **Cover photo**: Photo of the book's front cover

## 2. Directory Structure

Create a new directory under `books/` (at the repo root) with the next available number:

```
books/{N}/
├── data.json
├── cover.jpg
└── audio/
    ├── day-01.mp3
    ├── day-02.mp3
    └── ...
```

Book content is served to the browser at `/books/{N}/...` via a symlink at `public/books -> ../books`. The top-level directory is the source of truth; the symlink exists so Vite picks it up as static content without needing a copy step.

## 3. Audio Processing

### Transcribe the audio
```bash
pip install openai-whisper
python3 scripts/transcribe.py
```
Edit `transcribe.py` to point to your audio file if different from `LUK.mp3`.

### Align verses to timestamps
```bash
python3 scripts/align_verses.py assets/YOUR_BOOK.json
```
This produces a timestamps file mapping each day's reading to start/end times.

### Split into per-day clips
Create a timestamps file with format:
```
day-01 00:00:00.000 00:03:45.123
day-02 00:03:45.123 00:07:12.456
```

Then run:
```bash
./scripts/split_audio.sh timestamps.txt
```

Audio specs: 64kbps mono MP3 (~0.5-2MB per clip).

## 4. YouTube Video IDs (from QR codes)

Video days in the physical book typically include a QR code linking to a BibleProject YouTube video. Extract the IDs from photos of the pages rather than retyping them.

### Install a decoder

`zbar` ships a decoding library on most distros, but you need Python bindings:

```bash
pip install --break-system-packages --user pyzbar Pillow
```

(Ubuntu: `libzbar0` must be present. It usually already is; if not, `apt install libzbar0`.)

### Photograph the pages

Phone photos are fine — any resolution the camera produces works. Put all the images in `assets/` so they stay out of the build output. Shoot one QR per photo to avoid ambiguity.

### Decode

Save this as `scripts/decode_qrs.py` or run ad-hoc:

```python
import os
from pyzbar.pyzbar import decode, ZBarSymbol
from PIL import Image

d = "assets"
for f in sorted(f for f in os.listdir(d) if f.lower().endswith(".jpg")):
    img = Image.open(os.path.join(d, f))
    # pyzbar sometimes misses at full resolution; try a few sizes
    for target in (2000, 1400, 1000):
        w, h = img.size
        if max(w, h) <= target:
            candidate = img
        else:
            scale = target / max(w, h)
            candidate = img.resize((int(w * scale), int(h * scale)))
        results = decode(candidate, symbols=[ZBarSymbol.QRCODE])
        if results:
            print(f, results[0].data.decode())
            break
    else:
        print(f, "NONE")
```

If pyzbar returns `NONE` for a photo that clearly contains a QR, try the image at multiple scales (the resize loop above already does this). Glare and shallow depth-of-field are the usual culprits — reshoot if needed.

### Map to day numbers

The decoded QRs come back in filename order, which (for phone photos taken sequentially) matches the order the video days appear in the book. Cross-check by opening each YouTube URL and comparing the video's chapter range against the book's day list.

Plug the IDs into `data.json`:

```json
"youtubeId": "Mgol7AVWCw0",
"youtubeEmbed": "https://www.youtube.com/embed/Mgol7AVWCw0"
```

Duplicate QR codes across multiple pages are real — some printings reuse the same overview video across halves of a book. Preserve what the QR actually points to unless the author confirms a correction.

## 5. Cover Image

Crop the cover photo to isolate the emblem/artwork:
```bash
convert assets/your_cover.jpg -crop WxH+X+Y -resize 800x800 -quality 85 books/{N}/cover.jpg
```

## 6. data.json Schema

```json
{
  "id": 2,
  "title": "The Bible Warrior 2",
  "author": "Hanna Emilie",
  "language": "no",
  "cover": "cover.jpg",
  "totalDays": 48,
  "days": [
    {
      "day": 1,
      "type": "reading",
      "bibleRef": "Matteus 1,1-17",
      "bibleRefParsed": {
        "book": "MAT",
        "fromChapter": 1,
        "fromVerse": 1,
        "toChapter": 1,
        "toVerse": 17
      },
      "audioFile": "day-01.mp3",
      "prayerPrompt": "Prayer text...",
      "questions": [
        {
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C"],
          "correctIndex": 0
        }
      ],
      "reflection": "Reflection text..."
    },
    {
      "day": 2,
      "type": "video",
      "videoTitle": "BibleProject Video Title",
      "youtubeId": "youtube_video_id",
      "youtubeEmbed": "https://www.youtube.com/embed/youtube_video_id"
    }
  ]
}
```

### Field descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique book identifier |
| `title` | string | Display title |
| `author` | string | Book author |
| `language` | string | ISO language code |
| `cover` | string | Cover image filename (relative to book dir) |
| `totalDays` | number | Total number of days in the book |
| `days` | array | Array of ReadingDay or VideoDay objects |
| `day` | number | Day number (1-indexed) |
| `type` | string | `"reading"` or `"video"` |
| `bibleRef` | string | Human-readable Bible reference |
| `bibleRefParsed` | object | Machine-readable verse range |
| `audioFile` | string | Audio filename (relative to audio dir) |
| `prayerPrompt` | string | Prayer/intro text shown before reading |
| `questions` | array | Quiz questions with options and correct answer index |
| `reflection` | string | Reflection text shown after quiz |
| `videoTitle` | string | Title for video day |
| `youtubeId` | string | YouTube video ID |
| `youtubeEmbed` | string | Full YouTube embed URL |

## 7. Auto-Discovery

The app currently discovers books by a hardcoded list in `src/hooks/useBook.ts`. To add a new book:

1. Add the book ID to the `bookIds` array in `useBookList()`
2. Ensure `books/{N}/data.json` exists

In the future this could be replaced with a manifest file or directory listing.

## 8. Validation

```bash
# Validate JSON
python3 -m json.tool books/{N}/data.json

# Check audio files
ls -la books/{N}/audio/

# Run the app
npm run dev
```
