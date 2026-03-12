import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './forms/LoginModal';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-accent animate-heartbeat" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-6">
        <p className="text-textMuted mb-4">Please log in to register as a donor.</p>
        <LoginModal open onClose={() => navigate('/')} />
      </div>
    );
  }

  return children;
}
