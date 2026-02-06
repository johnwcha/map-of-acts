import { ScriptureReference } from '../../types';
import { BIBLE_VERSIONS } from '../../utils/scriptureUtils';
import { useLanguage } from '../../hooks/useLanguage';

interface TranslationSelectorModalProps {
  scripture: ScriptureReference;
  onSelect: (versionCode: string) => void;
  onClose: () => void;
  language: 'en' | 'zh';
}

const TranslationSelectorModal = ({
  scripture,
  onSelect,
  onClose,
  language
}: TranslationSelectorModalProps) => {
  const { t } = useLanguage();
  const versions = BIBLE_VERSIONS[language];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('event.selectTranslation')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">close</span>
          </button>
        </div>

        {/* Scripture Reference Display */}
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-sm font-medium text-primary">
            {scripture.display}
          </p>
        </div>

        {/* Version List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {versions.map((version) => (
            <button
              key={version.code}
              onClick={() => onSelect(version.code)}
              className="w-full text-left p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                {version.name}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {version.description}
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
          {t('event.opensBibleGateway')}
        </p>
      </div>
    </div>
  );
};

export default TranslationSelectorModal;
