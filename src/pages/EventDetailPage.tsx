import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvents';
import { useLocation } from '../hooks/useLocations';
import { usePeople } from '../hooks/usePeople';
import { useLanguage } from '../hooks/useLanguage';
import { Person } from '../types';
import EventHero from '../components/event/EventHero';
import ScripturePassage from '../components/event/ScripturePassage';
import KeyFigures from '../components/event/KeyFigures';
import MapView from '../components/map/MapView';
import LocationMarker from '../components/map/LocationMarker';

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(eventId || '');
  const { location } = useLocation(event?.location || '');
  const { people } = usePeople();
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';

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

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
          <p className="text-slate-600 dark:text-slate-400">{t('common.error')}</p>
          <button
            onClick={() => navigate('/timeline')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  // Get people data for this event
  const keyPeople = event?.keyFigures
    ? event.keyFigures.map(personId => people.find(p => p.id === personId)).filter((p): p is Person => p !== undefined)
    : [];

  const handlePrevious = () => {
    if (event.previousEventId) {
      navigate(`/event/${event.previousEventId}`);
    }
  };

  const handleNext = () => {
    if (event.nextEventId) {
      navigate(`/event/${event.nextEventId}`);
    }
  };

  const handleMapClick = () => {
    navigate('/map', { state: { eventId: event.id, locationId: event.location } });
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <EventHero event={event} />

      {/* Scripture Passage */}
      <ScripturePassage event={event} />

      {/* Location Section */}
      {location && (
        <section className="mt-8 px-4 md:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <h3 className="text-lg font-bold font-serif">
              {t('event.location')}: {location.name[lang]}
            </h3>
          </div>

          {/* Map Preview */}
          {/* Map Preview */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-200 shadow-inner border border-slate-200 dark:border-slate-800 z-0">
            <MapView center={location.coordinates} zoom={8}>
              <LocationMarker location={location} />
            </MapView>
            <div
              onClick={handleMapClick}
              className="absolute inset-0 z-[400] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center group"
            >
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-200 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">open_in_full</span>
                  {t('common.view_map')}
                </span>
              </div>
            </div>
          </div>

          {/* Location Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-snug">
            {location.description[lang]}
          </p>
        </section>
      )}

      {/* Key Figures */}
      <KeyFigures people={keyPeople} />

      {/* Navigation Footer */}
      <nav className="fixed bottom-20 left-0 right-0 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 z-40">
        <div className="max-w-mobile md:max-w-desktop mx-auto flex gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={!event.previousEventId}
            className={`flex-1 flex items-center justify-start gap-3 p-3 rounded-xl border transition-all ${event.previousEventId
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-100 active:scale-95'
                : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100/50 dark:border-slate-800/50 opacity-50 cursor-not-allowed'
              }`}
          >
            <span className="material-symbols-outlined text-slate-400">chevron_left</span>
            <div className="text-left overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t('event.previous')}
              </p>
              {event.previousEventId && (
                <p className="text-sm font-bold truncate text-slate-700 dark:text-slate-300">
                  {/* Will show actual previous event title once we have the data */}
                  ...
                </p>
              )}
            </div>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!event.nextEventId}
            className={`flex-1 flex items-center justify-end gap-3 p-3 rounded-xl transition-all ${event.nextEventId
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                : 'bg-primary/50 text-white/70 cursor-not-allowed'
              }`}
          >
            <div className="text-right overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
                {t('event.next')}
              </p>
              {event.nextEventId && (
                <p className="text-sm font-bold truncate">
                  {/* Will show actual next event title once we have the data */}
                  ...
                </p>
              )}
            </div>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default EventDetailPage;
