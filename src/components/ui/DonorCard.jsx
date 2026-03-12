import { BloodGroupBadge } from './BloodGroupBadge';

export function DonorCard({ donor }) {
  const { name, bloodGroup, distanceKm, lastActive, available } = donor;
  const lastActiveStr = lastActive ? new Date(lastActive).toLocaleDateString() : '—';

  return (
    <article
      className="bg-surface border border-muted rounded-xl p-4 hover:border-primary/50 transition-colors animate-fade-in-up"
      style={{ animationDelay: '0.05s' }}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-text truncate">{name}</p>
          <p className="text-sm text-textMuted mt-0.5">{distanceKm != null ? `${distanceKm.toFixed(1)} km away` : '—'}</p>
          <p className="text-xs text-textMuted mt-1">Last active: {lastActiveStr}</p>
        </div>
        <BloodGroupBadge group={bloodGroup} />
      </div>
      {available != null && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-textMuted'}`}
            aria-hidden
          />
          <span className="text-xs text-textMuted">{available ? 'Available now' : 'Not available'}</span>
        </div>
      )}
    </article>
  );
}
