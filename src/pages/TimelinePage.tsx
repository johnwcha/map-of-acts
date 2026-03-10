import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useLocations } from '../hooks/useLocations';
import { useLanguage } from '../hooks/useLanguage';
import TimelineItem from '../components/timeline/TimelineItem';
import SectionDivider from '../components/timeline/SectionDivider';
import { SearchContext } from '../components/layout/Layout';

const TimelinePage = () => {
  const { events, loading, error } = useEvents();
  const { locations } = useLocations();
  const { t } = useLanguage();
  const chapterRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const railRef = useRef<HTMLDivElement | null>(null);
  const indicatorTimeoutRef = useRef<number | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [indicatorChapter, setIndicatorChapter] = useState<number | null>(null);

  // Search query from Layout via outlet context (empty string when not searching)
  const { searchQuery } = useOutletContext<SearchContext>();
  const query = searchQuery.trim().toLowerCase();

  // Restore scroll position when navigating back from event detail
  useEffect(() => {
    if (!loading) {
      const saved = sessionStorage.getItem('timeline-scroll');
      if (saved) {
        sessionStorage.removeItem('timeline-scroll');
        requestAnimationFrame(() => {
          window.scrollTo({ top: Number(saved), behavior: 'instant' });
        });
      }
    }
  }, [loading]);

  // Filter events by title, description, and location name (both EN and ZH)
  const filteredEvents = useMemo(() => {
    if (!query) return events;
    return events.filter((event) => {
      const location = locations.find((loc) => loc.id === event.location);
      return (
        event.title.en.toLowerCase().includes(query) ||
        event.title.zh.toLowerCase().includes(query) ||
        event.description.en.toLowerCase().includes(query) ||
        event.description.zh.toLowerCase().includes(query) ||
        (location && (
          location.name.en.toLowerCase().includes(query) ||
          location.name.zh.toLowerCase().includes(query)
        ))
      );
    });
  }, [events, locations, query]);

  const chapterStartIds = useMemo(() => {
    const starts = new Map<number, string>();
    filteredEvents.forEach((event) => {
      if (!starts.has(event.scripture.chapter)) {
        starts.set(event.scripture.chapter, event.id);
      }
    });
    return starts;
  }, [filteredEvents]);

  const chapterEntries = useMemo(
    () => Array.from(chapterStartIds.entries()).map(([chapter, eventId]) => ({ chapter, eventId })),
    [chapterStartIds]
  );
  const activeChapterIndex = chapterEntries.findIndex((entry) => entry.chapter === activeChapter);
  const indicatorChapterIndex = chapterEntries.findIndex((entry) => entry.chapter === indicatorChapter);

  useEffect(() => {
    setActiveChapter(chapterEntries[0]?.chapter ?? null);
  }, [chapterEntries]);

  useEffect(() => {
    return () => {
      if (indicatorTimeoutRef.current != null) {
        window.clearTimeout(indicatorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chapterEntries.length === 0) return;

    const updateActiveChapter = () => {
      let nextChapter = chapterEntries[0].chapter;

      for (const entry of chapterEntries) {
        const top = chapterRefs.current[entry.chapter]?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        if (top <= 160) {
          nextChapter = entry.chapter;
        } else {
          break;
        }
      }

      setActiveChapter((current) => current === nextChapter ? current : nextChapter);
    };

    updateActiveChapter();
    window.addEventListener('scroll', updateActiveChapter, { passive: true });

    return () => window.removeEventListener('scroll', updateActiveChapter);
  }, [chapterEntries]);

  const scrollToChapter = (chapter: number, behavior: ScrollBehavior = 'smooth') => {
    chapterRefs.current[chapter]?.scrollIntoView({ behavior, block: 'start' });
    setActiveChapter(chapter);
  };

  const showChapterIndicator = (chapter: number, autoHide = !isScrubbing) => {
    setIndicatorChapter(chapter);

    if (indicatorTimeoutRef.current != null) {
      window.clearTimeout(indicatorTimeoutRef.current);
    }

    if (autoHide) {
      indicatorTimeoutRef.current = window.setTimeout(() => {
        setIndicatorChapter(null);
      }, 900);
    }
  };

  const scrubToPointer = (clientY: number, behavior: ScrollBehavior = 'auto') => {
    if (!railRef.current || chapterEntries.length === 0) return;

    const rect = railRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const nextIndex = Math.round(ratio * (chapterEntries.length - 1));
    const nextChapter = chapterEntries[nextIndex]?.chapter;

    if (nextChapter != null && nextChapter !== activeChapter) {
      scrollToChapter(nextChapter, behavior);
      showChapterIndicator(nextChapter);
    } else if (nextChapter != null) {
      showChapterIndicator(nextChapter);
    }
  };

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

      {/* Search result count */}
      {query && (
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200 px-4 mb-3">
          {filteredEvents.length === 0
            ? 'No results found'
            : `${filteredEvents.length} result${filteredEvents.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Timeline Container */}
      <div className="px-4 relative">
        {filteredEvents.length === 0 && query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No events match "{searchQuery}"</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try a different keyword</p>
          </div>
        ) : (
          <>
            {chapterEntries.length > 1 && (
              <div className="sticky top-24 z-20 h-0">
                <div
                  ref={railRef}
                  className={`relative flex h-[calc(100vh-160px)] w-10 touch-none select-none items-center justify-center ${isScrubbing ? 'cursor-row-resize' : ''}`}
                  onPointerDown={(event) => {
                    setIsScrubbing(true);
                    event.currentTarget.setPointerCapture(event.pointerId);
                    scrubToPointer(event.clientY, 'auto');
                  }}
                  onPointerMove={(event) => {
                    if (isScrubbing) {
                      scrubToPointer(event.clientY, 'auto');
                    }
                  }}
                  onPointerUp={(event) => {
                    setIsScrubbing(false);
                    event.currentTarget.releasePointerCapture(event.pointerId);
                    if (activeChapter != null) {
                      showChapterIndicator(activeChapter, true);
                    }
                  }}
                  onPointerCancel={(event) => {
                    setIsScrubbing(false);
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                      event.currentTarget.releasePointerCapture(event.pointerId);
                    }
                    if (activeChapter != null) {
                      showChapterIndicator(activeChapter, true);
                    }
                  }}
                  aria-label="Jump through timeline chapters"
                  role="navigation"
                >
                  <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-primary/15" />
                  <div
                    className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-primary/20 bg-primary ring-4 ring-white dark:ring-background-dark transition-transform"
                    style={{
                      top: chapterEntries.length > 1 && activeChapterIndex >= 0
                        ? `calc(${(activeChapterIndex / (chapterEntries.length - 1)) * 100}% - 8px)`
                        : '0%',
                    }}
                  />
                  {indicatorChapter != null && indicatorChapterIndex >= 0 && (
                    <div
                      className="absolute left-full ml-2 rounded-full bg-slate-900/95 dark:bg-slate-100/95 px-2.5 py-1 text-[11px] font-bold text-white dark:text-slate-900 shadow-md whitespace-nowrap"
                      style={{
                        top: chapterEntries.length > 1
                          ? `calc(${(indicatorChapterIndex / (chapterEntries.length - 1)) * 100}% - 14px)`
                          : '0%',
                      }}
                    >
                      Acts {indicatorChapter}
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute inset-0"
                    onClick={(event) => scrubToPointer(event.clientY)}
                    aria-label="Jump to nearby chapter"
                  />
                </div>
              </div>
            )}

            {filteredEvents.map((event, index) => {
              const location = locations.find((loc) => loc.id === event.location);
              const isLast = index === filteredEvents.length - 1;
              const isChapterStart = chapterStartIds.get(event.scripture.chapter) === event.id;

              // Show section divider when category changes (skip when searching)
              const showDivider = !query && event.category !== lastCategory && index > 0;
              lastCategory = event.category;

              return (
                <div
                  key={event.id}
                  ref={isChapterStart ? (node) => {
                    chapterRefs.current[event.scripture.chapter] = node;
                  } : undefined}
                >
                  {showDivider && <SectionDivider category={event.category} />}
                  <TimelineItem
                    event={event}
                    location={location}
                    isLast={isLast}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
