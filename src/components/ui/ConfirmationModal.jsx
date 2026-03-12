import { X, CheckCircle, AlertCircle } from 'lucide-react';

export function ConfirmationModal({ open, onClose, success, title, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" aria-modal="true" role="dialog">
      <div className="bg-surface border border-muted rounded-xl max-w-md w-full p-6 shadow-xl animate-fade-in-up">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center text-center mt-2">
          {success ? (
            <CheckCircle className="w-14 h-14 text-green-500 mb-4" aria-hidden />
          ) : (
            <AlertCircle className="w-14 h-14 text-red-500 mb-4" aria-hidden />
          )}
          <h3 className="font-display font-bold text-xl text-text">{title}</h3>
          <p className="text-textMuted mt-2">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
