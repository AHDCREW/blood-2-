import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../../api/client';
import { BLOOD_GROUPS } from '../../utils/bloodGroups';
import { LocationButton } from './LocationButton';
import { LoadingSpinner } from './LoadingSpinner';

export function SOSModal({ open, onClose }) {
  const [bloodGroup, setBloodGroup] = useState('');
  const [contact, setContact] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setBloodGroup('');
        setContact('');
        setLat(null);
        setLng(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send SOS.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" aria-modal="true" role="dialog">
      <div className="bg-surface border border-muted rounded-xl max-w-md w-full p-6 shadow-xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-bold text-xl text-text">Emergency SOS</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <p className="text-green-500 font-medium">Emergency alert sent. Donors are being contacted.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="sos-blood" className="block text-sm font-medium text-textMuted mb-1">Blood Group *</label>
              <select
                id="sos-blood"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Location *</label>
              <LocationButton onLocation={handleLocation} disabled={loading} />
            </div>
            <div>
              <label htmlFor="sos-contact" className="block text-sm font-medium text-textMuted mb-1">Contact Number *</label>
              <input
                id="sos-contact"
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder="Your phone number"
                className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text placeholder:text-textMuted focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {loading ? <LoadingSpinner className="w-6 h-6" /> : 'Send Emergency Alert'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
