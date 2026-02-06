# Map of Acts - Implementation Plan

## Overview
Build a responsive **PWA** for personal devotional study of the Book of Acts with chronological timeline and interactive maps of Paul's journeys.

**Tech Stack:**
- React + Vite + TypeScript
- Tailwind CSS (matching existing Stitch designs)
- Leaflet for interactive maps
- Static JSON data file with full KJV scripture text
- **React Context for i18n** (English default, Traditional Chinese option)
- Firebase Hosting + Analytics
- PWA with offline support (service worker)

**Target Audience:** Personal devotional study (peaceful UX, readability focus)

**Content Scope:**
- 15-20 major events covering Acts 1-28
- Full KJV passage text embedded (no external API)
- **Bilingual support: English UI (default) + Traditional Chinese (繁體中文)**
- Scripture in both English (KJV) and Traditional Chinese (和合本)
- Mixed image sources: AI-generated, stock photos, public domain art
- Static content (no CMS/admin panel needed)

---

## Stitch Mockups → React Components

The three existing HTML mockups serve as **design references**, not source code. We'll recreate them as React components:

| Stitch Mockup | React Page | Purpose |
|---------------|------------|---------|
| `timeline.html` | `TimelinePage.tsx` | Main screen - vertical chronological timeline with 5+ events |
| `event-details.html` | `EventDetailPage.tsx` | Detail view - hero image, full scripture, location map, navigation |
| `interactive-map.html` | `InteractiveMapPage.tsx` | Map screen - Leaflet integration with journey filters and active event card |

**Migration Strategy:**
1. **Extract design tokens** from HTML → Tailwind config (colors, fonts, spacing)
2. **Recreate layouts** as React components using same Tailwind classes
3. **Replace static content** with dynamic data from `acts-data.json`
4. **Add interactivity**: routing, state management, map controls
5. **Keep mockups** in `stitch-screens/` folder as reference

**Why not use HTML directly?**
- Need React for routing, state, and data binding
- Want component reusability (TimelineItem used multiple times)
- Leaflet requires React integration
- PWA requires service worker and app structure
- Future features need React ecosystem

The visual design will look **identical** - we're just rebuilding with proper architecture.

---

## Architecture

### Project Structure
```
map-of-acts/
├── public/
│   ├── data/
│   │   └── acts-data.json      # All events, locations, people, journeys
│   ├── locales/
│   │   ├── en.json             # English UI translations
│   │   └── zh-TW.json          # Traditional Chinese UI translations
│   └── images/
│       ├── events/             # Hero images for events
│       └── locations/          # Location photos
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── Layout.tsx
│   │   ├── timeline/
│   │   │   ├── TimelineItem.tsx
│   │   │   ├── TimelineConnector.tsx
│   │   │   └── SectionDivider.tsx
│   │   ├── event/
│   │   │   ├── EventHero.tsx
│   │   │   ├── ScripturePassage.tsx
│   │   │   └── KeyFigures.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   ├── LocationMarker.tsx
│   │   │   ├── RouteLayer.tsx
│   │   │   └── MapControls.tsx
│   │   └── shared/
│   │       └── Badge.tsx
│   ├── pages/
│   │   ├── TimelinePage.tsx
│   │   ├── EventDetailPage.tsx
│   │   └── InteractiveMapPage.tsx
│   ├── hooks/
│   │   ├── useEvents.ts
│   │   ├── useLocations.ts
│   │   ├── useJourneys.ts
│   │   └── useLanguage.ts      # Language context hook
│   ├── contexts/
│   │   └── LanguageContext.tsx # i18n provider
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── firebase.json
└── package.json
```

### Data Schema (TypeScript)

**Core Types:**
```typescript
interface Event {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  scripture: ScriptureReference;
  date: { year: number; displayText: { en: string; zh: string }; order: number };
  location: string; // Location ID
  primaryImage: string;
  imageSource: string; // Credit/attribution
  category: string;
  keyFigures: string[]; // Person IDs
  passage: {
    en: {
      fullText: string; // Complete KJV passage
      verses: Array<{ number: number; text: string }>;
      excerpt?: string;
    };
    zh: {
      fullText: string; // Complete 和合本 passage
      verses: Array<{ number: number; text: string }>;
      excerpt?: string;
    };
  };
  nextEventId?: string;
  previousEventId?: string;
}

interface Location {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  coordinates: [number, number]; // [lat, lng]
  description: {
    en: string;
    zh: string;
  };
}

interface Journey {
  id: string;
  name: string;
  displayName: string; // "1st Journey"
  events: string[];
  route: Array<{ from: string; to: string }>;
  color: string;
}
```

