import { Chapter } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface ChapterHeaderProps {
  chapter: Chapter;
  currentChapter: number;
  totalChapters: number;
}

const ChapterHeader = ({ chapter, currentChapter, totalChapters }: ChapterHeaderProps) => {
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';

  // Progress percentage
  const progress = (currentChapter / totalChapters) * 100;

  return (
    <div className="mb-6">
      {/* Chapter title and info */}
      <div className="text-center mb-4">
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-1">
          {t('read.chapterOf')
            .replace('{current}', currentChapter.toString())
            .replace('{total}', totalChapters.toString())}
        </p>

        <h1 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
          {chapter.title[lang]}
        </h1>

        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          {chapter.verseCount} {t('read.verses')}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ChapterHeader;
