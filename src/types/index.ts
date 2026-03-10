// Core data types for Map of Acts application

export interface ScriptureReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
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
  category: 'early-church' | 'persecution' | 'conversion' | 'missionary-journey' | 'imprisonment' | 'miracle' | 'speech' | 'journey' | 'evangelism' | 'vision';
  keyFigures: string[]; // Person IDs
  passage: {
    en: {
      verses: Verse[];
      excerpt?: string; // Short preview for timeline
    };
    zh: {
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
  category?: 'believer' | 'opponent';
  events?: string[]; // Event IDs this person is associated with
}

export interface JourneyStop {
  locationId: string;
  verseRef: string;
  keyEvent: BilingualText;
}

export interface Journey {
  id: string;
  name: string;
  displayName: BilingualText;
  events: string[];
  route: Array<{ from: string; to: string }>;  // All segments (used as fallback)
  outboundRoute?: Array<{ from: string; to: string }>;
  returnRoute?: Array<{ from: string; to: string }>;
  color: string;
  returnColor?: string;       // Color for the return leg
  startDate: string;
  endDate: string;
  journeyStops?: JourneyStop[]; // Full ordered stops including revisits, with metadata
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
