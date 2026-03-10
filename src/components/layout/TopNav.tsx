import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

interface TopNavProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showShare?: boolean;
  searchOpen?: boolean;
  searchQuery?: string;
  onToggleSearch?: () => void;
  onSearchChange?: (query: string) => void;
}

const TopNav = ({
  title,
  showBack = false,
  showSearch = false,
  showShare = false,
  searchOpen = false,
  searchQuery = '',
  onToggleSearch,
  onSearchChange,
}: TopNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/timeline');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh-TW' : 'en');
  };

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Main bar */}
      <div className="flex items-center p-4 md:px-8 justify-between max-w-mobile md:max-w-desktop mx-auto">
        {/* Left side - Back button */}
        <div className="flex items-center gap-2 min-w-[80px]">
          {showBack && (
            <button
              onClick={handleBack}
              className="text-primary flex size-10 items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer transition-colors"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
          )}
        </div>

        {/* Center - Title (hidden when search is open) */}
        <h1
          className={`font-serif text-lg md:text-2xl font-bold leading-tight flex-1 text-center transition-opacity duration-200 ${searchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
          {title}
        </h1>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 justify-end min-w-[80px]">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 text-xs font-bold transition-colors"
            aria-label="Toggle language"
          >
            {language === 'en' ? '中文' : 'EN'}
          </button>

          {showSearch && (
            <button
              onClick={onToggleSearch}
              className={`flex items-center justify-center rounded-full p-2 transition-colors ${searchOpen
                ? 'bg-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              aria-label={searchOpen ? 'Close search' : 'Search'}
            >
              <span className="material-symbols-outlined">
                {searchOpen ? 'close' : 'search'}
              </span>
            </button>
          )}

          {showShare && (
            <button
              className="flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2"
              aria-label="Share"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
          )}
        </div>
      </div>

      {/* Search input — slides down when open */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 md:px-8 pb-3 max-w-mobile md:max-w-desktop mx-auto">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search events, descriptions, locations…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-700 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
