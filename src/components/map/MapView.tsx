import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  center: LatLngExpression;
  zoom: number;
  children?: React.ReactNode;
}

const MapView = ({ center, zoom, children }: MapViewProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      className="z-0"
    >
      {/* Option 1: Esri World Topo Map - Beautiful topographic with terrain (RECOMMENDED for biblical geography) */}
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
      />

      {/* Option 2: Esri World Imagery - Stunning satellite view (uncomment to use) */}
      {/* <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
      /> */}

      {/* Option 3: Esri NatGeo World Map - National Geographic style (uncomment to use) */}
      {/* <TileLayer
        attribution='Tiles &copy; Esri, National Geographic'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
      /> */}

      {/* Option 4: Stadia Maps - Stamen Terrain (REQUIRES API KEY - see notes below) */}
      {/*
      STADIA MAPS PRICING (as of 2026):
      - Free tier: Available for development, evaluation, and non-commercial use (including academic)
      - Credit system: 1 credit per raster map tile
      - Paid plans: Starter, Standard, Professional tiers available
      - No surprise bills - hard limits by default
      - More info: https://stadiamaps.com/pricing/

      To use Stadia Maps:
      1. Sign up at https://stadiamaps.com/
      2. Get API key from dashboard
      3. Add to environment variables: VITE_STADIA_API_KEY
      4. Uncomment below and add ?api_key=${import.meta.env.VITE_STADIA_API_KEY} to URL

      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png?api_key=YOUR_API_KEY_HERE"
        maxZoom={18}
      />
      */}
      {children}
    </MapContainer>
  );
};

export default MapView;
