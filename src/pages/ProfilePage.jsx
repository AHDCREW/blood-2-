import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { SlideToggle } from '../components/ui/SlideToggle';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorNotFound, setDonorNotFound] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/auth/me').then(({ data }) => data).catch(() => null),
      apiClient.get('/api/donors/me').then(({ data }) => data).catch((err) => {
        if (err.response?.status === 404) setDonorNotFound(true);
        return null;
      }),
    ]).then(([userData, donorData]) => {
      setUser(userData || null);
      setDonor(donorData || null);
      setLoading(false);
    });
  }, []);

  const handleAvailabilityChange = async (available) => {
    if (donor == null || toggling) return;
    setToggling(true);
    try {
      await apiClient.patch('/api/donors/me', { available });
      setDonor((d) => (d ? { ...d, available } : null));
    } catch {
      // toast already shown by interceptor
    } finally {
      setToggling(false);
    }
  };

  const handleJustDonated = async () => {
    if (donor == null || toggling) return;
    setToggling(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await apiClient.patch('/api/donors/me', { available: false, last_donated: today });
      setDonor((d) => (d ? { ...d, available: false, last_donated: today } : null));
    } catch {
      // toast already shown by interceptor
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-8 px-4 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text mb-6">Profile</h1>

        <section className="bg-surface border border-muted rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-text mb-4">Account</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-textMuted">Name</dt>
              <dd className="text-text font-medium">{user?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-textMuted">Email</dt>
              <dd className="text-text">{user?.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-textMuted">Phone</dt>
              <dd className="text-text">{user?.phone ?? '—'}</dd>
            </div>
          </dl>
        </section>

        {donorNotFound ? (
          <section className="bg-surface border border-muted rounded-xl p-6">
            <p className="text-textMuted mb-4">You are not registered as a donor yet.</p>
            <Link
              to="/donate"
              className="inline-flex px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Register as Donor
            </Link>
          </section>
        ) : donor ? (
          <>
            <section className="bg-surface border border-muted rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-text mb-4">Donor profile</h2>
              <dl className="space-y-2 text-sm mb-6">
                <div>
                  <dt className="text-textMuted">Blood group</dt>
                  <dd className="text-text font-medium">{donor.blood_group}</dd>
                </div>
                <div>
                  <dt className="text-textMuted">City</dt>
                  <dd className="text-text">{donor.city}</dd>
                </div>
                {donor.last_donated && (
                  <div>
                    <dt className="text-textMuted">Last donated</dt>
                    <dd className="text-text">{donor.last_donated}</dd>
                  </div>
                )}
              </dl>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-muted">
                <SlideToggle
                  checked={donor.available}
                  onChange={handleAvailabilityChange}
                  disabled={toggling}
                  label="Available to donate"
                />
              </div>
            </section>

            <section className="bg-surface border border-muted rounded-xl p-6">
              <h2 className="font-semibold text-text mb-2">After you donate</h2>
              <p className="text-textMuted text-sm mb-4">
                Turn off your availability so you won’t be contacted until you’re ready again. This also saves your last donated date.
              </p>
              <button
                type="button"
                onClick={handleJustDonated}
                disabled={toggling || !donor.available}
                className="px-4 py-2 rounded-lg bg-muted text-text font-medium hover:bg-muted/80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                I just donated — turn off availability
              </button>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
