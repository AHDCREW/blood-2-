import { X } from 'lucide-react';

export function NotificationPanel({ open, onClose, notifications = [] }) {
  if (!open) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface border-l border-muted shadow-xl z-40 animate-fade-in-up"
      aria-label="Notifications"
    >
      <div className="flex justify-between items-center p-4 border-b border-muted">
        <h2 className="font-display font-bold text-lg text-text">Notifications</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Close notifications"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <ul className="divide-y divide-muted">
        {notifications.length === 0 ? (
          <li className="p-4 text-textMuted text-sm">No notifications yet.</li>
        ) : (
          notifications.map((n) => (
            <li key={n.id || n.title} className="p-4">
              <p className="font-medium text-text">{n.title}</p>
              {n.body && <p className="text-sm text-textMuted mt-1">{n.body}</p>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
