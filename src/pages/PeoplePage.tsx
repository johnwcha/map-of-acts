import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { usePeople } from '../hooks/usePeople';

const PeoplePage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const { people, loading, error } = usePeople();
  const openPerson = (personId: string) => navigate(`/people/${personId}`);

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

  // Split people by category
  const believers = people.filter(p => p.id !== 'jesus' && p.id !== 'peter' && p.id !== 'paul' && (p.category === 'believer' || !p.category));
  const opponents = people.filter(p => p.category === 'opponent' || p.category === 'official');

  // Get featured people for main cards
  const peter = people.find(p => p.id === 'peter');
  const paul = people.find(p => p.id === 'paul');

  const AvatarCircle = ({
    avatarUrl,
    name,
    size = 'md',
  }: {
    avatarUrl?: string;
    name: string;
    size?: 'sm' | 'md';
  }) => {
    const dim = size === 'sm' ? 'w-16 h-16' : 'w-20 h-20';
    const icon = size === 'sm' ? 'text-2xl' : 'text-3xl';
    return (
      <div className={`${dim} rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0`}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="bg-primary/10 dark:bg-primary/20 w-full h-full flex items-center justify-center">
            <span className={`material-symbols-outlined text-primary ${icon}`}>person</span>
          </div>
        )}
      </div>
    );
  };

  const OpponentAvatar = ({
    avatarUrl,
    name,
  }: {
    avatarUrl?: string;
    name: string;
  }) => (
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/40 flex-shrink-0">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="bg-slate-700 w-full h-full flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-400 text-2xl">person</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 md:px-8 py-8">
      <div className="max-w-lg md:max-w-3xl mx-auto">

        {/* Hero Image */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
            <img
              src="/images/people/people-hero.png"
              alt="People of Acts"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 text-center">
          {lang === 'en' ? 'Key Figures' : '關鍵人物'}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-primary font-medium mb-4 text-center">
          {lang === 'en' ? 'People of the Early Church' : '早期教會的人物'}
        </p>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-8 leading-relaxed text-center">
          {lang === 'en'
            ? 'Explore the lives and roles of important figures in the Book of Acts.'
            : '探索使徒行傳中重要人物的生平和角色。'}
        </p>

        {/* Sample Person Card — Peter */}
        {peter && (
          <button
            type="button"
            onClick={() => openPerson(peter.id)}
            className="mb-8 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-xl p-6 border border-primary/20 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-full w-20 h-20 flex-shrink-0 border-2 border-primary overflow-hidden">
                {peter.avatarUrl ? (
                  <img src={peter.avatarUrl} alt={peter.name[lang]} className="w-full h-full object-cover object-top" />
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
                <p className="text-sm text-primary font-medium mb-2">{peter.role[lang]}</p>
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
                  <span className="text-[10px] bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                    {lang === 'en' ? 'View profile' : '查看人物檔案'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Featured Card — Paul */}
        {paul && (
          <button
            type="button"
            onClick={() => openPerson(paul.id)}
            className="mb-8 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-xl p-6 border border-primary/20 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-full w-20 h-20 flex-shrink-0 border-2 border-primary overflow-hidden">
                {paul.avatarUrl ? (
                  <img src={paul.avatarUrl} alt={paul.name[lang]} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="bg-white dark:bg-slate-800 w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">person</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {paul.name[lang]}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">{paul.role[lang]}</p>
                {paul.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {paul.description[lang]}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded">
                    {lang === 'en' ? 'Apostle to Gentiles' : '外邦人的使徒'}
                  </span>
                  <span className="text-[10px] bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded">
                    {lang === 'en' ? '3 Missionary Journeys' : '三次宣教旅程'}
                  </span>
                  <span className="text-[10px] bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                    {lang === 'en' ? 'View profile' : '查看人物檔案'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* ── BELIEVERS SECTION ── */}
        <div className="mb-8">
          <h2 className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {lang === 'en' ? 'Key Figures in Acts' : '使徒行傳中的關鍵人物'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {believers.map((person) => (
              <button
                type="button"
                key={person.id}
                onClick={() => openPerson(person.id)}
                className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2 mb-2">
                  <AvatarCircle avatarUrl={person.avatarUrl} name={person.name[lang]} size="sm" />
                  <div className="text-center">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {person.name[lang]}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {person.role[lang]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── OPPONENTS SECTION ── */}
        {opponents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-lg">gavel</span>
              {lang === 'en' ? 'Notable Opponents & Officials' : '主要反對者與官員'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {opponents.map((person) => (
                <button
                  type="button"
                  key={person.id}
                  onClick={() => openPerson(person.id)}
                  className="bg-slate-800 dark:bg-slate-900 rounded-xl p-4 border-l-2 border-amber-500/60 border border-slate-700 hover:shadow-md hover:border-amber-500 transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <OpponentAvatar avatarUrl={person.avatarUrl} name={person.name[lang]} />
                    <div className="text-center">
                      <h3 className="font-bold text-slate-100 text-sm">
                        {person.name[lang]}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {person.role[lang]}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Features */}
        {/* <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {lang === 'en' ? 'Inside Each Profile' : '人物檔案內容'}
          </h3>
          <div className="space-y-3">
            {(lang === 'en' ? [
              'Biographies of apostles and disciples',
              'Timeline of their ministries',
              'Connection to events and locations',
              'Biblical references',
              'Historical context',
              'Interactive relationship maps',
            ] : [
              '使徒和門徒的傳記',
              '他們事工的時間表',
              '與事件和地點的聯繫',
              '聖經參考',
              '歷史背景',
              '互動關係圖',
            ]).map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 flex-shrink-0">
                  check_circle
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div> */}

        <div className="bg-gradient-to-br from-primary/10 via-white to-slate-50 dark:from-primary/20 dark:via-slate-900/60 dark:to-slate-900 rounded-xl p-6 border border-primary/20">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {lang === 'en' ? 'Project Developer' : '專案開發者'}
          </h3>
          <div className="space-y-4">
            <div>
              <p className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                John Chang
              </p>
              <a
                href="mailto:johnwcha@gmail.com"
                className="text-primary text-sm md:text-base font-medium hover:underline"
              >
                johnwcha@gmail.com
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {lang === 'en' ? 'Tools Used' : '使用工具'}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] md:text-xs bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-primary/10">
                  Google Stitch for UI mockup
                </span>
                <span className="text-[11px] md:text-xs bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-primary/10">
                  Antigravity for coding
                </span>
                <span className="text-[11px] md:text-xs bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-primary/10">
                  Codex for coding
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {lang === 'en' ? 'Bible Translation' : '聖經譯本'}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] md:text-xs bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-primary/10">
                  English ASV
                </span>
                <span className="text-[11px] md:text-xs bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-primary/10">
                  Chinese 中文和合本
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PeoplePage;
