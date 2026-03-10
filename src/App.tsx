import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import TimelinePage from './pages/TimelinePage';
import EventDetailPage from './pages/EventDetailPage';
import InteractiveMapPage from './pages/InteractiveMapPage';
import ReadPage from './pages/ReadPage';
import PeoplePage from './pages/PeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';

// Scrolls to top on every navigation except back-to-timeline
// (timeline handles its own scroll restoration via sessionStorage)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== '/timeline') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/timeline" replace />} />

        {/* Timeline - Main route */}
        <Route element={<Layout title="Acts Timeline" showSearch />}>
          <Route path="/timeline" element={<TimelinePage />} />
        </Route>

        {/* Event Detail - With back button */}
        <Route element={<Layout showBack showShare />}>
          <Route path="/event/:eventId" element={<EventDetailPage />} />
        </Route>

        {/* Map - With search */}
        <Route element={<Layout title="Acts Journey" showSearch />}>
          <Route path="/map" element={<InteractiveMapPage />} />
        </Route>

        {/* Read - Full page view */}
        <Route element={<Layout title="Read Acts" />}>
          <Route path="/read" element={<ReadPage />} />
          <Route path="/read/:chapterNum" element={<ReadPage />} />
        </Route>

        {/* People - Full page view */}
        <Route element={<Layout title="Key Figures" />}>
          <Route path="/people" element={<PeoplePage />} />
        </Route>

        {/* Person Detail - With back button */}
        <Route element={<Layout title="Key Figure" showBack />}>
          <Route path="/people/:personId" element={<PersonDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