---

## Implementation Phases

### Phase 1: Project Setup ✓ (Priority 1)

**Create new Vite project:**
```bash
cd /Users/johncheng/Documents/app/map-of-acts
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom leaflet
npm install -D @types/leaflet tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Critical Files:**
1. ✓ `tailwind.config.js` - Configure colors (#1152d4), fonts (Noto Serif/Sans)
2. ✓ `index.html` - Add Google Fonts and Material Icons CDN
3. `src/types/index.ts` - Define Event, Location, Journey, Person interfaces
4. `src/contexts/LanguageContext.tsx` - Create i18n context (en/zh-TW)
5. `src/hooks/useLanguage.ts` - Language switching hook
6. `public/locales/en.json` - English UI translations
7. `public/locales/zh-TW.json` - Traditional Chinese UI translations
8. `public/data/acts-data.json` - Create bilingual data file with 15-20 events
9. `firebase.json` - Configure hosting (public: dist, SPA rewrites)

**Design System from Stitch:**
- Primary: `#1152d4`
- Background Light: `#f6f6f8`
- Background Dark: `#101622`
- Fonts: Noto Serif (display), Noto Sans (body)
- Mobile-first, max-width: 28rem (448px)

### Phase 2: Data & Routing (Priority 2)

**Create acts-data.json:**
Include 15-20 key events with **bilingual content** (English KJV + Traditional Chinese 和合本):
- Ascension (1:6-11), Pentecost (2:1-4), Stephen's stoning (7:54-60)
- Peter heals lame man (3:1-10), Ananias & Sapphira (5:1-11)
- Philip & Ethiopian (8:26-40), Saul's conversion (9:1-19)
- Peter & Cornelius (10:1-48), Antioch church (11:19-26)
- Peter's escape (12:1-19), Paul's 1st journey (13-14)
- Council of Jerusalem (15:1-35), Paul's 2nd journey (16-18)
- Paul's 3rd journey (19-20), Paul's arrest (21:27-40)
- Paul before Felix (24:1-27), Paul before Festus (25:1-12)
- Shipwreck (27:13-44), Paul in Rome (28:16-31)

**Image Sourcing Strategy:**
- Dramatic events: AI-generated (Midjourney/DALL-E)
- Locations: Stock photos (Unsplash/Pexels)
- Historical context: Public domain art (Wikimedia)
- Maintain consistent style and quality across all images

**Setup routing in App.tsx:**
```typescript
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Navigate to="/timeline" />} />
    <Route path="timeline" element={<TimelinePage />} />
    <Route path="event/:eventId" element={<EventDetailPage />} />
    <Route path="map" element={<InteractiveMapPage />} />
  </Route>
</Routes>
```

**Data hooks:**
- `useEvents()` - Fetch and cache acts-data.json
- `useEvent(id)` - Get single event by ID
- `useLocations()` - Get all locations
- `useJourneys()` - Get journey routes
- `useLanguage()` - Get/set current language (en/zh-TW), load UI translations

### Phase 3: Layout Components (Priority 3)

**BottomNav.tsx** - iOS-style tab bar:
- Timeline (route icon, active by default)
- Atlas/Map (map icon)
- Read (menu_book icon) - placeholder
- People (person icon) - placeholder
- Uses `useLocation()` to highlight active tab

**TopNav.tsx** - Sticky header with blur:
- Back button (arrow_back_ios)
- Dynamic title
- Language toggle (EN/中文) - right side
- Action button (search/share)

**Layout.tsx** - Wraps pages with TopNav + BottomNav

### Phase 4: Timeline Page (Priority 4)

**TimelinePage.tsx** - Recreates `stitch-screens/timeline.html`:

