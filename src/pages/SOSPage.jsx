import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import apiClient from '../api/client';
import { BLOOD_GROUPS } from '../utils/bloodGroups';
import { LocationButton } from '../components/ui/LocationButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function SOSPage() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [contact, setContact] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentAt, setSentAt] = useState(null);
  const [error, setError] = useState(null);

  const handleLocation = (latitude, longitude) => {
    setLat(latitude);
    setLng(longitude);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!bloodGroup || !contact) {
      setError('Blood group and contact are required.');
      return;
    }
    if (lat == null || lng == null) {
      setError('Please detect your location.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/requests/sos', {
        blood_group: bloodGroup,
        contact: contact,
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      });
      setSent(true);
      setSentAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send SOS.');
    } finally {
      setLoading(false);
    }
  };

  const [elapsed, setElapsed] = useState('0:00');
  useEffect(() => {
    if (!sentAt) return;
    const tick = () => {
      const secs = Math.floor((Date.now() - sentAt) / 1000);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      setElapsed(`${m}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sentAt]);

  return (
    <main className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-12">
      {sent ? (
        <div className="text-center animate-fade-in-up">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
            EMERGENCY ALERT SENT
          </h1>
          <p className="text-white/90 mb-6">Donors are being contacted NOW.</p>
          <p className="text-white/80 text-sm">Alert sent {elapsed} ago</p>
        </div>
      ) : (
        <>
          <div className="inline-block animate-pulse-glow mb-8">
            <AlertTriangle className="w-20 h-20 sm:w-24 sm:h-24 text-white" aria-hidden />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-6 text-center">Emergency SOS</h1>

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <div>
              <label htmlFor="sos-blood" className="block text-sm font-medium text-white/90 mb-1">Blood Group *</label>
              <select
                id="sos-blood"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white"
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Location *</label>
              <LocationButton onLocation={handleLocation} disabled={loading} />
            </div>
            <div>
              <label htmlFor="sos-contact" className="block text-sm font-medium text-white/90 mb-1">Contact Number *</label>
              <input
                id="sos-contact"
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder="Your phone number"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white"
              />
            </div>
            {error && <p className="text-sm text-white">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-white text-primary font-bold text-lg hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {loading ? <LoadingSpinner className="w-6 h-6" /> : 'SEND EMERGENCY ALERT'}
            </button>
          </form>
        </>
      )}
    </main>
  );
}
