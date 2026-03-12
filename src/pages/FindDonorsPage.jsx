import { useState } from 'react';
import { BLOOD_GROUPS } from '../utils/bloodGroups';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNearbyDonors } from '../hooks/useNearbyDonors';
import { DonorCard } from '../components/ui/DonorCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function FindDonorsPage() {
  const { coords, getLocation } = useGeolocation();
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const { donors, loading, refetch } = useNearbyDonors({
    lat: coords?.lat,
    lng: coords?.lng,
    bloodGroup: bloodGroup || undefined,
    radius: 5,
    availableOnly,
  });

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text mb-6">Find Donors</h1>

        <div className="bg-surface border border-muted rounded-xl p-4 mb-8 space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label htmlFor="filter-blood" className="block text-sm text-textMuted mb-1">Blood Group</label>
              <select
                id="filter-blood"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
              >
                <option value="">All</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-city" className="block text-sm text-textMuted mb-1">City</label>
              <input
                id="filter-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="button"
              onClick={getLocation}
              className="px-4 py-2 rounded-lg bg-muted text-text hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              📍 Search within 5km of me
            </button>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-muted text-primary focus:ring-accent"
              />
              <span className="text-sm text-textMuted">Available only</span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-surface border border-muted rounded-xl p-12 text-center text-textMuted">
            <p className="font-medium text-text mb-2">No donors found</p>
            <p>{coords == null ? 'Click "Search within 5km of me" to find donors near you.' : 'Be the first to register in your area!'}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
