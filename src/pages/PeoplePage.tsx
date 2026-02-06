import { useLanguage } from '../hooks/useLanguage';
import { usePeople } from '../hooks/usePeople';

const PeoplePage = () => {
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const { people, loading, error } = usePeople();

  const content = {
    en: {
      title: 'Key Figures',
      subtitle: 'People of the Early Church',
      description: 'Explore the lives and roles of important figures in the Book of Acts.',
      features: [
        'Biographies of apostles and disciples',
        'Timeline of their ministries',
        'Connection to events and locations',
        'Biblical references',
        'Historical context',
        'Interactive relationship maps'
      ],
      plannedFeatures: 'Planned Features'
    },
    zh: {
      title: '關鍵人物',
      subtitle: '早期教會的人物',
      description: '探索使徒行傳中重要人物的生平和角色。',
      features: [
        '使徒和門徒的傳記',
        '他們事工的時間表',
        '與事件和地點的聯繫',
        '聖經參考',
        '歷史背景',
        '互動關係圖'
      ],
      plannedFeatures: '計劃功能'
    }
  };

  const text = content[lang];

  // Filter out Jesus and get first 6 people for featured section
  const featuredPeople = people.filter(p => p.id !== 'jesus').slice(0, 6);

  // Get Peter for the sample card
  const peter = people.find(p => p.id === 'peter');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
          <p className="text-slate-600 dark:text-slate-400">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 md:px-8 py-8">
      <div className="max-w-lg md:max-w-3xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-6 md:p-8">
            <span className="material-symbols-outlined text-6xl md:text-8xl text-primary">groups</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 text-center">
          {text.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-primary font-medium mb-4 text-center">
          {text.subtitle}
        </p>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-8 leading-relaxed text-center">
          {text.description}
        </p>

        {/* Featured People Preview */}
        <div className="mb-8">
          <h2 className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {lang === 'en' ? 'Key Figures in Acts' : '使徒行傳中的關鍵人物'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {featuredPeople.map((person) => (
              <div
                key={person.id}
                className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2 mb-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    {person.avatarUrl ? (
                      <img
                        src={person.avatarUrl}
                        alt={person.name[lang]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-primary/10 dark:bg-primary/20 w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">person</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {person.name[lang]}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {person.role[lang]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Person Card - Peter */}
        {peter && (
          <div className="mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-xl p-6 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="rounded-full w-20 h-20 flex-shrink-0 border-2 border-primary overflow-hidden">
                {peter.avatarUrl ? (
                  <img
                    src={peter.avatarUrl}
                    alt={peter.name[lang]}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-white dark:bg-slate-800 w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">person</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {peter.name[lang]}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">
                  {peter.role[lang]}
                </p>
                {peter.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {peter.description[lang]}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded">
                    {lang === 'en' ? '12 Apostles' : '十二使徒'}
                  </span>
                  <span className="text-[10px] bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded">
                    {lang === 'en' ? 'Jerusalem Leader' : '耶路撒冷領袖'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features List */}
        <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {text.plannedFeatures}
          </h3>
          <div className="space-y-3">
            {text.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 flex-shrink-0">
                  check_circle
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;
