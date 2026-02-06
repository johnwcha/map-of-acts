import { useMap } from 'react-leaflet';

const MapControls = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleRecenter = () => {
    map.setView([33.5, 36.3], 7);
  };

  return (
    <div className="absolute right-4 top-24 flex flex-col gap-3 z-40">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-0.5 rounded-lg overflow-hidden shadow-lg border border-black/5">
        <button
          onClick={handleZoomIn}
          className="flex size-12 items-center justify-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="Zoom in"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="flex size-12 items-center justify-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="Zoom out"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="flex size-12 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-black/5 text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Recenter map"
      >
        <span className="material-symbols-outlined">my_location</span>
      </button>
    </div>
  );
};

export default MapControls;