**From mockup to React:**
- Static HTML cards → `<TimelineItem>` component with props
- Hardcoded events → `events.map(event => <TimelineItem key={event.id} {...event} />)`
- Static images → Dynamic `<img src={event.primaryImage} />`
- "View Route" button → `onClick={() => navigate('/map', { state: { journey: event.journeyId } })}`

**Component breakdown:**
```
TimelinePage
├── Header ("The Book of Acts", subtitle)
├── TimelineItem (x5+)
│   ├── TimelineConnector (dot + line)
│   ├── Badge (scripture reference)
│   ├── Title + Description
│   ├── Image (optional, with location badge)
│   └── onClick → navigate to EventDetailPage
└── SectionDivider ("The Early Persecutions", etc.)
```

**Key React enhancements:**
- Click card → `navigate(/event/${event.id})`
- Lazy load images as user scrolls
- Smooth scroll to top on route change
- Section dividers appear automatically based on event categories

### Phase 5: Event Detail Page (Priority 5)

**EventDetailPage.tsx** - Recreates `stitch-screens/event-details.html`:

**From mockup to React:**
- URL: `/event/saul-conversion` (instead of static page)
- `useParams()` to get event ID, `useEvent(eventId)` to fetch data
- Hardcoded "Conversion of Saul" → Dynamic `{event.title}`
- Static scripture → Full KJV text from `event.passage.fullText`
- Previous/Next buttons → Navigate using `event.previousEventId` and `event.nextEventId`

**Component breakdown:**
```
EventDetailPage
├── TopNav (back button, title, share button)
├── EventHero
│   ├── Background image with gradient overlay
│   ├── Date badge ("A.D. 34")
│   ├── Chapter badge ("Chapter 9")
│   └── Title
├── ScripturePassage
│   ├── Reference heading ("Acts 9:1-9")
│   ├── Verse-by-verse text with numbers
│   └── "Read Full Passage" button (external link)
├── LocationSection
│   ├── "Location: Damascus" heading
│   ├── Mini map preview (initially static, later Leaflet)
│   └── Description text
├── KeyFigures (avatars for Saul, Ananias, etc.)
└── NavigationFooter
    ├── Previous button
    └── Next button
```

**Key React enhancements:**
- Dynamic content from JSON
- Navigate between events without page reload
- Share button copies URL to clipboard
- Location map clickable → opens InteractiveMapPage centered on location

### Phase 6: Interactive Map Page (Priority 6)

**InteractiveMapPage.tsx** - Recreates `stitch-screens/interactive-map.html`:

**From mockup to React:**
- Static terrain image → Live Leaflet map with Stamen Terrain tiles
- Hardcoded Jerusalem/Damascus markers → Dynamic `locations.map(loc => <Marker />)`
- Static dashed path → Animated `<Polyline>` based on journey data
- Journey filter pills → React state changes active routes
- Active event card → Updates based on `selectedEvent` state

**Leaflet Integration:**
```typescript
// Use same visual style as mockup
<MapContainer center={[36.0, 30.0]} zoom={6}>
  <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png" />
  {locations.map(loc => (
    <Marker
      position={loc.coordinates}
      icon={customBlueIcon}
      eventHandlers={{ click: () => setSelectedEvent(loc.eventId) }}
    />
  ))}
  <Polyline
    positions={activeJourneyRoute}
    pathOptions={{ dashArray: '6 4', color: '#1152d4', weight: 3 }}
  />
</MapContainer>
```

**Component breakdown:**
```
InteractiveMapPage
├── TopNav (back, "Acts Journey", search)
├── SearchBar (absolute positioned, top)
├── MapView (full height)
│   ├── Leaflet MapContainer
│   ├── LocationMarker (x10+)
│   └── RouteLayer (polyline for active journey)
├── MapControls (absolute, right side)
│   ├── Zoom in button
│   ├── Zoom out button
│   └── Center location button
├── JourneyFilter (absolute, horizontal scroll, top)
│   ├── "1st Journey" pill (active)
│   ├── "2nd Journey" pill
│   ├── "3rd Journey" pill
│   └── "Rome" pill
├── ActiveEventCard (absolute, bottom)
│   ├── Event title, scripture, location
│   ├── "Read Story" button → navigate to EventDetailPage
│   ├── Bookmark button
│   └── Thumbnail image
└── ProgressSlider (bottom section)
    ├── Chapter indicator ("Chapter 9")
    ├── Range slider (0-100%)
    ├── Date indicator ("AD 34")
    └── Progress bar visualization
```

