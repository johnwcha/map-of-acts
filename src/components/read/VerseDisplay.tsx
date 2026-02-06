import { Verse, ReadingMode } from '../../types';
import { useBookmarks } from '../../hooks/useBookmarks';
import VerseCard from './VerseCard';

interface VerseDisplayProps {
  versesEn: Verse[];
  versesZh: Verse[];
  mode: ReadingMode;
  chapter: number;
}

const VerseDisplay = ({ versesEn, versesZh, mode, chapter }: VerseDisplayProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Render based on mode
  if (mode === 'english') {
    // English only
    return (
      <div className="space-y-3">
        {versesEn.map((verse) => (
          <VerseCard
            key={`en-${verse.number}`}
            verse={verse}
            isBookmarked={isBookmarked(chapter, verse.number)}
            onToggleBookmark={() => toggleBookmark(chapter, verse.number)}
            lang="en"
          />
        ))}
      </div>
    );
  }

  if (mode === 'chinese') {
    // Chinese only
    return (
      <div className="space-y-3">
        {versesZh.map((verse) => (
          <VerseCard
            key={`zh-${verse.number}`}
            verse={verse}
            isBookmarked={isBookmarked(chapter, verse.number)}
            onToggleBookmark={() => toggleBookmark(chapter, verse.number)}
            lang="zh"
          />
        ))}
      </div>
    );
  }

  // Side-by-side (default)
  return (
    <div className="space-y-3">
      {versesEn.map((verse, index) => (
        <div
          key={`pair-${verse.number}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* English */}
          <VerseCard
            verse={verse}
            isBookmarked={isBookmarked(chapter, verse.number)}
            onToggleBookmark={() => toggleBookmark(chapter, verse.number)}
            lang="en"
          />

          {/* Chinese */}
          {versesZh[index] && (
            <VerseCard
              verse={versesZh[index]}
              isBookmarked={isBookmarked(chapter, versesZh[index].number)}
              onToggleBookmark={() => toggleBookmark(chapter, versesZh[index].number)}
              lang="zh"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default VerseDisplay;
