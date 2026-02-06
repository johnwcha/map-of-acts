import { useParams, useNavigate } from 'react-router-dom';
import { useChapter, useChapters } from '../hooks/useChapters';
import { useLanguage } from '../hooks/useLanguage';
import ChapterReader from '../components/read/ChapterReader';

const ReadPage = () => {
  const { chapterNum } = useParams<{ chapterNum?: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Parse chapter number, default to 1
  const currentChapter = chapterNum ? parseInt(chapterNum, 10) : 1;

  // Fetch chapter data
  const { chapter, loading, error } = useChapter(currentChapter);
  const { chapters } = useChapters();

  // Handle chapter navigation
  const handleNavigate = (newChapter: number) => {
    navigate(`/read/${newChapter}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
          <p className="text-slate-600 dark:text-slate-400">{t('common.error')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Chapter not found
  if (!chapter) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center">
          <span className="material-symbols-outlined text-slate-400 text-5xl mb-4">book</span>
          <p className="text-slate-600 dark:text-slate-400">Chapter {currentChapter} not found</p>
          <button
            onClick={() => navigate('/read/1')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Go to Chapter 1
          </button>
        </div>
      </div>
    );
  }

  // Render chapter reader
  return (
    <ChapterReader
      chapter={chapter}
      currentChapter={currentChapter}
      totalChapters={chapters.length || 28}
      onNavigate={handleNavigate}
    />
  );
};

export default ReadPage;