**State management:**
```typescript
const [activeJourney, setActiveJourney] = useState('1st-journey');
const [selectedEvent, setSelectedEvent] = useState<string>('saul-conversion');
const [mapCenter, setMapCenter] = useState<[number, number]>([33.5, 36.3]);
const [chapter, setChapter] = useState(9);
```

**Interactive behaviors:**
- Click journey pill → Filter markers and routes, zoom to journey extent
- Click location marker → Update ActiveEventCard, pan map to location
- Drag progress slider → Show events up to selected chapter
- Click "Read Story" → Navigate to EventDetailPage for selected event
- Click bookmark → Save to localStorage favorites

### Phase 7: PWA & Deployment (Priority 7)

**PWA Configuration:**
- Install `vite-plugin-pwa`
- Create `manifest.json` with app icons
- Configure service worker for offline caching
- Cache strategy: Network-first for HTML, cache-first for images/data
- Add "Add to Home Screen" prompt

**Firebase Setup:**
```bash
firebase init hosting analytics
firebase deploy
```

**Firebase Analytics:**
- Basic page view tracking
- Event tracking: event_view, journey_selected, scripture_read
- Privacy-friendly, aggregate data only

**Responsive Design:**
- Mobile: Full-width layouts (primary focus)
- Tablet (md:): Two-column timeline
- Desktop (lg:): Split screen map + sidebar

**Dark Mode:**
- Toggle in Layout.tsx
- Persist to localStorage
- Uses Tailwind's `dark:` variants

**Performance:**
- Lazy load images
- Code-split routes with React.lazy()
- Compress images (<200KB)
- Service worker caches all assets
- Cache acts-data.json in IndexedDB

---

## Verification & Testing

### Manual Tests

**Timeline Page:**
- [ ] All events load and sort by date
- [ ] Click event → navigate to detail
- [ ] Images lazy load
- [ ] Section dividers appear correctly

**Event Detail Page:**
- [ ] Hero image displays with badges
- [ ] Scripture passage renders
- [ ] Key figures show avatars
- [ ] Previous/Next navigation works
- [ ] Back button returns to timeline

**Map Page:**
- [ ] Map tiles load
- [ ] Markers appear at correct coordinates
- [ ] Journey filter switches routes
- [ ] Active event card updates on click
- [ ] Zoom controls work

**Cross-Page:**
- [ ] Bottom nav highlights active tab
- [ ] Dark mode persists across navigation
- [ ] Language toggle switches between EN/中文
- [ ] Language preference persists to localStorage
- [ ] All content displays correctly in both languages
- [ ] Deep linking works (e.g., /event/saul-conversion)
- [ ] Mobile responsive on real devices

### Performance Targets
- Lighthouse score: 90+ all categories
- Load time: <3s on 3G
- First Contentful Paint: <1.5s

---

## Critical Files Priority Order

1. **`src/types/index.ts`** - TypeScript interfaces (required first)
2. **`src/contexts/LanguageContext.tsx`** - i18n setup (required for all UI)
3. **`src/hooks/useLanguage.ts`** - Language hook (access translations)
4. **`public/locales/en.json`** - English UI strings
5. **`public/locales/zh-TW.json`** - Traditional Chinese UI strings
6. **`public/data/acts-data.json`** - Bilingual data source (enables all features)
7. **`tailwind.config.js`** - Design system (UI consistency)
8. **`src/App.tsx`** - Routing setup (navigation foundation)
9. **`src/components/layout/BottomNav.tsx`** - Navigation (appears everywhere)
6. **`src/components/layout/TopNav.tsx`** - Header navigation
7. **`src/components/layout/Layout.tsx`** - Wrapper component
8. **`src/pages/TimelinePage.tsx`** - Main screen
9. **`src/pages/EventDetailPage.tsx`** - Detail screen
10. **`src/pages/InteractiveMapPage.tsx`** - Map screen

