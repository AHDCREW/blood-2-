import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaHistory, FaCog, FaQuestionCircle, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const navigate = useNavigate();
  // Using context if functional, else dummy
  const { user, logout } = useAuth() || { user: { displayName: 'John Doe', email: 'john@example.com' }, logout: () => {} };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  // Get name locally if missing (or split email)
  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Anonymous Hero';
  };

  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up pb-24">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-red-50 text-primary flex items-center justify-center border-4 border-red-100 mb-4 shadow-sm relative">
          <FaUserCircle className="w-full h-full opacity-50" />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
            <div className="w-4 h-4 rounded-full bg-green-500 border border-white"></div>
          </div>
        </div>
        
        <h1 className="text-xl font-bold font-display text-gray-900 capitalize">{getUserName()}</h1>
        <p className="text-sm text-gray-500 font-medium">{user?.email || 'Guest'}</p>
        
        <div className="flex gap-4 mt-6 w-full">
          <div className="flex-1 bg-gray-50 rounded-2xl py-3 border border-gray-100 flex flex-col items-center">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Blood</span>
            <span className="text-xl font-bold text-primary">O+</span>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl py-3 border border-gray-100 flex flex-col items-center">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Donations</span>
            <span className="text-xl font-bold text-gray-800">3</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <ul className="divide-y divide-gray-100">
          <li>
            <button onClick={() => navigate('/profile/history')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-primary"><FaHistory /></div>
                <span className="font-semibold text-gray-800">Donation History</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/profile/saved')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><FaHeart /></div>
                <span className="font-semibold text-gray-800">Saved Donors</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/profile/settings')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><FaCog /></div>
                <span className="font-semibold text-gray-800">Settings</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/profile/support')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><FaQuestionCircle /></div>
                <span className="font-semibold text-gray-800">Help & Support</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </li>
        </ul>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full bg-white text-red-600 font-bold py-4 rounded-2xl shadow-sm border border-red-50 flex justify-center items-center gap-2 active:bg-red-50 transition-colors"
      >
        <FaSignOutAlt /> Log Out
      </button>
    </div>
  );
};
