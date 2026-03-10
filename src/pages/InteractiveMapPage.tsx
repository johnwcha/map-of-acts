import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { LatLngExpression } from 'leaflet';
import { useEvents } from '../hooks/useEvents';
import { useLocations } from '../hooks/useLocations';
import { useJourneys } from '../hooks/useJourneys';
import { useLanguage } from '../hooks/useLanguage';
import MapView from '../components/map/MapView';
import LocationMarker from '../components/map/LocationMarker';
import RouteLayer from '../components/map/RouteLayer';
import MapControls from '../components/map/MapControls';
import AnimatedArrow from '../components/map/AnimatedArrow';
import { formatScriptureDisplay } from '../utils/scriptureUtils';

interface MapRouteState {
  journeyId?: string;
  eventId?: string;
  locationId?: string;
}

const DEFAULT_JOURNEY_ID = 'early-church';
const DEFAULT_MAP_CENTER: LatLngExpression = [36.5, 32.0];
const DEFAULT_MAP_ZOOM = 6;
const FOCUSED_MAP_ZOOM = 8;

const InteractiveMapPage = () => {
  const routerLocation = useRouterLocation();
  const { events, loading: eventsLoading } = useEvents();
  const { locations, loading: locationsLoading } = useLocations();
  const { journeys, loading: journeysLoading } = useJourneys();
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const routeState = (routerLocation.state as MapRouteState | null) ?? null;
  const hasExplicitEventTarget = Boolean(routeState?.eventId);

  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(routeState?.journeyId ?? null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(routeState?.eventId ?? null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(routeState?.locationId ?? null);
  const [preferSelectedEventCard, setPreferSelectedEventCard] = useState(hasExplicitEventTarget);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);

  const loading = eventsLoading || locationsLoading || journeysLoading;

  useEffect(() => {
    if (loading) return;

    const hasExplicitTarget = Boolean(routeState?.journeyId || routeState?.eventId || routeState?.locationId);
    const routedEvent = routeState?.eventId
      ? events.find(event => event.id === routeState.eventId)
      : undefined;
    const routedLocationId = routeState?.locationId ?? routedEvent?.location ?? null;
    const routedJourneyId = routeState?.journeyId
      ?? routedEvent?.journeyId
      ?? (hasExplicitTarget ? null : DEFAULT_JOURNEY_ID);

    setIsPlaying(false);
    setActiveJourneyId(routedJourneyId);
    setSelectedEventId(routedEvent?.id ?? (hasExplicitTarget ? null : events[0]?.id ?? null));
    setSelectedLocationId(routedLocationId ?? (hasExplicitTarget ? null : null));
    setPreferSelectedEventCard(Boolean(routedEvent));

    if (!routedJourneyId) {
      setActiveStopIndex(-1);
      return;
    }

    const journey = journeys.find(item => item.id === routedJourneyId);
    if (!journey) {
      setActiveStopIndex(-1);
      return;
    }

    const journeyStopIds = journey.journeyStops?.map(stop => stop.locationId)
      ?? (journey.route.length > 0
        ? [journey.route[0].from, ...journey.route.map(segment => segment.to)]
        : []);
    const nextStopIndex = routedLocationId
      ? journeyStopIds.findIndex(id => id === routedLocationId)
      : (hasExplicitTarget ? -1 : 0);
    setActiveStopIndex(nextStopIndex);
  }, [events, journeys, loading, routeState, routerLocation.key]);

  const activeJourney = activeJourneyId ? journeys.find(j => j.id === activeJourneyId) : undefined;
  const journeyEvents = activeJourney
    ? events.filter(e => activeJourney.events.includes(e.id))
    : [];

  const selectedEvent = (selectedEventId ? events.find(e => e.id === selectedEventId) : undefined) || journeyEvents[0];

  // Derive full ordered route stops (including revisits) from journey segments
  const routeStopIds: string[] = useMemo(() => {
    if (!activeJourney) return [];
    if (activeJourney.route.length === 0) return [];
    return [activeJourney.route[0].from, ...activeJourney.route.map(seg => seg.to)];
  }, [activeJourney]);

  // Unique location ids for rendering markers (avoid duplicate overlapping markers)
  const markerStopIds: string[] = useMemo(() => {
    const seen = new Set<string>();
    const orderedUnique: string[] = [];
    for (const id of routeStopIds) {
      if (!seen.has(id)) {
        seen.add(id);
        orderedUnique.push(id);
      }
    }
    return orderedUnique;
  }, [routeStopIds]);

  const markerLocations = useMemo(
    () => markerStopIds.map(id => locations.find(l => l.id === id)).filter(Boolean) as typeof locations,
    [markerStopIds, locations]
  );

  // Location objects for route playback (includes revisits)
  const routeStopLocations = useMemo(
    () => routeStopIds.map(id => locations.find(l => l.id === id)).filter(Boolean) as typeof locations,
    [routeStopIds, locations]
  );

  // LatLng coords for each stop (for route + animation)
  const stopCoords: [number, number][] = useMemo(
    () => routeStopLocations.map(l => l.coordinates),
    [routeStopLocations]
  );

  const segmentStopCoords = useCallback((segments: Array<{ from: string; to: string }>) => {
    return segments.flatMap((segment, index) => {
      const fromLoc = locations.find(l => l.id === segment.from);
      const toLoc = locations.find(l => l.id === segment.to);

      if (!fromLoc || !toLoc) {
        return [
          fromLoc ? (fromLoc.coordinates as LatLngExpression) : ([0, 0] as LatLngExpression),
          toLoc ? (toLoc.coordinates as LatLngExpression) : ([0, 0] as LatLngExpression),
        ];
      }

      return index === 0
        ? [fromLoc.coordinates, toLoc.coordinates]
        : [toLoc.coordinates];
    });
  }, [locations]);

  // Route positions split by leg (supports different colors for outbound/return)
  const outboundRoutePositions: LatLngExpression[] = activeJourney
    ? segmentStopCoords(activeJourney.outboundRoute && activeJourney.outboundRoute.length > 0
      ? activeJourney.outboundRoute
      : activeJourney.route)
    : [];

  const turnaroundSegment = activeJourney?.outboundRoute?.length
    ? activeJourney.outboundRoute[activeJourney.outboundRoute.length - 1]
    : null;

  const returnRoutePositions: LatLngExpression[] = activeJourney?.returnRoute
    ? segmentStopCoords(turnaroundSegment
      ? [turnaroundSegment, ...activeJourney.returnRoute]
      : activeJourney.returnRoute)
    : [];

  const activeJourneyStop = activeJourney?.journeyStops && activeJourney.journeyStops.length > 0
    && activeStopIndex >= 0
    ? activeJourney.journeyStops[Math.min(activeStopIndex, activeJourney.journeyStops.length - 1)]
    : null;

  const activeStopLocationId = activeJourneyStop?.locationId || routeStopIds[activeStopIndex];

  const activeStopLocation = activeStopLocationId
    ? locations.find(l => l.id === activeStopLocationId)
    : undefined;

  const selectedMapLocation = locations.find(location => location.id === (selectedLocationId || selectedEvent?.location || ''));
  const focusedLocation = activeJourney
    ? activeStopLocation || selectedMapLocation
    : selectedMapLocation;
  const mapCenter = focusedLocation?.coordinates || DEFAULT_MAP_CENTER;
  const mapZoom = focusedLocation ? FOCUSED_MAP_ZOOM : DEFAULT_MAP_ZOOM;
  const focusedLocationInRoute = focusedLocation
    ? markerStopIds.includes(focusedLocation.id)
    : false;

  const handleJourneyChange = (journeyId: string) => {
    setIsPlaying(false);
    setActiveStopIndex(0);
    setActiveJourneyId(journeyId);
    setPreferSelectedEventCard(false);
    const journey = journeys.find(j => j.id === journeyId);
    const firstStopLocationId = journey?.journeyStops?.[0]?.locationId || journey?.route[0]?.from || null;
    setSelectedLocationId(firstStopLocationId);
    if (journey && journey.events.length > 0) {
      setSelectedEventId(journey.events[0]);
    } else {
      setSelectedEventId(null);
    }
  };

  const handleLocationClick = (locationId: string) => {
    setSelectedLocationId(locationId);
    setPreferSelectedEventCard(false);

    if (activeJourney) {
      const journeyStopIdx = activeJourney.journeyStops?.findIndex(stop => stop.locationId === locationId) ?? -1;
      const routeIdx = routeStopIds.findIndex(id => id === locationId);
      const nextIdx = journeyStopIdx >= 0 ? journeyStopIdx : routeIdx;
      setActiveStopIndex(nextIdx);
    }

    const eventAtLocation = events.find(e => e.location === locationId);
    if (eventAtLocation) setSelectedEventId(eventAtLocation.id);
  };

  const handlePlayPause = () => {
    setPreferSelectedEventCard(false);
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  // Called by AnimatedArrow each time it reaches a stop
  const handleStopReached = useCallback((stopIndex: number) => {
    setActiveStopIndex(stopIndex);
    setPreferSelectedEventCard(false);
    // Find the event at this stop's location
    const locId = activeJourney?.journeyStops?.[stopIndex]?.locationId || routeStopIds[stopIndex];
    if (locId) {
      setSelectedLocationId(locId);
      const ev = events.find(e => e.location === locId && e.journeyId === activeJourney?.id)
        || events.find(e => e.location === locId && activeJourney?.events.includes(e.id))
        || events.find(e => e.location === locId);
      if (ev) setSelectedEventId(ev.id);
    }
  }, [routeStopIds, events, activeJourney]);

  const handleAnimationComplete = useCallback(() => {
    setIsPlaying(false);
    setActiveStopIndex(0);
  }, []);

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

  const hasJourneyRoute = stopCoords.length >= 2;
  const stopCount = activeJourney?.journeyStops?.length || routeStopIds.length;
  const hasJourneyStopData = Boolean(activeJourneyStop && activeStopLocation && activeStopIndex >= 0);
  const showSelectedEventCard = Boolean(selectedEvent) && (!hasJourneyStopData || preferSelectedEventCard);
  const topCardTitle = showSelectedEventCard
    ? selectedEvent?.title[lang]
    : hasJourneyStopData
      ? `${activeStopIndex + 1}. ${activeStopLocation?.name[lang]}`
      : focusedLocation?.name[lang];
  const topCardMeta = showSelectedEventCard
    ? formatScriptureDisplay(selectedEvent!.scripture)
    : hasJourneyStopData
      ? activeJourneyStop?.verseRef
      : focusedLocation?.modernName?.[lang] || '';
  const topCardDescription = showSelectedEventCard
    ? locations.find(l => l.id === selectedEvent!.location)?.name[lang]
    : hasJourneyStopData
      ? activeJourneyStop?.keyEvent[lang]
      : focusedLocation?.description[lang] || '';
  const outboundStopCount = activeJourney?.outboundRoute?.length
    ? activeJourney.outboundRoute.length + 1
    : routeStopIds.length;
  const turnaroundStopIndex = Math.max(outboundStopCount - 1, 0);
  const isReturnBoundStop = activeJourney?.returnRoute?.length
    ? activeStopIndex >= turnaroundStopIndex
    : false;
  const stopStageLabel = showSelectedEventCard
    ? (lang === 'en' ? 'Active Event' : '當前事件')
    : hasJourneyStopData
    ? (isReturnBoundStop
      ? (lang === 'en' ? 'Return Bound' : '返程')
      : (lang === 'en' ? 'Out Bound' : '去程'))
    : (lang === 'en' ? 'Active Event' : '當前事件');
  const showOutboundRoute = outboundRoutePositions.length > 0 && (returnRoutePositions.length === 0 || !isReturnBoundStop);
  const showReturnRoute = returnRoutePositions.length > 0 && isReturnBoundStop;
  const activeRouteColor = isReturnBoundStop
    ? (activeJourney?.returnColor || '#10b981')
    : (activeJourney?.color || '#1152d4');

  return (
    <div className="relative flex h-[calc(100vh-64px-56px)] w-full flex-col overflow-hidden">
      {/* Map Container */}
      <div className="relative flex-1">
        <MapView center={mapCenter} zoom={mapZoom}>
          {/* Stop markers for active journey */}
          {activeJourney && markerLocations.length > 0
            ? (
              <>
                {markerLocations.map((location, idx) => (
                  <LocationMarker
                    key={location.id}
                    location={location}
                    stopNumber={idx + 1}
                    isActive={routeStopIds[activeStopIndex] === location.id}
                    color={activeJourney.color}
                    onClick={() => handleLocationClick(location.id)}
                  />
                ))}
                {focusedLocation && !focusedLocationInRoute && (
                  <LocationMarker
                    key={focusedLocation.id}
                    location={focusedLocation}
                    isActive
                    color={activeJourney.color}
                    onClick={() => handleLocationClick(focusedLocation.id)}
                  />
                )}
              </>
            )
            : locations.map(location => (
              <LocationMarker
                key={location.id}
                location={location}
                isActive={focusedLocation?.id === location.id}
                onClick={() => handleLocationClick(location.id)}
              />
            ))}

          {/* Journey Route polyline (outbound + return legs) */}
          {showOutboundRoute && (
            <RouteLayer
              positions={outboundRoutePositions}
              color={activeJourney?.color || '#1152d4'}
              animated={isPlaying}
            />
          )}
          {showReturnRoute && (
            <RouteLayer
              positions={returnRoutePositions}
              color={activeJourney?.returnColor || '#10b981'}
              animated={isPlaying}
            />
          )}

          {/* Animated Arrow */}
          {hasJourneyRoute && (
            <AnimatedArrow
              stops={stopCoords}
              color={activeRouteColor}
              isPlaying={isPlaying}
              onStopReached={handleStopReached}
              onComplete={handleAnimationComplete}
            />
          )}

          <MapControls />
        </MapView>

        <div className="absolute top-4 left-4 right-4 z-40 flex items-start gap-3">
          <div className="flex w-32 shrink-0 flex-col gap-2">
            {journeys.map(journey => (
              <button
                key={journey.id}
                onClick={() => handleJourneyChange(journey.id)}
                className={`flex min-h-10 w-full items-center justify-center rounded-2xl px-3 py-2 text-center shadow-md transition-colors ${activeJourneyId === journey.id
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
              >
                <p className="text-sm font-medium leading-tight">{journey.displayName[lang]}</p>
              </button>
            ))}
          </div>

          {(selectedEvent || hasJourneyStopData || focusedLocation) && (
            <div className="min-w-0 flex-1">
              <div className="rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 shadow-2xl border border-white/50 dark:border-white/10">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm leading-snug">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {stopStageLabel}
                  </span>
                  <p className="text-slate-900 dark:text-white text-base font-bold">
                    {topCardTitle}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {topCardMeta}
                  </p>
                  <p className="min-w-0 text-slate-600 dark:text-slate-300">
                    {topCardDescription}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Progress Slider */}
      {(selectedEvent || hasJourneyStopData || focusedLocation) && (
        <div className="bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 px-6 pt-4 pb-8 z-50">
          <div className="flex w-full items-center justify-between mb-2">
            <p className="text-base font-bold" style={{ color: activeRouteColor }}>
              {showSelectedEventCard
                ? (lang === 'en' ? `Chapter ${selectedEvent?.scripture.chapter}` : `第${selectedEvent?.scripture.chapter}章`)
                : hasJourneyStopData
                ? (lang === 'en' ? `Stop ${activeStopIndex + 1} / ${stopCount}` : `第${activeStopIndex + 1}站 / 共${stopCount}站`)
                : (selectedEvent
                  ? (lang === 'en' ? `Chapter ${selectedEvent.scripture.chapter}` : `第${selectedEvent.scripture.chapter}章`)
                  : focusedLocation?.name[lang] || '')}
            </p>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <p className="text-xs font-medium">
                {showSelectedEventCard
                  ? selectedEvent?.date.displayText[lang]
                  : hasJourneyStopData
                  ? activeJourneyStop?.verseRef
                  : selectedEvent?.date.displayText[lang] || focusedLocation?.modernName?.[lang]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex h-6 flex-1 items-center">
              <div className="flex h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full relative"
                  style={{
                    backgroundColor: activeRouteColor,
                    width: hasJourneyStopData
                      ? `${((activeStopIndex + 1) / Math.max(stopCount, 1)) * 100}%`
                      : `${(selectedEvent ? selectedEvent.date.order / events.length : 0) * 100}%`
                  }}
                >
                  <div
                    className="absolute -right-3 -top-2.5 size-6 rounded-full bg-white shadow-lg flex items-center justify-center"
                    style={{ border: `2px solid ${activeRouteColor}` }}
                  >
                    <div className="size-2 rounded-full" style={{ backgroundColor: activeRouteColor }} />
                  </div>
                </div>
              </div>
            </div>
            {hasJourneyRoute && (
              <button
                onClick={handlePlayPause}
                style={{ backgroundColor: activeJourney?.color || '#1152d4' }}
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                aria-label={isPlaying ? 'Pause animation' : 'Play journey animation'}
              >
                <span className="material-symbols-outlined text-2xl">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default InteractiveMapPage;
