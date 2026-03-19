import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

function FixDefaultIcon() {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);
  return null;
}

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (!markers?.length) return;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 12);
      return;
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
  }, [map, markers]);
  return null;
}

export function OSMMap({ center = [20.5937, 78.9629], zoom = 5, markers = [], className = '', height = '320px' }) {
  const hasMarkers = Array.isArray(markers) && markers.length > 0;
  const viewCenter = hasMarkers && markers.length === 1
    ? [markers[0].lat, markers[0].lng]
    : center;

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={viewCenter}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full rounded-lg z-0"
      >
        <FixDefaultIcon />
        <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_URL} />
        {hasMarkers && <FitBounds markers={markers} />}
        {hasMarkers && markers.map((m, i) => (
          <Marker key={m.id ?? i} position={[m.lat, m.lng]}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
