import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

interface TopNavProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showShare?: boolean;
}

const TopNav = ({
  title,
  showBack = false,
  showSearch = false,
  showShare = false
}: TopNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

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

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
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

        {/* Center - Title */}
        <h1 className="font-serif text-lg md:text-2xl font-bold leading-tight flex-1 text-center">
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
              className="flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
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
    </nav>
  );
};

export default TopNav;
