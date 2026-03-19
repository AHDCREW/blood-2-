import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { MOCK_BLOOD_AVAILABILITY, MOCK_RECENT_REQUESTS } from '../api/mockData';
import { BLOOD_GROUPS } from '../utils/bloodGroups';
import { RequestCard } from '../components/ui/RequestCard';
import { OSMMap } from '../components/ui/OSMMap';

function AvailabilityCard({ group, count }) {
  const status = count >= 10 ? 'green' : count >= 3 ? 'yellow' : 'red';
  const bgClass = status === 'green' ? 'bg-green-600/20 border-green-500/50' : status === 'yellow' ? 'bg-amber-600/20 border-amber-500/50' : 'bg-red-600/20 border-red-500/50';
  const barClass = status === 'green' ? 'bg-green-500' : status === 'yellow' ? 'bg-amber-500' : 'bg-red-500';
  const maxCount = 20;
  const pct = Math.min(100, (count / maxCount) * 100);

  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-text">{group}</span>
        <span className="text-textMuted text-sm">{count} donors</span>
      </div>
      <div className="h-2 bg-bg/50 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [availability, setAvailability] = useState(MOCK_BLOOD_AVAILABILITY);
  const [recentRequests, setRecentRequests] = useState(MOCK_RECENT_REQUESTS);

  useEffect(() => {
    apiClient.get('/api/donors/blood-availability').then(({ data }) => {
      setAvailability(data || MOCK_BLOOD_AVAILABILITY);
    }).catch(() => {});
    apiClient.get('/api/requests/recent').then(({ data }) => {
      setRecentRequests(Array.isArray(data) ? data : data?.requests ?? MOCK_RECENT_REQUESTS);
    }).catch(() => {});
  }, []);

  const counts = typeof availability === 'object' && !Array.isArray(availability)
    ? availability
    : BLOOD_GROUPS.reduce((acc, g) => ({ ...acc, [g]: 0 }), {});

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text mb-6">Dashboard</h1>

        <section className="mb-10">
          <h2 className="font-semibold text-text mb-4">Blood Availability</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BLOOD_GROUPS.map((group) => (
              <AvailabilityCard key={group} group={group} count={counts[group] ?? 0} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-semibold text-text mb-4">Recent Requests</h2>
          {recentRequests.length === 0 ? (
            <p className="text-textMuted">No recent requests.</p>
          ) : (
            <div className="space-y-3">
              {recentRequests.slice(0, 5).map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-semibold text-text mb-2">Map</h2>
          <OSMMap
            center={[20.5937, 78.9629]}
            zoom={5}
            markers={recentRequests
              .filter((r) => r.lat != null && r.lng != null)
              .map((r) => ({ id: r.id, lat: r.lat, lng: r.lng, label: `${r.hospital || 'Request'} — ${r.blood_group || ''}` }))}
            className="rounded-xl overflow-hidden border border-muted"
            height="320px"
          />
        </section>
      </div>
    </main>
  );
}
