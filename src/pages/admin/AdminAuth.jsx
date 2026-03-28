import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaUserShield } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // We use the existing auth context; we assume admin user is preconfigured
  const { login } = useAuth() || { login: async () => {} };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (login) {
        await login(email, password);
        toast.success('Admin access granted');
        navigate('/admin');
      } else {
        // dummy fallback
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 border border-gray-100 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -z-10 opacity-50 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-50 rounded-tr-full -z-10 opacity-50 blur-lg"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-primary mb-4 border-2 border-red-100">
            <FaUserShield size={32} />
          </div>
          <h2 className="text-3xl font-bold font-display text-gray-900 text-center">Admin Access</h2>
          <p className="text-gray-500 mt-2 text-sm text-center">Secure dashboard restricted to authorized personnel.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1 block mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              placeholder="admin@bloodsos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1 block mb-2">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                className="w-full border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? 'Authenicating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
