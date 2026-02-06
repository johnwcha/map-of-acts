import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TimelinePage from './pages/TimelinePage';
import EventDetailPage from './pages/EventDetailPage';
import InteractiveMapPage from './pages/InteractiveMapPage';
import ReadPage from './pages/ReadPage';
import PeoplePage from './pages/PeoplePage';

function App() {
  return (
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
    </Routes>
  );
}

export default App;
