import { Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { MapPoint, sampleCurvedPath } from '../../utils/mapCurves';

interface RouteLayerProps {
  positions: LatLngExpression[];
  color?: string;
  animated?: boolean;
}

const RouteLayer = ({ positions, color = '#1152d4', animated = false }: RouteLayerProps) => {
  if (positions.length < 2) return null;

  const curvedPositions = sampleCurvedPath(positions as MapPoint[]);

  return (
    <>
      {/* Halo glow underneath */}
      <Polyline
        positions={curvedPositions}
        pathOptions={{
          color: color,
          weight: 10,
          opacity: 0.15,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Main route line */}
      <Polyline
        positions={curvedPositions}
        pathOptions={{
          color: color,
          weight: animated ? 4 : 3,
          opacity: animated ? 0.9 : 0.8,
          dashArray: animated ? undefined : '6, 4',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </>
  );
};

export default RouteLayer;
