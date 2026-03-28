import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaSearch, FaTint, FaInfoCircle, FaDownload } from 'react-icons/fa';

export const Home = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20 animate-fade-in-up">
      
      {/* Install App Banner */}
      {deferredPrompt && (
        <div className="bg-primary/10 text-primary border border-primary/20 p-4 rounded-2xl flex justify-between items-center mt-2">
          <div>
            <h3 className="font-bold">Install Blood SOS</h3>
            <p className="text-sm font-medium">For faster access offline</p>
          </div>
          <button 
            onClick={handleInstallClick}
            className="bg-primary text-white font-bold px-4 py-2 flex items-center gap-2 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            <FaDownload /> Install
          </button>
        </div>
      )}

      {/* Awareness Banner */}
      <div className="bg-gradient-to-br from-primary to-accent relative rounded-3xl p-6 text-white overflow-hidden shadow-lg mt-2">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h1 className="text-2xl font-bold font-display mb-2 z-10 relative">Donate Blood,<br/>Save Lives.</h1>
        <p className="text-sm opacity-90 mb-4 max-w-[200px] z-10 relative leading-tight">Your single donation can save up to 3 lives.</p>
        <button 
          onClick={() => navigate('/donate')}
          className="bg-white text-primary font-bold px-5 py-2.5 rounded-xl shadow border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 relative z-10"
        >
          <FaHeartbeat className="animate-pulse" /> Become a Donor
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/find-donor')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 active:bg-gray-50 active:scale-[0.98] transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <FaSearch size={24} />
          </div>
          <span className="font-semibold text-gray-800">Find Donor</span>
        </button>
        <button 
          onClick={() => navigate('/request-blood')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 active:bg-gray-50 active:scale-[0.98] transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <FaTint size={24} />
          </div>
          <span className="font-semibold text-gray-800">Request Life</span>
        </button>
      </div>

      {/* Emergency Focus */}
      <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex shrink-0 items-center justify-center text-red-500 shadow-sm mt-1">
          <FaInfoCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-red-800 text-lg">Urgent Requirements</h3>
          <p className="text-sm text-red-600 mt-1 font-medium">B- and O+ blood types are currently in high demand at City Hospital.</p>
          <button 
            onClick={() => navigate('/request-blood')}
            className="mt-3 text-primary font-bold underline underline-offset-4 active:opacity-70"
          >
            Check Emergency Board
          </button>
        </div>
      </div>

    </div>
  );
};
