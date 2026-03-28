import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaPhoneAlt } from 'react-icons/fa';

export const SavedDonors = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 bg-white">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-3">Saved Donors</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center py-16">
        <FaHeart size={48} className="text-gray-200 mb-4" />
        <h3 className="font-bold text-gray-700 text-lg mb-2">No Saved Donors</h3>
        <p className="text-gray-500 text-sm text-center max-w-[250px]">
          Donors you bookmark for quick access will appear here.
        </p>
        <button onClick={() => navigate('/find-donor')} className="mt-6 text-primary font-bold bg-red-50 px-6 py-2 rounded-xl">
          Find Donors
        </button>
      </div>
    </div>
  );
};
