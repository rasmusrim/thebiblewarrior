export interface Book {
  id: number;
  title: string;
  author: string;
  language: string;
  cover: string;
  totalDays: number;
  days: Day[];
}

export type Day = ReadingDay | VideoDay;

export interface VerseRange {
  book: string;
  fromChapter: number;
  fromVerse: number;
  toChapter: number;
  toVerse: number;
}

export interface ReadingDay {
  day: number;
  type: "reading";
  bibleRef: string;
  bibleRefParsed: VerseRange;
  audioFile: string;
  prayerPrompt: string;
  reflection: string;
}

export interface VideoDay {
  day: number;
  type: "video";
  videoTitle: string;
  youtubeId: string;
  youtubeEmbed: string;
}
