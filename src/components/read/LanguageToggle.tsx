import { useState, useEffect } from 'react';
import { ReadingMode } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface LanguageToggleProps {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}

const STORAGE_KEY = 'acts-reading-mode';

const LanguageToggle = ({ mode, onChange }: LanguageToggleProps) => {
  const { t } = useLanguage();

  const modes: ReadingMode[] = ['english', 'side-by-side', 'chinese'];

  const handleModeChange = (newMode: ReadingMode) => {
    onChange(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => handleModeChange(m)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === m
              ? 'bg-primary text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {m === 'side-by-side' && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">translate</span>
              {t('read.readingMode.sideBySide')}
            </span>
          )}
          {m === 'english' && t('read.readingMode.englishOnly')}
          {m === 'chinese' && t('read.readingMode.chineseOnly')}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
