# Deployment Guide - Map of Acts

## Prerequisites

1. **Firebase CLI** installed globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project** created at [Firebase Console](https://console.firebase.google.com/)
   - Project ID should match `.firebaserc` (currently: `map-of-acts`)
   - Or update `.firebaserc` with your project ID

## First-Time Setup

### 1. Login to Firebase

```bash
firebase login
```

This will open your browser for Google authentication.

### 2. Initialize Firebase (Already Done)

The project is already configured with `firebase.json` and `.firebaserc`. If you need to reconfigure:

```bash
firebase init
```

Select:
- Hosting
- Use existing project
- Public directory: `dist`
- Single-page app: `Yes`
- Setup automatic builds with GitHub: `No`

### 3. Update Project ID

If using a different Firebase project, update `.firebaserc`:

```json
{
  "projects": {
    "default": "your-project-id-here"
  }
}
```

## Build & Deploy

### Quick Deploy (Production)

```bash
npm run deploy
```

This will:
1. Run TypeScript compiler
2. Build with Vite
3. Generate service worker for PWA
4. Deploy to Firebase Hosting

### Deploy Only Hosting

```bash
npm run deploy:hosting
```

### Manual Steps

```bash
# 1. Build
npm run build

# 2. Preview build locally (optional)
npm run preview

# 3. Deploy to Firebase
firebase deploy --only hosting
```

## Post-Deployment

### 1. Verify Deployment

Your app will be available at:
- **Production**: https://map-of-acts.web.app
- **Alternate**: https://map-of-acts.firebaseapp.com

### 2. Test PWA Features

- Visit on mobile browser (iOS Safari / Chrome)
- Look for "Add to Home Screen" prompt
- Test offline functionality
- Verify service worker caching

### 3. Check Performance

Run Lighthouse audit:
```bash
npx lighthouse https://map-of-acts.web.app --view
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

## Environment-Specific Deploys

### Staging

Update `.firebaserc` to add staging:

```json
{
  "projects": {
    "default": "map-of-acts",
    "staging": "map-of-acts-staging"
  }
}
```

Deploy to staging:
```bash
firebase use staging
npm run deploy
```

Switch back to production:
```bash
firebase use default
```

## Firebase Console Tasks

### 1. Enable Analytics (Optional)

1. Go to Firebase Console
2. Project Settings → Integrations
3. Enable Google Analytics
4. Update code to initialize analytics

### 2. Set Custom Domain (Optional)

1. Firebase Console → Hosting
2. Add custom domain
3. Verify domain ownership
4. Update DNS records

### 3. View Hosting Metrics

Firebase Console → Hosting → Dashboard
- Traffic patterns
- Bandwidth usage
- Request counts

## Rollback

To rollback to previous version:

```bash
firebase hosting:rollback
```

## CI/CD with GitHub Actions (Future)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: map-of-acts
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Service Worker Issues

```bash
# Clear all caches in browser DevTools
# Application → Storage → Clear site data
```

### Deploy Fails

```bash
# Check Firebase login
firebase login --reauth

# Check project selection
firebase use

# View detailed logs
firebase deploy --debug
```

## Performance Optimization Checklist

- [x] Code splitting (react-vendor, map-vendor)
- [x] Service worker caching
- [x] Image optimization (use WebP/AVIF)
- [x] Lazy loading routes
- [x] Tree shaking enabled
- [x] Minification enabled
- [x] Gzip compression
- [ ] Add placeholder images (192x192, 512x512)
- [ ] Generate social share image
- [ ] Optimize acts-data.json size
- [ ] Add more events (expand to 20)

## Security Headers

Already configured in `firebase.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Monitoring

### Firebase Performance Monitoring

```bash
npm install firebase
```

Add to `src/main.tsx`:
```typescript
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = { /* your config */ };
const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);
```

### Error Tracking

Consider adding:
- Sentry
- LogRocket
- Firebase Crashlytics

## Backup

Regular backups of:
- `public/data/acts-data.json`
- `public/locales/*.json`
- `public/images/`

Store in:
- Git repository
- Firebase Storage
- Cloud backup service

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build and deploy to Firebase |
| `firebase serve` | Test locally with Firebase |
| `firebase deploy --only hosting` | Deploy hosting only |
| `firebase hosting:rollback` | Rollback to previous version |

---

Built with Firebase Hosting 🔥
