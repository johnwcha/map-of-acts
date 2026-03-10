import { useLanguage } from '../../hooks/useLanguage';

interface ChapterNavigationProps {
  currentChapter: number;
  totalChapters: number;
  onNavigate: (chapter: number) => void;
}

const ChapterNavigation = ({ currentChapter, totalChapters, onNavigate }: ChapterNavigationProps) => {
  const { t } = useLanguage();

  const hasPrevious = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(currentChapter - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(currentChapter + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg z-40">
      <div className="max-w-mobile md:max-w-desktop-reading mx-auto flex items-center justify-between gap-4 p-4 md:px-8">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${hasPrevious
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-95'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
        >
          <span className="material-symbols-outlined">chevron_left</span>
          <span className="hidden sm:inline">{t('read.navigation.previous')}</span>
          <span className="sm:hidden">{t('event.previous')}</span>
        </button>

        {/* Chapter indicator */}
        <div className="text-center px-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {currentChapter} / {totalChapters}
          </p>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${hasNext
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-95'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
        >
          <span className="hidden sm:inline">{t('read.navigation.next')}</span>
          <span className="sm:hidden">{t('event.next')}</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default ChapterNavigation;
