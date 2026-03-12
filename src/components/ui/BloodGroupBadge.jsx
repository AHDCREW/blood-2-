import { getBloodGroupColor } from '../../utils/bloodGroups';

export function BloodGroupBadge({ group }) {
  const colorClass = getBloodGroupColor(group);
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-bold text-white ${colorClass}`}
      aria-label={`Blood group ${group}`}
    >
      {group}
    </span>
  );
}
