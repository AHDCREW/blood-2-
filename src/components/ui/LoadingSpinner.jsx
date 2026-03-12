export function LoadingSpinner({ className = '' }) {
  return (
    <div
      className={`w-10 h-10 rounded-full bg-accent animate-heartbeat ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
