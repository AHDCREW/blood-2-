import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LoginModal({ open, onClose }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" aria-modal="true" role="dialog">
      <div className="bg-surface border border-muted rounded-xl max-w-md w-full p-6 shadow-xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-bold text-xl text-text">Log in</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-textMuted mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-textMuted mb-1">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-muted text-text font-medium hover:bg-muted/80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
