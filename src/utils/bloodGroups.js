export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const BLOOD_GROUP_COLORS = {
  'O+': 'bg-red-600',
  'O-': 'bg-red-900',
  'A+': 'bg-rose-600',
  'A-': 'bg-rose-900',
  'B+': 'bg-orange-600',
  'B-': 'bg-orange-900',
  'AB+': 'bg-purple-600',
  'AB-': 'bg-purple-900',
};

export function getBloodGroupColor(group) {
  return BLOOD_GROUP_COLORS[group] || 'bg-muted';
}
