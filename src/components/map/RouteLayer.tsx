import { Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface RouteLayerProps {
  positions: LatLngExpression[];
  color?: string;
}

const RouteLayer = ({ positions, color = '#1152d4' }: RouteLayerProps) => {
  if (positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: color,
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 4',
      }}
    />
  );
};

export default RouteLayer;
