import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Permission denied');
        setCoords(null);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return { getLocation, loading, error, coords };
}
