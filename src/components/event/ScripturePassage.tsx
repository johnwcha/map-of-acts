import { useState } from 'react';
import { Event } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { formatScriptureDisplay } from '../../utils/scriptureUtils';

interface ScripturePassageProps {
  event: Event;
}

const ScripturePassage = ({ event }: ScripturePassageProps) => {
  const { language } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const [sideBySide, setSideBySide] = useState(false);

  const enVerses = event.passage.en.verses;
  const zhVerses = event.passage.zh.verses;
  const verses = event.passage[lang].verses;

  return (
    <section className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 pt-4">
        <h3 className="text-primary text-xl md:text-2xl font-bold font-serif">
          {formatScriptureDisplay(event.scripture)}
        </h3>
        <span className="material-symbols-outlined text-slate-400">auto_stories</span>
      </div>

      {/* Passage Container */}
      <div className="mx-4 md:mx-8 mt-2 p-5 md:p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">

        {sideBySide ? (
          /* Side-by-side bilingual view */
          <div className="space-y-4">
            {/* Column headers */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>English (ASV)</span>
              <span className="pl-4">中文 (和合本)</span>
            </div>
            {enVerses.map((enVerse, i) => {
              const zhVerse = zhVerses[i];
              return (
                <div key={enVerse.number} className="grid grid-cols-2 gap-4">
                  {/* English */}
                  <p className="text-sm md:text-base leading-relaxed italic text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-primary mr-1 not-italic">{enVerse.number}</span>
                    {enVerse.text}
                  </p>
                  {/* Chinese */}
                  <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-700 pl-4">
                    <span className="font-bold text-primary mr-1">{zhVerse?.number}</span>
                    {zhVerse?.text}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single-language view */
          <div className="space-y-4">
            {verses.map((verse) => (
              <p key={verse.number} className="text-base md:text-lg leading-relaxed italic text-slate-700 dark:text-slate-300">
                <span className="font-bold text-primary mr-1 not-italic">{verse.number}</span>
                {verse.text}
              </p>
            ))}
          </div>
        )}

        {/* Toggle Button */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => setSideBySide((prev) => !prev)}
            className={`flex-1 py-2 px-3 text-sm font-bold border rounded-lg transition-colors flex items-center justify-center gap-1 ${sideBySide
              ? 'bg-primary/10 text-primary border-primary/30'
              : 'text-primary border-primary/20 hover:bg-primary/5'
              }`}
          >
            <span className="material-symbols-outlined text-lg">translate</span>
            <span>English / Chinese Side-by-Side</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScripturePassage;
