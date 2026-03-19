import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, UserPlus, AlertCircle } from 'lucide-react';
import apiClient from '../api/client';
import { MOCK_STATS } from '../api/mockData';
import { MOCK_RECENT_REQUESTS } from '../api/mockData';
import { RequestCard } from '../components/ui/RequestCard';

export function Home() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [recentRequests, setRecentRequests] = useState(MOCK_RECENT_REQUESTS);

  useEffect(() => {
    apiClient.get('/api/stats').then(({ data }) => {
      setStats(data);
    }).catch(() => {});
    apiClient.get('/api/requests/recent').then(({ data }) => {
      setRecentRequests(Array.isArray(data) ? data : data?.requests ?? MOCK_RECENT_REQUESTS);
    }).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.08)_0%,transparent_70%)]" />
        <div className="relative z-10 text-center animate-fade-in-up">
          <div className="inline-block animate-float mb-6">
            <Droplets className="w-20 h-20 text-accent" aria-hidden />
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-text mb-4">
            Every Drop Saves a Life
          </h1>
          <p className="text-textMuted text-lg sm:text-xl max-w-xl mx-auto mb-8">
            Connect with donors near you in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <UserPlus className="w-5 h-5" aria-hidden />
              Register as Donor
            </Link>
            <Link
              to="/request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <AlertCircle className="w-5 h-5" aria-hidden />
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-muted bg-surface py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
          <div>
            <p className="font-display font-bold text-2xl text-primary">{stats.donors?.toLocaleString() ?? stats.donors}</p>
            <p className="text-textMuted text-sm">Donors</p>
          </div>
          <div>
            <p className="font-display font-bold text-2xl text-accent">{stats.livesSaved?.toLocaleString() ?? stats.livesSaved}</p>
            <p className="text-textMuted text-sm">Lives Saved</p>
          </div>
          <div>
            <p className="font-display font-bold text-2xl text-text">{stats.radiusKm ?? 5}km</p>
            <p className="text-textMuted text-sm">Radius Coverage</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display font-bold text-2xl text-text mb-8 text-center">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: 1, title: 'Register or Request', desc: 'Sign up as a donor or submit a blood request with your location.' },
            { step: 2, title: 'We Match Nearby', desc: 'Our system finds donors within 5km and sends instant alerts.' },
            { step: 3, title: 'Save a Life', desc: 'Donors respond and reach the hospital in minutes.' },
          ].map((item) => (
            <div key={item.step} className="bg-surface border border-muted rounded-xl p-6 text-center animate-fade-in-up">
              <span className="inline-flex w-10 h-10 rounded-full bg-primary text-white font-bold items-center justify-center mb-4">{item.step}</span>
              <h3 className="font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-textMuted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-muted py-8">
        <h2 className="font-display font-bold text-xl text-text mb-4 px-4">Recent Requests</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 px-4 min-w-max">
            {recentRequests.map((req) => (
              <div key={req.id} className="w-72 flex-shrink-0">
                <RequestCard request={req} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
