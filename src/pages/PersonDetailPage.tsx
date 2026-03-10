import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePerson } from '../hooks/usePeople';
import { useEvents } from '../hooks/useEvents';
import { useLocations } from '../hooks/useLocations';
import { useJourneys } from '../hooks/useJourneys';
import { useLanguage } from '../hooks/useLanguage';
import { BilingualText, Event, Journey, Location, Person } from '../types';
import { formatScriptureDisplay } from '../utils/scriptureUtils';

type LangKey = 'en' | 'zh';

const textFor = (value: BilingualText | undefined, lang: LangKey) => value?.[lang] || '';

const joinReadable = (items: string[], lang: LangKey) => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (lang === 'zh') return items.join('、');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const getRelatedEvents = (person: Person, events: Event[]) => {
  const explicitEventIds = new Set(person.events || []);
  return uniqueById(
    events
      .filter((event) => explicitEventIds.has(event.id) || event.keyFigures.includes(person.id))
      .sort((a, b) => a.date.order - b.date.order)
  );
};

const buildBiographyParagraphs = (
  person: Person,
  relatedEvents: Event[],
  relatedLocations: Location[],
  relatedJourneys: Journey[],
  lang: LangKey
) => {
  const name = textFor(person.name, lang);
  const summary = textFor(person.description, lang);
  const locationNames = relatedLocations.slice(0, 4).map((location) => textFor(location.name, lang));
  const journeyNames = relatedJourneys.map((journey) => textFor(journey.displayName, lang));
  const firstRef = relatedEvents[0] ? formatScriptureDisplay(relatedEvents[0].scripture) : '';
  const lastRef = relatedEvents[relatedEvents.length - 1] ? formatScriptureDisplay(relatedEvents[relatedEvents.length - 1].scripture) : '';

  const paragraphs = [summary];

  if (relatedEvents.length > 0) {
    paragraphs.push(
      lang === 'en'
        ? `${name} is tied to ${relatedEvents.length} major Acts scene${relatedEvents.length === 1 ? '' : 's'}, spanning ${firstRef} to ${lastRef}. These episodes place ${name} in ${joinReadable(locationNames, lang) || 'key centers of the early church'}, showing how this figure contributed to the spread, defense, or opposition of the gospel.`
        : `${name}與使徒行傳中的 ${relatedEvents.length} 個重要場景相關，經文橫跨 ${firstRef} 到 ${lastRef}。這些事件把${name}放在${joinReadable(locationNames, lang) || '早期教會的重要場域'}之中，呈現這位人物如何參與福音的拓展、見證或阻擋。`
    );
  }

  if (relatedJourneys.length > 0) {
    paragraphs.push(
      lang === 'en'
        ? `${name}'s story also intersects with ${joinReadable(journeyNames, lang)}. That wider movement situates the biography inside the missionary expansion of the church across the eastern Mediterranean and the Roman world.`
        : `${name}的故事也與${joinReadable(journeyNames, lang)}相連，使這份人物傳記不只停留在單一事件，而是放進教會在東地中海與羅馬世界持續擴展的宣教脈絡之中。`
    );
  }

  return paragraphs.filter(Boolean);
};

