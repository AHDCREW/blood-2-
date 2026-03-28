import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaStar } from 'react-icons/fa';

export const DonorCard = ({ donor }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform active:scale-95">
      <div className="w-14 h-14 shrink-0 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-100 relative shadow-inner">
        <span className="text-xl font-bold text-primary drop-shadow-sm">{donor.bloodGroup}</span>
        {donor.isAvailable && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate text-lg pr-4">{donor.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <FaMapMarkerAlt className="mr-1.5 text-red-400 shrink-0" size={12} />
          <span className="truncate">{donor.location || 'Unknown location'}</span>
        </div>
        <div className="flex items-center text-xs text-yellow-500 mt-1 font-medium">
          <FaStar className="mr-1" size={10} /> {donor.rating || '4.8'} (Verified)
        </div>
      </div>
      
      <button 
        onClick={() => window.location.href = `tel:${donor.phone}`}
        className="w-10 h-10 rounded-full bg-red-50 text-primary flex items-center justify-center hover:bg-red-100 active:bg-red-200 transition-colors shrink-0 shadow-sm"
      >
        <FaPhoneAlt size={16} />
      </button>
    </div>
  );
};
