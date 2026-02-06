// Core data types for Map of Acts application

export interface ScriptureReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  display: string; // e.g., "Acts 9:1-9"
}

export interface Verse {
  number: number;
  text: string;
}

export interface BilingualText {
  en: string;
  zh: string;
}

export interface Event {
  id: string;
  title: BilingualText;
  description: BilingualText;
  scripture: ScriptureReference;
  date: {
    year: number;
    displayText: BilingualText; // e.g., "A.D. 34" / "主後34年"
    order: number; // For sorting
  };
  location: string; // Location ID
  primaryImage: string;
  imageSource: string; // Credit/attribution
  category: 'early-church' | 'persecution' | 'conversion' | 'missionary-journey' | 'imprisonment' | 'miracle';
  keyFigures: string[]; // Person IDs
  passage: {
    en: {
      fullText: string; // Complete ASV passage
      verses: Verse[];
      excerpt?: string; // Short preview for timeline
    };
    zh: {
      fullText: string; // Complete 和合本 passage
      verses: Verse[];
      excerpt?: string;
    };
  };
  journeyId?: string; // Optional journey association
  nextEventId?: string;
  previousEventId?: string;
}

export interface Location {
  id: string;
  name: BilingualText;
  coordinates: [number, number]; // [lat, lng]
  modernName?: BilingualText;
  description: BilingualText;
  imageUrl?: string;
}

export interface Person {
  id: string;
  name: BilingualText;
  role: BilingualText;
  description?: BilingualText;
  avatarUrl?: string;
  events?: string[]; // Event IDs this person is associated with
}

export interface Journey {
  id: string;
  name: string;
  displayName: BilingualText; // e.g., "1st Journey" / "第一次旅程"
  events: string[]; // Event IDs
  route: Array<{ from: string; to: string }>; // Location IDs
  color: string;
  startDate: string;
  endDate: string;
}

export interface ActsData {
  events: Event[];
  locations: Location[];
  people: Person[];
  journeys: Journey[];
}

export type Language = 'en' | 'zh-TW';

export interface Translations {
  [key: string]: string | Translations;
}

// Chapter-level reading data types
export interface Chapter {
  chapter: number;
  title: BilingualText;
  verseCount: number;
  verses: {
    en: Verse[];
    zh: Verse[];
  };
}

export interface ChaptersData {
  chapters: Chapter[];
}

// Bookmark types for reading experience
export interface Bookmark {
  id: string;              // Format: "acts-{chapter}-{verse}" e.g., "acts-3-8"
  chapter: number;
  verse?: number;          // Optional: specific verse, undefined for chapter bookmark
  createdAt: number;       // Timestamp
}

// Reading progress tracking
export interface ReadingProgress {
  currentChapter: number;
  lastReadAt: number;      // Timestamp
  completedChapters: number[];  // Array of completed chapter numbers
}

// Reading mode type
export type ReadingMode = 'side-by-side' | 'english' | 'chinese';