const buildHistoricalContext = (
  person: Person,
  relatedEvents: Event[],
  relatedJourneys: Journey[],
  lang: LangKey
) => {
  const chapters = relatedEvents.map((event) => event.scripture.chapter);
  const firstChapter = chapters.length ? Math.min(...chapters) : null;
  const lastChapter = chapters.length ? Math.max(...chapters) : null;
  const role = textFor(person.role, lang);

  if (person.category === 'opponent') {
    return [
      lang === 'en'
        ? `${textFor(person.name, lang)} appears in Acts within the tense overlap of Jewish leadership, Roman administration, and public order. Figures like ${role.toLowerCase()} mattered because the Jesus movement was no longer a private sect; it had become visible enough to trigger hearings, riots, political calculation, and questions of imperial justice.`
        : `${textFor(person.name, lang)}出現在使徒行傳時，正處於猶太領袖、羅馬政權與公共秩序彼此交疊的緊張局勢中。像這樣的${role}之所以重要，是因為耶穌運動已不再只是私下的小群體，而是足以引發審訊、騷動、政治盤算與帝國司法問題的公開力量。`,
      lang === 'en'
        ? `Read in context, these scenes help explain how the early church advanced under scrutiny. Opposition in Acts is rarely random; it usually grows out of threatened authority, contested belief, economic pressure, or fear that public stability might unravel.`
        : `放在歷史脈絡中來讀，這些場景能幫助理解早期教會是在被監視與壓力下前進的。使徒行傳中的反對通常不是偶然，而是出於權柄受挑戰、信仰衝突、經濟利益受損，或對公共秩序動搖的恐懼。`
    ];
  }

  if (relatedJourneys.length > 0) {
    return [
      lang === 'en'
        ? `This profile belongs to the period when the church was moving beyond Jerusalem into the synagogue networks, port cities, and Roman roads of the eastern Mediterranean. Acts ${firstChapter ?? ''}${lastChapter && lastChapter !== firstChapter ? `-${lastChapter}` : ''} sits inside a world shaped by imperial transport, urban debate, and local patronage.`
        : `這份人物檔案屬於教會從耶路撒冷走向東地中海會堂網絡、港口城市與羅馬道路系統的時期。使徒行傳第${firstChapter ?? ''}${lastChapter && lastChapter !== firstChapter ? `至${lastChapter}` : ''}章所呈現的，是一個受帝國交通、城市辯論與地方權力結構塑造的世界。`,
      lang === 'en'
        ? `That context matters because ministry in Acts is not abstract. Travel, hospitality, trade routes, civic officials, and ethnic boundaries all shape how the gospel is heard and how leaders like ${textFor(person.name, lang)} must adapt their witness.`
        : `這個背景之所以重要，是因為使徒行傳中的事工從來不是抽象的。旅行、接待、商道、市政官員與族群界線，都直接影響福音如何被聽見，也塑造了像${textFor(person.name, lang)}這樣的人物如何調整見證方式。`
    ];
  }

  return [
    lang === 'en'
      ? `This biography belongs to the formative Jerusalem-centered phase of Acts, when the church was defining its life through prayer, teaching, temple presence, fellowship, and public witness. The social world was Jewish in texture but lived under Roman power, which helps explain both the boldness and the vulnerability of the first disciples.`
      : `這份人物傳記主要屬於使徒行傳以耶路撒冷為中心的奠基時期。當時教會藉著禱告、教導、聖殿生活、團契與公開見證來塑造自己的身份。其社會肌理深深帶有猶太背景，卻同時活在羅馬權力之下，這也解釋了最初門徒既剛強又脆弱的處境。`,
    lang === 'en'
      ? `Seen in that frame, the ministry of ${textFor(person.name, lang)} is part of the early church's effort to answer a decisive question: how should the risen Jesus be proclaimed, obeyed, and embodied in a rapidly changing world?`
      : `放在這樣的歷史框架裡，${textFor(person.name, lang)}的事奉就成了早期教會回應一個關鍵問題的一部分：在快速變動的世界裡，如何傳揚、順服並活出復活的耶穌？`
  ];
};

