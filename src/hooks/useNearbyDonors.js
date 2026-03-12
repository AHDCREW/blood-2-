import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { MOCK_DONORS } from '../api/mockData';

export function useNearbyDonors({ lat, lng, bloodGroup, radius = 5, availableOnly }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDonors = useCallback(async () => {
    if (lat == null || lng == null) {
      setDonors([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ lat, lng, radius });
      if (bloodGroup) params.set('blood_group', bloodGroup);
      if (availableOnly) params.set('available_only', 'true');
      const { data } = await apiClient.get(`/api/donors/nearby?${params.toString()}`);
      setDonors(Array.isArray(data) ? data : data?.donors ?? []);
    } catch (err) {
      setDonors(MOCK_DONORS);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, bloodGroup, radius, availableOnly]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  return { donors, loading, error, refetch: fetchDonors };
}
