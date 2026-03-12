import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-muted bg-surface mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-display font-semibold text-primary">Every Drop Saves a Life</p>
          <nav className="flex gap-6 text-sm text-textMuted" aria-label="Footer navigation">
            <Link to="/" className="hover:text-text">Home</Link>
            <Link to="/donate" className="hover:text-text">Donate</Link>
            <Link to="/request" className="hover:text-text">Request</Link>
            <Link to="/find-donors" className="hover:text-text">Find Donors</Link>
            <Link to="/sos" className="hover:text-accent">SOS</Link>
          </nav>
        </div>
        <p className="text-center text-textMuted text-sm mt-6">Blood Donation &amp; Emergency SOS — Connect with donors near you.</p>
      </div>
    </footer>
  );
}
