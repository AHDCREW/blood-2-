/**
 * BloodAlertBanner — Full-screen emergency popup shown to all users
 * when a new blood request is posted in real-time via Firestore.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTint, FaPhone, FaHospital, FaMapMarkerAlt, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const URGENCY_STYLES = {
  critical: { bg: 'from-red-600 to-red-800',   badge: 'bg-red-200 text-red-900',   label: '🚨 CRITICAL — Immediate Need' },
  urgent:   { bg: 'from-orange-500 to-red-600', badge: 'bg-orange-200 text-orange-900', label: '⚡ URGENT — Within 24 Hours' },
  normal:   { bg: 'from-primary to-red-700',    badge: 'bg-yellow-100 text-yellow-900', label: '🩸 Blood Needed' },
};

export function BloodAlertBanner({ request, onClose }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    if (request) {
      // tiny delay to let CSS transition kick in
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [request]);

  if (!request) return null;

  const urgency = request.urgency || 'normal';
  const style = URGENCY_STYLES[urgency] || URGENCY_STYLES.normal;

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onClose, 300); // wait for slide-out
  };

  const handleViewBoard = () => {
    handleDismiss();
    navigate('/request-blood');
  };

  const handleCall = () => {
    if (request.contact) window.location.href = `tel:${request.contact}`;
  };

  return (
    /* Backdrop */
    <div
      className={`fixed inset-0 z-[9999] flex items-end justify-center transition-all duration-300 ${visible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
      onClick={handleDismiss}
    >
      {/* Panel */}
      <div
        className={`w-full max-w-md mx-auto rounded-t-3xl overflow-hidden shadow-2xl transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className={`bg-gradient-to-br ${style.bg} px-6 pt-6 pb-4 relative`}>
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full blur-xl pointer-events-none" />

          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <FaTimes size={18} />
          </button>

          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <FaExclamationCircle size={20} className="text-white" />
            </div>
            <span className="text-white font-black uppercase tracking-widest text-xs">
              Emergency Blood Request
            </span>
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <h2 className="text-white font-bold text-2xl leading-tight">
                {request.patient_name || 'Emergency Patient'}
              </h2>
              <span className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${style.badge}`}>
                {style.label}
              </span>
            </div>
            {/* Blood group badge */}
            <div className="bg-white text-red-600 font-black text-2xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ml-4">
              {request.blood_group}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-5 space-y-3">
          {request.hospital && (
            <div className="flex items-center gap-3 text-gray-700">
              <FaHospital className="text-gray-400 shrink-0" />
              <span className="font-medium">{request.hospital}</span>
            </div>
          )}
          {request.city && (
            <div className="flex items-center gap-3 text-gray-700">
              <FaMapMarkerAlt className="text-gray-400 shrink-0" />
              <span className="font-medium">{request.city}</span>
            </div>
          )}
          {request.contact && (
            <div className="flex items-center gap-3 text-gray-700">
              <FaPhone className="text-gray-400 shrink-0" />
              <span className="font-semibold tracking-wide">{request.contact}</span>
            </div>
          )}
          {request.notes && (
            <p className="text-sm text-gray-500 italic border-t pt-3">{request.notes}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {request.contact && (
              <button
                onClick={handleCall}
                className="flex-1 bg-primary text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-red-200 active:scale-[0.97] transition-transform"
              >
                <FaPhone /> Call Now
              </button>
            )}
            <button
              onClick={handleViewBoard}
              className={`${request.contact ? 'flex-1 bg-gray-100 text-gray-800' : 'w-full bg-primary text-white'} font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform`}
            >
              <FaTint /> View Board
            </button>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full text-sm text-gray-400 py-2 active:text-gray-600 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