---

## Component File List (Complete)

### Types
- `src/types/index.ts`

### Layout Components
- `src/components/layout/TopNav.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/Layout.tsx`

### Timeline Components
- `src/components/timeline/TimelineItem.tsx`
- `src/components/timeline/TimelineConnector.tsx`
- `src/components/timeline/SectionDivider.tsx`

### Event Components
- `src/components/event/EventHero.tsx`
- `src/components/event/ScripturePassage.tsx`
- `src/components/event/KeyFigures.tsx`

### Map Components
- `src/components/map/MapView.tsx`
- `src/components/map/LocationMarker.tsx`
- `src/components/map/RouteLayer.tsx`
- `src/components/map/MapControls.tsx`

### Shared Components
- `src/components/shared/Badge.tsx`

### Pages
- `src/pages/TimelinePage.tsx`
- `src/pages/EventDetailPage.tsx`
- `src/pages/InteractiveMapPage.tsx`

### Hooks
- `src/hooks/useEvents.ts`
- `src/hooks/useLocations.ts`
- `src/hooks/useJourneys.ts`
- `src/hooks/useLanguage.ts`

### Contexts
- `src/contexts/LanguageContext.tsx`

### Core App Files
- `src/App.tsx`
- `src/main.tsx`
- `src/index.css`

---

## Timeline Estimate

- Phase 1 (Setup): ✓ Complete
- Phase 2 (Data/Routing): ~4 hours
- Phase 3 (Layout): ~3 hours
- Phase 4 (Timeline): ~4 hours
- Phase 5 (Event Detail): ~4 hours
- Phase 6 (Map): ~8 hours
- Phase 7 (PWA/Deploy): ~4 hours

**Total: ~27 hours of development**

---

## Next Steps

1. Install dependencies: `npm install`
2. Create TypeScript types
3. Build acts-data.json with 15-20 events
4. Setup routing and data hooks
5. Build layout components
6. Build page components in order (Timeline → Event Detail → Map)
7. Add PWA features
8. Deploy to Firebase

---

## Bilingual Implementation Details

### Language Architecture
- **Default Language:** English (en)
- **Secondary Language:** Traditional Chinese (zh-TW / 繁體中文)
- **Language Storage:** localStorage key `preferred-language`
- **Language Toggle:** TopNav component (EN/中文 button)
- **Bible Versions:**
  - English: King James Version (KJV)
  - Chinese: Chinese Union Version (和合本)

### Translation Structure

**UI Translations** (public/locales/):
```json
// en.json
{
  "nav": {
    "timeline": "Timeline",
    "map": "Atlas",
    "read": "Read",
    "people": "People"
  },
  "timeline": {
    "title": "The Book of Acts",
    "subtitle": "Journey of the Early Church"
  },
  ...
}

// zh-TW.json
{
  "nav": {
    "timeline": "時間軸",
    "map": "地圖",
    "read": "閱讀",
    "people": "人物"
  },
  "timeline": {
    "title": "使徒行傳",
    "subtitle": "早期教會之旅"
  },
  ...
}
```

**Content Translations** (acts-data.json):
- All event titles, descriptions in both languages
- All location names in both languages
- Scripture passages in both KJV and 和合本
- Date displays in both formats

### Context API Implementation
```typescript
// LanguageContext.tsx
interface LanguageContextType {
  language: 'en' | 'zh-TW';
  setLanguage: (lang: 'en' | 'zh-TW') => void;
  t: (key: string) => string; // Translation function
}

// useLanguage.ts
const { language, setLanguage, t } = useLanguage();
const eventTitle = event.title[language === 'zh-TW' ? 'zh' : 'en'];
```

---

## Notes

- All Stitch mockups preserved in `stitch-screens/` for reference
- Design tokens extracted to Tailwind config
- Mobile-first approach (primary target is iPhone/Android)
- Offline-first PWA for devotional use anywhere
- Static content (no backend/CMS needed)
- **Fully bilingual**: English (default) + Traditional Chinese
- Focus on peaceful, readable UX for Bible study
