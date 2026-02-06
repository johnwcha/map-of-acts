import { Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Location } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface LocationMarkerProps {
  location: Location;
  onClick?: () => void;
}

// Custom icon for location markers
const createCustomIcon = () => {
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <circle cx="12" cy="12" r="8" fill="#1152d4" stroke="white" stroke-width="2"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const LocationMarker = ({ location, onClick }: LocationMarkerProps) => {
  const { language } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const position: LatLngExpression = location.coordinates;

  return (
    <Marker
      position={position}
      icon={createCustomIcon()}
      eventHandlers={{
        click: () => onClick?.(),
      }}
    >
      <Popup>
        <div className="text-center">
          <strong className="text-primary">{location.name[lang]}</strong>
          {location.modernName && (
            <div className="text-xs text-slate-500 mt-1">
              {location.modernName[lang]}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
