import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell, LogIn, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from '../forms/LoginModal';
import { NotificationPanel } from '../ui/NotificationPanel';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifications = [];

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/donate', label: 'Donate' },
    { to: '/request', label: 'Request' },
    { to: '/find-donors', label: 'Find Donors' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/95 border-b border-muted backdrop-blur">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" aria-label="Main navigation">
          <Link to="/" className="font-display font-bold text-xl text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded">
            Blood SOS
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className={`absolute top-full left-0 right-0 bg-bg border-b border-muted md:border-0 md:static md:flex md:items-center gap-6 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block md:inline py-3 md:py-0 px-4 text-sm font-medium ${location.pathname === to ? 'text-accent' : 'text-textMuted hover:text-text'}`}
              >
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 py-3 md:py-0 md:px-0">
              <button
                type="button"
                onClick={() => setNotificationsOpen(true)}
                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-textMuted" />
              </button>
              {user ? (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-text hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Log out"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Log out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Log in"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Login</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} notifications={notifications} />
    </>
  );
}
