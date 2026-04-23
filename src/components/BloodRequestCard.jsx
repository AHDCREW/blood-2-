import React, { useState } from 'react';
import { FaHospital, FaClock, FaHeartbeat, FaPhone, FaCheckCircle, FaMapMarkerAlt, FaBolt } from 'react-icons/fa';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const BloodRequestCard = ({ request, onFulfilled }) => {
  const { user } = useAuth();
  const [fulfilling, setFulfilling] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const handleDonateNow = () => {
    if (request.contact) {
      window.location.href = `tel:${request.contact}`;
    } else {
      toast('No contact number available for this request.', { icon: '📞' });
    }
  };

  const handleFulfill = async () => {
    if (!user) {
      toast.error('Please log in to mark a request as fulfilled.');
      return;
    }
    setFulfilling(true);
    try {
      await apiClient.put(`/api/requests/${request.id}/fulfill`);
      toast.success('Request marked as fulfilled! 🎉');
      onFulfilled?.(request.id);
    } catch {
      // error handled by interceptor
    } finally {
      setFulfilling(false);
    }
  };

  const isMyRequest = user?.email && request.requesterEmail && user.email === request.requesterEmail;

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border relative overflow-hidden transition-all ${request.isSOS ? 'border-red-300 shadow-red-100' : 'border-gray-100'}`}>
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-3xl pointer-events-none"></div>

      {/* SOS badge */}
      {request.isSOS && (
        <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
          <FaBolt className="text-[8px]" /> SOS
        </span>
      )}

      <div className={`flex justify-between items-start ${request.isSOS ? 'mt-5' : 'mb-3'}`}>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{request.patientName || 'Emergency Patient'}</h3>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide mt-1.5 uppercase border ${getSeverityColor(request.urgency)}`}>
            {request.urgency || 'Normal'}
          </span>
        </div>
        <div className="bg-red-500 text-white font-bold w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-md shrink-0">
          {request.bloodGroup}
        </div>
      </div>

      <div className="space-y-2 mt-4 text-sm text-gray-600">
        {request.hospital && (
          <div className="flex items-center">
            <FaHospital className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
            <span className="truncate">{request.hospital}</span>
          </div>
        )}
        {request.city && (
          <div className="flex items-center">
            <FaMapMarkerAlt className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
            <span className="truncate">{request.city}</span>
          </div>
        )}
        <div className="flex items-center">
          <FaClock className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
          <span>Posted: <span className="font-semibold text-gray-800">{request.requiredDate || 'ASAP'}</span></span>
        </div>
        {request.contact && (
          <div className="flex items-center">
            <FaPhone className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
            <span className="font-semibold text-gray-800 tracking-wide">{request.contact}</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={handleDonateNow}
          className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 active:bg-red-700 shadow-sm transition-transform active:scale-[0.98]"
        >
          <FaPhone /> Call to Donate
        </button>

        {isMyRequest && (
          <button
            onClick={handleFulfill}
            disabled={fulfilling}
            className="bg-green-100 text-green-700 font-semibold py-3 px-4 rounded-xl flex items-center gap-2 border border-green-200 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            <FaCheckCircle />
            {fulfilling ? '...' : 'Fulfilled'}
          </button>
        )}
      </div>
    </div>
  );
};
