import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';

export function LocationButton({ onLocation, disabled }) {
  const { getLocation, loading, error, coords } = useGeolocation();
  const onLocationRef = useRef(onLocation);
  onLocationRef.current = onLocation;

  useEffect(() => {
    if (coords && onLocationRef.current) onLocationRef.current(coords.lat, coords.lng);
  }, [coords]);

  const handleClick = () => getLocation();

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-text border border-muted hover:border-primary transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
        aria-label="Detect my location"
      >
        <MapPin className="w-4 h-4" aria-hidden />
        {loading ? 'Detecting…' : coords ? '✅ Location detected' : error ? '❌ Permission denied' : '📍 Detect My Location'}
      </button>
    </div>
  );
}
