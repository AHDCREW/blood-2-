const STYLES = {
  Critical: 'bg-red-600 text-white animate-flash',
  Urgent: 'bg-amber-500 text-black',
  Normal: 'bg-green-600 text-white',
};

const LABELS = {
  Critical: '🚨 CRITICAL',
  Urgent: '⚠️ URGENT',
  Normal: '🩸 NORMAL',
};

export function UrgencyBadge({ level }) {
  const style = STYLES[level] || STYLES.Normal;
  const label = LABELS[level] || level;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${style}`}
      aria-label={`Urgency: ${level}`}
    >
      {label}
    </span>
  );
}
