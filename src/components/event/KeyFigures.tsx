import { Person } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface KeyFiguresProps {
  people: Person[];
}

const KeyFigures = ({ people }: KeyFiguresProps) => {
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';

  if (!people || people.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 px-4">
      <h3 className="text-lg font-bold font-serif mb-3">
        {t('event.keyFigures')}
      </h3>

      <div className="flex gap-4">
        {people.map((person, index) => (
          <div key={person.id} className="flex flex-col items-center gap-1">
            <div
              className={`size-14 rounded-full flex items-center justify-center overflow-hidden ${
                index === 0
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-slate-100 dark:bg-slate-800 border-2 border-transparent'
              }`}
            >
              {person.avatarUrl ? (
                <img
                  src={person.avatarUrl}
                  alt={person.name[lang]}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className={`material-symbols-outlined text-3xl ${
                    index === 0 ? 'text-primary' : 'text-slate-400'
                  }`}
                >
                  person
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-center">
              {person.name[lang]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyFigures;