const PersonDetailPage = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const { person, loading: personLoading, error: personError } = usePerson(personId || '');
  const { events, loading: eventsLoading } = useEvents();
  const { locations, loading: locationsLoading } = useLocations();
  const { journeys, loading: journeysLoading } = useJourneys();
  const { language, t } = useLanguage();
  const lang: LangKey = language === 'zh-TW' ? 'zh' : 'en';

  const loading = personLoading || eventsLoading || locationsLoading || journeysLoading;

  const relatedEvents = useMemo(
    () => (person ? getRelatedEvents(person, events) : []),
    [person, events]
  );

  const relatedLocations = useMemo(() => {
    const items = relatedEvents
      .map((event) => locations.find((location) => location.id === event.location))
      .filter(Boolean) as Location[];
    return uniqueById(items);
  }, [relatedEvents, locations]);

  const relatedJourneys = useMemo(() => {
    const items = relatedEvents
      .map((event) => journeys.find((journey) => journey.id === event.journeyId))
      .filter(Boolean) as Journey[];
    return uniqueById(items);
  }, [relatedEvents, journeys]);

  const biographyParagraphs = useMemo(
    () => (person ? buildBiographyParagraphs(person, relatedEvents, relatedLocations, relatedJourneys, lang) : []),
    [person, relatedEvents, relatedLocations, relatedJourneys, lang]
  );

  const historicalContext = useMemo(
    () => (person ? buildHistoricalContext(person, relatedEvents, relatedJourneys, lang) : []),
    [person, relatedEvents, relatedJourneys, lang]
  );

  const statItems = useMemo(() => {
    if (!person) return [];
    return [
      {
        label: lang === 'en' ? 'Acts Events' : '相關事件',
        value: String(relatedEvents.length),
      },
      {
        label: lang === 'en' ? 'Locations' : '涉及地點',
        value: String(relatedLocations.length),
      },
      {
        label: lang === 'en' ? 'Journeys' : '關聯旅程',
        value: String(relatedJourneys.length),
      },
    ];
  }, [person, relatedEvents.length, relatedLocations.length, relatedJourneys.length, lang]);

  const profileChips = useMemo(() => {
    if (!person) return [];
    const chips = [
      textFor(person.role, lang),
      person.category === 'opponent'
        ? (lang === 'en' ? 'Acts Opponent' : '使徒行傳中的反對者')
        : (lang === 'en' ? 'Early Church Figure' : '早期教會人物'),
    ];

    if (relatedJourneys.length > 0) {
      chips.push(
        lang === 'en'
          ? `${relatedJourneys.length} journey${relatedJourneys.length === 1 ? '' : 's'} linked`
          : `關聯 ${relatedJourneys.length} 段旅程`
      );
    }

    return chips;
  }, [person, relatedJourneys.length, lang]);

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

  if (personError || !person) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <div className="text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
          <p className="text-slate-600 dark:text-slate-400">{t('common.error')}</p>
          <button
            type="button"
            onClick={() => navigate('/people')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {lang === 'en' ? 'Back to Key Figures' : '返回關鍵人物'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 md:px-8 py-8">
      <div className="max-w-lg md:max-w-4xl mx-auto space-y-8">
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex justify-center md:justify-start">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex-shrink-0">
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={textFor(person.name, lang)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="bg-primary/10 dark:bg-primary/20 w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-5xl">person</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold mb-2">
                {lang === 'en' ? 'People of Acts' : '使徒行傳人物'}
              </p>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                {textFor(person.name, lang)}
              </h1>
              <p className="text-lg md:text-2xl text-primary font-medium mb-4">
                {textFor(person.role, lang)}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {profileChips.map((chip) => (
                  <span
                    key={chip}
                    className="text-[11px] md:text-xs bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-primary/10"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800"
            >
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {item.label}
              </p>
              <p className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary">menu_book</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {lang === 'en' ? 'Biography' : '人物傳記'}
            </h2>
          </div>
          <div className="space-y-4">
            {biographyParagraphs.map((paragraph, index) => (
              <p key={index} className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-primary">timeline</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {person.category === 'opponent'
                ? (lang === 'en' ? 'Timeline in Acts' : '在使徒行傳中的時間線')
                : (lang === 'en' ? 'Timeline of Ministry' : '事工時間線')}
            </h2>
          </div>

          {relatedEvents.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {lang === 'en'
                ? 'No linked events are currently stored for this figure.'
                : '目前尚未為這位人物建立相關事件。'}
            </p>
          ) : (
            <div className="space-y-4">
              {relatedEvents.map((event) => {
                const eventLocation = locations.find((location) => location.id === event.location);
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 p-4 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {event.date.displayText[lang]}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {formatScriptureDisplay(event.scripture)}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {textFor(event.title, lang)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {textFor(event.description, lang)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {eventLocation && (
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {textFor(eventLocation.name, lang)}
                        </span>
                      )}
                      {event.journeyId && (
                        <span className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {textFor(journeys.find((journey) => journey.id === event.journeyId)?.displayName, lang)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">history_edu</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                {lang === 'en' ? 'Historical Context' : '歷史背景'}
              </h2>
            </div>
            <div className="space-y-4">
              {historicalContext.map((paragraph, index) => (
                <p key={index} className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">explore</span>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Ministry Footprint' : '事工足跡'}
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    {lang === 'en' ? 'Locations' : '地點'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relatedLocations.length === 0 ? (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {lang === 'en' ? 'No linked locations' : '尚無關聯地點'}
                      </span>
                    ) : (
                      relatedLocations.map((location) => (
                        <span
                          key={location.id}
                          className="px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs md:text-sm"
                        >
                          {textFor(location.name, lang)}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    {lang === 'en' ? 'Journey Links' : '旅程關聯'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relatedJourneys.length === 0 ? (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {lang === 'en' ? 'No linked missionary journey' : '尚無關聯宣教旅程'}
                      </span>
                    ) : (
                      relatedJourneys.map((journey) => (
                        <span
                          key={journey.id}
                          className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs md:text-sm"
                        >
                          {textFor(journey.displayName, lang)}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PersonDetailPage;
