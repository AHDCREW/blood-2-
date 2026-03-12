import { UrgencyBadge } from './UrgencyBadge';
import { BloodGroupBadge } from './BloodGroupBadge';

export function RequestCard({ request }) {
  const { patientName, bloodGroup, hospital, city, urgency, status } = request;

  return (
    <article className="bg-surface border border-muted rounded-xl p-4 hover:border-primary/50 transition-colors">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <BloodGroupBadge group={bloodGroup} />
        <UrgencyBadge level={urgency} />
        <span className="text-xs text-textMuted uppercase tracking-wide">{status}</span>
      </div>
      <p className="font-medium text-text">{hospital}</p>
      <p className="text-sm text-textMuted">{city}</p>
      {patientName && <p className="text-xs text-textMuted mt-1">Patient: {patientName}</p>}
    </article>
  );
}
