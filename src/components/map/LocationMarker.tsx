import { Marker, Popup } from 'react-leaflet';
import { DivIcon, LatLngExpression } from 'leaflet';
import { Location } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface LocationMarkerProps {
  location: Location;
  onClick?: () => void;
  stopNumber?: number;   // If set, renders numbered journey-stop marker
  isActive?: boolean;    // Highlights with a pulse ring during animation
  color?: string;        // Journey color for stop markers
}

const createDefaultIcon = (color: string, isActive: boolean) =>
  new DivIcon({
    className: '',
    html: `<style>
      @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.7);opacity:0}}
    </style>
    <div style="position:relative;width:28px;height:28px;">
      ${isActive
        ? `<div style="position:absolute;inset:-6px;border-radius:50%;border:2.5px solid ${color};opacity:0.6;animation:pulse-ring 1.2s ease-out infinite;"></div>`
        : ''}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" style="position:relative;z-index:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.25));">
        <circle cx="12" cy="12" r="7" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

const createStopIcon = (num: number, color: string, isActive: boolean) => {
  const pulse = isActive
    ? `<div style="position:absolute;inset:-6px;border-radius:50%;border:2.5px solid ${color};opacity:0.6;animation:pulse-ring 1.2s ease-out infinite;"></div>`
    : '';
  return new DivIcon({
    className: '',
    html: `<style>
      @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.7);opacity:0}}
    </style>
    <div style="position:relative;width:30px;height:30px;">
      ${pulse}
      <div style="
        width:30px;height:30px;border-radius:50%;
        background:${isActive ? color : 'white'};
        border:2.5px solid ${color};
        display:flex;align-items:center;justify-content:center;
        font-size:12px;font-weight:700;
        color:${isActive ? 'white' : color};
        box-shadow:0 2px 6px rgba(0,0,0,0.25);
        position:relative;z-index:1;
      ">${num}</div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const LocationMarker = ({ location, onClick, stopNumber, isActive = false, color = '#1152d4' }: LocationMarkerProps) => {
  const { language } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const position: LatLngExpression = location.coordinates;

  const icon = stopNumber != null
    ? createStopIcon(stopNumber, color, isActive)
    : createDefaultIcon(color, isActive);

  return (
    <Marker
      position={position}
      icon={icon}
      zIndexOffset={isActive ? 1000 : stopNumber != null ? 500 : 0}
      eventHandlers={{ click: () => onClick?.() }}
    >
      <Popup>
        <div className="text-center">
          <strong className="text-primary">{location.name[lang]}</strong>
          {location.modernName && (
            <div className="text-xs text-slate-500 mt-1">{location.modernName[lang]}</div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
