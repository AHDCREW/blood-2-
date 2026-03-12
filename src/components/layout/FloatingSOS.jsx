import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { SOSModal } from '../ui/SOSModal';

export function FloatingSOS() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const isSOSPage = location.pathname === '/sos';

  if (isSOSPage) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white shadow-lg animate-pulse-glow focus:outline-none focus:ring-4 focus:ring-accent/50"
        aria-label="Open emergency SOS"
      >
        <AlertTriangle className="w-7 h-7" aria-hidden />
      </button>
      <SOSModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
