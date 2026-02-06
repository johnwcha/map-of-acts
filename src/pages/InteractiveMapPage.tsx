import { useState } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { LatLngExpression } from 'leaflet';
import { useEvents } from '../hooks/useEvents';
import { useLocations } from '../hooks/useLocations';
import { useJourneys } from '../hooks/useJourneys';
import { useLanguage } from '../hooks/useLanguage';
import MapView from '../components/map/MapView';
import LocationMarker from '../components/map/LocationMarker';
import RouteLayer from '../components/map/RouteLayer';
import MapControls from '../components/map/MapControls';

const InteractiveMapPage = () => {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { events, loading: eventsLoading } = useEvents();
  const { locations, loading: locationsLoading } = useLocations();
  const { journeys, loading: journeysLoading } = useJourneys();
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';

  // Get initial state from navigation
  const initialJourneyId = routerLocation.state?.journeyId || 'early-church';
  const initialEventId = routerLocation.state?.eventId || events[0]?.id;

  const [activeJourneyId, setActiveJourneyId] = useState(initialJourneyId);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed map center and zoom
  const mapCenter: LatLngExpression = [33.5, 36.3];
  const mapZoom = 7;

  const loading = eventsLoading || locationsLoading || journeysLoading;

  // Get active journey and its events
  const activeJourney = journeys.find(j => j.id === activeJourneyId);
  const journeyEvents = activeJourney
    ? events.filter(e => activeJourney.events.includes(e.id))
    : events.slice(0, 3);

  // Get selected event
  const selectedEvent = events.find(e => e.id === selectedEventId) || journeyEvents[0];

  // Calculate route positions for active journey
  const routePositions: LatLngExpression[] = activeJourney
    ? activeJourney.route.flatMap(segment => {
        const fromLoc = locations.find(l => l.id === segment.from);
        const toLoc = locations.find(l => l.id === segment.to);
        return [
          fromLoc ? (fromLoc.coordinates as LatLngExpression) : ([0, 0] as LatLngExpression),
          toLoc ? (toLoc.coordinates as LatLngExpression) : ([0, 0] as LatLngExpression)
        ];
      })
    : [];

  // Filter locations for search
  const filteredLocations = locations.filter(loc =>
    loc.name[lang].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJourneyChange = (journeyId: string) => {
    setActiveJourneyId(journeyId);
    const journey = journeys.find(j => j.id === journeyId);
    if (journey && journey.events.length > 0) {
      setSelectedEventId(journey.events[0]);
    }
  };

  const handleLocationClick = (locationId: string) => {
    // Find event at this location
    const eventAtLocation = events.find(e => e.location === locationId);
    if (eventAtLocation) {
      setSelectedEventId(eventAtLocation.id);
    }
  };

  const handleReadStory = () => {
    if (selectedEvent) {
      navigate(`/event/${selectedEvent.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-64px-56px)] w-full flex-col overflow-hidden">
      {/* Map Container */}
      <div className="relative flex-1">
        <MapView center={mapCenter} zoom={mapZoom}>
          {/* Location Markers */}
          {filteredLocations.map(location => (
            <LocationMarker
              key={location.id}
              location={location}
              onClick={() => handleLocationClick(location.id)}
            />
          ))}

          {/* Journey Route */}
          {routePositions.length > 0 && (
            <RouteLayer
              positions={routePositions}
              color={activeJourney?.color || '#1152d4'}
            />
          )}

          {/* Map Controls */}
          <MapControls />
        </MapView>

        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-40">
          <label className="flex flex-col h-12 shadow-lg">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
              <div className="text-slate-500 flex border-none bg-white dark:bg-slate-800 items-center justify-center pl-4">
                <span className="material-symbols-outlined">map</span>
              </div>
              <input
                type="text"
                className="flex w-full min-w-0 flex-1 border-none bg-white dark:bg-slate-800 focus:ring-0 h-full text-slate-900 dark:text-white px-4 pl-2 text-base font-normal"
                placeholder={t('map.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Journey Filter Pills */}
        <div className="absolute top-20 left-0 w-full overflow-x-auto no-scrollbar z-40">
          <div className="flex gap-3 p-4">
            {journeys.map(journey => (
              <button
                key={journey.id}
                onClick={() => handleJourneyChange(journey.id)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 shadow-md transition-colors ${
                  activeJourneyId === journey.id
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <p className="text-sm font-medium">{journey.displayName[lang]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Event Card */}
        {selectedEvent && (
          <div className="absolute bottom-6 left-4 right-4 z-40">
            <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 shadow-2xl border border-white/50 dark:border-white/10">
              <div className="flex flex-[2_2_0px] flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {lang === 'en' ? 'Active Event' : '當前事件'}
                  </span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                    {selectedEvent.title[lang]}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
                    {selectedEvent.scripture.display} • {locations.find(l => l.id === selectedEvent.location)?.name[lang]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReadStory}
                    className="flex flex-1 cursor-pointer items-center justify-center rounded-lg h-9 bg-primary text-white gap-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                    <span className="truncate">{t('map.readStory')}</span>
                  </button>
                  <button
                    className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    aria-label={t('map.bookmark')}
                  >
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  </button>
                </div>
              </div>
              {selectedEvent.primaryImage && (
                <div
                  className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 shadow-inner"
                  style={{ backgroundImage: `url(${selectedEvent.primaryImage})` }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress Slider */}
      {selectedEvent && (
        <div className="bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 px-6 pt-4 pb-8 z-50">
          <div className="flex w-full items-center justify-between mb-2">
            <p className="text-primary text-base font-bold">
              {lang === 'en' ? `Chapter ${selectedEvent.scripture.chapter}` : `第${selectedEvent.scripture.chapter}章`}
            </p>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <p className="text-xs font-medium">{selectedEvent.date.displayText[lang]}</p>
            </div>
          </div>
          <div className="relative flex h-6 w-full items-center">
            <div className="flex h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-primary relative"
                style={{ width: `${(selectedEvent.date.order / events.length) * 100}%` }}
              >
                <div className="absolute -right-3 -top-2.5 size-6 rounded-full bg-white border-2 border-primary shadow-lg flex items-center justify-center">
                  <div className="size-2 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMapPage;
