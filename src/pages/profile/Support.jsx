import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaQuestionCircle, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

export const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 bg-white">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-3">Help & Support</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">Frequently Asked Questions</h2>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 group hover:border-gray-300 transition-colors">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2"><FaInfoCircle className="text-primary"/> How do I fulfill a request?</h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">Simply click "Donate Now" on any active request card and the system will notify the hospital/requester of your intent to arrive.</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 group hover:border-gray-300 transition-colors">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2"><FaInfoCircle className="text-primary"/> Is my personal info safe?</h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">Yes, only verified personnel and users with matched emergency needs can view the baseline contact details you authorized.</p>
        </div>

        <button className="mt-4 flex items-center justify-center gap-2 w-full bg-red-50 text-primary font-bold py-3 rounded-xl hover:bg-red-100 transition-colors">
          <FaEnvelope /> Contact Admin Desk
        </button>
      </div>
    </div>
  );
};
