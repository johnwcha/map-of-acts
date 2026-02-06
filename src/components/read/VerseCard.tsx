import { Verse } from '../../types';

interface VerseCardProps {
  verse: Verse;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  lang?: 'en' | 'zh';
}

const VerseCard = ({ verse, isBookmarked, onToggleBookmark, lang = 'en' }: VerseCardProps) => {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-3">
        {/* Verse number */}
        <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm">
          {verse.number}
        </span>

        {/* Verse text */}
        <p className={`flex-1 leading-relaxed ${
          lang === 'zh' ? 'text-base md:text-lg' : 'text-sm md:text-base'
        } text-slate-700 dark:text-slate-300`}>
          {verse.text}
        </p>

        {/* Bookmark button */}
        <button
          onClick={onToggleBookmark}
          className="flex-shrink-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <span className={`material-symbols-outlined text-xl transition-all ${
            isBookmarked
              ? 'text-primary'
              : 'text-slate-300 dark:text-slate-600'
          }`}>
            {isBookmarked ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default VerseCard;
