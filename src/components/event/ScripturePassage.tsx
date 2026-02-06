import { useState } from 'react';
import { Event } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { openBiblePassage } from '../../utils/scriptureUtils';
import TranslationSelectorModal from './TranslationSelectorModal';

interface ScripturePassageProps {
  event: Event;
}

const ScripturePassage = ({ event }: ScripturePassageProps) => {
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const passage = event.passage[lang];
  const [showTranslations, setShowTranslations] = useState(false);

  // Show first 3 verses as preview
  const previewVerses = passage.verses.slice(0, 3);

  const handleReadFull = () => {
    const version = lang === 'en' ? 'ASV' : 'CUV';
    openBiblePassage(event.scripture, version);
  };

  const handleVersionSelect = (versionCode: string) => {
    openBiblePassage(event.scripture, versionCode);
    setShowTranslations(false);
  };

  return (
    <section className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 pt-4">
        <h3 className="text-primary text-xl md:text-2xl font-bold font-serif">
          {event.scripture.display}
        </h3>
        <span className="material-symbols-outlined text-slate-400">auto_stories</span>
      </div>

      {/* Passage Container */}
      <div className="mx-4 md:mx-8 mt-2 p-5 md:p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        {/* Verses */}
        <div className="space-y-4">
          {previewVerses.map((verse) => (
            <p key={verse.number} className="text-base md:text-lg leading-relaxed italic text-slate-700 dark:text-slate-300">
              <span className="font-bold text-primary mr-1">{verse.number}</span>
              {verse.text}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleReadFull}
            className="flex-1 py-2 px-3 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">menu_book</span>
            <span>{t('event.readFullPassage')}</span>
          </button>

          <button
            onClick={() => setShowTranslations(true)}
            className="flex-1 py-2 px-3 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">translate</span>
            <span>{t('event.compareTranslations')}</span>
          </button>
        </div>
      </div>

      {/* Translation Selector Modal */}
      {showTranslations && (
        <TranslationSelectorModal
          scripture={event.scripture}
          onSelect={handleVersionSelect}
          onClose={() => setShowTranslations(false)}
          language={lang}
        />
      )}
    </section>
  );
};

export default ScripturePassage;
