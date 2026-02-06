import { useEvents } from '../hooks/useEvents';
import { useLocations } from '../hooks/useLocations';
import { useLanguage } from '../hooks/useLanguage';
import TimelineItem from '../components/timeline/TimelineItem';
import SectionDivider from '../components/timeline/SectionDivider';

const TimelinePage = () => {
  const { events, loading, error } = useEvents();
  const { locations } = useLocations();
  const { t } = useLanguage();

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
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Group events by category for section dividers
  let lastCategory: string | null = null;

  return (
    <div>
      {/* Header Section */}
      <header className="pt-8 pb-6 px-4 md:px-8 text-center">
        <h2 className="font-serif text-primary tracking-tight text-[32px] md:text-5xl font-bold leading-tight mb-2">
          {t('timeline.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-normal font-serif italic">
          {t('timeline.subtitle')}
        </p>
      </header>

      {/* Timeline Container */}
      <div className="px-4">
        {events.map((event, index) => {
          const location = locations.find(loc => loc.id === event.location);
          const isLast = index === events.length - 1;

          // Show section divider when category changes
          const showDivider = event.category !== lastCategory && index > 0;
          lastCategory = event.category;

          return (
            <div key={event.id}>
              {showDivider && <SectionDivider category={event.category} />}
              <TimelineItem
                event={event}
                location={location}
                isLast={isLast}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelinePage;
