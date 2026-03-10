import { useState, useEffect } from 'react';
import { Chapter, ReadingMode } from '../../types';
import ChapterHeader from './ChapterHeader';
import LanguageToggle from './LanguageToggle';
import VerseDisplay from './VerseDisplay';
import ChapterNavigation from './ChapterNavigation';

interface ChapterReaderProps {
  chapter: Chapter;
  currentChapter: number;
  totalChapters: number;
  onNavigate: (chapter: number) => void;
}

const STORAGE_KEY = 'acts-reading-mode';

const ChapterReader = ({ chapter, currentChapter, totalChapters, onNavigate }: ChapterReaderProps) => {
  // Load saved reading mode or default to side-by-side
  const [readingMode, setReadingMode] = useState<ReadingMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'english' || saved === 'chinese' || saved === 'side-by-side') {
      return saved;
    }
    return 'side-by-side';
  });

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentChapter]);

  return (
    <div className="min-h-screen pb-32">
      {/* Container with max width */}
      <div className="max-w-mobile md:max-w-desktop-reading mx-auto px-4 md:px-8 py-8">
        {/* Chapter header */}
        <ChapterHeader
          chapter={chapter}
          currentChapter={currentChapter}
          totalChapters={totalChapters}
          onNavigate={onNavigate}
        />

        {/* Language toggle */}
        <LanguageToggle
          mode={readingMode}
          onChange={setReadingMode}
        />

        {/* Verse display */}
        <VerseDisplay
          versesEn={chapter.verses.en}
          versesZh={chapter.verses.zh}
          mode={readingMode}
          chapter={currentChapter}
        />
      </div>

      {/* Fixed bottom navigation */}
      <ChapterNavigation
        currentChapter={currentChapter}
        totalChapters={totalChapters}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default ChapterReader;
