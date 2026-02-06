# Map of Acts - Interactive Timeline

A responsive PWA for personal devotional study of the Book of Acts with chronological timeline and interactive maps of Paul's journeys.

## Features

- ✅ **Chronological Timeline** - 15-20 major events from Acts 1-28
- ✅ **Event Details** - Full KJV scripture passages with bilingual support
- ✅ **Interactive Maps** - Leaflet-powered maps with journey routes
- ✅ **Bilingual** - English and Traditional Chinese (繁體中文)
- ✅ **Progressive Web App** - Install on mobile devices, offline support
- ✅ **Mobile-First** - Optimized for iPhone and Android
- ✅ **Dark Mode** - Automatic theme support

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React Leaflet
- **Routing**: React Router DOM
- **i18n**: React Context API
- **PWA**: vite-plugin-pwa + Workbox
- **Hosting**: Firebase Hosting
- **Analytics**: Firebase Analytics

## Project Structure

```
map-of-acts/
├── public/
│   ├── data/
│   │   └── acts-data.json      # Bilingual event data with full scripture
│   ├── locales/
│   │   ├── en.json             # English UI translations
│   │   └── zh-TW.json          # Traditional Chinese translations
│   └── images/                 # Event and location images
├── src/
│   ├── components/
│   │   ├── layout/             # TopNav, BottomNav, Layout
│   │   ├── timeline/           # Timeline components
│   │   ├── event/              # Event detail components
│   │   ├── map/                # Map components (Leaflet)
│   │   └── shared/             # Reusable components
│   ├── pages/
│   │   ├── TimelinePage.tsx
│   │   ├── EventDetailPage.tsx
│   │   └── InteractiveMapPage.tsx
│   ├── hooks/                  # Custom React hooks
│   ├── contexts/               # React contexts (Language)
│   └── types/                  # TypeScript definitions
└── stitch-screens/             # Original design mockups
```

## Development

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI (for deployment)

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

App will open at http://localhost:3000

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Firebase Setup

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase project (already configured):
```bash
firebase init
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

### Firebase Hosting URL

Production: https://map-of-acts.web.app

## Data Structure

### acts-data.json

Contains bilingual content for:
- **Events**: Title, description, scripture (KJV + 和合本), dates, locations
- **Locations**: Names, coordinates, descriptions
- **People**: Key figures with roles
- **Journeys**: Missionary journey routes and metadata

Example event structure:
```json
{
  "id": "pentecost",
  "title": {
    "en": "Day of Pentecost",
    "zh": "五旬節"
  },
  "passage": {
    "en": { "verses": [...], "fullText": "..." },
    "zh": { "verses": [...], "fullText": "..." }
  }
}
```

## Language Support

- **Default**: English (en)
- **Secondary**: Traditional Chinese (zh-TW / 繁體中文)
- **Switching**: Toggle button in TopNav (EN/中文)
- **Storage**: Preference saved to localStorage

## PWA Features

- **Installable**: Add to home screen on iOS/Android
- **Offline**: Service worker caches all assets and data
- **Fast**: Code-split routes, lazy loading
- **Optimized**: Image optimization, tree shaking

## Performance

- Lighthouse score target: 90+ all categories
- First Contentful Paint: <1.5s
- Total Blocking Time: <200ms
- Code splitting for routes
- Lazy loading for images
- Service worker caching strategy

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile: iOS 14+, Android 8+

## License

Private project for personal devotional use.

## Credits

- **Scripture**: King James Version (KJV) and Chinese Union Version (和合本)
- **Maps**: Stadia Maps (Stamen Terrain)
- **Design**: Based on Stitch mockups
- **Fonts**: Noto Serif, Noto Sans (Google Fonts)
- **Icons**: Material Symbols Outlined

---

Built with ❤️ for Bible study
