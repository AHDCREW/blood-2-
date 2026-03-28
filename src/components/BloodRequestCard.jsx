import React from 'react';
import { FaHospital, FaClock, FaHeartbeat } from 'react-icons/fa';

export const BloodRequestCard = ({ request }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-50 to-transparent -z-10 rounded-bl-3xl"></div>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{request.patientName}</h3>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide mt-1.5 uppercase border ${getSeverityColor(request.urgency)}`}>
            {request.urgency || 'Normal'}
          </span>
        </div>
        <div className="bg-red-500 text-white font-bold w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-md shrink-0">
          {request.bloodGroup}
        </div>
      </div>
      
      <div className="space-y-2 mt-4 text-sm text-gray-600">
        <div className="flex items-center">
          <FaHospital className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
          <span className="truncate">{request.hospital}</span>
        </div>
        <div className="flex items-center">
          <FaClock className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
          <span>Needed by: <span className="font-semibold text-gray-800">{request.requiredDate || 'ASAP'}</span></span>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button className="flex-1 bg-primary text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 active:bg-red-700 shadow-sm transition-transform active:scale-[0.98]">
          <FaHeartbeat /> Donate Now
        </button>
      </div>
    </div>
  );
};
